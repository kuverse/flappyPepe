"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { Howl } from "howler"; // Import Howler.js

const GRAVITY = 0.6;
const JUMP_STRENGTH = -10;
const PIPE_WIDTH = 60;
const PIPE_SPACING = 220;
const PIPE_HEIGHT_VARIATION = 80;
const PIPE_GAP = 245; // Larger gap
const hitboxWidth = 65;  // Reduced width for hitbox
const hitboxHeight = 90; // Reduced height for hitbox
const hitboxOffsetX = 40; // Offset from the bird's X position to center the hitbox
const hitboxOffsetY = 30;
const PIPE_MIN_HEIGHT = 50; // Minimum height of the top pipe
const PIPE_MAX_HEIGHT = 300; // Maximum height of the top pipe
const PIPE_MIN_GAP = 200; // Minimum gap between pipes
const PIPE_MAX_GAP = 350; 

interface Bird {
  x: number;
  y: number;
  velocity: number;
}

interface Pipe {
  x: number;
  height: number;
  passed: boolean;
}

const FlappyBird: React.FC = () => {
  const [bird, setBird] = useState<Bird>({ x: 100, y: 250, velocity: 0 });
  const [pipes, setPipes] = useState<Pipe[]>([
    { x: 400, height: Math.random() * PIPE_HEIGHT_VARIATION + 100, passed: false },
  ]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0); // Score state
  const [finalScore, setFinalScore] = useState<number | null>(null); // Final score on death
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const birdGif = useRef<HTMLImageElement | null>(null); // Use one ref for the bird GIF
  const [backgroundMusic, setBackgroundMusic] = useState<Howl | null>(null); // For background music


  useEffect(() => {
    const music = new Howl({
      src: ["/babypepe bonkers.mp3"], // Path to your background music file in public folder
      loop: true, // Make sure it loops continuously
      volume: 0.5, // Set the volume
    });
    setBackgroundMusic(music);
    music.play(); // Start playing the background music

    return () => {
      music.stop(); // Stop the music when the component unmounts or when game resets
    };
  }, []);


  useEffect(() => {
    const birdImage = new Image();
    birdImage.src = "/0014.png"; // Replace with the path to your GIF
    birdImage.onload = () => {
      setIsImageLoaded(true); // Set the flag to true when the image is loaded
    };
    birdImage.onerror = () => {
      console.error("Failed to preload the bird image");
    };
    birdGif.current = birdImage; // Store the preloaded image in the ref
  }, []);

  const resetGame = () => {
    setBird({ x: 100, y: 250, velocity: 0 });
    setPipes([{ x: 400, height: Math.random() * PIPE_HEIGHT_VARIATION + 100, passed: false }]);
    setIsGameOver(false);
    setScore(0); // Reset score when game restarts
    setFinalScore(null);

    if (backgroundMusic) {
        backgroundMusic.stop();
        backgroundMusic.play();
      }
  };

  const handleJump = useCallback(() => {
    if (!isGameOver) {
      setBird((prevBird) => ({ ...prevBird, velocity: JUMP_STRENGTH }));
    } else {
      resetGame();
    }
  }, [isGameOver]);

  const updateGame = useCallback(() => {
    setBird((prevBird) => {
      const newY = prevBird.y + prevBird.velocity;
      const newVelocity = prevBird.velocity + GRAVITY;

      if (newY > 480 || newY < 0) {
        setIsGameOver(true);
        setFinalScore(score); // Set final score when game is over
      }

      return { ...prevBird, y: newY, velocity: newVelocity };
    });

    setPipes((prevPipes) => {
      const updatedPipes = prevPipes.map((pipe) => ({
        ...pipe,
        x: pipe.x - 3,
      }));

      if (updatedPipes.length === 0 || updatedPipes[0].x + PIPE_WIDTH < 0) {
        updatedPipes.shift();

        const randomHeight = Math.random() * (PIPE_MAX_HEIGHT - PIPE_MIN_HEIGHT) + PIPE_MIN_HEIGHT;
    
        // Generate a random gap (optional)
        const randomGap = Math.random() * (PIPE_MAX_GAP - PIPE_MIN_GAP) + PIPE_MIN_GAP;
    

        const newPipeX = updatedPipes.length
          ? updatedPipes[updatedPipes.length - 1].x + PIPE_SPACING
          : 400; // Default starting position for the new pipe

          updatedPipes.push({
            x: newPipeX,
            height: randomHeight, // Use the random height for the pipe
            passed: false, // Reset 'passed' to false for the new pipe
          });
        }

      updatedPipes.forEach((pipe) => {
        if (pipe.x + PIPE_WIDTH < bird.x && !pipe.passed) {
          setScore((prevScore) => prevScore + 1); // Increment score when passing a pipe
          pipe.passed = true; // Mark pipe as passed
        }

        if (
            bird.x + hitboxOffsetX + hitboxWidth > pipe.x && // Adjusted bird's hitbox width
            bird.x + hitboxOffsetX < pipe.x + PIPE_WIDTH && // Adjusted bird's hitbox x position
            (bird.y + hitboxOffsetY < pipe.height || // Adjusted bird's hitbox height
             bird.y + hitboxOffsetY + hitboxHeight > pipe.height + PIPE_GAP) // Adjusted bird's hitbox height
          ) {
          setIsGameOver(true);
          setFinalScore(score); // Set final score when game is over
        }
      });

      return updatedPipes;
    });
  }, [bird, score]);




  useEffect(() => {
    const interval = setInterval(() => {
      if (!isGameOver) {
        updateGame();
      }
    }, 16); // Approx 60 FPS
    return () => clearInterval(interval);
  }, [updateGame, isGameOver]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        handleJump();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleJump]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (ctx && canvas) {
      // Ensure smooth image scaling by disabling image smoothing
      ctx.imageSmoothingEnabled = false; 

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background
      ctx.fillStyle = "#ADD8E6"; // Light blue sky
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw pipes
      pipes.forEach((pipe) => {
        ctx.fillStyle = "green";
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.height); // Upper pipe
        ctx.fillRect(pipe.x, pipe.height + PIPE_GAP, PIPE_WIDTH, canvas.height); // Lower pipe
      });

      // Draw bird with GIF (only if image is loaded)
      if (birdGif.current && isImageLoaded) {
        ctx.drawImage(birdGif.current, bird.x, bird.y, 140, 140); // Increased size of the bird GIF
      }


      ctx.strokeStyle = "red"; // Use a red color for the hitbox
      ctx.lineWidth = 2; // Make the line a bit thicker
      ctx.strokeRect(
        bird.x + hitboxOffsetX, // X position
        bird.y + hitboxOffsetY, // Y position
        hitboxWidth, // Width of the hitbox
        hitboxHeight // Height of the hitbox
      );
      // Draw score
      ctx.fillStyle = "black";
      ctx.font = "30px Arial";
      ctx.fillText(`Score: ${score}`, 10, 50); // Display score in the top-left corner
    }
  }, [bird, pipes, isImageLoaded, score]);

  return (
    <div>
      {isImageLoaded ? ( // Conditionally render the game if the image is loaded
        <>
          <canvas ref={canvasRef} width={400} height={500} style={{ border: "1px solid black" }} />
          {isGameOver && (
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <h2>Game Over!</h2>
              <p>Final Score: {finalScore}</p>
              <p>Press Space to Restart</p>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: "center" }}>Loading...</div> // Loading message or spinner
      )}
    </div>
  );
}

export default FlappyBird;
