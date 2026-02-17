"use client";

import { useEffect,useState } from "react";
import QuestionCard from "@/components/QuestionCard";
import ScorePanel from "@/components/ScorePanel";
import { login,nextQuestion,submitAnswer,getState } from "@/lib/api";
import { v4 as uuid } from "uuid";
import ThemeToggle from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import { getToken } from "@/lib/api";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api";
import Leaderboard from "@/components/Leaderboard";


export default function Home(){

  const [token,setToken]=useState("");
  const [q,setQ]=useState<any>(null);
  const [state,setState]=useState<any>(null);
  const [loading,setLoading]=useState(true);
  const router = useRouter();

  useEffect(()=>{
    async function init(){

     const token = getToken();
      if(!token){
        router.push("/register");
        return;
      }
      setToken(token);

    
      console.log("auth :", token);

      const s=await getState(token);
      setState(s);
      console.log("State: ",s);
      console.log("auth_token: ", token);
      const nq=await nextQuestion(token);
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
      {/* <ThemeToggle/> */}
     <button
  onClick={()=>{
    logout();
    router.push("/register");
  }}
  className="
  absolute top-6 right-6
  px-4 py-2
  rounded-lg
  text-sm font-medium
  transition

  bg-white text-black hover:bg-gray-200
  dark:bg-white/10 dark:text-white dark:hover:bg-white dark:hover:text-black
  border border-white/20
  backdrop-blur 
  hover:cursor-pointer
  "
>
  Logout
</button>


      <ScorePanel state={state}/>
      <motion.div
      key={q.question_id}
      initial={{opacity:0,y:10}}
      animate={{opacity:1,y:0}}
      exit={{opacity:0}}
      transition={{duration:0.3}}
      >
        <QuestionCard q={q} onAnswer={answer}/>
      </motion.div>
      <Leaderboard/>


    </main>
  );
}
