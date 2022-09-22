import { IUserWord } from './../../common/interfaces';
import { NUMBER_OF_PAGES_IN_GROUP } from "../../common/constants";
import { IWord } from "../../common/interfaces";
import { API } from "./api";

export class SprintApi {

  static wordsAll: IWord[] = [];
  static wordsAllUser: IUserWord[] = [];
  static wordsEn: string[] = [];
  static wordsRu: string[] = [];
  static group = 0;
  static page = 0;

  static getRandomPage (): number {
    return Math.floor(Math.random() * NUMBER_OF_PAGES_IN_GROUP);
  }
  static setGroup(group: number): void {
    this.group = group;
  }
  static setPage(page: number):void {
    this.page = page;
  }
  static setWords(words: IWord[]):void {
    this.wordsAll = this.wordsAll.concat([...words]);
    words.forEach((word: IWord) => {
      this.wordsEn.push(word.word);
      this.wordsRu.push(word.wordTranslate);
    });
  }
  static setWordsUser(words: IUserWord[]):void {
    this.wordsAllUser = this.wordsAllUser.concat([...words]);
    words.forEach((word: IUserWord) => {
      this.wordsEn.push(word.word);
      this.wordsRu.push(word.wordTranslate);
    });
  }

  static async getWords() {
    await API.getWords(this.page, this.group).then(async(data) => {
      this.setWords(data);
    });
  }

  static createRandomId(words: string[]): number {
    return Math.floor(Math.random() * words.length);
  }

  static clearWords () {
    this.wordsAll = [];
    this.wordsAllUser = [];
    this.wordsEn = [];
    this.wordsRu = [];
  }
}