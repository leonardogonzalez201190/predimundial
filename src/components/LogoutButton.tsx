"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <Button variant="link" size="sm" className="text-red-500" onClick={() => signOut({ callbackUrl: "/login" })}>
      <LogOut />
      Logout
    </Button>
  );
}
