import { NextResponse } from "next/server";
import GameList from "@/model/GameList";
import dbConnect from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

// GET /api/game-list/:consoleType
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ error: "کاربر وارد نشده" }, { status: 401 });

  if (session.user.role !== "superadmin")
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const consoleType = searchParams.get("consoleType");

    const gameList = await GameList.find({
      platform: consoleType,
    });

    return NextResponse.json(
      {
        gameList,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
}
