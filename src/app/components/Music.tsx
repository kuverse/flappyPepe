import { useEffect, useState } from 'react';
import { backgroundMusic } from './Sounds'; // Import the background music instance
import { FaMusic, FaVolumeMute } from 'react-icons/fa';

const BackgroundMusic = () => {
  const [isMuted, setIsMuted] = useState(false); // Track mute state

  useEffect(() => {
    // Play background music when the component mounts
    backgroundMusic.play();

    // Cleanup when component unmounts
    return () => {
      backgroundMusic.stop();
    };
  }, []);

  // Toggle mute/unmute for background music
  const toggleMute = () => {
    setIsMuted((prevMuted) => {
      const newMutedState = !prevMuted;
      backgroundMusic.mute(newMutedState);
      return newMutedState;
    });
  };

  return (
    <div style={{ position: "fixed", padding: '10px', zIndex: "2000", bottom: "4%", left: "1%" }}>
      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        style={{
          padding: '10px',
          fontSize: '24px',
          zIndex: "2000",
          backgroundColor: isMuted ? "lightgreen" : "red",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: "10px"
        }}
      >
        {isMuted ? <FaMusic /> : <FaVolumeMute /> }
      </button>
    </div>
  );
};

export default BackgroundMusic;
