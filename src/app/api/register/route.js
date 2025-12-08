import User from "@/models/User";
import { connectToDB } from "@/lib/database";
import bcrypt from "bcryptjs";

export async function POST(request) {
  await connectToDB();
  const body = await request.json();

  const exists = await User.findOne({ username: body.username });
  if (exists) {
    return Response.json({ error: "Usuario ya existe" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(body.password, 10);

  await User.create({
    username: body.username,
    alias: body.alias,
    password: hashed
  });

  return Response.json({ ok: true });
}
