"use client";

import { useSession } from "next-auth/react";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/featured/auth/authSlice";
import AuthGuard from "@/components/shared/AuthGuard";

export default function DashboardPage() {
  const { data: session } = useSession();
  const currentUser = useAppSelector(selectCurrentUser);

  const user = session?.user || currentUser;
  const displayName = user?.name || user?.email?.split("@")[0] || "User";

  return (
    // ক্লায়েন্ট-গার্ড: লগইন না থাকলে লগইনে পাঠাই
    <AuthGuard>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Welcome, {displayName} 👋</h1>
        <p className="text-gray-600">
          This is your dashboard. From here you can manage orders, profile, and more.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border p-4">Recent Orders</div>
          <div className="rounded-lg border p-4">Wishlist</div>
          <div className="rounded-lg border p-4">Account Summary</div>
        </div>
      </div>
    </AuthGuard>
  );
}