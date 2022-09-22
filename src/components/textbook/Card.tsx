import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import "./Card.scss";
import WordAudio from "./WordAudio";
import { WordsApi } from "../API/wordsapi";
import {
  IUserWord,
  IWord,
  localWord,
  wordsList
} from "../../common/interfaces";
import { wordUtils } from "./utils";

interface wordProps {
  wordsArray: wordsList;
  word: IUserWord | IWord;
  localWords: Array<localWord>;
  updateLocalWords: (arr: localWord[]) => void;
  link: string;
  updateWords: (arr: IUserWord[]) => void;
  numbers: { page: number; section: number };
  isLoggedIn: boolean;
}

function Card(props: wordProps) {
  const {
    word,
    link,
    isLoggedIn,
    numbers,
    localWords,
    updateLocalWords,
    wordsArray,
    updateWords,
  } = props;
  let buttons = <div></div>;

  const [currentWord, setCurrentWord] = useState(word);
  let stats = null;

  useEffect(() => {
    setCurrentWord(word);
  }, [word]);

  if (isLoggedIn) {
    stats = (
    <div className="word__stats">
      <div title='Правильно угадано' className="word__stats-success">&#x2713; {word?.userWord?.optional?.correctAnswers || 0}</div>
      <div title='Неправильно угадано' className="word__stats-fail">&#10006; {word?.userWord?.optional?.wrongAnswers || 0}</div>
    </div>)
    buttons = (
      <div className="word__interact">
        <button
          className="words__interact-hard"
          onClick={() => {
            const newLocalWord = wordUtils.createLocalDifficultyWord(currentWord);
            wordUtils.updateLocalWord(localWords, newLocalWord, updateLocalWords);
            WordsApi.setWord(newLocalWord._id, newLocalWord.userWord, newLocalWord.isUserWord);
            if (numbers.section === 6) {
              updateWords(
                (wordsArray as IUserWord[]).filter(
                  (element) => element._id !== (currentWord as IUserWord)._id
                  )
                  );
                }
                setCurrentWord({
                  ...currentWord,
                  userWord: newLocalWord.userWord,
                });
          }}
        >
          {(currentWord as IUserWord).userWord?.difficulty === "hard" || numbers.section === 6
            ? "Убрать из сложных"
            : "Отметить как сложное"}
        </button>
        <button
          className="words__interact-learnt"
          onClick={() => {
            const newLocalWord = wordUtils.createLocalisLearntWord(currentWord);
            wordUtils.updateLocalWord(localWords, newLocalWord, updateLocalWords);
            WordsApi.setWord(newLocalWord._id, newLocalWord.userWord, newLocalWord.isUserWord);
            setCurrentWord({
              ...currentWord,
              userWord: newLocalWord.userWord,
            });
            if (numbers.section === 6) {
              updateWords(
                (wordsArray as IUserWord[]).filter(
                  (element) => element._id !== (currentWord as IUserWord)._id
                )
              );
            }
            WordsApi.addLearntWordStats(currentWord.userWord?.optional?.learnt ? -1 : 1)
          }}
        >
          {(currentWord as IUserWord).userWord?.optional?.learnt === true
            ? "Убрать из изученных"
            : "Отметить как изученное"}
        </button>
      </div>
    );
  }

  let [wordClass, setWordClass] = useState('word');
  useEffect(() => {
    let className = 'word';
    if (currentWord.userWord?.difficulty === 'hard' && numbers.section !== 6) {
      className += ' hard';
    } else if (currentWord.userWord?.optional?.learnt && numbers.section !== 6) {
      className += ' learnt';
    }
    setWordClass(className);
  }, [numbers, currentWord]);

  return (
    <div className={wordClass}>
      <div className="word__desc">
        <div className="word__word">
          <div className="word__word-name">{word?.word}</div>
          <div className="word__word-transcription">{word?.transcription}</div>
          <div className="word__word-translation">{word?.wordTranslate}</div>
          <WordAudio
            audioLink={word?.audio}
            audioMeaningLink={word?.audioMeaning}
            audioExampleLink={word?.audioExample}
          />
        </div>
        <div className="word__meaning">
          <div
            className="word__meaning-eng"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(word?.textMeaning as string),
            }}
          />
          <div className="word__meaning-ru">{word?.textMeaningTranslate}</div>
        </div>
        <div className="word__example">
          <div
            className="word__example-eng"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(word?.textExample as string),
            }}
          />
          <div className="word__example-ru">{word?.textExampleTranslate}</div>
        </div>
        {buttons}
        {stats}
      </div>
      <img className="word__image" src={link} alt={word?.word} />
    </div>
  );
}

export default Card;
