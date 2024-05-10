import  { useState, useEffect } from 'react';

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 2, y: 2 }]);
  const [fruit, setFruit] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const handleKeyDown = (event) => {
    switch(event.key) {
      case 'ArrowUp': setDirection('UP'); break;
      case 'ArrowDown': setDirection('DOWN'); break;
      case 'ArrowLeft': setDirection('LEFT'); break;
      case 'ArrowRight': setDirection('RIGHT'); break;
      default: break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const moveSnake = () => {
      let newSnake = [...snake];
      let head = { ...newSnake[0] };
      
      switch(direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
        default: break;
      }
      
      newSnake.unshift(head);
      if (head.x === fruit.x && head.y === fruit.y) {
        setScore(score + 10);
        setFruit({ x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) });
      } else {
        newSnake.pop();
      }
      
      if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || newSnake.slice(1).some(seg => seg.x === head.x && seg.y === head.y)) {
        setGameOver(true);
      }
      
      if (!gameOver) {
        setSnake(newSnake);
      }
    };

    const gameLoop = setInterval(moveSnake, 200);
    return () => clearInterval(gameLoop);
  }, [snake, direction, gameOver]);

  if (gameOver) {
    return <div>Game Over! Your score: {score}</div>;
  }

  return (
    <div>
      {/* Render le jeu ici */}
      {snake.map((segment, index) => (
        <div key={index} style={{ position: 'absolute', top: `${segment.y * 20}px`, left: `${segment.x * 20}px`, width: '20px', height: '20px', backgroundColor: 'green' }} />
      ))}
      <div style={{ position: 'absolute', top: `${fruit.y * 20}px`, left: `${fruit.x * 20}px`, width: '20px', height: '20px', backgroundColor: 'red' }} />
    </div>
  );
};

export default SnakeGame;
