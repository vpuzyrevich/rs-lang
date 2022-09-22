import { timeStamp } from "console";
import { GROUP_DIFFICULT, SERIES_FOR_UPD } from "../../common/constants";
import { IGameStats, IUserStats, IUserWordUpload, IWord, IWordStats } from "../../common/interfaces";
import { WordsApi } from "./wordsapi";

export class GameWordsProvider {
  private startWordsList: IUserWordUpload[];
  private currWordsList: IUserWordUpload[];
  private includeLearned: boolean;
  private correctAnswers = 0;
  private answers = 0;
  private series = 0;
  private longestSeries = 0;
  private game: string;
  private newWordsNumber = 0;
  private locLearned = 0;

  constructor(game: string, includeLearned: boolean) {
    this.startWordsList = [];
    this.currWordsList = [];
    this.game = game;
    this.includeLearned = includeLearned;
    
  }
  getUserWordList(group: number, page?: number) {
    return this.getWords(group, page)
      .then((data) => {
        if (!this.includeLearned) {
          return data.filter((item) => !item.userWord?.optional?.learnt)
        }
        return data;
      })
      .then((data) => {
        const tmp = data.map(({_id, userWord, ...rest}) => { return {wordId: _id, wordOptions: userWord} as IUserWordUpload});
        this.startWordsList = [ ...this.startWordsList, ...tmp];
        return data;
      })
      .catch((err: Error) => { throw new Error(err.message) });

  }
  guessed(id: string) {
   
   
    this.correctAnswers += 1;
    this.answers += 1;
    this.series += 1;
    const tmp = this.createWordToUp(id, true);
    
    
	  return WordsApi.uploadUserWord(tmp)
		.catch((err: Error) => { throw new Error(err.message) });
	
	
  }
  notGuessed(id: string) {
    this.answers += 1;
    if (this.series > this.longestSeries) this.longestSeries = this.series;
    this.series = 0;
    const tmp = this.createWordToUp(id, false);
    
    return WordsApi.uploadUserWord(tmp)
      .catch((err: Error) => { throw new Error(err.message) });
  }

  private createWordToUp(id: string, isGuessed: boolean) {
    let wordToUp: IUserWordUpload;
    let isUserWord = true;
    const index = this.currWordsList.findIndex((item) => item.wordId === id);
    if (index === -1) {
      const wordItem = this.startWordsList.find((item) => item.wordId === id);
      if(wordItem === undefined) throw new Error("deverr: error in ID list");
      
      if (wordItem.wordOptions === undefined) {
        this.newWordsNumber += 1;
        wordToUp = this.createNewWordItem(id, isGuessed);
        isUserWord = false;
      } else {
        wordToUp = this.updateWordItem(id, isGuessed, wordItem);
      }
      this.currWordsList.push(wordToUp);
    } else {
      wordToUp = this.updateWordItem(id, isGuessed, this.currWordsList[index]);
      this.currWordsList[index] = wordToUp;
    }
    return {wordToUp, isUserWord};
  }

  private createNewWordItem(id: string, guessed: boolean){
    return {
      wordId: id,
            wordOptions: {
              difficulty: "easy" ,
              optional: {
                learnt: false ,
                new: false,
                correctAnswers: guessed ? 1 : 0,
                wrongAnswers: guessed ? 0 : 1,
                series: guessed ? 1 : 0
              }
            }
    } as IUserWordUpload;
  }

  private updateWordItem(id: string, isGuessed: boolean, wordItem: IUserWordUpload){
    if(wordItem.wordOptions.optional?.new) {
      this.newWordsNumber +=1;
      wordItem.wordOptions.optional.new = false;
    }
    const series = wordItem.wordOptions.optional === undefined || wordItem.wordOptions.optional.series === undefined ? 0 
        :wordItem.wordOptions.optional.series;
    const learnt =  wordItem.wordOptions.optional === undefined || wordItem.wordOptions.optional.learnt === undefined? false 
        :wordItem.wordOptions.optional.learnt;
    const correctAnswers = wordItem.wordOptions.optional === undefined || wordItem.wordOptions.optional.correctAnswers === undefined ? 0 
        :wordItem.wordOptions.optional.correctAnswers;
    const wrongAnswers = wordItem.wordOptions.optional === undefined || wordItem.wordOptions.optional.wrongAnswers === undefined ? 0 
        :wordItem.wordOptions.optional.wrongAnswers;
    const newSeries = isGuessed ? 1 + series : 0;
    const newIsLearned = this.isLearned(isGuessed, learnt, newSeries);
    return {
      wordId: id,
            wordOptions: {
              difficulty: newIsLearned ? "easy" : wordItem.wordOptions.difficulty,
              optional: {
                learnt:  newIsLearned,
                new: false,
                correctAnswers: correctAnswers + (isGuessed ? 1 : 0),
                wrongAnswers: wrongAnswers + (isGuessed ? 0 : 1),
                series: newSeries 
              }
            }
    } as IUserWordUpload;
  }
  
