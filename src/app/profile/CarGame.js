import React, { useEffect, useRef, useState } from "react";
import styles from "./CarGame.module.css";

const CarGame = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [obstacleSpeed, setObstacleSpeed] = useState(5);
  const [obstacleInterval, setObstacleInterval] = useState(1500);

  useEffect(() => {
    const preventScroll = (e) => {
      if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", preventScroll);

    return () => {
      window.removeEventListener("keydown", preventScroll);
    };
  }, []);

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const lanes = [80, 220];
    let car = { x: lanes[0], y: canvas.height - 120, width: 40, height: 80 };
    let currentLane = 0;
    let obstacles = [];
    let obstacleIntervalId;
    let animationFrameId;

    const generateObstacle = () => {
      const randomLane = lanes[Math.floor(Math.random() * lanes.length)];
      const obstacle = {
        x: randomLane,
        y: -100,
        width: 40,
        height: 80,
      };
      obstacles.push(obstacle);
    };

    const detectCollision = (player, obstacle) => {
      return (
        player.x < obstacle.x + obstacle.width &&
        player.x + player.width > obstacle.x &&
        player.y < obstacle.y + obstacle.height &&
        player.y + player.height > obstacle.y
      );
    };

    const moveCar = (event) => {
      if (gameOver) return;

      if (event.key === "ArrowLeft" && currentLane > 0) {
        currentLane -= 1;
      } else if (event.key === "ArrowRight" && currentLane < lanes.length - 1) {
        currentLane += 1;
      }
      car.x = lanes[currentLane];
    };

    const drawRoad = () => {
      ctx.fillStyle = "#444";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.setLineDash([15, 15]);
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
    };

    const drawCar = (x, y, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 40, 80);
    };

    const updateGame = () => {
      if (gameOver) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawRoad();

      drawCar(car.x, car.y, "#4caf50");

      for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        drawCar(obstacle.x, obstacle.y, "#f44336");
        obstacle.y += obstacleSpeed;

        if (detectCollision(car, obstacle)) {
          setGameOver(true);
          cancelAnimationFrame(animationFrameId);
          clearInterval(obstacleIntervalId);
          return;
        }

        if (obstacle.y > canvas.height) {
          obstacles.splice(i, 1);
          setScore((prevScore) => {
            const newScore = prevScore + 1;

            if (newScore % 10 === 0) {
              setObstacleSpeed((prevSpeed) => prevSpeed + 1);
              setObstacleInterval((prevInterval) =>
                Math.max(prevInterval - 200, 500)
              );
            }

            return newScore;
          });
          i--;
        }
      }

      animationFrameId = requestAnimationFrame(updateGame);
    };

    const startGame = () => {
      setGameOver(false);
      setScore(0);
      setObstacleSpeed(5);
      setObstacleInterval(1500);
      car.x = lanes[currentLane];
      obstacles = [];
      obstacleIntervalId = setInterval(generateObstacle, obstacleInterval);
      updateGame();
    };

    window.addEventListener("keydown", moveCar);
    startGame();

    return () => {
      window.removeEventListener("keydown", moveCar);
      cancelAnimationFrame(animationFrameId);
      clearInterval(obstacleIntervalId);
    };
  }, [gameStarted, obstacleInterval, obstacleSpeed, gameOver]);

  return (
    <div className={styles.gameContainer}>
      <h3>Car Racing Game</h3>
      {gameStarted ? (
        <>
          <p>Score: {score}</p>
          <canvas
            ref={canvasRef}
            width="300"
            height="500"
            className={styles.canvas}
          ></canvas>
          {gameOver && (
            <div className={styles.buttons}>
              <button
                className={styles.restartButton}
                onClick={() => {
                  setGameStarted(false);
                  setGameOver(false);
                }}
              >
                Restart
              </button>
              <button
                className={styles.exitButton}
                onClick={() => {
                  setGameStarted(false);
                  setGameOver(false);
                }}
              >
                Exit
              </button>
            </div>
          )}
        </>
      ) : (
        <button
          className={styles.startButton}
          onClick={() => setGameStarted(true)}
        >
          Let&apos;s Play
        </button>
      )}
    </div>
  );
};

export default CarGame;
