import { NextResponse } from "next/server";
import { createCredentialsUser } from "@/services/userService";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);

    if (!body?.email || !body?.password || !body?.name) {
      return NextResponse.json(
        { error: "email, password and name are required" },
        { status: 400 },
      );
    }

    const result = await createCredentialsUser({
      email: body.email,
      password: body.password,
      name: body.name,
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status || 400 },
      );
    }

    return NextResponse.json({ user: result.user });
  } catch (err) {
    console.error("Signup error:", err.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
