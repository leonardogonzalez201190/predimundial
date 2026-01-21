"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, alias, password })
    });

    if (res.ok) {
      toast.success("Usuario creado, ahora inicia sesión");
      router.push("/login");
    } else {
      const data = await res.json();
      toast.error(data.error ?? "Error al registrar usuario");
    }
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen text-xs">
      <h2 className="text-lg font-bold">Registro</h2>

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <Input
          placeholder="Usuario"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />

        <Input
          placeholder="Alias"
          value={alias}
          onChange={e => setAlias(e.target.value)}
          required
        />

        <Input
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <Button type="submit">Crear cuenta</Button>
      </form>
      <div className="flex gap-2">
        <p>¿Ya tenés cuenta?</p>
        <a href="/login" style={{ color: "blue" }}>
          Inicia sesión aquí
        </a>
      </div>
    </div>
  );
}
