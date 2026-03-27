import { getListCollection } from "@/models/List";

export async function createList(data) {
  const lists = await getListCollection();

  const result = await lists.insertOne({
    ...data,
    createdAt: new Date(),
  });

  return result;
}

export async function getLists(boardId) {
  const lists = await getListCollection();

  return lists.find({ boardId }).sort({ order: 1 }).toArray();
}