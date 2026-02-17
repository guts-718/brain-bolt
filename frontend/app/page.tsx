"use client";

import { useEffect,useState } from "react";
import QuestionCard from "@/components/QuestionCard";
import ScorePanel from "@/components/ScorePanel";
import { login,nextQuestion,submitAnswer,getState } from "@/lib/api";
import { v4 as uuid } from "uuid";

export default function Home(){

  const [token,setToken]=useState("");
  const [q,setQ]=useState<any>(null);
  const [state,setState]=useState<any>(null);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    async function init(){

      const auth=await login({
        email:"rahul1@test.com",
        password:"1234"
      });
      console.log("auth :", auth);
      setToken(auth.token);
    
      console.log("auth :", auth);

      const s=await getState(auth.token);
      setState(s);
      console.log("State: ",s);
      console.log("auth_token: ", auth.token);
      const nq=await nextQuestion(auth.token);
      setQ(nq);

      setLoading(false);
    }

    init();
  },[]);

  async function answer(opt:string){

    const res=await submitAnswer(token,{
      question_id:q.question_id,
      selected_option:opt,
      time_taken_ms:1000,
      idempotency_key:uuid()
    });

    const s=await getState(token);
    setState(s);

    const nq=await nextQuestion(token);
    setQ(nq);
  }

  if(loading) return <div className="p-10">Loading...</div>;

  return(
    <main className="max-w-xl mx-auto p-6 space-y-6">

      <ScorePanel state={state}/>

      {q && <QuestionCard q={q} onAnswer={answer}/>}

    </main>
  );
}
