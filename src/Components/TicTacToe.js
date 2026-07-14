import { useState, useEffect, useCallback } from "react";
import "../Styles/TicTacToe.css";

function TicTacToe() {

  const [leaderboard, setLeaderboard] = useState(() => {
    return JSON.parse(localStorage.getItem("leaderboard")) || [];
  });

  const [currentPlayer, setCurrentPlayer] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [board, setBoard] = useState(Array(9).fill(""));
  const [isXTurn, setIsXTurn] = useState(true);
  const [winner, setWinner] = useState("");
  const winningPatterns = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
  ];

  // Save leaderboard
  useEffect(() => {
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  }, [leaderboard]);

  
  const startGame = () => {

    if (playerName.trim() === "") {
      alert("Please enter your name.");
      return;
    }

    let players = [...leaderboard];

    // Check if player already exists
    const exists = players.find(
      p => p.name.toLowerCase() === playerName.trim().toLowerCase()
    );

    // Add new player only if not found
    if (!exists) {
      players.push({
        id: Date.now(),
        name: playerName.trim(),
        wins: 0,
        losses: 0,
        draws: 0
      });
    }

    // Add AI only once
    if (!players.find(p => p.name === "Shivam")) {
      players.push({
        id: -1,
        name: "Shivam",
        wins: 0,
        losses: 0,
        draws: 0
      });
    }

    setLeaderboard(players);
    setCurrentPlayer(playerName.trim());
  };
const handleClick = (index)=>{

    if(board[index]!=="" || winner!=="" || !isXTurn){
        return;
    }

    const newBoard=[...board];

    newBoard[index]="X";

    setBoard(newBoard);

    if(!checkWinner(newBoard)){
        setIsXTurn(false);
    }

};

const makeAIMove = useCallback(() => {
  let move = -1;

  // 10% chance to make a random move
  if (Math.random() < 0.05) {

    const emptyCells = [];

    board.forEach((cell, index) => {
      if (cell === "") {
        emptyCells.push(index);
      }
    });

    move = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  }
   else {

    // 90% chance to use Minimax
    move = getBestMove();

   }

  if (move !== -1) {

    const newBoard = [...board];
    newBoard[move] = "O";

    setBoard(newBoard);

    checkWinner(newBoard);

    setIsXTurn(true);
  }
}, [board, currentPlayer, leaderboard]);

// AI move 
useEffect(() => {

  if (isXTurn || winner !== "") return;

  const timer = setTimeout(() => {
    makeAIMove();
  }, 600);

  return () => clearTimeout(timer);

}, [board, isXTurn, winner, makeAIMove]);

  const resetGame = () => {
  setBoard(Array(9).fill(""));
  setWinner("");
  setIsXTurn(true);
  };
  const minimax = (board, depth, isMaximizing) => {

  const result = checkWinnerForAI(board);

  if (result !== null) {
    if (result === "O") return 10 - depth;
    if (result === "X") return depth - 10;
    return 0;
  }

  if (isMaximizing) {

    let bestScore = -Infinity;

    for (let i = 0; i < 9; i++) {

      if (board[i] === "") {

        board[i] = "O";

        let score = minimax(board, depth + 1, false);

        board[i] = "";

        bestScore = Math.max(score, bestScore);

      }

    }

    return bestScore;

  } else {

    let bestScore = Infinity;

    for (let i = 0; i < 9; i++) {

      if (board[i] === "") {

        board[i] = "X";

        let score = minimax(board, depth + 1, true);

        board[i] = "";

        bestScore = Math.min(score, bestScore);

      }

    }

    return bestScore;

  }

  };

  const checkWinnerForAI = (board) => {

  for (let pattern of winningPatterns) {

    const [a,b,c] = pattern;

    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return board[a];
    }

  }

  if (!board.includes("")) {
    return "draw";
  }

  return null;

};

