import * as Yup from "yup";

// اعتبارسنجی شماره موبایل
export const mobileSchema = Yup.string()
      .matches(/^09\d{9}$/, "شماره تماس باید 11 رقم باشد و با 09 شروع شود")
      .required("شماره تماس الزامی است.")

// اعتبارسنجی OTP
export const otpSchema = Yup.string()
.required("کد تایید الزامی است")
.length(5, "کد تایید 5 رقمی است");