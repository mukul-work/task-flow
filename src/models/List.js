import clientPromise from "@/lib/mongodb";

export async function getListCollection() {
  const client = await clientPromise;
  const db = client.db();
  return db.collection("lists");
}