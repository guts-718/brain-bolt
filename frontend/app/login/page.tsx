import AuthForm from "@/components/AuthForm";

export default function Page(){
  return(
    <main className="min-h-screen flex items-center justify-center">
      <AuthForm mode="login"/>
    </main>
  );
}
