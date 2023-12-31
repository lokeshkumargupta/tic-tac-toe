import { useState } from "react";

function Square({ value, onSquareClick, thisSquareCauseWin }) {
  const background = thisSquareCauseWin ? "#808080" : "#FFFFFF";
  return (
    <button
      style={{ backgroundColor: background }}
      className="square"
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const [winner, winnerLine] = calculateWinner(squares);
  let gameStatus;
  if (winner) {
    gameStatus = "Winner: " + winner;
  } else if (squares.includes(null)) {
    gameStatus = "Next player: " + (xIsNext ? "X" : "O");
  } else {
    gameStatus = "Game draws";
  }
  function handleClick(i) {
    if (squares[i] || winner) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }
  const rows = [];
  for (let row = 0; row < 3; row++) {
    const columns = [];
    for (let column = 0; column < 3; column++) {
      const squareIndex = 3 * row + column;
      columns.push(
        <Square
          thisSquareCauseWin={winnerLine.includes(squareIndex)}
          value={squares[squareIndex]}
          onSquareClick={() => handleClick(3 * row + column)}
        />,
      );
    }
    rows.push(<div className="board-row">{columns}</div>);
  }
  return (
    <>
      <div className="status">{gameStatus}</div>
      {rows}
    </>
  );
}

export default function Game() {
  const [currentMove, setCurrentMove] = useState(0);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  const moves = history.map((squares, move) => {
    const toMove = history[move];
    const fromMove = history[move - 1];
    let thisMove = toMove.findIndex(
      (value, index) => value !== fromMove?.[index],
    );
    let description;
    if (move > 0) {
      if (currentMove === move) {
        description = `You are at move #${move} (${Math.floor(thisMove / 3)},${
          thisMove % 3
        })`;
      } else {
        description = `Go to move #${move} (${Math.floor(thisMove / 3)},${
          thisMove % 3
        })`;
      }
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button disabled={currentMove === move} onClick={() => jumpTo(move)}>
          {description}
        </button>
      </li>
    );
  });
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ul style={{ listStyleType: "none" }}>{moves}</ul>
      </div>
    </div>
  );
}

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
  for (const line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], line];
    }
  }
  return [null, []];
}
