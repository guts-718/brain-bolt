import OptionButton from "./OptionButton";

export default function QuestionCard({q,onAnswer}:any){
  return(
    <div className="bg-black/70 border border-white/20 shadow-2xl rounded-2xl p-6 space-y-5 text-white">

      <div className="text-sm text-gray-300">
        Difficulty {q.difficulty} • {q.topic}
      </div>

      <div className="text-2xl font-semibold text-white">
        {q.text}
      </div>

      <div className="space-y-3">
        {q.options.map((o:string)=>(
          <OptionButton key={o} text={o} onClick={()=>onAnswer(o)} />
        ))}
      </div>

    </div>
  );
}
