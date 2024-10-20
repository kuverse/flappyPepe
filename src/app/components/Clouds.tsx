import { useRef, useEffect } from "react";

const CloudCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (ctx && canvas) {
      const cloudImage = new Image();
      cloudImage.src = "/cloud.png";

      cloudImage.onload = () => {
        requestAnimationFrame(animate);
      };

      cloudImage.onerror = () => {
        console.error("Failed to load cloud image.");
      };

      const createCloud = () => {
        const width = 180 + Math.random() * 50; // Cloud size between 180 to 230 px
        const height = 90 + Math.random() * 30; // Cloud height between 90 to 120 px
        const zIndex = Math.floor(Math.random() * 6); // Random z-index value between 0 and 5

        return {
          x: Math.random() * canvas.width, // Random starting x-position
          y: Math.random() * (canvas.height * 0.5) + (canvas.height * 0.5) - height, // Ensure y-position keeps cloud fully visible
          width,
          height,
          speed: 1.5 + Math.random() * 2.5,
          zIndex,
        };
      };

      const clouds = Array.from({ length: 3 }, createCloud);

      const drawClouds = (ctx: CanvasRenderingContext2D) => {
        const sortedClouds = [...clouds].sort((a, b) => a.zIndex - b.zIndex);



        sortedClouds.forEach((cloud) => {
          cloud.x -= cloud.speed;

          if (cloud.x + cloud.width < 0) {
            cloud.zIndex = Math.floor(Math.random() * 6);
            cloud.x = canvas.width; // Reset to right side of canvas
            cloud.y = Math.random() * (canvas.height * 0.5) + (canvas.height * 0.5) - cloud.height; // Ensure cloud stays fully visible
          }

          ctx.drawImage(cloudImage, cloud.x, cloud.y, cloud.width, cloud.height);
        });
      };

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawClouds(ctx);
        requestAnimationFrame(animate);
      };

      canvas.width = 400;
      canvas.height = 610;
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: '50%',
        left: '50%',
        transform: "translate(-50%, -50%)",
        width: "400px",
        height: "610px",
        pointerEvents: "none",
      }}
    />
  );
};

export default CloudCanvas;
