"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (!res?.error) router.push("/home");
    else alert("Login inválido");
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <Input
          placeholder="Usuario"
          value={username}
          onChange={e => setUser(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPass(e.target.value)}
        />
        <Button type="submit">Entrar</Button>
      </form>
      <p>
        ¿No tenés cuenta?{" "}
        <a href="/register" style={{ color: "blue" }}>
          Registrate aquí
        </a>
      </p>
    </div>
  );
}
