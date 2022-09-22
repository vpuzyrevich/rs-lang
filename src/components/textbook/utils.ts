import { localWord, IUserWord, IWord } from "../../common/interfaces";

export class wordUtils {
  static areObjectsEqual(obj1: object, obj2: object) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  static countHardWords(array: IUserWord[]) {
    return array.filter((element) => element.userWord?.difficulty === "hard")
      .length;
  }

  static countLearntWords(array: IUserWord[]) {
    return array.filter((element) => {
      if (element.userWord?.optional?.learnt === undefined) return false;
      return element.userWord?.optional?.learnt;
    }).length;
  }
  
  static getIdsArray(array: localWord[]) {
    return array.map((element) => element._id);
  }

  static getUniqueWords(array1: localWord[], array2: IUserWord[]) {
    const idsOnly = wordUtils.getIdsArray(array1);
    return array2.filter((element) => !idsOnly.includes(element._id));
  }

  static updateLocalWord(
    array1: localWord[],
    newWord: localWord,
    update: (arr: localWord[]) => void
  ) {
    const ids = wordUtils.getIdsArray(array1);
    if (ids.includes(newWord._id)) {
      const filteredLocalWords = array1.filter(
        (element) => element._id !== newWord._id
      );
      update([...filteredLocalWords, newWord]);
    } else {
      update([...array1, newWord]);
    }
  }

  static createLocalisLearntWord(difficultWord: IUserWord | IWord) {
    const oldIsLearnt = (difficultWord as IUserWord).userWord?.optional?.learnt;
    const newDifficulty = !oldIsLearnt
      ? "easy"
      : (difficultWord as IUserWord).userWord?.difficulty!;
    const newIsLearnt = !oldIsLearnt;
    
    return {
      _id: (difficultWord as IUserWord)._id,
      userWord: {
        difficulty: newDifficulty,
        optional: {
          new: true,
          ...(difficultWord as IUserWord).userWord?.optional,
          learnt: newIsLearnt,
        },
      },
      isUserWord: !!(difficultWord as IUserWord).userWord,
    };
  }

  static createLocalDifficultyWord(difficultWord: IUserWord | IWord) {
    const oldIsLearnt = (difficultWord as IUserWord).userWord?.optional?.learnt;
    const newDifficulty =
      (difficultWord as IUserWord).userWord?.difficulty === "hard"
        ? "easy"
        : "hard";
    const newIsLearnt = newDifficulty === "hard" ? false : oldIsLearnt;
    return {
      _id: (difficultWord as IUserWord)._id,
      userWord: {
        difficulty: newDifficulty,
        optional: {
          new: true,
          ...(difficultWord as IUserWord).userWord?.optional,
          learnt: newIsLearnt,
        },
      },
      isUserWord: !!(difficultWord as IUserWord).userWord,
    };
  }
  
}
