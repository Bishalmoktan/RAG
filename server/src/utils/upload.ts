import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import sharp from "sharp";
import pdf from "pdf-parse-debugging-disabled";
import config from "../config/index.js";

export async function extractTextFromImageOrPdf(
  path: string,
  mimetype: string
) {
  if (mimetype === "application/pdf") {
    const dataBuffer = fs.readFileSync(path);
    const data = await pdf(dataBuffer);
    return data.text;
  } else {
    const form = new FormData();
    form.append("image", fs.createReadStream(path));

    const response = await axios.post(
      `${config.service.ocr}/extract-text`,
      form,
      {
        headers: {
          ...form.getHeaders(),
        },
      }
    );

    return response.data.text.join("\n");
  }
}

export async function getEmbedding(data: string) {
  const { pipeline } = await import("@xenova/transformers");
  const embedder = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
  );
  const results = await embedder(data, { pooling: "mean", normalize: true });
  return Array.from(results.data);
}

export async function extractExif(path: string, mimetype: string) {
  if (mimetype === "application/pdf") {
    const dataBuffer = fs.readFileSync(path);
    const data = await pdf(dataBuffer);
    return data.info;
  } else {
    const data = await sharp(path).metadata();
    const { exif, icc, xmpAsString, xmp, ...others } = data;
    return others;
  }
}
