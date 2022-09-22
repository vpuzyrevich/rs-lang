import { GameMenu } from '../gameMenu/GameMenu';
import { useLocation } from 'react-router-dom';
import { SprintGame } from './SprintGame';

export function Sprint () {
  let {state} = useLocation() as {state: {gameMenu: boolean}};

  return state.gameMenu ? (
      <GameMenu/>
    ) : (
      <SprintGame/>
    )
}