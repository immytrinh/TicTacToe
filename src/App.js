import { useState } from 'react';

function Square({ value, onSquareClick, winning }) {
  const squareClass = "square " + (winning ? "winning-square " : "");
  return (
    <button className={squareClass} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, currentMove }) {
  const result = calculateWinner(squares)
  const winner = result?.winner
  const winningLine = result?.line

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares,i);
  }

  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  }
  else if (currentMove === 9) {
    status = "Draw"
  }
  else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  // 2. Rewrite Board to use two loops to make the squares instead of hardcoding them.

  const boardSize = 3
  let board = []
  for (let i = 0; i < boardSize; i++) {
    let row = []
    for (let j = 0; j < boardSize; j++) {
      const index = i * boardSize + j
      const winningSquare = winningLine?.includes(index)
      row.push(
        <Square
          key = {index}
          value = {squares[index]}
          onSquareClick = {() => handleClick(index)}
          winning = {winningSquare}
        />
      )
    }
    board.push(
      <div key={i} className="board=row">
        {row}
      </div>
    )
  }

  return (
    <>
      <div className="status">{status}</div>
      {board}
      {/* <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div> */}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{squares: Array(9).fill(null), index: -1}]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;
  const [ascending, setAscending] = useState(true)

  function handlePlay(nextSquares,i) {
    const nextHistory = [...history.slice(0, currentMove + 1),{squares: nextSquares, index: i}];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((turnInfo, move) => {
    let description;
    if (move > 0) {
      const row = Math.floor(turnInfo.index / 3);
      const col = turnInfo.index % 3;
      const symbol = turnInfo.index % 2 === 0 ? 'X' : 'O';
      description = 'Go to move #' + move + ' - ' + symbol + '(' + row + ', ' + col + ')';
    } else {
      description = 'Go to game start';
    }

    // 1. For the current move only, show “You are at move #…” instead of a button.

    return (
      <li key={move}>
        {move === currentMove ? (
          <>You are at move #{move}</>) : (
          <button onClick={() => jumpTo(move)}>{description}</button>)}
      </li>
    );
  });

  // 3. Add a toggle button that lets you sort the moves in either ascending or descending order.

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} currentMove={currentMove} />
      </div>
      <div className="game-info">
        <button onClick={() => setAscending(!ascending)}>
          {ascending? "Sort descending" : "Sort ascending"}
        </button>
        <ol>{ascending ? moves : moves.slice().reverse()}</ol>
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner: squares[a], line: lines[i]};
    }
  }
  return null;
}
