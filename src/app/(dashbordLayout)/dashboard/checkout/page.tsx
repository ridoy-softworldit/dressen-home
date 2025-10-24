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
import { useGetAllCouponsQuery } from "@/redux/featured/coupons/couponApi";
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
  Copy,
  Tag,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

// Local types
type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

interface ShippingInfo {
  name: string;
  type: "amount" | "percentage";
}

interface ProductInOrder {
  product: string;
  shop: string;
  name: string;
  sku: string;
  price: number;
  salePrice: number;
  retailPrice: number;
  wholeSalePrice: number;
  quantity: number;
  variant?: string;
  subtotal: number;
}

interface OrderItemTotalAmount {
  subTotal: number;
  tax: number;
  shipping: ShippingInfo;
  discount: number;
  total: number;
}

interface Commission {
  isAddedToBalance: boolean;
  type: "percentage" | "fixed";
  value: number;
  amount: number;
}

interface OrderItem {
  user: number;
  productInfo: string;
  isCancelled: boolean;
  quantity: number;
  selectedPrice: number;
  products: ProductInOrder[];
  totalAmount: OrderItemTotalAmount;
  commission: Commission;
}

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  address: string;
  city?: string;
  postalCode?: string;
  country: string;
}

interface PaymentInfo {
  cardNumber?: string;
  expireDate?: string;
  cvc?: string;
  nameOnCard?: string;
}

interface CreateOrderInput {
  orderBy: string;
  userRole: "customer";
  status: OrderStatus;
  isCancelled: boolean;
  totalQuantity: number;
  orderInfo: OrderItem[];
  customerInfo: CustomerInfo;
  paymentInfo: PaymentInfo | string;
  totalAmount: number;
  orderNote?: string;
}

import { CartItem } from "@/redux/featured/cart/cartSlice";
import { TCoupon } from "@/redux/featured/coupons/couponSlice";

