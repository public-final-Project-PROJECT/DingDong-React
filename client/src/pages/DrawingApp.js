import React, { useRef, useState, useEffect, useCallback } from 'react';

const DrawingApp = () => {
  const canvasRef = useRef(null);
  const [shape, setShape] = useState({ color: 'white', width: 3 });
  const [drawing, setDrawing] = useState(false);
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth > 1280 ? 1910 : window.innerWidth,
    height: window.innerWidth > 1280 ? 720 : window.innerHeight * 0.7,
  });
  const savedCanvasRef = useRef(null);

  const colorMap = [
    { value: 'white', name: '하얀색' },
    { value: 'red', name: '빨간색' },
    { value: 'orange', name: '주황색' },
    { value: 'yellow', name: '노란색' },
    { value: 'blue', name: '파랑색' },
    { value: 'black', name: '검정색' },
  ];

  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Save the current canvas content as an image
    const savedImage = canvas.toDataURL();
    savedCanvasRef.current = savedImage;

    // Update canvas size
    const newSize = {
      width: window.innerWidth > 1280 ? 1910 : window.innerWidth,
      height: window.innerWidth > 1280 ? 720 : window.innerHeight * 0.7,
    };
    setCanvasSize(newSize);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [updateCanvasSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Restore saved canvas content after resizing
    const savedImage = savedCanvasRef.current;
    if (savedImage) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvasSize.width, canvasSize.height);
      };
      img.src = savedImage;
    } else {
      // Set the background color for the initial render
      ctx.fillStyle = '#194038';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [canvasSize]);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.width;
    ctx.stroke();
  };

  const handleMouseUp = () => {
    setDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear the canvas and reset the background color
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#194038';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    savedCanvasRef.current = null; // Reset saved content
  };

  const handleShapeChange = (e) => {
    const { name, value } = e.target;
    setShape((prevShape) => ({ ...prevShape, [name]: value }));
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1910px',
        margin: '0 auto',
      }}
    >
      <canvas
        id="cv"
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          width: '100%',
          height: '100%',
          border: '1px solid black',
          display: 'block',
        }}
      ></canvas>
      <div>
        <label>
          색상:
          <select
            id="pen_color"
            name="color"
            value={shape.color}
            onChange={handleShapeChange}
          >
            {colorMap.map((color) => (
              <option key={color.value} value={color.value}>
                {color.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          굵기:
          <select
            id="pen_width"
            name="width"
            value={shape.width}
            onChange={handleShapeChange}
          >
            {Array.from({ length: 15 }, (_, i) => i + 1).map((width) => (
              <option key={width} value={width}>
                {width}
              </option>
            ))}
          </select>
        </label>
        <button id="clear" onClick={handleClear}>
          지우기
        </button>
      </div>
    </div>
  );
};

export default DrawingApp;
