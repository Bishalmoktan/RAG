import { pool } from "../db/setupDb.js";
import {
  extractExif,
  extractTextFromImageOrPdf,
  getEmbedding,
  getFileHash,
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
  const fileHash = await getFileHash(path);
  await pool.query(
    "INSERT INTO documents (filename, text, exif, embedding, filehash) VALUES ($1, $2, $3, $4, $5)",
    [name, text, exif, formattedVector, fileHash]
  );
}

export async function findEmbeddingByhash(filePath: string) {
  const fileHash = await getFileHash(filePath);

  const { rowCount } = await pool.query(
    "SELECT 1 FROM documents WHERE filehash = $1",
    [fileHash]
  );

  return rowCount;
}
