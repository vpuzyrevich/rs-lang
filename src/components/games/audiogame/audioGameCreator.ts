import { GameWordsProvider } from "../../API/GameWordsProvider";
import { GAMES_NAMES } from '../../../common/constants';
import { IUserWord } from '../../../common/interfaces';
import { gameUtils } from "../utils";
import { API } from "../../API/api";

export class audioGame {
  includeLearned: boolean;
  gameProvider: GameWordsProvider;
  words: IUserWord[];
  chunkedWords: Array<IUserWord>[];
  wordsTotal: number;
  location: { page: number; section: number; };
  sectionsTotal: number;
  rightWord: IUserWord | null;
  
  constructor(includeLearned: boolean, location: {page: number, section: number}) {
    this.includeLearned = includeLearned;
    this.location = location;
    this.gameProvider = new GameWordsProvider(GAMES_NAMES.audio, this.includeLearned);
    this.words = [];
    this.chunkedWords = [];
    this.rightWord = null;
    this.sectionsTotal = 6;
    this.wordsTotal = 40;
  }
  async getFullWordlist() {
    // if user is logged in get userlist, otherwise get default list
    let newWords;
    if (API.isAuth()) {
      newWords = await this.gameProvider.getUserWordList(this.location.section, this.location.page);
    } else {
      newWords = await API.getWords(this.location.page, this.location.section);
    }
    const MAX_PAGE = 29;
    let page = MAX_PAGE;
    this.words = [...this.words, ...newWords] as IUserWord[];
    let iterationCount = 0;
    if (this.location.section === 6) iterationCount = MAX_PAGE;
    while (this.words.length < this.wordsTotal && iterationCount < MAX_PAGE) {
      iterationCount += 1;
      if (page < 0) page = MAX_PAGE;
      if (API.isAuth()) {
        newWords = await this.gameProvider.getUserWordList(this.location.section, page);
      } else {
        newWords = await API.getWords(page, this.location.section);
      }
      this.words = [...this.words, ...newWords] as IUserWord[];
      page -= 1;
    }

    const trimmedWords = gameUtils.trimArrayLength(this.words, this.wordsTotal);
    const filteredWords = gameUtils.filterRepeatedWords(trimmedWords);
    return filteredWords;
    
  }
  
}