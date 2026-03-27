import api from "./fetcher";

export async function getLists(boardId) {
  const { data } = await api.get(`/api/lists?boardId=${boardId}`);
  return data;
}

export async function createList(title, boardId, order = 1) {
  const { data } = await api.post("/api/lists", { title, boardId, order });
  return data;
}

export async function deleteList(id) {
  const { data } = await api.delete(`/api/lists?id=${id}`);
  return data;
}
