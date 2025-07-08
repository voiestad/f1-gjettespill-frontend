import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import Table from '../util/Table';
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

function Leaderboard(props) {
  const header = ["Plass", "Navn", "Poeng"];
  const body = props.leaderboard.map((row) => ({
    key: row.guesser.id,
    values: [row.rank,
    <Link to={`/user/${row.guesser.id}`}>{row.guesser.username}</Link>,
    row.guesser.points]
  }));
  return <Table title="Rangering" header={header} body={body} />;
}

function Home() {
  const [leaderboard, setLeaderboard] = useState(null);
  const [graph, setGraph] = useState(null);
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

  useEffect(() => {
    loadContent();
  }, []);

  function loadContent() {
    axios.get('/api/public/home')
      .then(res => {
        setLeaderboard(res.data.leaderboard);
        const graphData = res.data.graph;
        const xValues = graphData[0].scores.map((_, i) => i);
        const userScores = [];
        const colors = ["#f7d000", "purple", "red", "green", "blue", "orange"];
        for (let i = 0; i < graphData.length; i++) {
          userScores.push({
            data: graphData[i].scores,
            borderColor: colors[i % colors.length],
            backgroundColor: colors[i % colors.length],
            fill: false,
            label: graphData[i].name
          });
        }
        const data = {
          labels: xValues,
          datasets: userScores
        };
        setGraph(data);
      })
      .catch(err => console.error(err));
  }

  return (
    <>
      <title>F1 Tipping</title>
      <h2>F1 Tipping hjemskjerm!</h2>
      {leaderboard ?
        <div className="tables">
          <Leaderboard leaderboard={leaderboard} />
        </div>
        : ''}
      {graph ?
        <>
        <div style={chartStyle}>
          <Line height={null} width={null} data={graph} options={options} />
        </div>
        </>
        : ''}
    </>
  )
}

export default Home
