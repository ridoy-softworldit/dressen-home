/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { selectCartItems } from "@/redux/featured/cart/cartSlice";
import {
  clearCart,
  removeFromCart,
  updateCartItemQuantity,
} from "@/redux/featured/cart/cartSlice";
import { useCreateOrderMutation } from "@/redux/featured/order/orderApi";
import { useGetAllProductsQuery } from "@/redux/featured/product/productApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Shield,
  Truck,
  Minus,
  Plus,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

// Local types
type OrderStatus =
  | "pending"
  | "processing"
  | "at-local-facility"
  | "out-for-delivery"
  | "cancelled"
  | "completed";

type ShippingType = "amount" | "percentage";

interface ShippingInfo {
  name: string;
  type: ShippingType;
}

interface LineTotals {
  subTotal: number;
  discount: number;
  total: number;
  shipping: ShippingInfo;
}

interface OrderLine {
  productInfo: string;
  trackingNumber: string;
  quantity: number;
  status: OrderStatus;
  isCancelled: boolean;
  totalAmount: LineTotals;
  commission: { type: string; value: number; amount: number };
}

type OrderInfo = OrderLine[];

interface CustomerInfo {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  country: string;
}

type CashOn = "cash-on";

type PaymentInfo = CashOn | "bkash" | "nagad";

interface _IOrder {
  _id: string;
  orderInfo: OrderInfo;
  customerInfo?: CustomerInfo | string;
  paymentInfo?: PaymentInfo;
  totalAmount: number | LineTotals;
  createdAt: string;
  updatedAt?: string;
}

interface CreateOrderInput {
  orderInfo: OrderLine[];
  customerInfo: CustomerInfo;
  paymentInfo?: PaymentInfo;
  totalAmount: number;
}

import { CartItem } from "@/redux/featured/cart/cartSlice";

// -------------------- small helpers (type-safe) --------------------
const num = (v: unknown, d = 0): number => {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : d;
};

const makeTracking = (): string => {
  const token =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `TRK-${token.toUpperCase()}`;
};

type ProductLite = {
  _id: string;
  shopId: string;
  featuredImg?: string;
  description?: { name?: string };
  productInfo?: { price?: number; salePrice?: number };
};

