import { UserData } from "../components/API/userData"



export type wordsList = IUserWord[] | IWord[];

export interface IUserReg {
  name?: string,
  email: string,
  password: string
}

export interface localWord {
  _id: string,
  userWord: IUserWordOptions,
  isUserWord: boolean
}

export interface IUser {
  email: string,
  id: string,
  name?: string,
}

export interface IUserSignin {
  message: string,
  token: string,
  refreshToken: string,
  userId: string,
  name: string
}

export interface IUserToken {
  token: string,
  refreshToken: string,
}

export interface IGameStats{
  game: string,
  answers: number,
  correctAnswers: number,
  newWords: number,
  longestSeries: number  
}
export interface ILongStats{
  date: string,
  learnedWords: number,
  newWords: number
}
export interface IUserStats {
  learnedWords: number,
  optional: {
    daystats:
    {
      date: string,
      gamestats: IGameStats[],
      wordsstats: IWordsStats
    },
    longstats:{
      longStatsArray: ILongStats[]
    } 
 }
}
export interface IWordsStats{
  learnedWords: number,
  newWords: number
}
export interface IGetUserStats extends IUserStats{
  id: string,
}

export interface IWordStats {
  id: string,
  learned: boolean,
  difficult: boolean,
  met: number,
  guessed: number,
  series: number 
}

export interface IUserSettings {
      wordsPerDay: 0,
      optional?: {}
}

export interface IUserData {
  userData: UserData,
}

export interface IAggrResp{
  paginatedResults:[],
  totalCount: []
}

export interface IUserWordOptions {
  difficulty: string,
  optional?: {
          learnt?: boolean,
          new?: boolean,
          correctAnswers?: number,
          wrongAnswers?: number,
          series?: number
  }
}

export interface IUserWordRecord extends IUserWordOptions{
  id: string, // id of record
  wordId: string
}

export interface IWordDescription{
  group: number,
  page: number,
  word: string,
  image: string,
  audio: string,
  audioMeaning: string,
  audioExample: string,
  textMeaning: string,
  textExample: string,
  transcription: string,
  wordTranslate: string,
  textMeaningTranslate: string,
  textExampleTranslate: string
}

export interface IWord extends IWordDescription {
  id: string,  
  userWord?: IUserWordOptions,
}

export interface IPagenatedResult extends IWordDescription{
  _id: string,
}

export interface IUserWord extends IPagenatedResult{
  userWord?: IUserWordOptions,
}

export interface IUserWordUpload{
  wordId: string,
  wordOptions: IUserWordOptions
}