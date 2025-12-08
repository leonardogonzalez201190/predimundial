import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";

export default async function RootPage() {
  const session = await getServerSession(authConfig);

  // Si hay sesión → al Home
  if (session) redirect("/home");

  // Si NO hay sesión → al Login
  redirect("/login");
}
