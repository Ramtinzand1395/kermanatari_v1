"use client";

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

interface BasicInfoFieldsProps {
  form: ProductForm;
  updateField: <K extends keyof ProductForm>(
    key: K,
    value: ProductForm[K]
  ) => void;
}

const BasicInfoFields = ({ form, updateField }: BasicInfoFieldsProps) => {
  return (
    <div className="grid grid-cols-3 gap-5 mt-10">
      <div className="relative w-fit">
        <input
          title="عنوان محصول"
          type="text"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          className="border-b border-gray-300 py-1 focus:border-b-2 focus:border-blue-700 transition-colors focus:outline-none peer bg-inherit"
        />
        <label className="absolute -top-4 text-xs left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-blue-700 peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm">
          عنوان محصول{" "}
        </label>
      </div>

      <div className="relative w-fit">
        <input
          title="اسلاگ"
          type="text"
          value={form.slug}
          onChange={(e) => updateField("slug", e.target.value)}
          className="border-b border-gray-300 py-1 focus:border-b-2 focus:border-blue-700 transition-colors focus:outline-none peer bg-inherit"
        />
        <label className="absolute -top-4 text-xs left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-blue-700 peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm">
          اسلاگ
        </label>
      </div>

      <div className="relative w-fit">
        <input
          title="قیمت"
          type="number"
          value={form.price}
          onChange={(e) => updateField("price", Number(e.target.value))}
          className="border-b border-gray-300 py-1 focus:border-b-2 focus:border-blue-700 transition-colors focus:outline-none peer bg-inherit"
        />
        <label className="absolute -top-4 text-xs left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-blue-700 peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm">
          قیمت
        </label>
      </div>

      <div className="relative w-fit">
        <input
          title="موجودی"
          type="number"
          value={form.stock}
          onChange={(e) => updateField("stock", Number(e.target.value))}
          className="border-b border-gray-300 py-1 focus:border-b-2 focus:border-blue-700 transition-colors focus:outline-none peer bg-inherit"
        />
        <label className="absolute -top-4 text-xs left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-blue-700 peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm">
          موجودی
        </label>
      </div>

      <div className="relative w-fit ">
        <textarea
          placeholder="توضیحات"
          className="border-b border-gray-300 py-1 focus:border-b-2 focus:border-blue-700 transition-colors focus:outline-none peer bg-inherit"
          rows={4}
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
        />
        <label className="absolute -top-4 text-xs left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-blue-700 peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm">
          توضیحات
        </label>
      </div>
    </div>
  );
};

export default BasicInfoFields;