export default function CheckoutPage() {
  const cartItems = useAppSelector(selectCartItems);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const [createOrder] = useCreateOrderMutation();
  const { data: productsData } = useGetAllProductsQuery();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [createOrderLoading, setCreateOrderLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bkash" | "nagad">(
    "cod"
  );
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    country: "Bangladesh",
  });

  const subTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.totalAmount, 0);
  }, [cartItems]);

  const finalTotal = subTotal - (promoApplied ? 5 : 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (formErrors[id]) {
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  const handleQtyChange = (productId: string, dir: "inc" | "dec") => {
    const item = cartItems.find((i) => i.productId === productId);
    if (!item) return;

    if (dir === "inc" || item.quantity > 1) {
      const newQty = item.quantity + (dir === "inc" ? 1 : -1);
      dispatch(updateCartItemQuantity({ productId, quantity: newQty }));
    }
  };

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
    toast.success("Item removed from cart");
  };

  const validateShippingForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.phone.trim()) errors.phone = "Phone is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePaymentForm = () => {
    return true; // No form validation needed for these methods
  };

  const applyPromoCode = () => {
    if (promoCode.trim()) {
      setPromoApplied(true);
      toast.success("Promo code applied!");
    } else {
      toast.error("Please enter a valid promo code.");
    }
  };

  const clearCarts = () => {
    dispatch(clearCart());
  };

  const buildOrderPayload = (): CreateOrderInput | null => {
    const lines = cartItems
      .map((it) => {
        const pidStr = it.productId;
        const p = productsData?.find((pr) => pr._id === pidStr);
        if (!p || !pidStr) {
          return null;
        }
        const lineSub = it.totalAmount;
        const lineTotal = lineSub;
        const orderLine = {
          productInfo: pidStr,
          trackingNumber: makeTracking(),
          status: "pending",
          isCancelled: false,
          quantity: num(it.quantity, 0),
          totalQuantity: num(it.quantity, 0),
          orderBy: "507f1f77bcf86cd799439011",
          totalAmount: {
            subTotal: lineSub,
            discount: 0,
            total: lineTotal,
            shipping: { name: "Free Shipping", type: "amount" },
          },
          commission: { type: "fixed", value: 5, amount: 0 },
        } as OrderLine;
        return orderLine;
      })
      .filter((line) => !!line) as OrderLine[];

    if (lines.length === 0) {
      toast.error("No valid items in cart.");
      return null;
    }

    let grandTotal = lines.reduce(
      (sum, l) => sum + num(l?.totalAmount?.total ?? 0),
      0
    );
    if (promoApplied) {
      grandTotal -= 5;
    }

    const payload: CreateOrderInput = {
      orderInfo: lines,
      customerInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        country: "Bangladesh",
      },
      paymentInfo: paymentMethod === "cod" ? "cash-on" : paymentMethod,
      totalAmount: grandTotal,
    };
    return payload;
  };

  const handlePlaceOrder = async () => {
    if (!validateShippingForm() || !validatePaymentForm()) {
      setCurrentStep(1);
      toast.error("Please fill in all required fields.");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Please add items to proceed.");
      return;
    }
    const finalOrder = buildOrderPayload();
    if (!finalOrder) return;
    try {
      setCreateOrderLoading(true);
      const response = await createOrder(finalOrder as any).unwrap();
      clearCarts();
      setCurrentStep(1);
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        country: "Bangladesh",
      });
      toast.success("Order placed successfully!");
    } catch (error) {

      toast.error(
        (error as any)?.data?.message || "Failed to place order. Please try again."
      );
    } finally {
      setCreateOrderLoading(false);
    }
  };

  const handleBackToShipping = () => setCurrentStep(1);
  const handleBackToPayment = () => setCurrentStep(2);
  const handleBackClick = () => {
    if (currentStep === 2) handleBackToShipping();
    if (currentStep === 3) handleBackToPayment();
  };

  const handleNextStepOrSubmit = () => {
    if (currentStep === 1) {
      if (validateShippingForm()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validatePaymentForm()) setCurrentStep(3);
    } else if (currentStep === 3) {
      handlePlaceOrder();
    }
  };

  const nextCtaText =
    currentStep === 1
      ? "Continue to Payment"
      : currentStep === 2
      ? "Review Order"
      : "Place Order";

  // ---------- UI (unchanged structure) ----------
  return (
    <div className="min-h-screen bg-[#FFFFFF] py-4 md:py-8">
      <div className="w-full px-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
            Complete Your Order
          </h1>
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-6 md:mb-8">
            <div className="flex flex-col items-center w-24 md:w-32">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 1
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep > 1 ? <Check className="w-5 h-5" /> : "1"}
              </div>
              <span
                className={`mt-2 text-xs md:text-sm ${
                  currentStep >= 1
                    ? "text-orange-500 font-medium"
                    : "text-gray-500"
                }`}
              >
                Shipping
              </span>
            </div>
            <div
              className={`w-8 md:w-16 h-1 ${
                currentStep >= 2 ? "bg-orange-500" : "bg-gray-300"
              }`}
            />
            <div className="flex flex-col items-center w-24 md:w-32">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 2
                    ? "bg-orange-500 text-white"
                    : currentStep === 2
                    ? "border-2 border-orange-500 text-orange-500 bg-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep > 2 ? <Check className="w-5 h-5" /> : "2"}
              </div>
              <span
                className={`mt-2 text-xs md:text-sm ${
                  currentStep >= 2
                    ? "text-orange-500 font-medium"
                    : "text-gray-500"
                }`}
              >
                Payment
              </span>
            </div>
            <div
              className={`w-8 md:w-16 h-1 ${
                currentStep >= 3 ? "bg-orange-500" : "bg-gray-300"
              }`}
            />
            <div className="flex flex-col items-center w-24 md:w-32">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 3
                    ? "bg-orange-500 text-white"
                    : currentStep === 3
                    ? "border-2 border-orange-500 text-orange-500 bg-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                3
              </div>
              <span
                className={`mt-2 text-xs md:text-sm ${
                  currentStep >= 3
                    ? "text-orange-500 font-medium"
                    : "text-gray-500"
                }`}
              >
                Review
              </span>
            </div>
          </div>
        </div>
        {/* Main Grid Wrapped in Form */}
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 md:gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
              {currentStep === 1 ? (
                <>
                  {/* Cart Items */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">Your Items</h3>
                    {cartItems.length > 0 ? (
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {cartItems.map((item) => (
                          <div
                            key={item.productId}
                            className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                              <div className="w-10 h-10 relative rounded overflow-hidden">
                                <Image
                                  src={item.productImage}
                                  alt={item.productName}
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                  unoptimized
                                />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {item.productName}
                              </p>
                              <p className="text-xs text-gray-600">
                                ৳{item.unitPrice.toFixed(2)} each
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleQtyChange(item.productId, "dec")
                                }
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-8 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleQtyChange(item.productId, "inc")
                                }
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="text-right ml-4">
                              <p className="text-sm font-medium text-gray-900">
                                ৳{item.totalAmount.toFixed(2)}
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.productId)}
                              className="ml-auto"
                            >
                              <X className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No items in cart</p>
                    )}
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                      <Truck className="w-4 h-4 text-orange-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Shipping Information
                    </h2>
                  </div>
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* First Name */}
                      <div>
                        <Label
                          htmlFor="firstName"
                          className="text-sm font-medium"
                        >
                          First Name
                        </Label>
                        <Input
                          required
                          id="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`mt-1 ${
                            formErrors.firstName ? "border-red-500" : ""
                          }`}
                        />
                        {formErrors.firstName && (
                          <p className="mt-1 text-xs text-red-500">
                            {formErrors.firstName}
                          </p>
                        )}
                      </div>
                      {/* Last Name */}
                      <div>
                        <Label
                          htmlFor="lastName"
                          className="text-sm font-medium"
                        >
                          Last Name
                        </Label>
                        <Input
                          required
                          id="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`mt-1 ${
                            formErrors.lastName ? "border-red-500" : ""
                          }`}
                        />
                        {formErrors.lastName && (
                          <p className="mt-1 text-xs text-red-500">
                            {formErrors.lastName}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Phone */}
                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium">
                          Phone
                        </Label>
                        <Input
                          required
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`mt-1 ${
                            formErrors.phone ? "border-red-500" : ""
                          }`}
                        />
                        {formErrors.phone && (
                          <p className="mt-1 text-xs text-red-500">
                            {formErrors.phone}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* Address */}
                    <div>
                      <Label htmlFor="address" className="text-sm font-medium">
                        Address
                      </Label>
                      <Input
                        required
                        id="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`mt-1 ${
                          formErrors.address ? "border-red-500" : ""
                        }`}
                      />
                      {formErrors.address && (
                        <p className="mt-1 text-xs text-red-500">
                          {formErrors.address}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              ) : currentStep === 2 ? (
                <>
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                      <Truck className="w-4 h-4 text-orange-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Payment Information
                    </h2>
                  </div>
                  {/* payment method */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div
                      onClick={() => setPaymentMethod("cod")}
                      className={`rounded-lg border p-4 cursor-pointer transition-all duration-200 relative ${
                        paymentMethod === "cod"
                          ? "border-orange-500 ring-2 ring-orange-200"
                          : "border-gray-300 hover:border-orange-400"
                      }`}
                    >
                      <div className="flex items-center">
                        <Truck className="w-5 h-5 mr-3 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-800">
                            Cash on Delivery
                          </p>
                          <p className="text-xs text-gray-500">
                            Pay when you receive
                          </p>
                        </div>
                      </div>
                      {paymentMethod === "cod" && (
                        <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-orange-500" />
                      )}
                    </div>
                    <div
                      onClick={() => setPaymentMethod("bkash")}
                      className={`rounded-lg border p-4 cursor-pointer transition-all duration-200 relative ${
                        paymentMethod === "bkash"
                          ? "border-orange-500 ring-2 ring-orange-200"
                          : "border-gray-300 hover:border-orange-400"
                      }`}
                    >
                      <div className="flex items-center">
                        <Truck className="w-5 h-5 mr-3 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-800">bKash</p>
                          <p className="text-xs text-gray-500">
                            Mobile Payment
                          </p>
                        </div>
                      </div>
                      {paymentMethod === "bkash" && (
                        <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-orange-500" />
                      )}
                    </div>
                    <div
                      onClick={() => setPaymentMethod("nagad")}
                      className={`rounded-lg border p-4 cursor-pointer transition-all duration-200 relative ${
                        paymentMethod === "nagad"
                          ? "border-orange-500 ring-2 ring-orange-200"
                          : "border-gray-300 hover:border-orange-400"
                      }`}
                    >
                      <div className="flex items-center">
                        <Truck className="w-5 h-5 mr-3 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-800">Nagad</p>
                          <p className="text-xs text-gray-500">
                            Mobile Payment
                          </p>
                        </div>
                      </div>
                      {paymentMethod === "nagad" && (
                        <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-orange-500" />
                      )}
                    </div>
                  </div>
                  {paymentMethod === "cod" && (
                    <div className="rounded-lg border bg-gray-50 p-6 text-center animate-in fade-in duration-300">
                      <Truck className="w-8 h-8 mx-auto text-gray-500 mb-2" />
                      <p className="text-sm font-medium text-gray-800">
                        You will pay in cash upon delivery.
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Please have the exact amount ready.
                      </p>
                    </div>
                  )}
                  {paymentMethod === "bkash" && (
                    <div className="rounded-lg border bg-gray-50 p-6 text-center animate-in fade-in duration-300">
                      <Truck className="w-8 h-8 mx-auto text-gray-500 mb-2" />
                      <p className="text-sm font-medium text-gray-800 mb-2">
                        bKash Number: 01712345678
                      </p>
                      <p className="text-xs text-gray-500">
                        Send money to this number and call admin at 01812345678
                        to confirm your payment.
                      </p>
                    </div>
                  )}
                  {paymentMethod === "nagad" && (
                    <div className="rounded-lg border bg-gray-50 p-6 text-center animate-in fade-in duration-300">
                      <Truck className="w-8 h-8 mx-auto text-gray-500 mb-2" />
                      <p className="text-sm font-medium text-gray-800 mb-2">
                        Nagad Number: 01912345678
                      </p>
                      <p className="text-xs text-gray-500">
                        Send money to this number and call admin at 01812345678
                        to confirm your payment.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Review Your Order
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Please confirm all details before placing your order
                    </p>
                  </div>
                  <div className="space-y-6">
                    {/* Shipping Information */}
                    <div className="border rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        <Truck className="w-4 h-4 mr-2 text-orange-500" />
                        Shipping Information
                      </h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{`${formData.firstName} ${formData.lastName}`}</p>
                        <p>{formData.address}</p>
                        <p>{formData.phone}</p>
                        <p>{formData.country}</p>
                      </div>
                      <Button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        variant="link"
                        className="text-orange-500 p-0 h-auto text-xs mt-2"
                      >
                        Edit shipping information
                      </Button>
                    </div>
                    {/* Payment Method */}
                    <div className="border rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        <Truck className="w-4 h-4 mr-2 text-orange-500" />
                        Payment Method
                      </h3>
                      {paymentMethod === "cod" ? (
                        <div className="text-sm text-gray-700">
                          Cash on delivery
                        </div>
                      ) : paymentMethod === "bkash" ? (
                        <div className="text-sm text-gray-700">
                          bKash Mobile Payment
                        </div>
                      ) : (
                        <div className="text-sm text-gray-700">
                          Nagad Mobile Payment
                        </div>
                      )}
                      <Button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        variant="link"
                        className="text-orange-500 p-0 h-auto text-xs mt-2"
                      >
                        Edit payment method
                      </Button>
                    </div>
                    {/* Items */}
                    <div className="border rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        Order Items
                      </h3>
                      <div className="max-h-[200px] overflow-y-auto space-y-3">
                        {cartItems.length > 0
                          ? cartItems.map((item: CartItem, index: number) => {
                              const title = item.productName ?? "Product";
                              const lineTotal = item.totalAmount;
                              const img =
                                item.productImage ?? "/placeholder.svg";
                              return (
                                <div
                                  key={`${item.productId}-${index}`}
                                  className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                                >
                                  <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <div className="w-10 h-10 relative rounded overflow-hidden">
                                      <Image
                                        src={img}
                                        alt={title}
                                        fill
                                        className="object-cover"
                                        sizes="40px"
                                        unoptimized={img.startsWith("http")}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {title}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                      Qty: {num(item.quantity, 1)}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">
                                      ৳{lineTotal.toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              );
                            })
                          : "No items in the cart"}
                      </div>
                    </div>
                  </div>
                </>
              )}
              {/* desktop actions */}
              <div className="mt-6 hidden md:flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackClick}
                  className="bg-transparent text-gray-700 border-gray-300 h-10 px-4 text-sm"
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {currentStep === 2 ? "Back to Shipping" : "Back to Payment"}
                </Button>
                <Button
                  type="button"
                  onClick={handleNextStepOrSubmit}
                  className="bg-orange-500 hover:bg-orange-600 h-10 px-5 text-sm"
                  disabled={createOrderLoading || cartItems.length === 0}
                >
                  {createOrderLoading ? `Creating Order...` : nextCtaText}
                  {currentStep < 3 && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </div>
            {/* Right Column - Order Summary */}
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 h-fit lg:sticky lg:top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 md:mb-6 pb-3 border-b">
                Order Summary
              </h2>
              <div className="space-y-3 mb-4 md:mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">৳{subTotal.toFixed(2)}</span>
                </div>

                {promoApplied && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">-৳5.00</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between font-medium">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">
                      ৳{finalTotal.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Including VAT</p>
                </div>
              </div>
              {/* Security Badge */}
              <div className="flex items-center justify-center space-x-2 mb-4 p-3 bg-gray-50 rounded-lg">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-xs text-gray-600">
                  Secure SSL encrypted checkout
                </span>
              </div>

              {/* Promo Code */}
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-900 mb-2">
                  Have a promo code?
                </p>
                <div className="flex flex-col md:flex-row gap-2">
                  <Input
                    placeholder="Enter code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1"
                    disabled={promoApplied}
                  />
                  <Button
                    type="button"
                    onClick={applyPromoCode}
                    className="bg-gray-800 hover:bg-gray-900 h-11 md:h-12 w-full md:w-auto"
                    disabled={promoApplied}
                  >
                    {promoApplied ? "Applied" : "Apply"}
                  </Button>
                </div>
                {/* Mobile controls */}
                <div className="mt-4 flex justify-end flex-col md:hidden gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBackClick}
                    className="bg-transparent text-gray-700 border-gray-300 h-12 w-full"
                    disabled={currentStep === 1}
                  >
                    <ArrowLeft className=" mr-2" />
                    {currentStep === 2 ? "Back to Shipping" : "Back to Payment"}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNextStepOrSubmit}
                    className="bg-orange-500 hover:bg-orange-600 px-6 py-2 h-12 w-full"
                    disabled={createOrderLoading || cartItems.length === 0}
                  >
                    {createOrderLoading ? `Creating Order...` : nextCtaText}
                    {currentStep < 3 && <ArrowRight className=" ml-2" />}
                  </Button>
                </div>
              </div>
            </div>
            {/* End Right Column */}
          </div>
        </form>
      </div>
    </div>
  );
}