const getBestMove = () => {

  let bestScore = -Infinity;
  let move = -1;

  for (let i = 0; i < 9; i++) {

    if (board[i] === "") {

      board[i] = "O";

      let score = minimax(board, 0, false);

      board[i] = "";

      if (score > bestScore) {

        bestScore = score;
        move = i;

      }

    }

  }

  return move;

};


const checkWinner = (gameBoard) => {

  for (let pattern of winningPatterns) {

    const [a,b,c] = pattern;

    if(
      gameBoard[a] &&
      gameBoard[a] === gameBoard[b] &&
      gameBoard[a] === gameBoard[c]
    ){

      const winnerSymbol = gameBoard[a];

      if(winnerSymbol === "X"){

        setWinner(`${currentPlayer} Wins 🎉`);

        const updated = leaderboard.map(player=>{

          if(player.name === currentPlayer){
            return {...player,wins:player.wins+1};
          }

          if(player.name==="Shivam"){
            return {...player,losses:player.losses+1};
          }

          return player;

        });

        setLeaderboard(updated);

      }
      else{

        setWinner("Shivam  Wins 🤖");

        const updated = leaderboard.map(player=>{

          if(player.name==="Shivam"){
            return {...player,wins:player.wins+1};
          }

          if(player.name===currentPlayer){
            return {...player,losses:player.losses+1};
          }

          return player;

        });

        setLeaderboard(updated);

      }

      return true;
    }

  }

  if(!gameBoard.includes("")){

    setWinner("Draw");

    const updated = leaderboard.map(player=>({
      ...player,
      draws:player.draws+1
    }));

    setLeaderboard(updated);

    return true;

  }

  return false;

};
  // Show name screen first
  if (currentPlayer === "") {
    return (
      <div className="start-screen">

        <div className="start-card">

          <h2>Tic Tac Toe</h2>

          <h4>Enter Your Name</h4>

          <input
            type="text"
            placeholder="Player Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />

          <button onClick={startGame}>
            Start Game
          </button>

          {leaderboard.length > 0 && (
            <>
              <h3>Leaderboard</h3>

              <table>

                <thead>
                  <tr>
                    <th>Player</th>
                    <th>Wins</th>
                    <th>Losses</th>
                    <th>Draws</th>
                  </tr>
                </thead>

                <tbody>

                  {[...leaderboard]
                    .sort((a, b) => b.wins - a.wins)
                    .map(player => (

                      <tr key={player.id}>
                        <td>{player.name}</td>
                        <td>{player.wins}</td>
                        <td>{player.losses}</td>
                        <td>{player.draws}</td>
                      </tr>

                  ))}

                </tbody>

              </table>
            </>
          )}

        </div>

      </div>
    );
  }

  return (
  <div className="container mt-4">

    <div className="row">

      {/* Left Side */}

      <div className="col-md-8">

        <h2>Welcome, {currentPlayer}</h2>

        <h4>
          {winner !== ""
            ? winner
            : isXTurn
            ? `${currentPlayer}'s Turn (X)`
            : "Shivam's Turn (O)"}
        </h4>

        <div className="board">

          {board.map((cell, index) => (

            <button
              key={index}
              className="cell"
              onClick={() => handleClick(index)}
            >
              {cell}
            </button>

          ))}

        </div>

        <button
          className="btn btn-primary mt-3"
          onClick={resetGame}
        >
          Reset Game
        </button>

      </div>

      {/* Right Side */}

      <div className="col-md-4">

        <h3>Leaderboard</h3>

        <table className="table table-bordered">

          <thead className="table-primary">
            <tr>
              <th>Player</th>
              <th>Wins</th>
              <th>Losses</th>
              <th>Draws</th>
            </tr>
          </thead>

          <tbody>

            {[...leaderboard]
              .sort((a, b) => b.wins - a.wins)
              .map(player => (

                <tr key={player.id}>
                  <td>{player.name}</td>
                  <td>{player.wins}</td>
                  <td>{player.losses}</td>
                  <td>{player.draws}</td>
                </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  </div>
);

}

export default TicTacToe;