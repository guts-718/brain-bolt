export default function OptionButton({text,onClick}:{text:string,onClick:()=>void}){
  return(
    <button
      onClick={onClick}
      className="
w-full p-3 rounded-xl border transition font-medium
bg-white text-black hover:bg-gray-200
dark:bg-white/10 dark:text-white dark:hover:bg-white dark:hover:text-black
"
    >
      {text}
    </button>
  );
}
