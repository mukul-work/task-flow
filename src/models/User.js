import clientPromise from "@/lib/mongodb";

export async function getUserCollection() {
  const client = await clientPromise;
  const db = client.db();
  return db.collection("users");
}