// todo
// formatprice برای همه
// لودینگ عکس
// دیتای بالا
"use client";
import Image from "next/image";
import { Product } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";

import {
  AlertTriangle,
  DollarSign,
  Edit2,
  Package,
  Plus,
  Trash2,
} from "lucide-react";
import StatsCard from "../components/StatsCard";
import AddProductDrawer from "../components/drawers/AddProductDrawer";
import { formatPrice } from "@/helpers/Price";
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [OpenAdd, setOpenAdd] = useState(false);
  const fetchProducts = async (page: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/product?page=${page}&limit=10`);
      if (!res.ok) throw new Error("خطا در دریافت محصولات");
      const data = await res.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
      toast.error("خطا در دریافت محصولات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  // Derived Stats
  const stats = useMemo(() => {
    return {
      total: products.length,
      value: products.reduce(
        (acc, p) => acc + Number(p.price) * Number(p.stock),
        0
      ),

      lowStock: products.filter((p) => p.stock < 5).length,
    };
  }, [products]);

  // Handlers
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این محصول اطمینان دارید؟")) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/admin/product/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("خطا در حذف محصول");

      toast.success("محصول با موفقیت حذف شد.");

      // حذف از UI بدون رفرش
      setProducts((prev) => prev.filter((p) => p._id !== id));

      // اگر بخواهی از سرور هم sync شود
      // router.refresh();
    } catch (err) {
      toast.error("❌ خطا در حذف محصول");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const closeDrawer = () => setOpenAdd(false);

  return (
    <div className="min-h-screen bg-gray-50 text-right">
      <main className="p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">لیست محصولات</h1>
            <p className="mt-1 text-sm text-gray-500">
              مدیریت موجودی و قیمت‌گذاری محصولات فروشگاه
            </p>
          </div>
          <button
            onClick={() => setOpenAdd(true)}
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm hover:shadow-md"
          >
            <Plus className="h-5 w-5" />
            افزودن محصول جدید
          </button>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="کل محصولات"
            value={new Intl.NumberFormat("fa-IR").format(stats.total)}
            icon={Package}
            color="blue"
            trend="+12%"
          />
          <StatsCard
            title="ارزش موجودی"
            value={`${formatPrice(stats.value)} تومان`}
            icon={DollarSign}
            color="green"
            trend="+5%"
          />
          <StatsCard
            title="موجودی کم"
            value={new Intl.NumberFormat("fa-IR").format(stats.lowStock)}
            icon={AlertTriangle}
            color="amber"
          />
          {/* <StatsCard
            title="محصولات فعال"
            value={new Intl.NumberFormat("fa-IR").format(stats.active)}
            icon={CheckCircle2}
            color="indigo"
          /> */}
        </div>

        {/* Table Card */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 font-medium text-gray-500">محصول</th>
                  <th className="px-6 py-4 font-medium text-gray-500">
                    دسته‌بندی
                  </th>
                  <th className="px-6 py-4 font-medium text-gray-500">وضعیت</th>
                  <th className="px-6 py-4 font-medium text-gray-500">قیمت</th>
                  <th className="px-6 py-4 font-medium text-gray-500">
                    موجودی
                  </th>
                  <th className="px-6 py-4 font-medium text-gray-500">
                    آخرین بروزرسانی
                  </th>
                  <th className="px-6 py-4 font-medium text-gray-500">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading
                  ? Array.from({ length: 5 }).map((_, idx) => (
                      <tr key={idx} className="border-b border-gray-100">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <td key={i} className="px-4 py-3 text-center">
                            <Skeleton
                              width={100}
                              height={20}
                              baseColor="#dbeafe"
                              highlightColor="#bfdbfe"
                              borderRadius={8}
                            />
                          </td>
                        ))}
                      </tr>
                    ))
                  : products.map((product) => (
                      <tr
                        key={product._id}
                        className="group hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Image
                              src={product.mainImage}
                              alt={product.title}
                              width={50}
                              height={50}
                              className="h-10 w-10 rounded-lg object-cover ring-1 ring-gray-100"
                            />
                            <span className="font-medium text-gray-900">
                              {product.title}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {product.category?.parent?.name ?? "مادر"} /{" "}
                          {product.category?.name ?? "—"}
                        </td>

                        <td className="px-6 py-4"></td>

                        <td className="px-6 py-4 font-medium text-gray-900">
                          {formatPrice(product.price)} تومان
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100">
                              <div
                                className={`h-full rounded-full ${
                                  product.stock < 10
                                    ? "bg-amber-500"
                                    : "bg-green-500"
                                }`}
                                style={{
                                  width: `${Math.min(product.stock * 2, 100)}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs">{product.stock} عدد</span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-gray-500">
                          {new Date(product.updatedAt).toLocaleDateString(
                            "fa-IR"
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="rounded-lg p-2 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                              title="ویرایش"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                              title="حذف"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Pagination (Visual only) */}
          <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
            <span className="text-sm text-gray-500">
              نمایش 1 تا {products.length} از {products.length} نتیجه
            </span>
            <div className="flex gap-2">
              <button
                className="rounded-lg border border-gray-200 px-3 py-1 text-sm text-gray-600 disabled:opacity-50"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                قبلی
              </button>
              <button
                className="rounded-lg border border-gray-200 px-3 py-1 text-sm text-gray-600 disabled:opacity-50"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                بعدی
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <AddProductDrawer
          onClose={() => setIsModalOpen(false)}
          onUpdated={(updatedProduct) => {
            setProducts((prev) =>
              prev.map((p) =>
                p._id === updatedProduct._id ? updatedProduct : p
              )
            );
          }}
          product={selectedProduct}
        />
      )}
      {OpenAdd && (
        <AddProductDrawer
          onClose={closeDrawer}
          onSave={(newProduct) => setProducts((prev) => [...prev, newProduct])}
        />
      )}
    </div>
  );
}
