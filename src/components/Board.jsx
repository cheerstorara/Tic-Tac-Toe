import { useEffect, useState } from "react";
import Square from "./Square";

const winSound = new Audio("/sounds/win.mp3");
const loseSound = new Audio("/sounds/lose.mp3");
const clickSound = new Audio("/sounds/click.mp3");


winSound.volume = 0.7;
loseSound.volume = 0.7;
clickSound.volume = 0.5;

function playWinSound() {
  const sfx = winSound.cloneNode();
  sfx.play();
}

function playLoseSound() {
  const sfx = loseSound.cloneNode();
  sfx.play();
}

function playClickSound() {
  const sound = clickSound.cloneNode();
  sound.play();
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [aiSymbol, setAiSymbol] = useState(null);
  const [isXNext, setIsXNext] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [message, setMessage] = useState("");
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);


  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo?.winner;

  const currentSymbol = isXNext ? "X" : "O";
  const isPlayerTurn = playerSymbol === currentSymbol;

  function handleSymbolChoice(symbol) {
    const ai = symbol === "X" ? "O" : "X";
    setPlayerSymbol(symbol);
    setAiSymbol(ai);
    setGameStarted(true);

    if (symbol === "O") {
      const aiMove = getRandomMove(squares);
      if (aiMove !== null) {
        const next = [...squares];
        next[aiMove] = "X";
        setSquares(next);
        setIsXNext(false);
      }
    }
  }

  function handleClick(index) {
    if (!gameStarted || !isPlayerTurn || squares[index] || winner) return;

    const next = [...squares];
    next[index] = playerSymbol;
    setSquares(next);
    setIsXNext(!isXNext);
    playClickSound();
  }

  function resetGame() {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
    setPlayerSymbol(null);
    setAiSymbol(null);
    setGameStarted(false);
    setMessage("");
    // Jangan reset skor agar tetap ditampilkan
  }
  
  

  useEffect(() => {
    if (
      gameStarted &&
      !winner &&
      !isPlayerTurn &&
      squares.filter(Boolean).length < 9
    ) {
      const timeout = setTimeout(() => {
        const aiMove = getRandomMove(squares);
        if (aiMove !== null) {
          const next = [...squares];
          next[aiMove] = aiSymbol;
          setSquares(next);
          setIsXNext(!isXNext);
          playClickSound();
        }
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [squares, gameStarted, isPlayerTurn, aiSymbol, winner]);

  useEffect(() => {
    if (winner) {
      const playerWon = winner === playerSymbol;
      if (playerWon) {
        setPlayerScore((prev) => prev + 1);
        playWinSound();
      } else {
        setAiScore((prev) => prev + 1);
        playLoseSound();
      }
    }
  }, [winner]);
  

  

  const status = winner
    ? `Pemenang: ${winner}`
    : squares.every(Boolean)
    ? "Seri!"
    : `Giliran: ${isXNext ? "X" : "O"}`;

    if (!playerSymbol) {
      return (
        <div className="font-vintage w-full max-w-sm mx-auto p-4 space-y-4">
          <h2 className="text-xl sm:text-2xl text-[#4b3621] text-center">Pilih simbol kamu</h2>
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => handleSymbolChoice("X")}
              className="px-6 py-2 w-20 bg-[#d4c1ac] border border-[#4b3621] text-[#4b3621] text-lg hover:bg-[#cbb498]"
            >
              X
            </button>
            <button
              onClick={() => handleSymbolChoice("O")}
              className="px-6 py-2 w-20 bg-[#d4c1ac] border border-[#4b3621] text-[#4b3621] text-lg hover:bg-[#cbb498]"
            >
              O
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="font-vintage w-full max-w-sm mx-auto p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-4 text-[#4b3621] gap-2 text-sm sm:text-base">
          <div>Pemain ({playerSymbol}): {playerScore}</div>
          <div>AI ({aiSymbol}): {aiScore}</div>
        </div>
    
        <h2 className="text-xl sm:text-2xl text-[#4b3621] mb-2 text-center">{status}</h2>
    
        {message && <p className="mb-4 text-[#8b5e3c] italic text-center text-sm">{message}</p>}
    
        <div className="grid grid-cols-3 gap-2 mb-4">
          {squares.map((val, i) => (
            <div key={i} className="aspect-square">
              <Square
                value={val}
                onClick={() => handleClick(i)}
                isWinning={winnerInfo?.line?.includes(i)}
              />
            </div>
          ))}
        </div>
    
        <button
          onClick={resetGame}
          className="w-full py-2 bg-[#c1b096] text-[#4b3621] border border-[#4b3621] hover:bg-[#b4a187] transition text-base"
        >
          Main Lagi
        </button>
      </div>
    );
    
}

function getRandomMove(squares) {
  const available = squares
    .map((val, i) => (val === null ? i : null))
    .filter((v) => v !== null);
  if (available.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}