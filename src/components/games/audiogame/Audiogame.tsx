import { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './styles/Audiogame.scss';
import DOMPurify from "dompurify";
import { audioGame } from './audioGameCreator';
import { gameUtils } from '../utils';
import { IUserWord } from '../../../common/interfaces';
import { API } from '../../API/api';
import playAudio from './playAudio';
import AudioPlay from './AudioPlay';
import { authContext } from "../../app/App";
interface IGameLocationProps {
   gameMenu: boolean,
   section: number,
   page: number
}

export function Audiogame () {
let location = useLocation();
let navigate = useNavigate();
const {isAuth,changeIsAuth} = useContext(authContext);
const [isLoggedIn, setIsLoggedIn] = useState<boolean>(API.isAuth());
const locs = location.state as IGameLocationProps;
const [game] = useState(new audioGame(false, {page: locs.page, section: locs.section}));
const [wordsRow, setWordsRow] = useState(-1);
const [wordChunk, setWordChunk] = useState<IUserWord[]>([]);
const [attempts, setAttempts] = useState(5);
const [failedWords, setFailedWords] = useState<IUserWord[]>([]);
const [solvedWords, setSolvedWords] = useState<IUserWord[]>([]);
const [rightWord, setRightWord] = useState<IUserWord>();
const [showRevealed, setShowRevealed] = useState(false);
const [isPlaying, setPlaying] = useState(false);
const [hearts, setHearts] = useState([	'&#128156;', '&#128156;', '&#128156;', '&#128156;', '&#128156;']);

const ctx = useContext(authContext);
if(ctx.isAuth !== isLoggedIn){
  setIsLoggedIn(ctx.isAuth);
}

let inputRefs: Array<React.RefObject<HTMLButtonElement>> = [];

inputRefs = [
  useRef<HTMLButtonElement>(null),
  useRef<HTMLButtonElement>(null),
  useRef<HTMLButtonElement>(null),
  useRef<HTMLButtonElement>(null)
];


function goNextWord(word: IUserWord) {
  setShowRevealed(true);
  setTimeout(() => {

    if (wordsRow < game.chunkedWords.length && attempts > 0) {
      setWordsRow(wordsRow + 1);
      if (gameUtils.areWordsEqual(rightWord!.word, word.word)) {
        setSolvedWords([...solvedWords, rightWord!]);
        if (API.isAuth()) {
          game.gameProvider.guessed(rightWord!._id);
        }
      } else {
        setAttempts(attempts - 1);
        setFailedWords([...failedWords, rightWord!]);
        const updatedHearts = [...hearts];
        updatedHearts.splice(updatedHearts.lastIndexOf('&#128156;'), 1, '&#128153;');
        setHearts(updatedHearts);
        if (API.isAuth()) {
          game.gameProvider.notGuessed(rightWord!._id);
        }
      }
    }
    setShowRevealed(false);
  }, 1000);
}

useEffect(() => {
  const fetchWords = async () => {
    const data = await game.getFullWordlist().catch(() => {
      ctx.changeIsAuth(false);
    });
    game.chunkedWords = gameUtils.chunkArray(data as IUserWord[], 4);
    setWordsRow(0);
  }
    fetchWords();
}, []);

useEffect(() => {
setWordChunk(game.chunkedWords[wordsRow]);
if (wordsRow === game.chunkedWords.length) {
  navigate('/games/audiostats', { state: {failedWords, solvedWords} });
  if (API.isAuth()) {
    game.gameProvider.uploadStats();
  }
}
}, [wordsRow]);

useEffect(() => {
 if (attempts === 0) {
  navigate('/games/audiostats', { state: {failedWords, solvedWords} });
  if (API.isAuth()) {
  game.gameProvider.uploadStats();
  }
 }
}, [attempts]);

useEffect(() => {
  if (wordChunk) {
    setRightWord(gameUtils.getRandomElement(wordChunk));
  }

  function listenFirstWordClicked(event: KeyboardEvent) {
    if (event.code === 'Digit1') {
      inputRefs[0].current!.click();
      inputRefs[0].current!.style.backgroundColor = 'black !important';
    }
  }
  function listenSecondWordClicked(event: KeyboardEvent) {
    if (event.code === 'Digit2') {
      inputRefs[1].current!.click();
    }
  }
  function listenThirdWordClicked(event: KeyboardEvent) {
    if (event.code === 'Digit3') {
      inputRefs[2].current!.click();
    }
  }
  function listenFourthWordClicked(event: KeyboardEvent) {
    if (event.code === 'Digit4') {
      inputRefs[3].current!.click();
    }
  }

  document.addEventListener('keyup', listenFirstWordClicked);
  document.addEventListener('keyup', listenSecondWordClicked);
  document.addEventListener('keyup', listenThirdWordClicked);
  document.addEventListener('keyup', listenFourthWordClicked);

  return () => {
    document.removeEventListener('keyup', listenFirstWordClicked);
  document.removeEventListener('keyup', listenSecondWordClicked);
  document.removeEventListener('keyup', listenThirdWordClicked);
  document.removeEventListener('keyup', listenFourthWordClicked);
  }
}, [wordChunk]);

useEffect(() => {
    playAudio(`${rightWord?.audio}`, setPlaying);
}, [rightWord]);

return (
 <div className='audiogame'>
    <div className='audiogame__wrapper'>
      <div className="audiogame__hearts">
      {hearts.map((el: string, key: number) => <span
      key={key + el}
       className='audiogame__heart'
        dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(el),
            }}/>)}
      </div>
      <button className="audiogame__audio">
           <AudioPlay
            audioLink={`${rightWord?.audio}`}
          /> 
      </button>
      {showRevealed ? (
      <div className="audiogame__revealed">
         <div className="audiogame__revealed-word"> {rightWord?.word} </div>
          <div className="audiogame__revealed-translate"> {rightWord?.wordTranslate} </div>
      </div>) : null}
      <div className="audiogame__options">
          {wordChunk ? wordChunk.map((word, ndx) => {
            return(<button
             disabled={showRevealed}
             ref={(inputRefs[ndx])}
             onClick={() => {goNextWord(word)}}
             key={word.word + ndx + '-audio'}
             className="audiogame__options-option">
              {word.wordTranslate}
            </button>);
          }) : ''}
      </div>
    </div>
  </div>
)
}