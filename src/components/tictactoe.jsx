import React, { useState, useEffect } from 'react';
import { Heart, X, Volume2, VolumeX, Music } from 'lucide-react';

const GameStatus = {
  PLAYING: 'playing',
  WIN: 'win',
  LOSE: 'lose',
  DRAW: 'draw'
};

// Added music tracks
const MUSIC_TRACKS = [
  {
    name: "Gentle Romance",
    url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3"
  }
];

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
          Yes!!
        </button>
      </div>
    </div>
  );
};

const MusicSelector = ({ onSelect, currentTrack, isPlaying }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-pink-200 transition-colors flex items-center gap-2"
      >
        <Music className="w-6 h-6 text-pink-600" />
        <span className="text-sm text-pink-600"></span>
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg p-2 w-48">
          {MUSIC_TRACKS.map((track, index) => (
            <button
              key={index}
              onClick={() => {
                onSelect(track);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded hover:bg-pink-50 text-sm ${
                currentTrack?.name === track.name ? 'text-pink-600 font-medium' : 'text-gray-700'
              }`}
            >
              {track.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [gameStatus, setGameStatus] = useState(GameStatus.PLAYING);
  const [showModal, setShowModal] = useState(false);
  const [lastMove, setLastMove] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(MUSIC_TRACKS[0]);
  const [audio] = useState(new Audio(MUSIC_TRACKS[0].url));

  useEffect(() => {
    audio.loop = true;
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio]);

  const toggleMusic = () => {
    if (isMusicPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  const changeTrack = (track) => {
    const wasPlaying = !audio.paused;
    audio.src = track.url;
    setCurrentTrack(track);
    if (wasPlaying) {
      audio.play();
    }
  };

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
    
    // Reduced AI intelligence - only block obvious wins and make more random moves
    
    // Block player's winning move (50% chance)
    if (Math.random() > 0.5) {
      for (let i of emptySquares) {
        const testBoard = [...squares];
        testBoard[i] = 'X';
        if (checkWinner(testBoard) === 'X') {
          newSquares[i] = 'O';
          return newSquares;
        }
      }
    }
    
    // Take center only 30% of the time
    if (squares[4] === null && Math.random() < 0.3) {
      newSquares[4] = 'O';
      return newSquares;
    }
    
    // Random move with higher probability
    if (Math.random() < 0.7) {
      const randomIndex = Math.floor(Math.random() * emptySquares.length);
      newSquares[emptySquares[randomIndex]] = 'O';
      return newSquares;
    }
    
    // If no random move, take any available corner
    const corners = [0, 2, 6, 8].filter(i => squares[i] === null);
    if (corners.length > 0) {
      const randomCorner = corners[Math.floor(Math.random() * corners.length)];
      newSquares[randomCorner] = 'O';
      return newSquares;
    }
    
    // Fallback to any available move
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
        // Add delay before showing the win message
        setTimeout(() => {
          setGameStatus(GameStatus.LOSE);
          setShowModal(true);
        }, 500); // 0.5 second delay
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
        <div className="flex items-center justify-between w-full max-w-md mb-4">
          <h1 className="text-3xl font-bold text-pink-600">
            Tic-Tac-Toe
          </h1>
          <div className="flex items-center gap-4">
            <MusicSelector 
              onSelect={changeTrack}
              currentTrack={currentTrack}
              isPlaying={isMusicPlaying}
            />
            <button
              onClick={toggleMusic}
              className="p-2 rounded-full hover:bg-pink-200 transition-colors"
            >
              {isMusicPlaying ? (
                <Volume2 className="w-6 h-6 text-pink-600" />
              ) : (
                <VolumeX className="w-6 h-6 text-pink-600" />
              )}
            </button>
          </div>
        </div>
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