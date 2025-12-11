import dbConnect from "@/lib/mongodb";
import Product from "@/model/Product";
import { data } from "framer-motion/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await dbConnect();

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  const total = await Product.countDocuments();
  const products = await Product.find()
    .populate({
      path: "category",
      populate: {
        path: "parent", // اینجا parent را هم populate می‌کنیم
        select: "name slug _id", // فقط فیلدهای مورد نیاز
      },
    })

    .populate("tags")
    .populate("specifications")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  return NextResponse.json({
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(req: Request) {
  await dbConnect();
  const generateSKU = () =>
    `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  try {
    const body = await req.json();
    const productData = {
      ...body,
      images: body.galleryImages,
      sku: generateSKU(),
    };

    const product = await Product.create(productData);
    return NextResponse.json({ message: "محصول جدید ساخته شد.", product });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
