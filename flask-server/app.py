from flask import Flask, request, jsonify
from flask_cors import CORS
import insightface
import cv2
import numpy as np

app = Flask(__name__)
CORS(app)

# Initialize InsightFace model
model = insightface.app.FaceAnalysis()
model.prepare(ctx_id=0)

@app.route('/recognize', methods=['POST'])
def recognize_faces():
    file = request.files['image']
    img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)

    # Detect faces
    faces = model.get(img)

    # Prepare response
    results = []
    for face in faces:
        results.append({
            'bbox': face.bbox.tolist(),
            'landmark': face.landmark.tolist() if face.landmark is not None else None,
            'embedding': face.embedding.tolist()
        })

    return jsonify({'faces': results})

if __name__ == '__main__':
    app.run(debug=True)
