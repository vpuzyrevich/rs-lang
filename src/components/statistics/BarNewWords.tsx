import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { ILongStats } from '../../common/interfaces';



ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
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
        text: 'Новые слова',
      },
    },
  };

export function BarNewWords(props: {longStatsArray:ILongStats[]}){
    const array = props.longStatsArray;
    if (!array.length) return (
        <p> </p>
    );
    const labels = array.map((item) => item.date);
    const data = {
        labels,
        datasets: [
          {
            label: '',
            data: array.map((item) => item.newWords),
            backgroundColor: 'rgb(224, 94, 94)',
          }
        ],
      };
return (
    <Bar className='chart'
        options={options}
  data={data}
     />
)
}