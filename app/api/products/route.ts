import { NextResponse } from "next/server";
import Category from "@/model/Category";
import Product from "@/model/Product";
import dbConnect from "@/lib/mongodb";
import "@/model/Category";
import "@/model/Tag";
import "@/model/Comment";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");
    const hasDiscount = searchParams.get("discount");

    const filter: any = {};

    // فیلتر بر اساس تخفیف
    if (hasDiscount === "true") {
      filter.discountPrice = { $ne: null };
    }

    // فیلتر بر اساس دسته‌بندی با slug (نه id)
    if (categorySlug) {
      const mainCategory = await Category.findOne({
        slug: categorySlug,
      }).select("_id");

      if (mainCategory) {
        // پیدا کردن زیر‌دسته‌ها
        const subCategories = await Category.find({
          parentId: mainCategory._id,
        }).select("_id");
        const categoryIds = [
          mainCategory._id,
          ...subCategories.map((c) => c._id),
        ];
        filter.categoryId = { $in: categoryIds };
      }
    }

    // دریافت محصولات
    const products = await Product.find(filter)
      .populate("category")
      .populate("images")
      .populate("tags")
      .populate({
        path: "comments",
        match: { verified: true }, // فقط کامنت‌های تایید شده
      });

    return NextResponse.json(products);
  } catch (err) {
    console.error("❌ خطا در دریافت محصولات:", err);
    return NextResponse.json(
      { error: "خطا در دریافت محصولات" },
      { status: 500 }
    );
  }
}
