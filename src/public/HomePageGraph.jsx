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
  const xValues = graph[0].scores.map((_, i) => i);
  const userScores = [];
  const colors = ["#f7d000", "purple", "red", "green", "blue", "orange"];
  for (let i = 0; i < graph.length; i++) {
    userScores.push({
      data: graph[i].scores,
      borderColor: colors[i % colors.length],
      backgroundColor: colors[i % colors.length],
      fill: false,
      label: graph[i].name
    });
  }
  const data = {
    labels: xValues,
    datasets: userScores
  };
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
        <Line redraw={false} height={null} width={null} data={data} options={options} />
      </div>
    </>
  )
}

export default HomePageGraph
