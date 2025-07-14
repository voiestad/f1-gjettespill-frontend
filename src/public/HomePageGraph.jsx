import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function HomePageGraph(properties) {
  const { graph } = properties;
  const chartStyle = {
    display: "flex",
    maxWidth: "800px",
    maxHeight: "500px",
    margin: "0 auto",
    width: "100%",
    height: "100%"
  }
  const chartColor = "grey";
  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Løp"
        },
        grid: {
          color: chartColor,
          borderColor: chartColor
        },
        ticks: {
          color: chartColor
        }
      },
      y: {
        title: {
          display: true,
          text: "Poeng"
        },
        grid: {
          color: chartColor,
          borderColor: chartColor
        },
        ticks: {
          color: chartColor
        }
      }
    },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: chartColor
        }
      },
      title: {
        display: true,
        text: "Utvikling gjennom sesongen",
        color: chartColor
      }
    }
  };

  return (
    <>
      <div style={chartStyle}>
        <Line redraw={false} height={null} width={null} data={graph} options={options} />
      </div>
    </>
  )
}

export default HomePageGraph
