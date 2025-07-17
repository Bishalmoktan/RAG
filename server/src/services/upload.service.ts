import { pool } from "../db/setupDb.js";
import {
  extractExif,
  extractTextFromImageOrPdf,
  getEmbedding,
} from "../utils/upload.js";

export async function handleUpload(
  name: string,
  path: string,
  mimetype: string
) {
  const text = await extractTextFromImageOrPdf(path, mimetype);
  const embedding = await getEmbedding(text);
  const formattedVector = `[${embedding.join(",")}]`;
  const exif = await extractExif(path, mimetype);
  await pool.query(
    "INSERT INTO documents (filename, text, exif, embedding) VALUES ($1, $2, $3, $4)",
    [name, text, exif, formattedVector]
  );
}
