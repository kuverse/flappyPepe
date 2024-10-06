import React, { useState } from 'react';
import styles from "../style/animation.module.css";

const Leaderboard = ({ scores }: { scores: number[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle the overlay
  const toggleLeaderboard = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className={styles.leaderboardContainer}>
        {/* Replace the button with an image */}
        <img
          src="/LEADERBOARD.png"  // Update this with your PNG image path
          alt="Open Leaderboard"
          className={styles.leaderboardButton}  // Use the existing style or add more styles if needed
          onClick={toggleLeaderboard}  // Trigger the toggle on click
        />

        {isOpen && (
          <div className={styles.overlay}>
            <div className={styles.leaderboardContent}>
              <h2>Top 5 Scores</h2>
              <ul>
                {scores.map((score: number, index: number) => (
                  <li key={index}>Round {index + 1}: {score}</li>
                ))}
              </ul>
              <button className={styles.closeButton} onClick={toggleLeaderboard}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Leaderboard;
