// // import dbConnect from "@/lib/mongodb";
// // import Otp from "@/model/Otp";
// // async function senSMS({
// //   bodyId,
// //   to,
// //   args,
// // }: {
// //   bodyId: number;
// //   to: string;
// //   args: string[];
// // }) {
// //   const url =
// //     "https://console.melipayamak.com/api/send/shared/cba17fa6705a4348b2e2d10279cf3fb9";
// //   const payload = { bodyId, to, args };
// //   const res = await fetch(url, {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json; charset=UTF-8" },
// //     body: JSON.stringify(payload),
// //   });
// //   const text = await res.text();
// //   return { status: res.status, body: text };
// // }
// // export async function sendOtpToUser(mobile: string) {
// //   await dbConnect();

// //   // تولید OTP 5 رقمی
// //   const otp = Math.floor(10000 + Math.random() * 90000).toString();

// //   // ذخیره OTP در دیتابیس با انقضای 2 دقیقه
// //   const otpDoc = await Otp.create({
// //     mobile,
// //     otp,
// //     createdAt: new Date(),
// //   });

// //   // اینجا می‌توانی کد ارسال SMS را قرار دهی
// //   console.log(`OTP برای ${mobile} ارسال شد: ${otp}`);
// //   const smsResponse = await senSMS({
// //     bodyId: 401950,
// //     to: mobile,
// //     args: [otpDoc.otp],
// //   });
// //   return { id: otpDoc._id.toString() };
// // }
// "use server";
// import dbConnect from "@/lib/mongodb";
// import Otp from "@/model/Otp";

// // متد ارسال SMS به سرویس ملی‌پیامک

// // تابع اصلی ارسال OTP
// export async function sendOtpToUser(mobile: string) {
//   await dbConnect();

//   // پاک کردن OTP قبلی شماره موبایل
//   await Otp.deleteMany({ mobile });

//   // تولید OTP 5 رقمی
//   const otp = Math.floor(10000 + Math.random() * 90000).toString();

//   // ذخیره OTP در دیتابیس با انقضای 2 دقیقه (TTL index در مدل)
//   const otpDoc = await Otp.create({
//     mobile,
//     otp,
//     createdAt: new Date(),
//   });

//   // ارسال SMS با ملی‌پیامک
//   // const smsResponse = await sendSMS({
//   //   bodyId: 401950,
//   //   to: mobile,
//   //   args: [otpDoc.otp],
//   // });

//   return {
//     otp: otp,
//     // sms:smsResponse
//   }; // بازگشت شناسه OTP برای فرانت
// }
"use server";

import dbConnect from "@/lib/mongodb";
import Otp from "@/model/Otp";

async function sendSMS({
  bodyId,
  to,
  args,
}: {
  bodyId: number;
  to: string;
  args: string[];
}) {
  const url =
    "https://console.melipayamak.com/api/send/shared/cba17fa6705a4348b2e2d10279cf3fb9";
  const payload = { bodyId, to, args };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  return { status: res.status, body: text };
}

export async function sendOtpToUser(mobile: string) {
  await dbConnect();

  // پاک کردن OTP قبلی شماره موبایل
  await Otp.deleteMany({ mobile });

  // تولید OTP 5 رقمی
  const otp = Math.floor(10000 + Math.random() * 90000).toString();

  // ذخیره OTP در دیتابیس با انقضای 2 دقیقه (TTL index در مدل)
  const otpDoc = await Otp.create({
    mobile,
    otp,
    createdAt: new Date(),
  });
  // await sendSMS({
  //   bodyId: 401950,
  //   to: mobile,
  //   args: [otp],
  // });
  return otpDoc.otp;
}
