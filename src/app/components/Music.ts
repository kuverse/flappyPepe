import { useEffect } from 'react';
import { Howl } from 'howler';

const BackgroundMusic = () => {
  useEffect(() => {
    const music = new Howl({
      src: ['/babypepe.mp3'], // Path to your background music
      loop: true, // Ensure it loops continuously
      volume: 0.5, // Adjust volume
    });

    music.play();

    return () => {
      music.stop();
    };
  }, []);

  return null; // This component only handles the music, no UI
};

export default BackgroundMusic;
