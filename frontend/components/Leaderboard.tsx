"use client";

import { useEffect, useState } from "react";
import { leaderboardScore } from "@/lib/api";

export default function Leaderboard(){

  const [list,setList]=useState<any[]>([]);

  async function load(){
    const data = await leaderboardScore();
    console.log("data: ",data);
    setList(data);
  }

  useEffect(()=>{
    load();
    const id=setInterval(load,5000); // refresh every 5s
    return ()=>clearInterval(id);
  },[]);

  return(
    <div className="bg-white dark:bg-black rounded-2xl shadow-xl p-4 w-full">

      <h2 className="font-bold text-lg mb-3">Leaderboard</h2>

      <div className="space-y-2">

        {list.map((u,i)=>(
          <div
            key={i}
            className="flex justify-between border-b pb-1 text-sm"
          >
            <span>#{i+1}</span>
            <span>{u.username}</span>
            <span className="font-semibold">{u.value}</span>
          </div>
        ))}

      </div>

    </div>
  );
}
