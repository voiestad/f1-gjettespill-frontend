import { useState } from 'react';

function ChooseDriver(props) {
  const { initialSelected, drivers, guessHandler } = props;
  const [selected, setSelected] = useState(initialSelected);
  function confirmGuess(event) {
    event.preventDefault();
    if (selected) {
      guessHandler(selected);
    }
  }

  return (
    <>
      <form>
        <ul className="container">
          {drivers.map((driver, i) =>
            <li key={driver.id} onClick={e => setSelected(driver.id)}
              className={(driver.id === selected ? 'selected ' : '') + 'item-wrapper'}>
              <div className="number">{i + 1}</div>
              <div className="item">{driver.name}</div>
              {driver.color ?
                <span className="circle" style={{ backgroundColor: driver.color }}></span> : ''}
            </li>
          )}
        </ul>
        <input type="submit" onClick={confirmGuess} value="Send inn gjett" />
      </form>
    </>
  )
}


export default ChooseDriver
