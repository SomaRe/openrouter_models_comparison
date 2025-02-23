// In-memory storage for comments
let comments = {};

export async function getComments() {
  return comments;
}

export async function updateComments(newComments) {
  comments = newComments;
  return comments;
}
