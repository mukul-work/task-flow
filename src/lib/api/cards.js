import { apiFetch } from "./fetcher";

export async function getCards(listId) {
  return apiFetch(`/api/cards?listId=${listId}`);
}

export async function createCard(data) {
  return apiFetch("/api/cards", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCard(data) {
  return apiFetch("/api/cards", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteCard(id) {
  return apiFetch(`/api/cards?id=${id}`, {
    method: "DELETE",
  });
}