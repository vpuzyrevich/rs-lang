import { useContext, useEffect, useState } from "react";
import { SprintApi } from "../../API/sprintApi";
import star from '../../../assets/icon/star.svg';
import './SprintGame.scss';
import { useLocation } from "react-router-dom";
import { Timer } from "../timer/Timer";
import pathCorrectAnswer from '../../../assets/audio/correct-answer.mp3';
import pathWrongAnswer from '../../../assets/audio/wrong-answer.mp3'
import { ResultsGame } from "../results/ResultsGame";
import useEventListener from "@use-it/event-listener";
import { API } from "../../API/api";
import { GameWordsProvider } from "../../API/GameWordsProvider";
import { IUserWord, IWord } from "../../../common/interfaces";
import { GAMES_NAMES } from "../../../common/constants";
import { authContext } from "../../app/App";

export function SprintGame () {
  let {state} = useLocation() as {state: {gameMenu: boolean, group: number, page: number, learned: boolean}};
  const levelPoints = [10, 20, 40, 80];
  const [totalPoints, setTotalPoints] = useState(0);
  const [index, setIndex] = useState(0);
  const [wordEn, setWordEn] = useState<string[]>([]);
  const [wordRu, setWordRu] = useState<string[]>([]);
  let random = (words: string[]): number => (Math.random() > 0.5) ? (index + 1): SprintApi.createRandomId(words);
  const [indexRu, setIndexRu] = useState(() => random(wordRu));
  const [circleIndex, setCircleIndex] = useState(0);
  const [levelIndex, setLevelIndex] = useState(0);
  const [audioCorrect] = useState(new Audio());
  const [audioWrong] = useState(new Audio());
  const [time, setTime] = useState(true);
  const [wordsProvider] = useState(new GameWordsProvider(GAMES_NAMES.sprint, state.learned));
  const [guessedWord, setGuessedWord] = useState<IWord[] | IUserWord[]>([]);
  const [notGuessedWord, setNotGuessedWord] = useState<IUserWord[] | IWord[]>([]);
  const ctx = useContext(authContext);

  

  useEffect(() => {
    const fetchData = async () => {
      SprintApi.clearWords();
      SprintApi.setGroup(state.group);
      SprintApi.setPage(state.page);
      if(API.isAuth()) {
        for(let i = SprintApi.page; i >= 0; i--) {
          await wordsProvider.getUserWordList(SprintApi.group, i).then((data) => SprintApi.setWordsUser(data)).catch(() => ctx.changeIsAuth(false));
        }
        setWordEn(SprintApi.wordsEn);
        setWordRu(SprintApi.wordsRu);
      } else {
        for(let i = SprintApi.page; i >= 0; i--) {
          await API.getWords(i, SprintApi.group).then((data) => SprintApi.setWords(data));
        }
        setWordEn(SprintApi.wordsEn);
        setWordRu(SprintApi.wordsRu);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!time && API.isAuth()) {
      wordsProvider.uploadStats().catch(() => ctx.changeIsAuth(false));
    }
  });

  useEffect(() => {
    if (wordRu.length === 1) {
      setIndexRu(0);
    }
  }, [wordRu.length]);

  const renderWords = async () => {
    setIndex((index) => index + 1);
    setIndexRu(random(wordRu));
    if(wordEn.length === index + 1) {
      setTime(false);
    }
  };

  const removeActiveCircles = () => {
    const circles = document.querySelectorAll('.circle');
    circles.forEach((circle) => {
      circle.classList.remove('active-circle');
    });
    setCircleIndex(0);
  };

  const isGuessed = async (index: number) => {
    if(API.isAuth()) {
      await wordsProvider.guessed(SprintApi.wordsAllUser[index]._id).catch(() => ctx.changeIsAuth(false));
      setGuessedWord(() => (guessedWord as IUserWord[]).concat(SprintApi.wordsAllUser[index]));
    } else {
      setGuessedWord(() => (guessedWord as IWord[]).concat(SprintApi.wordsAll[index]));
    }
  }

  const isNotGuessed = async (index: number) => {
    if(API.isAuth()) {
      await wordsProvider.notGuessed(SprintApi.wordsAllUser[index]._id).catch(() => ctx.changeIsAuth(false));
      setNotGuessedWord(() => (notGuessedWord as IUserWord[]).concat(SprintApi.wordsAllUser[index]));
    } else {
      setNotGuessedWord(() => (notGuessedWord as IWord[]).concat(SprintApi.wordsAll[index]));
    }
  };
  const playAudioCorrect = () => {
    audioCorrect.src = pathCorrectAnswer;
    audioCorrect.play();
  };
  const playAudioWrong = () => {
    audioWrong.src = pathWrongAnswer;
    audioWrong.play();
  };

  const isRight = () => {
    if (index === indexRu) {
      setTotalPoints(totalPoints + levelPoints[levelIndex]);
      checkCircle(circleIndex);
      playAudioCorrect();
      isGuessed(index);
    } else {
      removeActiveCircles();
      playAudioWrong()
      isNotGuessed(index);
    }
    renderWords();
  };

  const isWrong = () => {
   
    if (index !== indexRu) {
      setTotalPoints(totalPoints + levelPoints[levelIndex]);
      checkCircle(circleIndex);
      playAudioCorrect();
      isGuessed(index);
    } else {
      removeActiveCircles();
      playAudioWrong()
      isNotGuessed(index);
    }
    renderWords();
  };

  const checkLevel = (i: number) => {
    const stars = document.querySelectorAll('.card-star-img');
    const circles = document.querySelectorAll('.circle');

    if (i <= 3) {
      stars[i].classList.add('active-star');
      setLevelIndex(levelIndex => levelIndex + 1);
    }
    if (i >= 3) {
      setLevelIndex(3);
      circles[0].classList.add('active-circle');
      circles[1].classList.add('hide');
      circles[2].classList.add('hide');
    }
  };

  const checkCircle = (i: number) => {
    const circles = document.querySelectorAll('.circle');
    if (i > 2) {
      removeActiveCircles();
      checkLevel(levelIndex + 1);
    } else {
      circles[i].classList.add('active-circle');
      setCircleIndex(circleIndex + 1);
    }
  };

  const updateTime = (value: boolean) => {
    setTime(value);
  };

  const onKeypress = (e: KeyboardEvent) => {
    if (e.code === 'ArrowLeft') {
      isWrong();
    }
    if (e.code === 'ArrowRight') {
      isRight();
    }
  };

  useEventListener('keydown', (e:KeyboardEvent) => onKeypress(e));


  return time ? (
    <div className="sprint">
      <div className='sprint-wrapper'>
        <div className="sprint-header">
          <Timer updateTime={updateTime}/>
          <div className="sprint-total">{totalPoints}</div>
        </div>
        <div className='sprint-card'>
          <div className="card-header">
            <div className="circle-block">
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
            </div>
            <div className="points">
              {`+${levelPoints[levelIndex]} очков за слово`}
            </div>
          </div>
          <div className="card-star">
            <img className='card-star-img active-star' src={star} alt="star" />
            <img className='card-star-img' src={star} alt="star" />
            <img className='card-star-img' src={star} alt="star" />
            <img className='card-star-img' src={star} alt="star" />
          </div>
          <div className="card-words">
            <div className="card-word word-en">{wordEn[index]}</div>
            <div className="card-word word-ru">{wordRu[indexRu]}</div>
          </div>
          <div className="card-buttons">
            <button className='button btn-false' onClick={() => {
              isWrong();
            }}>Неверно</button>
            <button className='button btn-true' onClick={() => {
              isRight();
              }}>Верно</button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <ResultsGame guessed={guessedWord} notGuessed={notGuessedWord} totalPoints={totalPoints} />
  )
}