  private isLearned(isGuessed: boolean, startLearned: boolean, series: number) {
   
    if (startLearned) {
      
      if (!isGuessed) {
        this.locLearned -= 1;
       
        return false
      } else {
        
        return true
      }
    } else {
      if (series >= SERIES_FOR_UPD) {
        this.locLearned += 1;
        
        return true
      }
      
      return false
    }
  }

  //количество новых слов
  //количество угаданных слов
  //количество сыгранных слов
  // самая длинная серия 
  getGameStats() {
    
    let res = {
      game: this.game,
      answers: this.answers,
      correctAnswers: this.correctAnswers,
      newWords: this.newWordsNumber,
      longestSeries: this.longestSeries,
    } as IGameStats;
    return res;
  }

  uploadStats() {
    return this.uploadGameStat()
      .catch((err: Error) => { throw new Error(err.message) });

  }

  private uploadGameStat() {
    const now = new Date();
    const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    let newStat: IUserStats;
    return WordsApi.getUserStats()
      .then((data) => {  
        newStat = {...data};  
       
        newStat.learnedWords += this.locLearned;
        if (data.optional.daystats.date !== date){
          
          const dayStat = {
            date: data.optional.daystats.date,  
            learnedWords: data.optional.daystats.wordsstats.learnedWords,
            newWords: data.optional.daystats.wordsstats.newWords,            
          }
          newStat.optional.longstats.longStatsArray.push(dayStat);

          newStat.optional.daystats.wordsstats.learnedWords =  this.locLearned;
          newStat.optional.daystats.wordsstats.newWords = this.newWordsNumber;
          newStat.optional.daystats.date = date;
          newStat.optional.daystats.gamestats = [];
          newStat.optional.daystats.gamestats.push(this.createNewDayStats());
          
   
        }else{
          const startGameDayStatsInd = newStat.optional.daystats.gamestats.findIndex((item) => item.game === this.game);
          if(startGameDayStatsInd === -1) {
            newStat.optional.daystats.gamestats.push(this.createNewDayStats());
          }else{
            const tmpGameStat = newStat.optional.daystats.gamestats[startGameDayStatsInd];            
            newStat.optional.daystats.gamestats[startGameDayStatsInd] = this.updateDayStats(tmpGameStat);
          }     
          newStat.optional.daystats.wordsstats.learnedWords += this.locLearned;
          newStat.optional.daystats.wordsstats.newWords += this.newWordsNumber;
        }
        
     
        return WordsApi.setUserStats(newStat);
      })
      
  }
  
  private createNewDayStats(){
    const currStat = this.getGameStats();
    const res = {
      answers: currStat.answers,
      correctAnswers: currStat.correctAnswers,
      longestSeries: currStat.longestSeries,
      game: this.game,
      newWords: this.newWordsNumber,
    } as IGameStats;
    return res;   
  }

  private updateDayStats(data: IGameStats){
    const res = {...data};
    const currStat = this.getGameStats();
    res.answers += currStat.answers;
    res.correctAnswers += currStat.correctAnswers;
    res.newWords += currStat.newWords;
    res.longestSeries = currStat.longestSeries > res.longestSeries ? currStat.longestSeries : res.longestSeries;
    return res;
  }

  private getWords(group: number, page?: number) {
    if (page === undefined) page = 0;
    if (group === GROUP_DIFFICULT)
      return WordsApi.getDifficultWords()
        .catch((err: Error) => { throw new Error(err.message) });
    return WordsApi.getUserWords(page, group)
      .catch((err: Error) => { throw new Error(err.message) });
  }
}