import { ObjectId } from "mongodb";
import { getCardCollection } from "@/models/Card";

export async function createCard(data) {
  const cards = await getCardCollection();

  const result = await cards.insertOne({
    ...data,
    createdAt: new Date(),
  });

  return result;
}

export async function getCards(listId) {
  const cards = await getCardCollection();

  return cards.find({ listId }).sort({ order: 1 }).toArray();
}

export async function updateCard(id, data) {
  const cards = await getCardCollection();

  await cards.updateOne(
    { _id: new ObjectId(id) },
    { $set: data }
  );

  return true;
}

export async function deleteCard(id) {
  const cards = await getCardCollection();

  return cards.deleteOne({ _id: new ObjectId(id) });
}