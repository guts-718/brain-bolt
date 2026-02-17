"use client";

import { useState } from "react";
import { login, register, setToken } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function AuthForm({mode}:{mode:"login"|"register"}){

  const router = useRouter();

  const [form,setForm]=useState({
    username:"",
    email:"",
    password:""
  });

  function update(e:any){
    setForm({...form,[e.target.name]:e.target.value});
  }

  async function submit(e:any){
    e.preventDefault();

    const res =
      mode==="login"
      ? await login(form)
      : await register(form);

    setToken(res.token);
    router.push("/");
  }

  return(
    <form
      onSubmit={submit}
      className="space-y-4 bg-white dark:bg-black p-6 rounded-2xl shadow-xl w-80"
    >
      <h1 className="text-xl font-bold text-center">
        {mode==="login"?"Login":"Register"}
      </h1>

      {mode==="register" && (
        <input
          name="username"
          placeholder="Username"
          onChange={update}
          className="w-full p-2 border rounded"
        />
      )}

      <input
        name="email"
        placeholder="Email"
        onChange={update}
        className="w-full p-2 border rounded"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={update}
        className="w-full p-2 border rounded"
      />

      <button className="w-full bg-black text-white py-2 rounded">
  {mode === "login" ? "Login" : "Create account"}
</button>

<div className="text-center text-sm mt-3">
  <span className="opacity-70">
    {mode === "login"
      ? "Don't have an account?"
      : "Already have an account?"}
  </span>

  <button
    type="button"
    onClick={() =>
      router.push(mode === "login" ? "/register" : "/login")
    }
    className="ml-1 underline hover:opacity-80"
  >
    {mode === "login" ? "Register" : "Login"}
  </button>
</div>


    </form>
  );
}
