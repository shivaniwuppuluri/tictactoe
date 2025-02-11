import React, { useState } from 'react';
import { Heart, X } from 'lucide-react';

const GameStatus = {
  PLAYING: 'playing',
  WIN: 'win',
  LOSE: 'lose',
  DRAW: 'draw'
};

const Modal = ({ isOpen, onClose, status, message, onPlayAgain }) => {
  if (!isOpen) return null;

  const getBackgroundColor = () => {
    switch (status) {
      case GameStatus.WIN: return 'bg-gradient-to-r from-pink-100 to-pink-200';
      case GameStatus.LOSE: return 'bg-gradient-to-r from-blue-100 to-blue-200';
      case GameStatus.DRAW: return 'bg-gradient-to-r from-purple-100 to-purple-200';
      default: return 'bg-white';
    }
  };

  const titles = {
    [GameStatus.WIN]: "🎉 Congratulations! 🎉",
    [GameStatus.LOSE]: "💝 Don't Worry! 💝",
    [GameStatus.DRAW]: "🤝 It's a Draw! 🤝"
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className={`${getBackgroundColor()} p-6 rounded-lg shadow-xl max-w-sm w-full`}>
        <h2 className="text-2xl font-bold text-pink-600 text-center mb-4">
          {titles[status]}
        </h2>
        <p className="text-lg text-pink-700 py-4 text-center">
          {message}
        </p>
        <button
          onClick={() => {
            onPlayAgain();
            onClose();
          }}
          className="w-full py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [gameStatus, setGameStatus] = useState(GameStatus.PLAYING);
  const [showModal, setShowModal] = useState(false);
  const [lastMove, setLastMove] = useState(null);
  const [isThinking, setIsThinking] = useState(false);

  const messages = {
    [GameStatus.WIN]: "You win a Valentine's date with me! yoohoo!",
    [GameStatus.LOSE]: "That's okay, I can take you for dinner on Valentines to cheer you up. What say?",
    [GameStatus.DRAW]: "Let's play again , Valentine's day during dinner?"
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setGameStatus(GameStatus.PLAYING);
    setShowModal(false);
    setLastMove(null);
    setIsThinking(false);
  };

  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const getEmptySquares = (squares) => {
    return squares
      .map((square, index) => square === null ? index : null)
      .filter(index => index !== null);
  };

  const makeAIMove = (squares) => {
    const emptySquares = getEmptySquares(squares);
    if (emptySquares.length === 0) return squares;
    
    const newSquares = [...squares];
    
    // Check if AI can win
    for (let i of emptySquares) {
      const testBoard = [...squares];
      testBoard[i] = 'O';
      if (checkWinner(testBoard) === 'O') {
        newSquares[i] = 'O';
        return newSquares;
      }
    }
    
    // Block player's winning move
    for (let i of emptySquares) {
      const testBoard = [...squares];
      testBoard[i] = 'X';
      if (checkWinner(testBoard) === 'X') {
        newSquares[i] = 'O';
        return newSquares;
      }
    }
    
    // Take center if available
    if (squares[4] === null) {
      newSquares[4] = 'O';
      return newSquares;
    }
    
    // Take corners
    const corners = [0, 2, 6, 8].filter(i => squares[i] === null);
    if (corners.length > 0) {
      const randomCorner = corners[Math.floor(Math.random() * corners.length)];
      newSquares[randomCorner] = 'O';
      return newSquares;
    }
    
    // Take any available edge
    const edges = [1, 3, 5, 7].filter(i => squares[i] === null);
    if (edges.length > 0) {
      const randomEdge = edges[Math.floor(Math.random() * edges.length)];
      newSquares[randomEdge] = 'O';
      return newSquares;
    }
    
    // Fallback to random move
    const randomIndex = Math.floor(Math.random() * emptySquares.length);
    newSquares[emptySquares[randomIndex]] = 'O';
    return newSquares;
  };

  const handleClick = (index) => {
    if (board[index] || gameStatus !== GameStatus.PLAYING || isThinking) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setLastMove(index);

    if (checkWinner(newBoard) === 'X') {
      setGameStatus(GameStatus.WIN);
      setShowModal(true);
      return;
    }

    if (getEmptySquares(newBoard).length === 0) {
      setGameStatus(GameStatus.DRAW);
      setShowModal(true);
      return;
    }

    setIsThinking(true);
    setTimeout(() => {
      const aiBoard = makeAIMove(newBoard);
      setBoard(aiBoard);
      setIsThinking(false);

      if (checkWinner(aiBoard) === 'O') {
        setGameStatus(GameStatus.LOSE);
        setShowModal(true);
        return;
      }

      if (getEmptySquares(aiBoard).length === 0) {
        setGameStatus(GameStatus.DRAW);
        setShowModal(true);
      }
    }, 1000);
  };

  const renderSquare = (index) => {
    const isLastMove = lastMove === index;
    return (
      <button
        key={index}
        onClick={() => handleClick(index)}
        className={`w-24 h-24 border-2 border-pink-300 flex items-center justify-center bg-white hover:bg-pink-50 transition-all duration-300 rounded-full
          ${isLastMove ? 'scale-95' : ''}
          ${isThinking ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        disabled={isThinking}
      >
        {board[index] === 'X' && (
          <X className="w-16 h-16 text-blue-500" />
        )}
        {board[index] === 'O' && (
          <Heart 
            className="w-16 h-16 text-pink-500" 
            fill="pink" 
          />
        )}
      </button>
    );
  };

  return (
    <div className="w-full min-h-screen bg-pink-100 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-pink-600 mb-8">
          Tic-tac-toe
        </h1>
        <div className="text-lg text-pink-600 mb-4">
          You are "X" and I am "❤️". Let's play!
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => renderSquare(index))}
          </div>
        </div>
        <p className="mt-4 text-pink-600">
          {isThinking ? "I am thinking..." : null}
        </p>

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          status={gameStatus}
          message={messages[gameStatus]}
          onPlayAgain={resetGame}
        />
      </div>
    </div>
  );
};

export default TicTacToe;