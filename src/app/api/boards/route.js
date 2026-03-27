import { NextResponse } from "next/server";
import { createBoard, getBoardsByUser } from "@/services/boardService";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { getBoardCollection } from "@/models/Board";
import { ObjectId } from "mongodb";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const boards = await getBoardsByUser(session.user.id);

  return NextResponse.json(boards);
}

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const board = await createBoard({
    ...body,
    ownerId: session.user.id,
  });

  return NextResponse.json(board);
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const boards = await getBoardCollection();

  await boards.deleteOne({
    _id: new ObjectId(id),
    ownerId: session.user.id,
  });

  return NextResponse.json({ success: true });
}