"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import SignInGoogle from "@/components/SignInGoogle";
import { Separator } from "@/components/ui/separator";
import { IMAGES } from "@/lib/constants";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");
  const [event, setEvent] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setIsLoading(true);
    document.cookie = `event=${event}; path=/; max-age=300`; // 5 min
    const res = await signIn("credentials", {
      redirect: false,
      username,
      password
    });

    setIsLoading(false);

    if (!res?.error) router.push("/home");
    else toast.error("Login inválido");
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen text-xs">
      <img src={IMAGES[event as keyof typeof IMAGES]} alt="" className="w-24 dark:bg-white" />
      <select className="text-base" name="event" id="" onChange={e => setEvent(Number(e.target.value))}>
        <option value="1">Clásico Mundial de Béisbol 2026</option>
        <option value="2">Copa Mundial de la FIFA 2026</option>
      </select>

      <h1>Iniciar sesión</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <Input
          autoFocus={true}
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

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
        <Separator className="w-full" />
        <SignInGoogle event={event} />
      </form>

      <div className="flex gap-2">
        <p>¿No tenés cuenta?</p>
        <a href="/register" style={{ color: "blue" }}>
          Registrate aquí
        </a>
      </div>
    </div>
  );
}
