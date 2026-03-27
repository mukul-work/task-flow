import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyCredentials } from "@/services/userService";
import { generateToken } from "@/lib/auth";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const result = await verifyCredentials(parsed.data);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    const token = generateToken({
      userId: result.user.id,
      email: result.user.email,
    });

    return NextResponse.json({ user: result.user, token });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}