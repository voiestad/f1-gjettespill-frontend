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
  const colors = [
    "#DC3912", // red
    "#109618", // green
    "#3366CC", // blue
    "#FF9900", // orange
    "#0099C6", // cyan
    "#DD4477", // pink
    "#66AA00", // lime
    "#B82E2E", // dark red
    "#316395", // steel blue
    "#994499", // violet
    "#22AA99", // teal
    "#AAAA11", // olive
    "#6633CC", // indigo
    "#E67300", // burnt orange
    "#8B0707", // maroon
    "#651067", // plum
    "#329262", // forest green
    "#5574A6", // slate blue
    "#3B3EAC"  // deep blue
  ];
  let i = 0;
  for (const user of graph) {
    let color = colors[i % colors.length]
    if (user.name === "Elina") {
      color = "#f7d000"; // yellow
    } else if (user.name === "Frida Seselje") {
      color = "#990099"; // purple
    } else {
      i++;
    }
    userScores.push({
      data: user.scores,
      borderColor: color,
      backgroundColor: color,
      fill: false,
      label: user.name
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
