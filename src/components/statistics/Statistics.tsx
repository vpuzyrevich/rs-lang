import "./statistics.scss";
import { useContext, useEffect, useState } from "react";
import { ILongStats, IUserStats, IWordsStats } from "../../common/interfaces";
import { API } from "../API/api";
import { authContext } from "../app/App";
import Footer from "../footer/Footer";
import { GameStats } from "./GameStats";
import { WordsStats } from "./WordsStats";
import { LongStats } from "./LongStats";


function Statistics() {
 
  const ctx = useContext(authContext);
  const isAuth = ctx.isAuth;


  const [stats, setStats] = useState({
    learnedWords: 0,
    optional: {
      daystats:
      {
        date: "",
        gamestats: [],
        wordsstats: {
          learnedWords: 0,
          newWords: 0
        }
      },
      longstats:
      {
        longStatsArray:[]
      }
   }
  } as IUserStats);
  const [isTodayStatsExists, setIsTodayStatsExists] = useState(false);
  const [gamesItems, setGamesItems] = useState<JSX.Element[]>([]);
  const [wordsStats, setWordStats] = useState({
    learnedWords: 0,
    newWords: 0
  } as IWordsStats);
  const [correctAnswersShare, setCorrectAnswersShare] = useState(0);
  const [longStatsArr, setLongStatsArr] =useState<ILongStats[]>([]);
  

  useEffect(() => {
   
    let longStat: ILongStats[];
    if(isAuth){
    
      API.getUserStats()
      .then((data) => {
      
        setStats(data);
        longStat = [...data.optional.longstats.longStatsArray];
        const now = new Date();
        const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
        
        
        if ((data.optional.daystats.date === undefined) || (date !== data.optional.daystats.date)) {
          setIsTodayStatsExists(false);
        } else {
          setIsTodayStatsExists(true);
          const todayStats = {
            date: date,
            newWords: data.optional.daystats.wordsstats.newWords,
            learnedWords: data.optional.daystats.wordsstats.learnedWords,
          } as ILongStats;
          longStat.push(todayStats);
          let corrNum = 0;
          let totalNum = 0;
          const items = data.optional.daystats.gamestats.map((item) =>{
            corrNum += item.correctAnswers;
            totalNum += item.answers;
            return (
              <section  key={item.game}>
              {<GameStats stats={item} />}
            </section>
            )
          }
         
        )
          setGamesItems(items);
          setWordStats(data.optional.daystats.wordsstats);
          setCorrectAnswersShare(totalNum ? Math.round((corrNum / totalNum * 10000))/100 : 0);
          setLongStatsArr(longStat);
        }
      })

    }
    
  }, [isAuth]);

 
  const wordSt = {stats: wordsStats, corrAnswersShare: correctAnswersShare};
  const arr = longStatsArr;
  if(isAuth){
  if(isTodayStatsExists) return (
    <div>
    <div className="statistics">
      <div className="wrapper statistics__wrapper">
        <h1>Статистика</h1>
        <h3>Всего слов выучено: {stats.learnedWords}</h3>
        <h2>Статистика по играм за день</h2>
        <div className="gamestats-container">
        {gamesItems}
        </div>
        <h2>Статистика по словам за день</h2>
        {<WordsStats  value = {wordSt} />}
        <h2>Статистика за все время</h2>
        {<LongStats longStatsArray = {arr} />}
      </div>     
      </div> 
      <Footer />
    </div>
  );
  return (
    <div >
    <div className="statistics">
      <div className="wrapper statistics__wrapper">
        <h1>Статистика</h1>
        <h3>Всего выучено {stats.learnedWords}</h3>
        <h2 className="no-statistics">на сегодня статистики нет</h2>
        <h2>Статистика за все время</h2>
        {<LongStats longStatsArray = {arr} />}
      </div>
      </div>
      <Footer />
    </div>  
  );
  }
  return (
    <div>
    <div className="statistics">
      <div className="wrapper statistics__wrapper">
        <p className="no-statistics">Авторизуйтесь для получения статистики</p>
       </div>
       </div>
      <Footer />
    </div>  
  )
}


export default Statistics;