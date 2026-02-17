export default function OptionButton({text,onClick}:{text:string,onClick:()=>void}){
  return(
    <button
      onClick={onClick}
      className="w-full border p-3 rounded-xl hover:bg-gray-100 transition"
    >
      {text}
    </button>
  );
}
