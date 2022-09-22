import { ILongStats } from "../../common/interfaces";
import { BarNewWords } from "./BarNewWords";
import { LineChart } from "./LineChart";
import "./longStats.scss";

export function LongStats(props: {longStatsArray:ILongStats[]}){
    const array = props.longStatsArray;
    if (!array.length) return (
        <p> </p>
    );
    
return (
    <div className="longstats-container">
        <div> 
            <h4>Новые слова</h4>
            <BarNewWords longStatsArray = {array} 
     />
     </div>
   <div>
    <h4>Изученные слова</h4>
   <LineChart longStatsArray = {array} 
     />
   </div>
   
    
    </div>
   
)
}