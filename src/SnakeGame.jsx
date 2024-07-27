import { useState, useEffect } from "react";
import * as tf from '@tensorflow/tfjs';


import { createModel } from "./Model";
import { getState, isDanger } from "./function";

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 2, y: 2 }]);
  const [fruit, setFruit] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [model, setModel] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    async function loadModel() {
      const newModel = createModel();
      setModel(newModel);
    }

    loadModel();
  }, []);

  function addData(state, action, reward, nextState) {
    setData((prevData) => [...prevData, { state, action, reward, nextState }]);
  }

  async function trainModel() {
    if (data.length > 100) {
      const inputs = data.map((d) => d.state);
      const labels = data.map((d) => d.action);

      const inputTensor = tf.tensor2d(inputs);
      const labelTensor = tf.tensor1d(labels, "int32");

      await model.fit(inputTensor, labelTensor, {
        epochs: 10,
        batchSize: 32,
        callbacks: {
          onEpochEnd: (epoch, logs) =>
            console.log(`Epoch ${epoch}: Loss = ${logs.loss}`),
        },
      });

      inputTensor.dispose();
      labelTensor.dispose();
    }
  }
  const updateGame = (action) => {
    const actions = ["UP", "DOWN", "LEFT", "RIGHT"];
    setDirection(actions[action]);
  };
  

  useEffect(() => {
    const gameLoop = setInterval(() => {
        if (!gameOver && model) {
            const state = getState(snake, fruit, direction);
            const action = predictAction(state);
            updateGame(action);
        }
    }, 200);

    return () => clearInterval(gameLoop);
}, [snake, fruit, direction, gameOver, model]);

  function predictAction(state) {
    const inputTensor = tf.tensor2d([state]);
    const predictions = model.predict(inputTensor);
    const action = predictions.argMax(1).dataSync()[0];
    inputTensor.dispose();
    return action;
}


  const handleKeyDown = (event) => {
    switch (event.key) {
      case "ArrowUp":
        setDirection("UP");
        break;
      case "ArrowDown":
        setDirection("DOWN");
        break;
      case "ArrowLeft":
        setDirection("LEFT");
        break;
      case "ArrowRight":
        setDirection("RIGHT");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const moveSnake = () => {
      let newSnake = [...snake];
      let head = { ...newSnake[0] };

      switch (direction) {
        case "UP":
          head.y -= 1;
          break;
        case "DOWN":
          head.y += 1;
          break;
        case "LEFT":
          head.x -= 1;
          break;
        case "RIGHT":
          head.x += 1;
          break;
        default:
          break;
      }

      newSnake.unshift(head);
      if (head.x === fruit.x && head.y === fruit.y) {
        setScore(score + 10);
        setFruit({
          x: Math.floor(Math.random() * 20),
          y: Math.floor(Math.random() * 20),
        });
      } else {
        newSnake.pop();
      }

      if (
        head.x < 0 ||
        head.x >= 20 ||
        head.y < 0 ||
        head.y >= 20 ||
        newSnake.slice(1).some((seg) => seg.x === head.x && seg.y === head.y)
      ) {
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
        <div
          key={index}
          style={{
            position: "absolute",
            top: `${segment.y * 20}px`,
            left: `${segment.x * 20}px`,
            width: "20px",
            height: "20px",
            backgroundColor: "green",
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          top: `${fruit.y * 20}px`,
          left: `${fruit.x * 20}px`,
          width: "20px",
          height: "20px",
          backgroundColor: "red",
        }}
      />
    </div>
  );
};

export default SnakeGame;
