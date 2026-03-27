import { apiFetch } from "./fetcher";

export async function getBoards(userId) {
  return apiFetch(`/api/boards?ownerId=${userId}`);
}

export async function createBoard(data) {
  return apiFetch("/api/boards", {
    method: "POST",
    body: JSON.stringify(data),
  });
}