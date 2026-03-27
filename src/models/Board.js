import clientPromise from "@/lib/mongodb";

export async function getBoardCollection() {
  const client = await clientPromise;
  const db = client.db();
  return db.collection("boards");
}