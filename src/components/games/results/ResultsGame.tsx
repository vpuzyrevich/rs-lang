import { useState } from 'react';
import { IUserWord, IWord } from '../../../common/interfaces';
import { API } from '../../API/api';
import './ResultsGame.scss';

interface IProps {
  guessed: IWord[] | IUserWord[]; 
  notGuessed: IWord[] | IUserWord[];
  totalPoints: number;
}

export function ResultsGame (props: IProps) {
  const {guessed, notGuessed, totalPoints} = props;
  const [sound] = useState(new Audio());
  const resultItem = (el: IWord | IUserWord, idx: number) => {
    if (el === undefined) return null;
    return(
      <div key={idx} className="results-item">
        <div className="results-sound" onClick={() => {
          sound.src = `${API.baseUrl}/${el.audio}`;
          sound.play();
        }}></div>
        <div className="results-en">{el.word}</div>
        <div className="hyphen">&mdash;</div>
        <div className="results-ru">{el.wordTranslate}</div>
      </div>
    )
  }
  return (
    <div className='results'>
      <div className="results-card">
        <div className="results-total">
          <div className="results-total-title">Количество очков: <span className='total-points'>{totalPoints}</span></div>
        </div>
        <div className="results-block results-wrong">
          <div className="results-title">Неправильные ответы: <span className='wrong-answers'>{notGuessed.length}</span></div>
          <div className="results-list">
            {notGuessed ? notGuessed.map((item, idx) => resultItem(item, idx)) : ''}
          </div>
        </div>
        <div className="results-block results-right">
          <div className="results-title">Правильные ответы: <span className='right-answers'>{guessed.length}</span></div>
          <div className="results-list">
          {guessed ? guessed.map((item, idx) => resultItem(item, idx)) : ''}
          </div>
        </div>
      </div>
    </div>
  )
}