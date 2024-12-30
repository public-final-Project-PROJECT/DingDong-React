import { useRef, useState, useEffect } from "react";
import axios from "axios";

const RandomPickerWithRoulette = () =>
{
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [randomPerson, setRandomPerson] = useState(null);
    const [faces, setFaces] = useState([]);
    const [isRouletteRunning, setIsRouletteRunning] = useState(false);

    useEffect(() => 
    {
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((stream) => 
            {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            })
            .catch((error) => 
            {
                console.error("Error accessing webcam:", error);
            });
    }, []);

    const handleCapture = async () => 
    {
        const canvas = document.createElement("canvas");
        const video = videoRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const frameBlob = await new Promise((resolve) =>canvas.toBlob(resolve, "image/jpeg"));

        const formData = new FormData();
        formData.append("image", frameBlob);

        try {
            const response = await axios.post("http://localhost:5000/recognize", formData, 
            { headers: { "Content-Type": "multipart/form-data" }});

            const detectedFaces = response.data.faces;
            setFaces(detectedFaces);

            if (detectedFaces.length > 0) 
            {
                runRoulette(detectedFaces);
            } 
            else 
            {
                alert("No faces detected!");
            }
        } catch (error) {
            console.error("Error recognizing faces:", error);
        }
    };

    const runRoulette = (detectedFaces) => 
    {
        setIsRouletteRunning(true);

        let currentIndex = 0;
        const interval = setInterval(() => 
        {
            setRandomPerson(detectedFaces[currentIndex]);
            currentIndex = (currentIndex + 1) % detectedFaces.length;
        }, 200);

        setTimeout(() => 
        {
            clearInterval(interval);
            setIsRouletteRunning(false);
            const randomFace = detectedFaces[Math.floor(Math.random() * detectedFaces.length)];
            setRandomPerson(randomFace);
        }, 5000);
    };

    useEffect(() => 
    {
        if (!canvasRef.current || !videoRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const video = videoRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        faces.forEach((face) => 
        {
            const { bbox } = face;
            ctx.strokeStyle = "blue";
            ctx.lineWidth = 2;
            ctx.strokeRect(bbox[0], bbox[1], bbox[2] - bbox[0], bbox[3] - bbox[1]);
        });

        if (randomPerson) 
        {
            const { bbox } = randomPerson;
            ctx.strokeStyle = isRouletteRunning ? "yellow" : "red";
            ctx.lineWidth = 3;
            ctx.strokeRect(bbox[0], bbox[1], bbox[2] - bbox[0], bbox[3] - bbox[1]);

            ctx.fillStyle = isRouletteRunning ? "yellow" : "red";
            ctx.font = "16px Arial";
            ctx.fillText(
                isRouletteRunning ? "두구두구..." : "당첨",
                bbox[0],
                bbox[1] - 10
            );
        }
    }, [faces, randomPerson, isRouletteRunning]);

    const handleResetHighlight = () => 
    {
        setFaces([]);
        setRandomPerson(null);

        if (canvasRef.current) 
        {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    return (
        <div style={{ position: "relative" }}>
            <h1>Random Face Picker with Roulette</h1>
            <div style={{ position: "relative", width: "100%" }}>
                <video ref={videoRef} style={{ width: "100%", border: "1px solid black" }} />
                <canvas
                    ref={canvasRef}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                    }}
                />
            </div>
            <button onClick={handleCapture} disabled={isRouletteRunning}>
                {isRouletteRunning ? "..." : "딸깍"}
            </button>
            <button onClick={handleResetHighlight}>초기화</button>
        </div>
    );
};

export default RandomPickerWithRoulette;
