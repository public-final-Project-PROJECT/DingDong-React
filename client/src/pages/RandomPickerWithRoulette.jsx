import { useRef, useState, useEffect } from "react";
import axios from "axios";

const RandomPickerWithRoulette = () =>
{
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [randomPerson, setRandomPerson] = useState(null);
    const [faces, setFaces] = useState([]);
    const [isRouletteRunning, setIsRouletteRunning] = useState(false);
    const [containerStyle, setContainerStyle] = useState({});
    const rouletteSoundRef = useRef(null);
    const selectionSoundRef = useRef(null);

    useEffect(() => 
    {
        const adjustContainerStyle = () =>
        {
            setContainerStyle({
                position: "relative",
                width: "100%",
                maxWidth: "1920px",
                height: window.innerWidth > 1280 ? "720px" : "auto",
                margin: "0",
            });
        };

        adjustContainerStyle();
        window.addEventListener("resize", adjustContainerStyle);

        return () => window.removeEventListener("resize", adjustContainerStyle);
    }, []);

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

        if (!rouletteSoundRef.current) 
        {
            rouletteSoundRef.current = new Audio("/roulette_spin.mp3");
        }
        rouletteSoundRef.current.loop = true;
        rouletteSoundRef.current.play();

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

            if (rouletteSoundRef.current) 
            {
                rouletteSoundRef.current.pause();
                rouletteSoundRef.current.currentTime = 0;
            }

            const randomFace = detectedFaces[Math.floor(Math.random() * detectedFaces.length)];
            setRandomPerson(randomFace);

            if (!selectionSoundRef.current) 
            {
                selectionSoundRef.current = new Audio("/roulette_select.mp3");
            }
            selectionSoundRef.current.play();
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
                isRouletteRunning ? "두구두구..." : "당첨!",
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
        <div style={containerStyle}>
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <video
                    ref={videoRef}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        border: "1px solid black",
                    }}
                />
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
            <div
                style={{
                    width: "100%",
                    maxWidth: "1920px",
                    height: "167px",
                    backgroundColor: "#333",
                    color: "white",
                    border: "5px solid #FFD700",
                    borderRadius: "0px 0px 10px 10px",
                    marginTop: window.innerWidth > 1280 ? "0px" : "-6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    fontFamily: "Arial, sans-serif",
                    textAlign: "center",
                }}
            />
            <div style={{ display: "flex", justifyContent: "center", gap: "100px", marginTop: "-135px" }}>
                <button
                    onClick={handleCapture}
                    disabled={isRouletteRunning}
                    style={{
                        width: "100px",
                        height: "100px",
                        background: isRouletteRunning
                            ? "linear-gradient(to bottom, #FFD700, #C9A400)"
                            : "linear-gradient(to bottom, #FF0000, #B20000)",
                        color: "white",
                        border: "2px solid #333",
                        borderRadius: "50%",
                        boxShadow: "0 4px #666",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "14px",
                        textTransform: "uppercase",
                        outline: "none",
                        transition: "transform 0.1s ease",
                        textAlign: "center",
                        lineHeight: "80px",
                    }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.9)")}
                    onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                    {isRouletteRunning ? "진행 중" : "뽑기"}
                </button>
                <button
                    onClick={handleResetHighlight}
                    style={{
                        width: "100px",
                        height: "100px",
                        background: "linear-gradient(to bottom, #444, #222)",
                        color: "white",
                        border: "2px solid #333",
                        borderRadius: "50%",
                        boxShadow: "0 4px #666",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "14px",
                        textTransform: "uppercase",
                        outline: "none",
                        transition: "transform 0.1s ease",
                        textAlign: "center",
                        lineHeight: "80px",
                    }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.9)")}
                    onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                    초기화
                </button>
            </div>
        </div>
    );    
};

export default RandomPickerWithRoulette;
