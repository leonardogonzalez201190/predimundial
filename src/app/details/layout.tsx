import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { CalendarCheck2, ListCheck, TrendingUp, UserRound } from "lucide-react";
import BackButton from "@/components/BackButton";

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

        <BackButton />
        <h1 className="text-center flex items-center justify-center">
          <ListCheck className="size-3.5 mr-2" />
          Predicciones
        </h1>
      </header>

      {children}

    </div>
  );
}
