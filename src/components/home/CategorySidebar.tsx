"use client";

import Link from "next/link";
import { useGetAllCategoryQuery } from "@/redux/featured/category/categoryApi";

type RemoteSubCategory = { _id?: string; slug?: string; name?: string };
type RemoteCategory = {
  _id?: string; slug?: string; name?: string;
  subCategories?: RemoteSubCategory[];
};

type UICategory = {
  id: string;
  label: string;
  children?: { id: string; label: string }[];
};

export default function CategorySidebar() {
  const { data: remoteCats, isSuccess } = useGetAllCategoryQuery();

  const cats: UICategory[] =
    isSuccess && Array.isArray(remoteCats) && remoteCats.length
      ? (remoteCats as RemoteCategory[]).map((c) => ({
          id: c.slug ?? c._id ?? "",
          label: c.name ?? "Category",
          children: (c.subCategories ?? []).map((sc) => ({
            id: sc.slug ?? sc._id ?? "",
            label: sc.name ?? "Subcategory",
          })),
        }))
      : [];

  return (
    <aside className="hidden md:block md:col-span-3 lg:col-span-2">
      <div className="border rounded-lg overflow-hidden h-44 sm:h-56 md:h-64 lg:h-80 xl:h-96">
        <div className="px-3 bg-[#facf35] py-2 font-medium border-b text-[#2e2e2e]">Categories</div>
        <ul className="divide-y">
          {cats.map((c) => (
            <li key={c.id} className="text-sm">
              <Link href={`/category?slug=${encodeURIComponent(c.id)}`} className="block px-3 py-2 hover:bg-gray-50">
                {c.label}
              </Link>
              {!!c.children?.length && (
                <ul className="ml-4 border-l">
                  {c.children.map((sc) => (
                    <li key={sc.id}>
                      <Link
                        href={`/category?slug=${encodeURIComponent(sc.id)}`}
                        className="block px-3 py-1.5 hover:bg-gray-50 text-[13px]"
                      >
                        {sc.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
