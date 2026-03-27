import api from "./fetcher";

export async function getCards(listId) {
  const { data } = await api.get(`/api/cards?listId=${listId}`);
  return data;
}

export async function createCard(title, listId, order = 1) {
  const { data } = await api.post("/api/cards", { title, listId, order });
  return data;
}

export async function updateCard(id, updates) {
  const { data } = await api.patch("/api/cards", { id, ...updates });
  return data;
}

export async function deleteCard(id) {
  const { data } = await api.delete(`/api/cards?id=${id}`);
  return data;
}
