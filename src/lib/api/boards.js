import api from "./fetcher";

export async function getBoards() {
  const { data } = await api.get("/api/boards");
  return data;
}

export async function createBoard(title) {
  const { data } = await api.post("/api/boards", { title });
  return data;
}

export async function deleteBoard(id) {
  const { data } = await api.delete(`/api/boards?id=${id}`);
  return data;
}
