"use client";

import { Category } from "@/types";

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

interface CategorySelectorProps {
  form: ProductForm;
  categories: Category[];
  updateField: <K extends keyof ProductForm>(
    key: K,
    value: ProductForm[K]
  ) => void;
}

const CategorySelector = ({
  form,
  categories,
  updateField,
}: CategorySelectorProps) => {
  return (
    <div>
      <p className="font-medium mb-2">دسته بندی ها</p>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat._id}
            type="button"
            onClick={() => updateField("category", cat._id)}
            className={`px-2 py-1 rounded text-xs ${
              form.category === cat._id
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {cat.parent
              ? `مادر: ${cat.parent.name} - زیردسته: ${cat.name}`
              : cat.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
