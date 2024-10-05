import { useRef, useEffect } from "react";

const CloudCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (ctx && canvas) {
      // Load the cloud image
      const cloudImage = new Image();
      cloudImage.src = "/cloud.png"; // Ensure the path is correct

      cloudImage.onload = () => {
        requestAnimationFrame(animate);
      };

      cloudImage.onerror = () => {
        console.error("Failed to load cloud image.");
      };

      // Function to generate random x position and speed for each cloud
      const createCloud = () => {
        const width = 180 + Math.random() * 50; // Larger cloud size (180 to 230 px)
        const height = 90 + Math.random() * 30; // Larger height (90 to 120 px)

        return {
          x: Math.random() * canvas.width, // Random starting x-position
          y: Math.random() * (canvas.height * 0.5) + (canvas.height * 0.5) - height, // Ensure y-position keeps cloud fully visible
          width,
          height,
          speed: 1.5 + Math.random() * 2.5, // Random speed (0.5 to 2.0)
        };
      };

      // Create 3 clouds (you can adjust this number)
      let clouds = Array.from({ length: 3 }, createCloud);

      // Function to draw clouds
      const drawClouds = (ctx: CanvasRenderingContext2D) => {
        clouds.forEach((cloud) => {
          cloud.x -= cloud.speed; // Move clouds left by decreasing x position

          // If the cloud moves off the left side of the canvas, reset to the right side
          if (cloud.x + cloud.width < 0) {
            cloud.x = canvas.width; // Reset to right side of canvas
            cloud.y = Math.random() * (canvas.height * 0.5) + (canvas.height * 0.5) - cloud.height; // Ensure cloud stays fully visible
          }

          ctx.drawImage(cloudImage, cloud.x, cloud.y, cloud.width, cloud.height);
        });
      };

      // Animation loop
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
        drawClouds(ctx);
        requestAnimationFrame(animate); // Continue the animation
      };

      // Set canvas dimensions
      canvas.width = 800;
      canvas.height = 600;
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none", // Ensure it doesn't block interactions
        zIndex: 1000,
      }}
    />
  );
};

export default CloudCanvas;
