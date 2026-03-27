import clientPromise from "@/lib/mongodb";

export async function getCardCollection() {
  const client = await clientPromise;
  const db = client.db();
  return db.collection("cards");
}