import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { CalendarCheck2, TrendingUp } from "lucide-react";
import { EVENTS } from "@/lib/constants";

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authConfig);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen max-w-2xl mx-auto flex flex-col relative text-[12px]">

      {/* 🔹 Header fijo con glass effect */}
      <header
        className="
          sticky top-0 z-50
          flex items-center justify-between border-b h-12 px-4 sm:px-0
          bg-white/60 backdrop-blur-md
          dark:bg-black/40
        "
      >
        <h1 className="text-sm font-bold">{EVENTS[Number(session.user.event) as keyof typeof EVENTS]}</h1>
        <div className="flex gap-2">
          <ThemeToggle />
          <LogoutButton />
        </div>

      </header>

      <header className="flex flex-col-[1fr_auto_auto] gap-4 items-center p-4 sm:px-0">

        <h1 className="font-bold truncate flex-1">{session.user?.username}</h1>
        <Link className="flex items-center underline underline-offset-4" href="/home">
          <TrendingUp className="w-4 h-4 mr-1" />
          Posiciones
        </Link>
        <Link className="flex items-center underline underline-offset-4" href="/home/partidos">
          <CalendarCheck2 className="w-4 h-4 mr-1" />
          Partidos
        </Link>

      </header>


      {/* 🔹 margen superior para que el contenido no quede tapado */}
      {children}

    </div>
  );
}
