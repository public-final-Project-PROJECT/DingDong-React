import React, { useRef, useState, useEffect } from "react";

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
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            const { x, y } = getCanvasCoordinates(e);
            ctx.beginPath();
            ctx.moveTo(x, y);
            setDrawing(true);
        }
    };

    const handleMouseMove = (e) => 
    {
        if (!drawing) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const { x, y } = getCanvasCoordinates(e);

        ctx.lineTo(x, y);
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = shape.width;
        ctx.stroke();
    };

    const handleMouseUp = () => 
    {
        setDrawing(false);
    };

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
        const newTextBox = { x, y, text: "", id: Date.now() };
        setTextBoxes((prev) => [...prev, newTextBox]);
    };

    const handleTextChange = (id, newText) => 
    {
        setTextBoxes((prev) =>
            prev.map((box) =>
                box.id === id ? { ...box, text: newText } : box
            )
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
            const newX = e.clientX - dragOffset.x;
            const newY = e.clientY - dragOffset.y;

            setTextBoxes((prev) =>
                prev.map((box) =>
                    box.id === draggingBox
                        ? { ...box, x: newX, y: newY }
                        : box
                )
            );
        }
    };

    const handleDragEnd = () => 
    {
        setDraggingBox(null);
    };

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
            {textBoxes.map(({ x, y, text, id }) => (
                <textarea
                    rows={1}
                    key={id}
                    value={text}
                    onChange={(e) => handleTextChange(id, e.target.value)}
                    onMouseDown={(e) => handleDragStart(id, e)}
                    style={{
                        position: "absolute",
                        left: `${x}px`,
                        top: `${y}px`,
                        backgroundColor: "transparent",
                        border: "none",
                        resize: "none",
                        color: "white",
                    }}
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
            </div>
        </div>
    );
};

export default DrawingApp;
