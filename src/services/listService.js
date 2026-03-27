import { getListCollection } from "@/models/List";

export async function createList(data) {
  const lists = await getListCollection();

  const doc = { ...data, createdAt: new Date() };
  const result = await lists.insertOne(doc);

  return { ...doc, _id: result.insertedId.toString() };
}

export async function getLists(boardId) {
  const lists = await getListCollection();

  return lists.find({ boardId }).sort({ order: 1 }).toArray();
}
