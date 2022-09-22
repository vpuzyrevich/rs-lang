import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SprintApi } from '../../API/sprintApi';
import '../gameMenu/GameMenu.scss';

export default function AudiogameMenu () {
  let navigate = useNavigate();

  const navigateToAudio = async (e: React.MouseEvent) => {
    navigate('/games/audio', { state: {gameMenu: false, group: (Number((e.target as HTMLElement).textContent) - 1), page: SprintApi.getRandomPage(), learned: true} });
  }
  return (
    <div className='game-menu'>
      <div className="game-menu-block">
        <div className="game-menu-decription">
          Тренировка понимания на слух.<br/>Выберите уровень сложности
        </div>
        <div className="game-menu-level">
          <button className='game-menu-btn' onClick={(e) => navigateToAudio(e)}>1</button>
          <button className='game-menu-btn' onClick={(e) => navigateToAudio(e)}>2</button>
          <button className='game-menu-btn' onClick={(e) => navigateToAudio(e)}>3</button>
          <button className='game-menu-btn' onClick={(e) => navigateToAudio(e)}>4</button>
          <button className='game-menu-btn' onClick={(e) => navigateToAudio(e)}>5</button>
          <button className='game-menu-btn' onClick={(e) => navigateToAudio(e)}>6</button>
        </div>
      </div>
    </div>
  )
}