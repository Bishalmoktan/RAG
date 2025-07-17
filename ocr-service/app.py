from flask import Flask, request, jsonify
from flask_cors import CORS
import easyocr
import os

app = Flask(__name__)
CORS(app)
reader = easyocr.Reader(['en'])

@app.route("/", methods=["GET"])
def index():
    return "EasyOCR API is running!"

@app.route("/extract-text", methods=["POST"])
def extract_text():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files['image']
    image_path = os.path.join("/tmp", file.filename)
    file.save(image_path)

    try:
        result = reader.readtext(image_path, detail=0)
        return jsonify({"text": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        os.remove(image_path)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