type Coupon = TCoupon;

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
  const { data: productsData } = useGetAllProductsQuery({ page: 1 });
  const { data: couponsData } = useGetAllCouponsQuery();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [promoCode, setPromoCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [createOrderLoading, setCreateOrderLoading] = useState(false);
  const [showThanksModal, setShowThanksModal] = useState(false);
  const [orderId, setOrderId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bkash" | "nagad">(
    "cod"
  );
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Bangladesh",
  });

  const subTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.totalAmount, 0);
  }, [cartItems]);

  const calculateDiscount = () => {
    if (!appliedCoupon) return { discount: 0, shipping: 0 };
    
    if (appliedCoupon.type === "free-shipping") {
      return { discount: 0, shipping: 0 }; // Free shipping
    } else if (appliedCoupon.type === "percentage") {
      return { discount: (subTotal * appliedCoupon.discountAmount) / 100, shipping: 0 };
    } else if (appliedCoupon.type === "fixed") {
      return { discount: appliedCoupon.discountAmount, shipping: 0 };
    }
    return { discount: 0, shipping: 0 };
  };

  const { discount } = calculateDiscount();
  const finalTotal = subTotal - discount;

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
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePaymentForm = () => {
    return true; // No form validation needed for these methods
  };

  const applyPromoCode = () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code.");
      return;
    }

    const coupon = couponsData?.find(
      (c: Coupon) => c.code.toLowerCase() === promoCode.toLowerCase() && c.isApproved
    );

    if (!coupon) {
      toast.error("Invalid or expired promo code.");
      return;
    }

    if (subTotal < coupon.minimumPurchaseAmount) {
      toast.error(`Minimum purchase amount is ৳${coupon.minimumPurchaseAmount}`);
      return;
    }

    setAppliedCoupon(coupon);
    toast.success(`Coupon "${coupon.code}" applied successfully!`);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setPromoCode("");
    toast.success("Coupon removed");
  };

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setPromoCode(code);
    toast.success("Coupon code copied!");
  };

  const clearCarts = () => {
    dispatch(clearCart());
  };

  const buildOrderPayload = (): CreateOrderInput | null => {
    const orderItems = cartItems
      .map((it) => {
        const pidStr = it.productId;
        const p = productsData?.find((pr) => pr._id === pidStr);
        if (!p || !pidStr) {
          return null;
        }
        
        const itemSubTotal = it.totalAmount;
        const tax = 0;
        const discount = 0;
        const itemTotal = itemSubTotal + tax - discount;
        
        const orderItem = {
          user: 1,
          productInfo: pidStr,
          isCancelled: false,
          quantity: num(it.quantity, 1),
          selectedPrice: it.unitPrice,
          totalAmount: {
            subTotal: itemSubTotal,
            tax,
            shipping: { name: "Standard Shipping", type: "amount" as const },
            discount,
            total: itemTotal
          },
          commission: {
            isAddedToBalance: false,
            type: "percentage" as const,
            value: 5,
            amount: itemTotal * 0.05
          },
          products: []
        };
        return orderItem;
      })
      .filter((item) => !!item);

    if (orderItems.length === 0) {
      toast.error("No valid items in cart.");
      return null;
    }

    const totalQuantity = orderItems.reduce((sum, item) => sum + item.quantity, 0);
    let grandTotal = orderItems.reduce((sum, item) => sum + item.totalAmount.total, 0);
    
    if (appliedCoupon) {
      if (appliedCoupon.type === "percentage") {
        grandTotal -= (grandTotal * appliedCoupon.discountAmount) / 100;
      } else if (appliedCoupon.type === "fixed") {
        grandTotal -= appliedCoupon.discountAmount;
      }
    }

    const payload: CreateOrderInput = {
      orderBy: "507f1f77bcf86cd799439011",
      userRole: "customer" as const,
      status: "pending" as const,
      isCancelled: false,
      totalQuantity,
      orderInfo: orderItems,
      customerInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        country: formData.country,
      },
      paymentInfo: "cash-on",
      totalAmount: grandTotal
    };
    return payload;
  };

  const handlePlaceOrder = async () => {
    if (!validateShippingForm() || !validatePaymentForm()) {
      setCurrentStep(1);
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
      setAppliedCoupon(null);
      setPromoCode("");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        country: "Bangladesh",
      });
      // Generate order ID from response or create a tracking ID
      const generatedOrderId = response?._id || makeTracking();
      setOrderId(generatedOrderId);
      setShowThanksModal(true);
      
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
    <>
      {/* Thanks Modal */}
      {showThanksModal && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center shadow-2xl">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Order Placed Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your order has been placed successfully. We&apos;ll process it shortly.
            </p>
            
            {/* Order ID Section */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Order ID / Tracking ID</p>
              <div className="flex items-center justify-between bg-white border rounded-lg p-3">
                <span className="font-mono text-sm font-bold text-gray-900">{orderId}</span>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(orderId);
                    toast.success('Order ID copied to clipboard!');
                  }}
                  variant="outline"
                  size="sm"
                  className="ml-2"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Save this ID to track your order
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowThanksModal(false);
                  router.push('/product-listing');
                }}
                className="flex-1 bg-primary hover:bg-gray-300"
              >
                Continue Shopping
              </Button>
              <Button
                onClick={() => setShowThanksModal(false)}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      
    <div className="min-h-screen bg-[#FFFFFF] py-4 md:py-8">
      <div className="w-full px-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
            Complete Your Order
          </h1>
          {/* Progress Steps with Back Button */}
          <div className="relative flex items-center justify-center mb-6 md:mb-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/product-listing')}
              className="absolute left-0 hidden lg:flex items-center text-gray-600 hover:text-gray-800 border-gray-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shopping
            </Button>
            <div className="flex items-center">
            <div className="flex flex-col items-center w-24 md:w-32">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 1
                    ? "bg-primary text-[#2e2e2e]"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep > 1 ? <Check className="w-5 h-5" /> : "1"}
              </div>
              <span
                className={`mt-2 text-xs md:text-sm ${
                  currentStep >= 1
                    ? "text-secondary font-medium"
                    : "text-gray-500"
                }`}
              >
                Shipping
              </span>
            </div>
            <div
              className={`w-8 md:w-16 h-1 ${
                currentStep >= 2 ? "bg-primary" : "bg-gray-300"
              }`}
            />
            <div className="flex flex-col items-center w-24 md:w-32">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 2
                    ? "bg-primary text-[#2e2e2e]"
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
                    ? "text-secondary font-medium"
                    : "text-gray-500"
                }`}
              >
                Payment
              </span>
            </div>
            <div
              className={`w-8 md:w-16 h-1 ${
                currentStep >= 3 ? "bg-primary" : "bg-gray-300"
              }`}
            />
            <div className="flex flex-col items-center w-24 md:w-32">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 3
                    ? "bg-primary text-[#2e2e2e]"
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
                    ? "text-secondary font-medium"
                    : "text-gray-500"
                }`}
              >
                Review
              </span>
            </div>
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
                              {(item.size || item.color) && (
                                <p className="text-xs text-gray-500">
                                  {item.size && <span>Size: {item.size.toUpperCase()}</span>}
                                  {item.size && item.color && <span> • </span>}
                                  {item.color && <span>Color: {item.color}</span>}
                                </p>
                              )}
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
                        bKash Number: +8801909008004
                      </p>
                      <p className="text-xs text-gray-500">
                        Send money to this number and call admin at +8801909008004
                        to confirm your payment.
                      </p>
                    </div>
                  )}
                  {paymentMethod === "nagad" && (
                    <div className="rounded-lg border bg-gray-50 p-6 text-center animate-in fade-in duration-300">
                      <Truck className="w-8 h-8 mx-auto text-gray-500 mb-2" />
                      <p className="text-sm font-medium text-gray-800 mb-2">
                        Nagad Number: +8801909008004
                      </p>
                      <p className="text-xs text-gray-500">
                        Send money to this number and call admin at +8801909008004
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
                                      {(item.size || item.color) && (
                                        <span className="ml-2">
                                          {item.size && <span>• Size: {item.size.toUpperCase()}</span>}
                                          {item.size && item.color && <span> </span>}
                                          {item.color && <span>• Color: {item.color}</span>}
                                        </span>
                                      )}
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
                  className="bg-primary hover:bg-gray-300 h-10 px-5 text-sm"
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
                {/* <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div> */}
                {appliedCoupon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {appliedCoupon.type === "free-shipping" ? "Free Shipping" : "Discount"}
                    </span>
                    <span className="text-green-600">
                      {appliedCoupon.type === "free-shipping" 
                        ? "Free" 
                        : `-৳${discount.toFixed(2)}`}
                    </span>
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
              {/* Free Shipping Notice */}
              {/* <div className="rounded-lg bg-blue-50 p-3 mb-4">
                <p className="text-xs text-blue-800 flex items-center">
                  <Truck className="w-3 h-3 mr-1" />
                  Free shipping on orders over ৳50!
                </p>
              </div> */}
              {/* Available Coupons */}
              {couponsData && couponsData.length > 0 && (
                <div className="border-t pt-4 mb-4">
                  <p className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <Tag className="w-4 h-4 mr-2 text-orange-500" />
                    Available Coupons
                  </p>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {couponsData
                      .filter((coupon: Coupon) => coupon.isApproved)
                      .map((coupon: Coupon) => {
                        const isEligible = subTotal >= coupon.minimumPurchaseAmount;
                        const isExpired = new Date(coupon.expireDate) < new Date();
                        return (
                          <div
                            key={coupon._id}
                            className={`p-2 rounded-lg border text-xs ${
                              isEligible && !isExpired
                                ? "border-green-200 bg-green-50"
                                : "border-gray-200 bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-orange-600">
                                    {coupon.code}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyCouponCode(coupon.code)}
                                    className="h-5 w-5 p-0 hover:bg-orange-100"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                </div>
                                <p className="text-gray-600 mt-1">{coupon.description}</p>
                                <p className="text-gray-500 mt-1">
                                  {coupon.type === "free-shipping"
                                    ? "Free shipping"
                                    : coupon.type === "percentage"
                                    ? `${coupon.discountAmount}% off`
                                    : `৳${coupon.discountAmount} off`}
                                  {" • Min: ৳"}{coupon.minimumPurchaseAmount}
                                </p>
                              </div>
                              {!isEligible && (
                                <span className="text-red-500 text-xs">
                                  Need ৳{(coupon.minimumPurchaseAmount - subTotal).toFixed(2)} more
                                </span>
                              )}
                              {isExpired && (
                                <span className="text-red-500 text-xs">Expired</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
              
              {/* Promo Code */}
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-900 mb-2">
                  Apply Coupon Code
                </p>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        {appliedCoupon.code} Applied
                      </p>
                      <p className="text-xs text-green-600">
                        {appliedCoupon.description}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeCoupon}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className="flex-1 h-10"
                    />
                    <Button
                      type="button"
                      onClick={applyPromoCode}
                      className="bg-primary hover:bg-gray-400 h-10 w-full md:w-auto px-4"
                    >
                      Apply
                    </Button>
                  </div>
                )}
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
                  className="bg-primary hover:bg-orange-600 px-6 py-2 h-12 w-full"
                  disabled={createOrderLoading || cartItems.length === 0}
                >
                  {createOrderLoading ? `Creating Order...` : nextCtaText}
                  {currentStep < 3 && <ArrowRight className=" ml-2" />}
                </Button>
              </div>
            </div>
            {/* End Right Column */}
          </div>
        </form>
      </div>
    </div>
    </>
  );
}