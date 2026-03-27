import { apiFetch } from "./fetcher";

export async function getLists(boardId) {
  return apiFetch(`/api/lists?boardId=${boardId}`);
}

export async function createList(data) {
  return apiFetch("/api/lists", {
    method: "POST",
    body: JSON.stringify(data),
  });
}