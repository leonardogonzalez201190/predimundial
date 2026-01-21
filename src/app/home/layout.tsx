import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { CalendarCheck2, TrendingUp, UserRound } from "lucide-react";

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authConfig);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen max-w-2xl mx-auto flex flex-col relative text-[12px]">

      {/* 🔹 Header fijo con glass effect */}
      <header
        className="
          sticky top-0 z-50
          flex items-center justify-between border-b h-12 px-4
          bg-white/60 backdrop-blur-md
          dark:bg-black/40
        "
      >

        <nav className="items-center gap-2 hidden sm:flex">
          <UserRound className="w-4 h-4 mr-1" />
          <h1 className="font-bold">{session.user?.alias}</h1>
        </nav>


        <Link className={buttonVariants({ variant: "outline", size: "sm" })} href="/home">
          <TrendingUp className="w-4 h-4 mr-1" />
          Posiciones
        </Link>

        <Link className={buttonVariants({ variant: "outline", size: "sm", className: "text-end" })} href="/home/partidos">
          <CalendarCheck2 className="w-4 h-4 mr-1" />
          Partidos
        </Link>

        <div className="flex gap-2">
          <ThemeToggle />
          <LogoutButton />
        </div>

      </header>

      {/* 🔹 margen superior para que el contenido no quede tapado */}
      {children}

    </div>
  );
}
