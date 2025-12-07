import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  throw new Error("لطفاً MONGODB_URI را در فایل .env تنظیم کنید");
}

// ---- افزودن تایپ به global ----
declare global {
  // اجازه می‌دهیم یک ویژگی به نام mongoose در global وجود داشته باشد
  var mongooseCache:
    | {
        conn: Mongoose | null;
        promise: Promise<Mongoose> | null;
      }
    | undefined;
}

// ---- مقداردهی اولیه به حافظه global ----
let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export default async function dbConnect() {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts);
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
}

// import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI || "";

// if (!MONGODB_URI) {
//   throw new Error("لطفاً MONGODB_URI را در .env تنظیم کنید");
// }

// // تعریف type برای cache روی global
// declare global {
//   // eslint-disable-next-line no-var
//   var mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
// }

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// async function dbConnect() {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//     };
//     cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => mongoose);
//   }
//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// export default dbConnect;
