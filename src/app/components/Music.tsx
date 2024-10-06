import { useEffect, useState } from 'react';
import { Howl } from 'howler';
import { FaMusic, FaVolumeMute } from 'react-icons/fa';

const BackgroundMusic = () => {
  const [music, setMusic] = useState<Howl | null>(null); // Store the Howl instance
  const [isMuted, setIsMuted] = useState(false); // Track mute state

  useEffect(() => {
    const musicInstance = new Howl({
      src: ['/babypepe.mp3'],
      loop: true,
      volume: 0.25,
    });

    musicInstance.play();
    setMusic(musicInstance); // Store the music instance in state

    return () => {
      musicInstance.stop();
    };
  }, []);

  // Toggle mute/unmute
  const toggleMute = () => {
    if (music) {
      if (isMuted) {
        music.mute(false); // Unmute the music
      } else {
        music.mute(true); // Mute the music
      }
      setIsMuted(!isMuted); // Toggle mute state
    }
  };

  return (
    <div style={{ position: "fixed", padding: '10px', zIndex: "2000", bottom: "4%", left: "1%"}}>
      {/* Mute/Unmute Button */}
      <button onClick={toggleMute} style={{ padding: '10px', fontSize: '16px', zIndex: "2000", backgroundColor: "lightgreen", borderRadius: "10px", color: "white"}}>
      {isMuted ?  <FaMusic /> : <FaVolumeMute /> }
      </button>
    </div>
  );
};

export default BackgroundMusic;
