async function getData(){
  const res = await fetch("http://localhost:4000/leaderboard/score",{
    cache:"no-store"
  });
  return res.json();
}

export default async function Leaderboard(){

  const data = await getData();

  return(
    
    <main className="max-w-xl mx-auto p-6">
        <a href="/leaderboard" className="underline text-sm">
            View Leaderboard →
         </a>

      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>

      <div className="bg-white rounded-2xl shadow">

        {data.map((u:any,i:number)=>(
          <div
            key={i}
            className="flex justify-between p-4 border-b last:border-none"
          >
            <span>#{i+1}</span>
            <span>{u.username ?? u.userid}</span>
            <span className="font-semibold">{u.value}</span>
          </div>
        ))}

      </div>

    </main>
  );
}
