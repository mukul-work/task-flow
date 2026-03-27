import { ObjectId } from "mongodb";
import { getBoardCollection } from "@/models/Board";

export async function createBoard(data) {
  const boards = await getBoardCollection();

  const boardData = {
    title: data.title,
    ownerId: data.ownerId,
    members: data.members,
  };

  const createdAt = new Date();

  const result = await boards.insertOne({
    ...boardData,
    createdAt,
  });

  return {
    ...boardData,
    createdAt,
    _id: result.insertedId.toString(),
  };
}

export async function getBoardsByUser(userId) {
  const boards = await getBoardCollection();

  return boards
    .find({ ownerId: userId })
    .sort({ createdAt: -1 })
    .toArray();
}