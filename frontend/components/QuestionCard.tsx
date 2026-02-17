import OptionButton from "./OptionButton";

type Question = {
  difficulty: number;
  topic: string;
  text: string;
  options: string[];
};

export default function QuestionCard({
  q,
  onAnswer,
}: {
  q: Question;
  onAnswer: (opt: string) => void;
}) {
  return (
    <div
      className="
      rounded-2xl p-6 space-y-5 shadow-xl transition

      bg-white text-black
      dark:bg-gradient-to-br dark:from-slate-900 dark:to-black dark:text-white
      "
    >
      {/* Difficulty */}
      <div className="text-sm text-gray-600 dark:text-gray-300">
        Difficulty {q.difficulty} • {q.topic}
      </div>

      {/* Question */}
      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
        {q.text}
      </div>

      {/* Options */}
      <div className="space-y-3">
        {q?.options?.map((o) => (
          <OptionButton key={o} text={o} onClick={() => onAnswer(o)} />
        ))}
      </div>
    </div>
  );
}
