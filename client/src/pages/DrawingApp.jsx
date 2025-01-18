import React, { useRef, useState, useEffect } from "react";
import { useResizeDetector } from "react-resize-detector";

const DrawingApp = () => 
{
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);
    const [shape, setShape] = useState({ color: "white", width: 3 });
    const [addingText, setAddingText] = useState(false);
    const [textBoxes, setTextBoxes] = useState([]);
    const [draggingBox, setDraggingBox] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const canvasWidth = 1910;
    const canvasHeight = 720;

    const colors = [
        { value: "white", label: "하얀색" },
        { value: "palevioletred", label: "빨간색" },
        { value: "yellow", label: "노란색" },
        { value: "skyblue", label: "파란색" },
    ];

    useEffect(() => 
    {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#194038";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }, []);

    const getCanvasCoordinates = (event) => 
    {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;
        return { x, y };
    };

    const handleMouseDown = (e) => 
    {
        if (addingText) 
        {
            const { x, y } = getCanvasCoordinates(e);
            addTextBox(x, y);
            setAddingText(false);
        } 
        else 
        {
            const { x, y } = getCanvasCoordinates(e);
            const ctx = canvasRef.current.getContext("2d");
            ctx.beginPath();
            ctx.moveTo(x, y);
            setDrawing(true);
        }
    };

    const handleMouseMove = (e) => 
    {
        if (!drawing) return;

        const { x, y } = getCanvasCoordinates(e);
        const ctx = canvasRef.current.getContext("2d");
        ctx.lineTo(x, y);
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = shape.width;
        ctx.stroke();
    };

    const handleMouseUp = () => setDrawing(false);

    const handleClear = () => 
    {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#194038";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setTextBoxes([]);
    };

    const handleShapeChange = (e) => 
    {
        const { name, value } = e.target;
        setShape((prev) => ({ ...prev, [name]: value }));
    };

    const addTextBox = (x, y) => 
    {
        const newTextBox = { x, y, text: "", id: Date.now(), fontSize: 16 };
        setTextBoxes((prev) => [...prev, newTextBox]);
    };

    const handleTextChange = (id, newText) => 
    {
        setTextBoxes((prev) =>
            prev.map((box) => (box.id === id ? { ...box, text: newText } : box))
        );
    };

    const handleDragStart = (id, e) => 
    {
        const box = textBoxes.find((box) => box.id === id);
        const offsetX = e.clientX - box.x;
        const offsetY = e.clientY - box.y;
        setDraggingBox(id);
        setDragOffset({ x: offsetX, y: offsetY });
    };

    const handleDrag = (e) => 
    {
        if (draggingBox !== null) 
        {
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            const newX = Math.min(
                Math.max(e.clientX - dragOffset.x, 0),
                rect.width - 100 
            );
            const newY = Math.min(
                Math.max(e.clientY - dragOffset.y, 0),
                rect.height - 20
            );
    
            setTextBoxes((prev) =>
                prev.map((box) =>
                    box.id === draggingBox ? { ...box, x: newX, y: newY } : box
                )
            );
        }
    };
    
    const saveCanvas = () => 
    {
        const canvas = canvasRef.current;
    
        const offscreenCanvas = document.createElement("canvas");
        offscreenCanvas.width = canvas.width;
        offscreenCanvas.height = canvas.height;
        const offscreenCtx = offscreenCanvas.getContext("2d");
    
        offscreenCtx.drawImage(canvas, 0, 0);
    
        textBoxes.forEach(({ x, y, text, fontSize }) => 
        {
            offscreenCtx.font = `${fontSize}px Arial`;
            offscreenCtx.fillStyle = "white";
            offscreenCtx.textBaseline = "top";
    
            const lines = text.split("\n");
            lines.forEach((line, index) => 
            {
                const lineY = y + index * fontSize * 1.2;
                if (lineY + fontSize <= canvas.height) 
                {
                    offscreenCtx.fillText(line, x, y + (index * fontSize));
                }
            });
        });
    
        const image = offscreenCanvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = "drawing.png";
        link.href = image;
        link.click();
    };
    
    const handleFontSizeChange = (id, newFontSize) => 
    {
        setTextBoxes((prev) =>
            prev.map((box) =>
                box.id === id ? { ...box, fontSize: newFontSize } : box
            )
        );
    };
    
    const handleDragEnd = () => setDraggingBox(null);

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                maxWidth: "100%",
                margin: "0 auto",
            }}
            onMouseMove={handleDrag}
            onMouseUp={handleDragEnd}
        >
            <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{
                    width: "100%",
                    height: "auto",
                    border: "1px solid black",
                }}
            />
            {textBoxes.map(({ x, y, text, id, fontSize }) => (
                <ResizableDraggableTextarea
                    key={id}
                    x={x}
                    y={y}
                    text={text}
                    fontSize={fontSize}
                    id={id}
                    onTextChange={handleTextChange}
                    onDragStart={handleDragStart}
                    onFontSizeChange={handleFontSizeChange}
                />
            ))}
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
                <button onClick={() => setAddingText(true)}>텍스트 박스 추가</button>
                <button onClick={saveCanvas}>저장</button>
            </div>
        </div>
    );
};

const ResizableDraggableTextarea = ({ x, y, text, fontSize, id, onTextChange, onDragStart, onFontSizeChange }) => 
{
    const { ref, width, height } = useResizeDetector({
        onResize: () => {
            if (textareaRef.current && width && height) {
                const newFontSize = Math.max(12, Math.min(width / 10, height / 2));
                onFontSizeChange(id, newFontSize);
            }
        },
    });
    
    const textareaRef = useRef(null);

    useEffect(() => 
    {
        if (textareaRef.current) 
        {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [text]);

    useEffect(() => 
    {
        if (width && height && textareaRef.current) 
        {
            const newFontSize = Math.max(12, Math.min(width / 10, height / 2));
            textareaRef.current.style.fontSize = `${newFontSize}px`;
        }
    }, [width, height]);

    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
            }}
        >
            <textarea
                ref={(el) => {
                    textareaRef.current = el;
                    ref(el);
                }}
                value={text}
                onChange={(e) => onTextChange(id, e.target.value)}
                style={{
                    resize: "both",
                    overflow: "hidden",
                    color: "white",
                    backgroundColor: "transparent",
                    border: "none",
                    minWidth: "100px",
                    fontFamily: "inherit",
                    fontSize: `${fontSize}px`,
                    lineHeight: "1.2",
                }}
            />
            <div
                onMouseDown={(e) => onDragStart(id, e)}
                style={{
                    position: "absolute",
                    left: -10,
                    top: -10,
                    width: "20px",
                    height: "20px",
                    backgroundColor: "gray",
                    cursor: "move",
                    borderRadius: "50%",
                }}
            />
        </div>
    );
};

export default DrawingApp;
