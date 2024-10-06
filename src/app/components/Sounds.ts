import { Howl } from 'howler';

// Preload and manage all sounds here
export const backgroundMusic = new Howl({
  src: ['/babypepe.mp3'],
  loop: true,
  volume: 0.25,
  preload: true,
});

export const jumpSound = new Howl({
  src: ["/flap2.wav"],
  volume: 0.1,
  preload: true,
});

export const gameOverSound = new Howl({
  src: ["/death.mp3"],
  volume: 0.07,
  preload: true,
});

export const babyGiggle = new Howl({
  src: ["/giggle.wav"],
  volume: 0.07,
  preload: true,
});

export const drinkBottle = new Howl({
  src: ["/drink.mp3"],
  volume: 0.07,
  preload: true,
});

// Utility functions to play sounds
export const playJumpSound = () => {
  jumpSound.play();
};

export const playGameOverSound = () => {
  gameOverSound.play();
};
export const playDrinkBottleSound = () => {
    drinkBottle.play();
  };
