import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button
      className={props.winner_box ? " square text-green" : "square"}
      onClick={() => {
        props.onClick();
      }}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderRowSquares(i) {
    let boxes = [],
      winner_box;
    let winner = this.props.winner;

    for (let j = i; j < i + 3; j++) {
      if (winner && (j === winner[0] || j === winner[1] || j === winner[2])) {
        winner_box = true;
      } else {
        winner_box = false;
      }
      boxes.push(
        <Square
          value={this.props.squares[j]}
          onClick={() => this.props.onClick(j)}
          winner_box={winner_box}
        />
      );
    }
    return boxes;
  }
  renderSquare() {
    let grid = [];
    for (let index = 0; index < 9; index += 3) {
      grid.push(
        <div className="board-row">{this.renderRowSquares(index)}</div>
      );
    }
    return grid;
  }
  render() {
    return <div>{this.renderSquare()}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          row: null,
          col: null,
        },
      ],
      winner: [],
      xIsNext: true,
      stepNumber: 0,
      ascending: true,
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    let row = Math.floor(i / 3) + 1;
    let col = (i % 3) + 1;

    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      ...this.state,
      history: history.concat([
        {
          squares: squares,
          row: row,
          col: col,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      ...this.state,
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }
  reverseMoves = () => {
    this.setState({
      ...this.state,
      ascending: !this.state.ascending,
    });
  };

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const draw = calculateDraw(current.squares);

    const moves = history.map((step, move) => {
      const desc = move
        ? `Go to move #${move} at (${step.row}, ${step.col})`
        : "Go to game start";
      return (
        <li key={move}>
          <button
            className={this.state.stepNumber === move ? "activeStep" : ""}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + current.squares[winner[0]];
    } else if (draw) {
      status = "DRAW";
    } else {
      status = "Next Player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winner={winner}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <p>
              Ascending
              <label className="switch">
                <input type="checkbox" onClick={() => this.reverseMoves()} />
                <span className="slider round"></span>
              </label>
              Descending
            </p>
          </div>
          <ol className={this.state.ascending ? "straight" : "reverse"}>
            {moves}
          </ol>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}

function calculateDraw(squares) {
  for (let i = 0; i < 9; i++) {
    if (squares[i] === null) return false;
  }
  return true;
}
