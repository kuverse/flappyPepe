"use client";
import { useEffect, useState, useRef, useCallback } from "react";
//import BackgroundMusic from "./Music";
import styles from "../style/animation.module.css";
import GameOverOverlay from "./GameoverOverlay";
//import Leaderboard from "./Leaderboard";
import CloudCanvas from "./Clouds";
import { playJumpSound, playGameOverSound, playDrinkBottleSound } from './Sounds';


const GRAVITY = 0.38;
const JUMP_STRENGTH = -7.5;
const PIPE_WIDTH = 50;
const PIPE_SPACING = 245;
const PIPE_HEIGHT_VARIATION = 80;
const PIPE_GAP = 265; 
const hitboxWidth = 40;  
const hitboxHeight = 80; 
const hitboxOffsetX = 30;
const hitboxOffsetY = -10;
const PIPE_MIN_HEIGHT = 40; 
const PIPE_MAX_HEIGHT = 300;
const gamebaseSpeed = 3;
const canvasHeight = 610;
const canvasWidth = 400;

interface Bird {
  x: number;
  y: number;
  velocity: number;
}
interface Pipe {
  x: number;
  height: number;
  passed: boolean;
  color: string;
}


const FlappyPepe: React.FC = () => {
  const [bird, setBird] = useState<Bird>({ x: 100, y: 250, velocity: 0 });
  const generateRandomColor = () => (Math.random() > 0.5 ? "#156D30" : "#A02E00");
  const pipeColor = generateRandomColor();
  const [pipes, setPipes] = useState<Pipe[]>([{ x: 400, height: Math.random() * PIPE_HEIGHT_VARIATION + 100, passed: false, color: pipeColor },]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [baseSpeed, setBaseSpeed] = useState(gamebaseSpeed);
  const currentSpeed = baseSpeed + score * 0.05;
  const [gameStarted, setGameStarted] = useState(false);
  const [scores, setScores] = useState<number[]>([]); // State to store the scores
  const [coin, setCoin] = useState<{ x: number, y: number } | null>(null); // Single coin at a time
  const [coinImage, setCoinImage] = useState<HTMLImageElement | null>(null); // Store the coin image


  const incrementScore = useCallback(() => {
    if(gameStarted) {
    setScore((prevScore) => prevScore + 1);
    }
  }, [gameStarted]);


  useEffect(() => {
    const img = new Image();
    img.src = "/bottle1.png";
    img.onload = () => {
      setCoinImage(img);
    };
    img.onerror = () => {
      console.error("Failed to load coin image.");
    };
  }, []);



  useEffect(() => {
    if (typeof window !== 'undefined') {
      const positionMap = [
        { minWidth: 1200, top: '40%', left: '43%' },
        { minWidth: 1000, top: '40%', left: '40%' },
        { minWidth: 900, top: '40%', left: '39%' },
        { minWidth: 800, top: '40%', left: '37%' },
        { minWidth: 700, top: '40%', left: '35%' },
        { minWidth: 600, top: '40%', left: '32%' },
        { minWidth: 400, top: '40%', left: '30%' },
        { minWidth: 300, top: '40%', left: '20%' },
        { minWidth: 0, top: '40%', left: '10%' }
      ];
  
      const handleResize = () => {
        const screenWidth = window.visualViewport ? window.visualViewport.width : window.innerWidth;
        
        //console.log(`Screen width: ${screenWidth}, DPR: ${devicePixelRatio}`);
        
  
        const birdElement = document.querySelector(`.${styles["pepe-animation"]}`) as HTMLElement | null;
  
        if (birdElement) {
          birdElement.style.position = 'absolute';
          
          for (const position of positionMap) {
            if (screenWidth > position.minWidth) {
              birdElement.style.top = position.top;
              birdElement.style.left = position.left;
              break;
            }
          }
        } else {
          console.error('Bird element not found');
        }
      };
  
      window.addEventListener('resize', handleResize);
  
      handleResize();
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);


  useEffect(() => {
    try {
      const savedScores = JSON.parse(localStorage.getItem('scores') || '[]');
      setScores(savedScores);
    } catch (error) {
      console.error('Error parsing scores from localStorage:', error);
    }
  }, []);

  useEffect(() => {
    if (scores.length > 0) { // Only save if there are scores to save
      localStorage.setItem('scores', JSON.stringify(scores));
    }
  }, [scores]);


const resetGame = useCallback(() => {
    setBird({ x: 100, y: 250, velocity: 0 });
    setPipes([{ x: 400, height: Math.random() * PIPE_HEIGHT_VARIATION + 100, passed: false, color: pipeColor }]);
    setIsGameOver(false);
    setScore(0); 
    setFinalScore(null);
    setGameStarted(false);
    setBaseSpeed(gamebaseSpeed);
    setCoin(null);
}, [pipeColor]);


  const handleJump = useCallback(() => {
    if (!gameStarted) {
        setGameStarted(true);
      }
    if (!isGameOver) {
      playJumpSound();
      setBird((prevBird) => ({ ...prevBird, velocity: JUMP_STRENGTH }));
    } else {
      resetGame();
    }
}, [gameStarted, isGameOver, resetGame]);


const handleGameOver = useCallback(() => {
  setIsGameOver(true);
  playGameOverSound();
  setFinalScore(score);
  setScores((prevScores) => {
    const updatedScores = [...prevScores, score];
    return updatedScores.sort((a, b) => b - a).slice(0, 5);
  });
}, [score]);


  const updateGame = useCallback(() => {
    setBird((prevBird) => {
      const newY = prevBird.y + prevBird.velocity;
      const newVelocity = prevBird.velocity + GRAVITY;

      if (newY > 580 || newY < -100) {
        if (!isGameOver) {
          handleGameOver();
        } 
      }
      return { ...prevBird, y: newY, velocity: newVelocity };
    });




    setPipes((prevPipes) => {
      const updatedPipes = prevPipes.map((pipe) => ({
        ...pipe,
        x: pipe.x - currentSpeed,
      }));

      if (updatedPipes.length === 0 || updatedPipes[0].x + PIPE_WIDTH < 0) {
        updatedPipes.shift();

        const randomHeight = Math.random() * (PIPE_MAX_HEIGHT - PIPE_MIN_HEIGHT) + PIPE_MIN_HEIGHT;

          updatedPipes.push({ x: updatedPipes.length ? updatedPipes[updatedPipes.length - 1].x + PIPE_SPACING : 400, 
            height: randomHeight,
            color: pipeColor,
            passed: false,
          });
        }

      updatedPipes.forEach((pipe) => {
        if (pipe.x + PIPE_WIDTH < bird.x && !pipe.passed) {
          incrementScore();
          pipe.passed = true;
        }

        if (
            bird.x + hitboxOffsetX + hitboxWidth > pipe.x &&
            bird.x + hitboxOffsetX < pipe.x + PIPE_WIDTH &&
            (bird.y + hitboxOffsetY < pipe.height ||
             bird.y + hitboxOffsetY + hitboxHeight > pipe.height + PIPE_GAP)
          ) {
            handleGameOver();
          
        }
      });

      return updatedPipes;
    });
  }, [bird, currentSpeed, handleGameOver, incrementScore,isGameOver, pipeColor]);


  useEffect(() => {
    const interval = setInterval(() => {
      if (!isGameOver && gameStarted) {
        updateGame();
      }
    }, 16);
    return () => clearInterval(interval);
  }, [updateGame, isGameOver, gameStarted]);


//Handle Jump//
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        handleJump();
      }
    };
    const handleTouchStart = () => {
      handleJump();
    };  
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart);
  
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [handleJump]);
  



  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (ctx && canvas ) {
      ctx.imageSmoothingEnabled = false; 
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      ctx.fillStyle = "#ADD8E6";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      pipes.forEach((pipe) => {
        ctx.fillStyle = pipe.color;
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.height); // Upper pipe
        ctx.fillRect(pipe.x, pipe.height + PIPE_GAP, PIPE_WIDTH, canvas.height); // Lower pipe
      });
  
  
      if (coin && coinImage) {
        coin.x -= currentSpeed;
        
        ctx.drawImage(coinImage, coin.x, coin.y, 50, 50);

        if (
          bird.x < coin.x + 50 &&
          bird.x + 50 > coin.x &&
          bird.y < coin.y + 50 &&
          bird.y + 50 > coin.y
        ) {
          setCoin(null);
          console.log("Coin collected!");
          playDrinkBottleSound();
          incrementScore();
          setBaseSpeed(baseSpeed * 0.95);
          
        }

        if (coin.x + 50 < 0) {
          setCoin(null);
        }
      }
      {/*}
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;

      ctx.strokeRect(
        bird.x + hitboxOffsetX,  
        bird.y + hitboxOffsetY,  
        hitboxWidth,             
        hitboxHeight             
      );
      */}

      ctx.fillStyle = "#6CB947";
      ctx.font = "40px PepeFont";
      ctx.textAlign = "center"; 
      ctx.fillText(`Score: ${score}`, canvas.width / 2, 100);

    }
  }, [ pipes, score, bird.x, bird.y, coin, baseSpeed, coinImage, currentSpeed, incrementScore]);
  

  useEffect(() => {
    const generateCoin = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        console.warn("Canvas is not available");
        return;
      }
  
      console.log("Canvas dimensions:", canvas.width, canvas.height);
  
      // Generate the coin off-screen to the right
      const randomX = canvas.width + 50; // Always off-screen
      const randomY = Math.random() * (canvas.height - 100) + 50; // Random vertical position
  
      setCoin({ x: randomX, y: randomY });
      console.log("Generated coin at:", randomX, randomY);
    };
    
    const interval = setInterval(generateCoin, 5000);
    return () => clearInterval(interval);
  }, []);
  

  useEffect(() => {
    const moveCoin = () => {
      setCoin((prevCoin) => {
        if (!prevCoin) return prevCoin;
  
        const newX = prevCoin.x; // Move coin left
  
        // If the coin moves off-screen, remove it
        if (newX + 50 < 0) {
          return null;
        }
  
        return { ...prevCoin, x: newX };
      });
    };
  
    const interval = setInterval(moveCoin, 16); // Runs approximately at 60 FPS
    return () => clearInterval(interval);
  });
  

  return (
  
  <>

    <div style={{ textAlign: "center", padding: '50px', marginTop: '25px'}}>
      <div className="background-wrapper">
      <div className="background">
      <canvas className="gameCanvas" ref={canvasRef} width={canvasWidth} height={canvasHeight} style={{ border: "1px solid black" }} />
      <div
        className={isGameOver ? styles.pepeStatic : styles["pepe-animation"]}
        style={{
          position: "absolute",
          top: bird.y + 50 + "px",
          left: bird.x  + "px",
          width: "100px",
          height: "100px",
          pointerEvents: isGameOver ? 'none' : 'auto',
          zIndex: 0,
        }}
      >
        
      </div>

      
       </div></div>
       
       <GameOverOverlay
          isGameOver={isGameOver}
          finalScore={finalScore ?? 0}
          onRestart={resetGame}
        />


    {/*<div className={styles.background} />*/}
    <CloudCanvas />
    {/*<Leaderboard scores={scores} />*/}
    </div>
    {/*<BackgroundMusic  />*/}

    </>
  );
}

export default FlappyPepe;
