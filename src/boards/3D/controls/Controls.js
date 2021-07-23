import "./style.css";

export function Controls(props) {
  const { shuffle, reset } = props;
  return (
    <div id="controls">
      <div class="control" onClick={() => shuffle(100)}>
        Shuffle
      </div>
      <div class="control" onClick={reset}>
        Reset
      </div>
    </div>
  );
}
