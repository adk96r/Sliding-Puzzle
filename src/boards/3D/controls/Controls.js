import "./style.css";

export function Controls(props) {
  const { shuffle, reset } = props;
  return (
    <div id="controls">
      <div className="control" onClick={() => shuffle(100)}>
        Shuffle
      </div>
      <div className="control" onClick={reset}>
        Reset
      </div>
    </div>
  );
}
