import React from 'react';
import styles from '../style/animation.module.css'; // Import the CSS module
import Image from 'next/image';


const GameOverOverlay = ({ isGameOver, finalScore, onRestart }: { isGameOver: boolean, finalScore: number, onRestart: () => void }) => {
  return (
    <>
      {isGameOver && (
        <div className={styles.overlay}>
          <div className={styles.overlayContent}>
          <Image src="/deadpepe.png" width="80" height="80" alt="Example Image" />
          <h2>Play Again?</h2>
            <p>Final Score: {finalScore}</p>
            <button className={styles.restartButton} onClick={onRestart}>Play</button>
            <br></br>
            <p className={styles.restartInstructions}>Press Space to Restart</p><br></br>
          </div>
        </div>
      )}
    </>
  );
};

export default GameOverOverlay;
