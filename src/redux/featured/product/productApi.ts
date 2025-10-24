// Dressen-home/src/redux/featured/product/productApi.ts

/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";
import type { IProduct } from "@/types/product";

// --- Common API response shape ---
interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
}

// --- Helpers ---
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const isNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

// createdAt সেফলি পড়ে ms টাইমস্ট্যাম্প বের করি (ভিন্ন ফিল্ড হলে এখানেই যোগ করুন)
const getCreatedAtMs = (p: any): number => {
  const raw = p?.createdAt ?? p?.created_at ?? p?.createdOn ?? p?.date ?? null;
  if (!raw) return 0;
  const t = new Date(raw).getTime();
  return Number.isFinite(t) ? t : 0;
};

// আজকের শুরু/শেষ (লোকাল টাইম)
const getTodayBounds = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { startMs: start.getTime(), endMs: end.getTime() };
};

// --- Dynamic filters ---
const dynamicProductFilter = (
  products: IProduct[],
  queryType: string
): IProduct[] => {
  let result = [...products];

  if (queryType === "discount") {
    result = result.filter(
      (p) =>
        isNumber(p.productInfo?.salePrice) &&
        isNumber(p.productInfo?.price) &&
        (p.productInfo!.salePrice as number) < (p.productInfo!.price as number)
    );
  } else if (queryType === "deal") {
    // ✅ আজকের যোগ করা পণ্যগুলোই রাখি
    const { startMs, endMs } = getTodayBounds();

    result = result.filter((p) => {
      const t = getCreatedAtMs(p);
      return t >= startMs && t <= endMs;
    });

    // newest first
    result.sort((a, b) => getCreatedAtMs(b) - getCreatedAtMs(a));

    // ফাঁকা হলে fallback: সর্বশেষ ১০টা
    if (result.length === 0) {
      result = [...products]
        .sort((a, b) => getCreatedAtMs(b) - getCreatedAtMs(a))
        .slice(0, 10);
    }
  } else if (queryType === "reviews") {
    if (result.some((p) => isNumber((p as any).rating))) {
      result = result.sort(
        (a, b) =>
          Number((b as any).rating || 0) - Number((a as any).rating || 0)
      );
    } else {
      result = shuffleArray(result);
    }
  }

  return result.slice(0, 10);
};

// --- API ---
export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query<IProduct[], { page?: number }>({
      query: ({ page = 1 } = {}) => ({ url: `/product?page=${page}`, method: "GET" }),
      transformResponse: (res: ApiResponse<IProduct[]>) => res.data,
      providesTags: (result) =>
        result
          ? [
              { type: "Product" as const, id: "LIST" },
              ...result.map((p) => ({ type: "Product" as const, id: p._id })),
            ]
          : [{ type: "Product" as const, id: "LIST" }],
      keepUnusedDataFor: 60,
    }),

    getSingleProduct: builder.query<IProduct, string>({
      query: (id) => ({ url: `/product/${id}`, method: "GET" }),
      transformResponse: (res: ApiResponse<IProduct>) => res.data,
      providesTags: (_res, _err, id) => [{ type: "Product" as const, id }],
    }),

    createProduct: builder.mutation<IProduct, Partial<IProduct>>({
      query: (data) => ({
        url: "/product/create-product",
        method: "POST",
        body: data,
      }),
      transformResponse: (res: ApiResponse<IProduct>) => res.data,
      invalidatesTags: [{ type: "Product" as const, id: "LIST" }],
    }),

    updateProduct: builder.mutation<
      IProduct,
      { id: string; body: Partial<IProduct> }
    >({
      query: ({ id, body }) => ({
        url: `/product/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (res: ApiResponse<IProduct>) => res.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Product" as const, id },
        { type: "Product" as const, id: "LIST" },
      ],
    }),

    // ✅ Discounted
    getDiscountedProducts: builder.query<IProduct[], void>({
      query: () => ({ url: "/product", method: "GET" }),
      transformResponse: (res: ApiResponse<IProduct[]>) =>
        dynamicProductFilter(res.data, "discount"),
      providesTags: (result) =>
        result
          ? [
              { type: "Product" as const, id: "DISCOUNT_LIST" },
              ...result.map((p) => ({ type: "Product" as const, id: p._id })),
            ]
          : [{ type: "Product" as const, id: "DISCOUNT_LIST" }],
      keepUnusedDataFor: 15,
    }),

    // ✅ Today's Deal (লোকাল টাইমে "আজ" ফিল্টার)
    getTodaysDeals: builder.query<IProduct[], void>({
      // ব্যাকএন্ডে ?deal=today দরকার নেই—শুধু /product নিলেই হবে
      query: () => ({ url: "/product", method: "GET" }),
      transformResponse: (res: ApiResponse<IProduct[]>) =>
        dynamicProductFilter(res.data, "deal"),
      providesTags: (result) =>
        result
          ? [
              { type: "Product" as const, id: "DEAL_LIST" },
              ...result.map((p) => ({ type: "Product" as const, id: p._id })),
            ]
          : [{ type: "Product" as const, id: "DEAL_LIST" }],
      keepUnusedDataFor: 15,
    }),

    // ✅ Top Reviewed
    getTopReviewedProducts: builder.query<IProduct[], void>({
      query: () => ({ url: "/product", method: "GET" }),
      transformResponse: (res: ApiResponse<IProduct[]>) =>
        dynamicProductFilter(res.data, "reviews"),
      providesTags: (result) =>
        result
          ? [
              { type: "Product" as const, id: "REVIEW_LIST" },
              ...result.map((p) => ({ type: "Product" as const, id: p._id })),
            ]
          : [{ type: "Product" as const, id: "REVIEW_LIST" }],
      keepUnusedDataFor: 15,
    }),


  }),

  overrideExisting: false,
});

export const {
  useGetAllProductsQuery,
  useGetSingleProductQuery,
  useLazyGetSingleProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetDiscountedProductsQuery,
  useGetTodaysDealsQuery,
  useGetTopReviewedProductsQuery,
} = productApi;
