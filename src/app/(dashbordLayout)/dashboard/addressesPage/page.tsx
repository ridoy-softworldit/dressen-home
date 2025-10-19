/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MapPin } from "lucide-react";
import Link from "next/link";
import { useGetSingleCustomerQuery } from "@/redux/featured/customer/customerApi";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/featured/auth/authSlice";
import { useSession } from "next-auth/react";
import AuthGuard from "@/components/shared/AuthGuard";

export default function AddressesPage() {
  const currentUser = useAppSelector(selectCurrentUser);
  const { data: session } = useSession();
  
  // Use actual logged-in user ID
  const user = session?.user || currentUser;
  const customerId = user?.id || "";
  const {
    data: customer,
    isLoading,
    isError,
    error,
  } = useGetSingleCustomerQuery(customerId, { skip: !customerId });

  useEffect(() => {

  }, [customer]);

  useEffect(() => {
    if (isError) console.error("❌ API Error:", error);
  }, [isError, error]);

  if (isLoading) {
    return <p className="p-6 text-sm">Loading addresses...</p>;
  }

  if (isError) {
    return (
      <AuthGuard>
        <div className="w-full p-6">
          <h1 className="text-2xl font-semibold mb-8">My Addresses</h1>
          <div className="text-center py-12">
            <p className="text-gray-500">Your addresses could not be loaded.</p>
            <Link href="/dashboard/add-new-address">
              <Button className="mt-4">
                <MapPin className="h-4 w-4 mr-2" />
                Add New Address
              </Button>
            </Link>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (!customer?.address?.length) {
    return (
      <AuthGuard>
        <div className="w-full p-6">
          <h1 className="text-2xl font-semibold mb-8">My Addresses</h1>
          <div className="text-center py-12">
            <p className="text-gray-500">No addresses found.</p>
            <p className="text-sm text-gray-400 mt-2">Add your first address to get started!</p>
            <Link href="/dashboard/add-new-address">
              <Button className="mt-4">
                <MapPin className="h-4 w-4 mr-2" />
                Add New Address
              </Button>
            </Link>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="w-full p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-foreground">My Addresses</h1>
        <Link href={`/dashboard/add-new-address`} className="md:hidden">
          <Button
            variant="ghost"
            className="text-orange-600 hover:text-orange-700"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {customer.address.map((addr: any, idx: number) => (
          <Card
            key={idx}
            className={`flex-1 ${
              addr.isDefault
                ? "border-amber-200 bg-amber-50/30"
                : "border-border"
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-medium text-foreground">
                      {addr.title || `Address ${idx + 1}`}
                    </h3>
                    {addr.isDefault && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-md font-medium">
                        Default
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-muted-foreground space-y-1 mb-3">
                    <p>{addr.street}</p>
                    <p>
                      {addr.city}, {addr.state} {addr["zip-code"]}
                    </p>
                    <p>{addr.country}</p>
                    <p>Type: {addr.type}</p>
                  </div>

                  {!addr.isDefault && (
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Set as Default
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="hidden md:flex justify-start mt-6">
        <Link href={`/dashboard/add-new-address`}>
          <Button
            variant="ghost"
            className="text-orange-600 hover:text-orange-700"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </Link>
      </div>
    </div>
    </AuthGuard>
  );
}
