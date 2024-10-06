"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { Howl } from "howler"; // Import Howler.js
import BackgroundMusic from "./Music";
import styles from "../style/animation.module.css";
import GameOverOverlay from "./GameoverOverlay";
import Leaderboard from "./Leaderboard";
import InfoPopup from "./Info";
import CloudCanvas from "./Clouds";


const GRAVITY = 0.4;
const JUMP_STRENGTH = -8;
const PIPE_WIDTH = 50;
const PIPE_SPACING = 235;
const PIPE_HEIGHT_VARIATION = 80;
const PIPE_GAP = 260; 
const hitboxWidth = 40;  
const hitboxHeight = 80; 
const hitboxOffsetX = 30;
const hitboxOffsetY = -10;
const PIPE_MIN_HEIGHT = 40; 
const PIPE_MAX_HEIGHT = 300;
const baseSpeed = 3;
const canvasHeight = 600;
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
  const generateRandomColor = () => (Math.random() > 0.5 ? "green" : "red");
  const pipeColor = generateRandomColor();
  const [pipes, setPipes] = useState<Pipe[]>([{ x: 400, height: Math.random() * PIPE_HEIGHT_VARIATION + 100, passed: false, color: pipeColor },]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentSpeed = baseSpeed + score * 0.05;
  const [gameStarted, setGameStarted] = useState(false);
  const jumpSound = new Howl({ src: ["/flap2.wav"], volume: 0.1,});
  const gameOverSound = new Howl({ src: ["/death.mp3"],volume: 0.07, });
  const [scores, setScores] = useState<number[]>([]); // State to store the scores


  const incrementScore = useCallback(() => {
    setScore((prevScore) => prevScore + 1);
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
        const devicePixelRatio = window.devicePixelRatio || 1;
        
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

  const resetGame = () => {
    setBird({ x: 100, y: 250, velocity: 0 });
    setPipes([{ x: 400, height: Math.random() * PIPE_HEIGHT_VARIATION + 100, passed: false, color: pipeColor }]);
    setIsGameOver(false);
    setScore(0); 
    setFinalScore(null);
    setGameStarted(false);

  };

  const handleJump = useCallback(() => {
    if (!gameStarted) {
        setGameStarted(true);
      }
    if (!isGameOver) {
        jumpSound.play();
      setBird((prevBird) => ({ ...prevBird, velocity: JUMP_STRENGTH }));
    } else {
      resetGame();
    }
}, [gameStarted, isGameOver, jumpSound, resetGame]);


const handleGameOver = useCallback(() => {
  setIsGameOver(true);
  gameOverSound.play();
  setFinalScore(score);
  setScores((prevScores) => {
    const updatedScores = [...prevScores, score];
    return updatedScores.sort((a, b) => b - a).slice(0, 10); // Keep top 10 scores
  });
}, [score, gameOverSound]);


  const updateGame = useCallback(() => {
    setBird((prevBird) => {
      const newY = prevBird.y + prevBird.velocity;
      const newVelocity = prevBird.velocity + GRAVITY;

      if (newY > 480 || newY < 0) {
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
  }, [bird, score]);


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

      ctx.fillStyle = "white";
      ctx.font = "45px Arial";
      ctx.textAlign = "center"; 
      ctx.fillText(`Score: ${score}`, canvas.width / 2, 100);

    }
  
     
  }, [ pipes, score, bird.x, bird.y]);
  

  return (
    <div style={{ textAlign: "center", padding: '50px', marginTop: '25px'}}>

      {gameStarted && (<BackgroundMusic />)}


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

     
    <div className={styles.background} />
    <CloudCanvas />
    <Leaderboard scores={scores} />
    <InfoPopup/>
    </div>
    
  );
}

export default FlappyPepe;
