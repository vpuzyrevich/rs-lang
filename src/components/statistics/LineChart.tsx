import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ILongStats } from '../../common/interfaces';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
        display: false,
      position: 'top' as const,
    },
    title: {
      display: false,
      text: 'Изученные слова',
    },
    
  },
};



export function LineChart(props: {longStatsArray:ILongStats[]}){
    const array = props.longStatsArray;
    if (!array.length) return (
        <p> </p>
    );

    const labels = array.map((item) => item.date);
    const dataset = array.reduce((acc, item) => acc.length ? [...acc, acc[acc.length-1] + item.learnedWords] : [...acc, item.learnedWords], [] as number[]);

   
    const data = {
        labels,
        datasets: [
          { label: '',
            data: dataset,
            backgroundColor: 'rgb(120, 195, 162)',
            borderColor: 'rgb(120, 195, 162)',
      
          }
        ],
      };
return (
    <Line className='chart'
    options={options}
    data={data}
     />
)
}


