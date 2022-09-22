import { IWordsStats } from "../../common/interfaces";

export function WordsStats(props: {value: {stats:IWordsStats, corrAnswersShare: number}}){
  const {value} = props;
  return (
    <table>
      <tbody>
    <tr>
      <td>Выучено за сегодня:</td>
      <td>{value.stats.learnedWords}</td>
    </tr>
    <tr>
      <td>Новых за сегодня:</td>
      <td>{value.stats.newWords}</td>
    </tr>
    <tr>
      <td>Процент правильных ответов:</td>
      <td>{value.corrAnswersShare}%</td>
    </tr>

    </tbody>
  </table>
  )    
}