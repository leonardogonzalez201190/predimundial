import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // 🔹 Si el usuario ya está logueado y visita /login → enviarlo a /home
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // 🔹 Protección de rutas privadas
  if (!token && pathname.startsWith("/home")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/home/:path*"],
};
