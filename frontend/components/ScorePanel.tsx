"use client";

import { useEffect, useState } from "react";

/* ---------------- Animated Number ---------------- */

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    let start = display;
    const step = () => {
      start += (value - start) * 0.2;

      if (Math.abs(value - start) < 0.5) {
        setDisplay(value);
        return;
      }

      setDisplay(Math.round(start));
      requestAnimationFrame(step);
    };

    step();
  }, [value]);

  return <>{display}</>;
}

/* ---------------- Stat Block ---------------- */

function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <div className="text-xs text-gray-300">{label}</div>

      <div className="text-2xl font-bold">
        <AnimatedNumber value={value} />
        {label === "Streak" && value >= 3 && " 🔥"}
      </div>
    </div>
  );
}

/* ---------------- Main Panel ---------------- */

export default function ScorePanel({
  state,
}: {
  state: {
    score: number;
    streak: number;
    current_difficulty: number;
  };
}) {
  return (
    <div
      className="
      bg-indigo-100 dark:bg-indigo-900/40
      border border-white/20
      shadow-xl
      rounded-2xl
      p-4
      flex
      justify-between
      text-center
      text-white
      backdrop-blur
      "
    >
      <Stat label="Score" value={state.score} />
      <Stat label="Streak" value={state.streak} />
      <Stat label="Difficulty" value={state.current_difficulty} />
    </div>
  );
}



// import { useEffect,useState } from "react";

// export default function ScorePanel({state}:any){
  

//         function AnimatedNumber({value}:{value:number}){
//         const [n,setN]=useState(value);

//         useEffect(()=>{
//             let start=n;
//             const id=setInterval(()=>{
//             start += Math.ceil((value-start)/5);
//             setN(start);
//             if(start===value) clearInterval(id);
//             },20);
//             return ()=>clearInterval(id);
//         },[value]);

//         return <>{n}</>;
//         }

  
//     return(
//     <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20
//  border border-white/20 shadow-xl rounded-2xl p-4 flex justify-between text-center text-white">

//       <Stat label="Score" value={state.score}/>
//       <Stat label="Streak" value={state.streak}/>
//       <Stat label="Difficulty" value={state.current_difficulty}/>

//     </div>
//   );
// }

// function Stat({label,value}:{label:string,value:any}){
//   return(
//     <div>
//       <div className="text-xs text-gray-300">{label}</div>
//       <div className="text-2xl font-bold">{value} {value>=3 && "🔥"}</div>

//     </div>
//   );
// }


