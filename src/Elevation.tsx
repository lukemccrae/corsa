import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Data and options for the chart
const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'], // X-axis labels
  datasets: [
    {
      label: 'Sales', // Name of the dataset
      data: [10, 20, 30, 40, 50, 60], // Data points for the Y-axis
      borderColor: 'rgba(75, 192, 192, 1)', // Line color
      backgroundColor: 'rgba(75, 192, 192, 0.2)', // Fill color under the line
      borderWidth: 2,
    },
  ],
};

const options = {
  responsive: true,
  plugins: [{
    beforeInit: (chart: { data: { datasets: { data: any; }[]; labels: any; }; options: { scales: { x: { min: number; max: number; }; y: { max: number; }; y1: { max: number; }; }; }; }) => {
      const maxHeight = Math.max(...chart.data.datasets[0].data);
      chart.options.scales.x.min = Math.min(...chart.data.labels);
      chart.options.scales.x.max = Math.max(...chart.data.labels);
      chart.options.scales.y.max = maxHeight + Math.round(maxHeight * 0.2);
      chart.options.scales.y1.max = maxHeight + Math.round(maxHeight * 0.2);
    }
  }],
scales: {
      x: { type: 'linear', position: 'bottom' },
      y: { type: 'linear', beginAtZero: true , position: 'left',  id: 'y'},
      y1: { type: 'linear', display: true, position: 'right', beginAtZero: true, grid: { drawOnChartArea: false }}, id: 'y1',
    },
};

// LineChart Component
const LineChart = () => {
  return (
    <div style={{ width: '80%', margin: '0 auto' }}>
      <Line data={data} options={options} />
    </div>
  );
};

// App Component
const App = () => {
  return (
    <div>
      <LineChart />
    </div>
  );
};

export default App;
