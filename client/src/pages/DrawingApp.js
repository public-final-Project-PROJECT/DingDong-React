import React, { useRef, useState, useEffect } from 'react';

const DraggableTool = ({ children }) => {
    const [dragging, setDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        setDragging(true);
        setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e) => {
        if (!dragging) return;

        const dx = e.clientX - position.x;
        const dy = e.clientY - position.y;

        setPosition((prev) => ({
            x: prev.x + dx,
            y: prev.y + dy,
        }));

        e.target.style.transform = `translate(${position.x + dx}px, ${position.y + dy}px)`;
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [dragging]);

    return (
        <div
            onMouseDown={handleMouseDown}
            style={{
                position: "absolute",
                top: position.y,
                left: position.x,
                cursor: "move",
            }}
        >
            {children}
        </div>
    );
};

const DrawingApp = () =>
{
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);
    const [shape, setShape] = useState({ color: 'white', width: 3 });
    const [showRuler, setShowRuler] = useState(false);
    const [showProtractor, setShowProtractor] = useState(false);

    const canvasWidth = 1910;
    const canvasHeight = 720;

    const colors = [
        { value: 'white', label: '하얀색' },
        { value: 'palevioletred', label: '빨간색' },
        { value: 'yellow', label: '노란색' },
        { value: 'skyblue', label: '파란색' },
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#194038';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }, []);

    const getCanvasCoordinates = (event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;
        return { x, y };
    };

    const handleMouseDown = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const { x, y } = getCanvasCoordinates(e);

        ctx.beginPath();
        ctx.moveTo(x, y);
        setDrawing(true);
    };

    const handleMouseMove = (e) => {
        if (!drawing) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const { x, y } = getCanvasCoordinates(e);

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
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#194038';
        ctx.fillRect(0, 0, canvas.width, canvasHeight);
    };

    const handleShapeChange = (e) => {
        const { name, value } = e.target;
        setShape((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                maxWidth: '100%',
                margin: '0 auto',
            }}
        >
            <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{
                    width: '100%',
                    height: 'auto',
                    border: '1px solid black',
                }}
            />
            <div>
                <label>
                    펜 색상:
                    <select
                        name="color"
                        value={shape.color}
                        onChange={handleShapeChange}
                    >
                        {colors.map(({ value, label }) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    펜 굵기:
                    <select
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
                <button onClick={handleClear}>지우기</button>
                <button onClick={() => setShowRuler(!showRuler)}>
                    {showRuler ? 'Hide Ruler' : 'Show Ruler'}
                </button>
                <button onClick={() => setShowProtractor(!showProtractor)}>
                    {showProtractor ? 'Hide Protractor' : 'Show Protractor'}
                </button>
            </div>

            {showRuler && (
                <DraggableTool>
                    <div
                        style={{
                            width: '600px',
                            height: '100px',
                            backgroundColor: 'gray',
                            color: 'white',
                            textAlign: 'center',
                            lineHeight: '20px',
                            cursor: 'move',
                        }}
                    >
                        Ruler
                    </div>
                </DraggableTool>
            )}

            {showProtractor && (
                <DraggableTool>
                    <div
                        style={{
                            width: '200px',
                            height: '200px',
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            border: '2px solid black',
                            borderRadius: '50%',
                            textAlign: 'center',
                            cursor: 'move',
                        }}
                    >
                        Protractor
                    </div>
                </DraggableTool>
            )}
        </div>
    );
};

export default DrawingApp;
