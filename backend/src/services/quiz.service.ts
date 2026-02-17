export async function getNextQuestion(userId: string) {
  return { msg: "next question stub", userId };
}

export async function submitAnswer(userId: string, body: any) {
  return { msg: "answer stub", userId, body };
}

export async function getState(userId: string) {
  return { msg: "state stub", userId };
}
