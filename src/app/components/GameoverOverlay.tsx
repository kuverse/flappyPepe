import React from 'react';
import styles from '../style/animation.module.css'; // Import the CSS module

const GameOverOverlay = ({ isGameOver, finalScore, onRestart }: { isGameOver: boolean, finalScore: number, onRestart: () => void }) => {
  return (
    <>
      {isGameOver && (
        <div className={styles.overlay}>
          <div className={styles.overlayContent}>
          <img src="/deadpepe.png" width="100" height="100" alt="Example Image" />
          <h2>Game Over!</h2>
            <p>Final Score: {finalScore}</p>
            <button className={styles.restartButton} onClick={onRestart}>Try Again</button>
            <br></br>
            <p className={styles.restartInstructions}>Press Space to Restart</p><br></br>
          </div>
        </div>
      )}
    </>
  );
};

export default GameOverOverlay;
