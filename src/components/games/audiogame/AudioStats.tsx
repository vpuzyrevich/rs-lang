import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { IUserWord } from '../../../common/interfaces';
import AudioPlay from './AudioPlay';
import './styles/AudioStats.scss';

interface IGameStats {
  solvedWords: IUserWord[],
  failedWords: IUserWord[],
  attempts: number
}

function AudioStats() {
  let location = useLocation();
  let navigate = useNavigate();
  const stats = location.state as IGameStats;

  return (
    <div className="stats">
      <div className="stats__wrapper">
      <div className="stats__rightwords">
      <h3 className="stats__rightwords-title words-title">Правильные ответы:</h3>
      <div className="stats__words-container">
      {stats.solvedWords.map((word, i) => {
      return (
      <div key={`right-${word}${i}`} className="stats__rightwords-word stats-word">
          <AudioPlay
            audioLink={word!.audio}
          /> 
        <div className="stats__rightwords-name word-name">
        {word.word}
        </div>
        <div className="word-translate">
        {word.wordTranslate}
        </div>
      </div>
      )})}
      </div>
      </div>
      <div className="stats__wrongwords">
        <h3 className="stats__wrongwords-title words-title">Неправильные ответы:</h3>
        <div className="stats__words-container">
      {stats.failedWords.map((word, i) =>  {
       return (
      <div key={`failed-${word}${i}`} className="stats__wrongwords-word stats-word">
         <AudioPlay
            audioLink={word!.audio}
          /> 
        <div className="stats__wrongwords-name word-name">
        {word.word}
        </div>
        <div className="word-translate">
        {word.wordTranslate}
        </div>
      </div>
      )})}
        </div>
      </div>
    </div>
    <div className="stats__nav">
    <button onClick={() => navigate('../../')} className="stats__nav-link">Домой</button>
    <button onClick={() => navigate('/textbook')} className="stats__nav-link">Слова</button>
    </div>
  </div>
  )
}

export default AudioStats