import { pool } from "../db/setupDb.js";
import { getEmbedding } from "../utils/upload.js";

export async function handleSearch(query: string) {
  const embedding = await getEmbedding(query);
  const formattedVector = `[${embedding.join(",")}]`;

  const result = await pool.query(
    `SELECT filename, text, exif, embedding <#> $1 AS distance
     FROM documents
     ORDER BY distance ASC
     LIMIT 1`,
    [formattedVector]
  );

  return result.rows;
}
