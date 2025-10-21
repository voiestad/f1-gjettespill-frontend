import { useState, useEffect, useRef } from 'react';

function RankCompetitors(props) {
  const { initialCompetitors, guessHandler } = props;
  const [competitors, setCompetitors] = useState(initialCompetitors);
  const [transitions, setTransitions] = useState(false)
  const itemRefs = useRef([]);
  const itemBoundsRef = useRef([]);
  const draggedIndexRef = useRef(null);
  const currPosRef = useRef(null);
  const maxRef = useRef(0);

  function confirmGuess(event) {
    event.preventDefault();
    guessHandler(competitors.map(comp => comp.id));
  }

  useEffect(() => {
    const heights = itemRefs.current.map(elem => elem.getBoundingClientRect().height);
    const max = Math.max(...heights);
    maxRef.current = max;
    itemRefs.current.forEach(ref => {
      ref.style.height = `${max}px`;
      ref.style.zIndex = 1000;
    });
  }, []);

  function setItemBounds() {
    itemBoundsRef.current = itemRefs.current.map((el) => el.getBoundingClientRect());
  }

  function findIndexOfCursor(y) {
    const bounds = itemBoundsRef.current;
    for (let i = 0; i < bounds.length; i++) {
      if (y > bounds[i].top && y < bounds[i].bottom) {
        return i;
      }
    }
    return null;
  }

  function resetPositions() {
    itemRefs.current.forEach((el) => {
      el.style.transform = '';
    });
  }

  function updatePositions() {
    const boxHeight = maxRef.current;
    competitors.forEach((_, index) => {
      const el = itemRefs.current[index];
      if (!el || index === draggedIndexRef.current) return;

      let offset = 0;
      if (index < draggedIndexRef.current && index >= currPosRef.current) {
        offset = boxHeight;
      } else if (index > draggedIndexRef.current && index <= currPosRef.current) {
        offset = -boxHeight;
      }

      el.style.transform = `translate3d(0px, ${offset}px, 0px)`;
    });
  };

  function dragStart(index, event) {
    setTransitions(true);
    event.target.style.zIndex = 1;
    draggedIndexRef.current = index;
    currPosRef.current = index;
    setItemBounds();
  }

  function dragOver(event) {
    event.preventDefault();
    const y = event.clientY;
    const index = findIndexOfCursor(y);
    if (index == null) return;
    currPosRef.current = index;
    updatePositions();
  }

  function dragEnd(event) {
    setTransitions(false);
    event.target.style.zIndex = 1000;
    resetPositions();
    const from = draggedIndexRef.current;
    const to = currPosRef.current;

    if (from == null || to == null || from === to) return;

    const updated = [...competitors];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setCompetitors(updated);

    draggedIndexRef.current = null;
    currPosRef.current = null;
  }

  return (
    <>
      <script async src="/DragDropTouch.js" />
      <form>
        <ul className="container">
          {competitors.map((competitor, i) =>
            <li
              ref={el => itemRefs.current[i] = el}
              key={competitor.id}
              className={'item-wrapper' + (transitions ? '' : ' disable-transitions')}
              draggable="true"
              onDragStart={el => dragStart(i, el)}
              onDragOver={dragOver}
              onDragEnd={dragEnd}
            >
              <div className="number">{i + 1}</div>
              <div className="item">{competitor.name}</div>
              {competitor.color ?
                <span className="circle" style={{ backgroundColor: competitor.color }}></span> : ''}
            </li>
          )}
        </ul>
        <input type="submit" onClick={confirmGuess} value="Send inn gjett" />
      </form>
    </>
  )
}

export default RankCompetitors
