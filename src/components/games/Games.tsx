import { useNavigate } from 'react-router-dom';
import './Games.scss';


export function Games () {
  let navigate = useNavigate();

  return(
    <div className='games-wrapper'>
      <div className='game game-sprint' onClick={() => navigate('/games/sprint', { state: {gameMenu: true} })}>
        <div className='game-title'>Спринт</div>
      </div>
      <div className='game game-audio' onClick={() => navigate('/games/audio-menu')}>
        <div className='game-title'>Аудиовызов</div>
      </div>
    </div>
  )
}
