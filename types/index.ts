export interface CartItem {
  id: string | number;
  title: string;
  image: string;
  price: number;
  quantity: number;
  discountPrice: number | null;
  sku?: string;
}

export interface CartStoreStateType {
  cart: CartItem[];
  hasHydrated: boolean;
}

export type UserProfileForm = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
} & User;

export type ProfileFormPayload = {
  username: string;
  gender?: string;
  birthday?: string;
  nationalCode?: string;
  email: string;
  mobile: string;
  newsletter: boolean;
};

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  mobile: string;
  role: "user" | "admin" | "superadmin";
  otps?: OTP[];
  newsletter: boolean;
  gender?: string;
  birthday?: string;
  nationalCode?: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface OTP {
  id: number;
  mobile: string;
  otp: number;
  createdAt: string | Date;
}
