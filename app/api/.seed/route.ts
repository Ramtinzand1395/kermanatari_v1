import mongoose from "mongoose";
import Gamedata from "./GameData.json"; // مسیر رو درست کن
import { NextResponse } from "next/server";

const MONGO_URI =
  "mongodb+srv://ramtinzand6:z4hfD25hb9z2TGox@cluster0.sdow2.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0";

// جلوگیری از اتصال چندباره
if (!mongoose.connection.readyState) {
  mongoose.connect(MONGO_URI);
}

// Schema
const ItemSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  items: [
    {
      name: { type: String, required: true },
    },
  ],
});

// Model (برای جلوگیری از overwrite)
const GameList =
  mongoose.models.GameList || mongoose.model("GameList", ItemSchema);

export async function POST() {
  try {
    // تبدیل داده‌ها
    const dataArray = Object.keys(Gamedata).map((platform) => ({
      platform,
      items: Gamedata[platform].map((name) => ({ name })),
    }));

    // (اختیاری) پاک کردن قبلی‌ها
    await GameList.deleteMany({});

    // ذخیره
    await GameList.insertMany(dataArray);

    return NextResponse.json({
      success: true,
      message: "Game data seeded successfully",
      count: dataArray.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
