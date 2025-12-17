import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import StoreOrder from "@/model/StoreOrder";

interface Params {
  orderId: string;
}

export async function PUT(
  req: Request,
  context: { params: Promise<Params> } // ⚠ حتما Promise
): Promise<NextResponse> {
  await dbConnect();

  try {
    const { orderId } = await context.params;
    const body = await req.json();
    const { list, price, consoleType, description } = body;
    const order = await StoreOrder.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { message: "سفارشی پیدا نشد." },
        { status: 400 }
      );
    }

    order.list = list;
    order.price = price;
    order.consoleType = consoleType;
    order.description = description;

    await order.save();

    return NextResponse.json({ message: "سفارش ویرایش شد." }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "خطای سرور" }, { status: 500 });
  }
}

/* ===================== DELETE ===================== */
export async function DELETE(
  req: Request,
  context: { params: Promise<Params> } // ⚠ حتما Promise
): Promise<NextResponse> {
  await dbConnect();

  try {
    const { orderId } = await context.params;

    const order = await StoreOrder.findByIdAndDelete(orderId);

    if (!order) {
      return NextResponse.json(
        { message: "سفارشی پیدا نشد.", status: 404 },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "سفارش با موفقیت حذف شد.", status: 200 },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "خطای سرور", status: 500 },
      { status: 500 }
    );
  }
}
