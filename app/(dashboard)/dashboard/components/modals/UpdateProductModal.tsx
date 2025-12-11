"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Category, Product, Tag } from "@/types";
import { toast } from "react-toastify";
import { productValidationSchema } from "@/validations/validation";
import BasicInfoFields from "./updateProduct/BasicInfoFields";
import ImageUploader from "./updateProduct/ImageUploader";
import CategorySelector from "./updateProduct/CategorySelector";
import TagsSelector from "./updateProduct/TagsSelector";
import SpecificationsEditor from "./updateProduct/SpecificationsEditor";
import GalleryUploader from "./updateProduct/GalleryUploader";
import * as yup from "yup";

interface ProductForm {
  title: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  brand?: string;
  description: string;
  shortDesc?: string;
  category: string;
  mainImage: string;
  galleryImages: string[];
  tags: string[];
  specifications: {
    title: string;
    items: {
      key: string;
      value: string;
    }[];
  }[];
}

interface EditProductModalProps {
  onClose: () => void;
  product: Product | null;
  onUpdated: (updatedData: Product) => void;
}

export default function EditProductModal({
  onClose,
  product,
  onUpdated,
}: EditProductModalProps) {
  const [form, setForm] = useState<ProductForm>({
    title: product?.title || "",
    slug: product?.slug || "",
    price: product?.price || 0,
    discountPrice: product?.discountPrice || null,
    stock: product?.stock || 0,
    brand: product?.brand || "",
    description: product?.description || "",
    shortDesc: product?.shortDesc || "",
    category: product?.category?._id || "",
    mainImage: product?.mainImage || "",
    galleryImages: product?.images || [],
    tags: product?.tags?.map((t: Tag) => t._id) || [],
    specifications: product?.specifications || [],
  });

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tagsList, setTagsList] = useState<Tag[]>([]);

  // ------------------ Fetch categories & tags ------------------
  useEffect(() => {
    fetch("/api/admin/category")
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => toast.error("خطا در دریافت دسته‌بندی‌ها"));

    fetch("/api/admin/tag")
      .then((res) => res.json())
      .then(setTagsList)
      .catch(() => toast.error("خطا در دریافت تگ‌ها"));
  }, []);

  // ------------------ Handle input change ------------------
  const updateField = <K extends keyof ProductForm>(
    key: K,
    value: ProductForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ==========================
  // 📌 Submit
  // ==========================
  const handleSave = async (): Promise<void> => {
    try {
      productValidationSchema.validateSync(form, { abortEarly: false });
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        err.inner.forEach((e) => toast.error(e.message));
      } else {
        toast.error("خطای ناشناخته");
      }
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/product/${product?._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      const updatedProduct = await res.json();
      onUpdated(updatedProduct);
      toast.success("محصول با موفقیت بروزرسانی شد");
      onClose();
    } catch {
      toast.error("خطا در بروزرسانی محصول");
    } finally {
      setLoading(false);
    }
  };
  // ------------------ Render ------------------
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black/50 z-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl w-full max-w-3xl p-6 shadow-xl overflow-y-auto max-h-[90vh]"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: "spring", duration: 0.4 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5 border-b pb-3">
            <h2 className="text-xl font-semibold">ویرایش محصول</h2>
            <button
              title="بستن"
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full"
            >
              <X size={22} />
            </button>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-4">
            {/* main iamge */}
            <GalleryUploader form={form} updateField={updateField} />
            {/* MainInfo */}
            <BasicInfoFields form={form} updateField={updateField} />
            {/* GalleryImage */}
            <ImageUploader form={form} updateField={updateField} />

            {/* Category */}
            <CategorySelector
              form={form}
              categories={categories}
              updateField={updateField}
            />

            {/* Tags */}
            <TagsSelector
              form={form}
              updateField={updateField}
              tagsList={tagsList}
            />

            {/* Specifications */}
            <SpecificationsEditor form={form} updateField={updateField} />
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              لغو
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
