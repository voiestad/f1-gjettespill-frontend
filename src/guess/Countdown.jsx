import { useEffect, useState, useRef } from 'react';

function Countdown(props) {
  const { initialTimeLeft } = props;
  const timeLeftRef = useRef(initialTimeLeft);
  const [time, setTime] = useState(null);

  function refreshTime() {
    const timeLeft = timeLeftRef.current;
    if (timeLeft <= 0) {
      setTime('Tiden er gått ut');
      return;
    }
    const days = Math.floor(timeLeft / (24 * 3600));
    const hours = Math.floor((timeLeft % (24 * 3600)) / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    setTime(<>Tiden går ut om:<br />{days}d {hours}t {minutes}m {seconds}s</>);
    timeLeftRef.current--;
  }

  useEffect(() => {
    refreshTime();
    setInterval(() => {
      refreshTime();
    }, 1000);
  }, []);

  return (
    <>
      {time ? time : ''}
    </>
  )
}

export default Countdown
