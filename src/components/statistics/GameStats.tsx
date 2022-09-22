import "./gamestats.scss";
import { IGameStats } from "../../common/interfaces";
import { GAMES_NAMES } from "../../common/constants";


export function GameStats(props: {stats:IGameStats}){
  const {stats} = props;
  const bg = (stats.game === GAMES_NAMES.sprint) ? "game1" : "game2";
  return (
    <div className="gamestats">
      <div className={"gamestats__heading" +" "+ bg} >
        <h3 className="gamestats__headingtext">{stats.game}</h3>
      </div>
      <table>
        <tbody>
    <tr>
      <td className="col1">Новых слов:</td>
      <td>{stats.newWords}</td>
    </tr>
    <tr>
      <td  className="col1">Процент правильных ответов:</td>
      <td>{stats.answers ? Math.round((stats.correctAnswers / stats.answers * 10000))/100 : 0} %</td>
    </tr>
    <tr>
      <td className="col1">Самая длинная серия правильных ответов:</td>
      <td>{stats.longestSeries}</td>
    </tr>
    </tbody>
  </table>
    </div>
  );   
}