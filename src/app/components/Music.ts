import { useEffect } from 'react';
import { Howl } from 'howler';

const BackgroundMusic = () => {
  useEffect(() => {
    const music = new Howl({
      src: ['/babypepe.mp3'], 
      loop: true,
      volume: 0.25,
    });

    music.play();

    return () => {
      music.stop();
    };
  }, []);

  return null; 
};

export default BackgroundMusic;
