const API = "http://localhost:4000";

export async function register(data:any){
  const r = await fetch(API+"/auth/register",{
    method:"POST",
    headers:{ "Content-Type":"application/json"},
    body:JSON.stringify(data)
  });
  return r.json();
}

export async function login(data:any){
  const r = await fetch(API+"/auth/login",{
    method:"POST",
    headers:{ "Content-Type":"application/json"},
    body:JSON.stringify(data)
  });
  return r.json();
}

export async function nextQuestion(token:string){
  const r = await fetch(API+"/quiz/next",{
    headers:{ Authorization:`Bearer ${token}` }
  });
  return r.json();
}

export async function submitAnswer(token:string,body:any){
  const r = await fetch(API+"/quiz/answer",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      Authorization:`Bearer ${token}`
    },
    body:JSON.stringify(body)
  });
  return r.json();
}

export async function getState(token:string){
  const r = await fetch(API+"/quiz/state",{
    headers:{ Authorization:`Bearer ${token}` }
  });
  return r.json();
}


export function setToken(t:string){
  localStorage.setItem("token",t);
}

export function getToken(){
  return localStorage.getItem("token");
}

export function logout(){
  localStorage.removeItem("token");
}

export async function leaderboardScore(){
  const r = await fetch("http://localhost:4000/leaderboard/score",{
    cache:"no-store"
  });
  return r.json();
}
