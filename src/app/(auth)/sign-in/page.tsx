"use server";

import { SignInForm } from "@/auth/nextjs/components/SignInForm"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link";

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ oauthError?: string }>
}) {
  const { oauthError } = await searchParams

  // const handleGoogleSignIn = async () => {
  //   setLoading(true);
  //   setError("");
  //   try {
  //     await signIn("google", { callbackUrl: "/dashboard" });
  //   } catch (err) {
  //     setError("ไม่สามารถเข้าสู่ระบบด้วย Google ได้");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="min-h-screen bg-[#01BCB4] flex flex-col">
      {/* Header Section */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div />
        </div>
      </div>

      {/* Main Content: Centered Vertically and Horizontally */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 xl:gap-16">
            {/* Left Section: Logo and Title */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center text-center">
              <div className="space-y-6">
                {/* Mobile logo */}
                <div className="block lg:hidden">
                  <img
                    src="/assets/Logo_vertical_white.png"
                    alt="Dormy Icon"
                    className="w-32 sm:w-40 h-auto mx-auto"
                  />
                </div>
                {/* Desktop logo */}
                <div className="hidden lg:block">
                  <img
                    src="/assets/Logo_vertical_white.png"
                    alt="Dormy Icon"
                    className="w-64 xl:w-80 h-auto"
                  />
                </div>
                <div className="space-y-4">
                  <h1 className="text-white text-lg sm:text-xl lg:text-2xl xl:text-3xl font-medium leading-tight">
                    ระบบจัดการหอพัก อพาร์ทเมนท์
                  </h1>
                  <p className="text-white/90 text-sm sm:text-base lg:text-lg max-w-md mx-auto">
                    จัดการหอพักของคุณได้อย่างง่ายดายและมีประสิทธิภาพ
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section: Sign In Card */}
            <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl">
              <Card className="bg-white shadow-xl border-0">
                <CardHeader className="space-y-4 pb-6">
                  <CardTitle className="text-xl sm:text-2xl font-semibold text-center text-gray-900">
                    เข้าสู่ระบบ
                  </CardTitle>
                  {oauthError && (
                    <CardDescription className="text-destructive text-center text-sm">
                      {oauthError}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="px-6 sm:px-8 pb-8">
                  <SignInForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
