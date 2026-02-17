export default function ScorePanel({state}:any){
  return(
    <div className="bg-black/60 border border-white/20 shadow-xl rounded-2xl p-4 flex justify-between text-center text-white">

      <Stat label="Score" value={state.score}/>
      <Stat label="Streak" value={state.streak}/>
      <Stat label="Difficulty" value={state.current_difficulty}/>

    </div>
  );
}

function Stat({label,value}:{label:string,value:any}){
  return(
    <div>
      <div className="text-xs text-gray-300">{label}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
}


