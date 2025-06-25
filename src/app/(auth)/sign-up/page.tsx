"use server";

import { SignUpForm } from "@/auth/nextjs/components/SignUpForm";
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
      <div className="max-w-screen-xl sm:px-8 lg:px-16 mx-auto text-white flex justify-between px-6 items-center">
        <div />
      </div>

      {/* Main Content: Centered Vertically and Horizontally */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-7xl w-full gap-8 flex flex-col md:flex-row items-center">
          {/* Left Section: Logo and Title */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center mb-8 md:mb-0">
            <div className="text-center">
              <div className="flex-col">
                {/* Mobile logo */}
                <div className="mb-4 block md:hidden">
                  <img
                    src="/assets/Logo_vertical_white.png"
                    alt="Dormy Icon"
                    className="w-48 h-auto mx-auto"
                  />
                </div>
                {/* Desktop logo */}
                <div className="mb-6 hidden md:block">
                  <img
                    src="/assets/Logo_vertical_white.png"
                    alt="Dormy Icon"
                    className="w-[400px] h-auto"
                  />
                </div>
                <h1 className="text-white text-xl md:text-3xl mb-4">
                  ระบบจัดการหอพัก อพาร์ทเมนท์
                </h1>
              </div>
            </div>
          </div>

          <Card className="bg-white md:w-1/3">
            <CardHeader>
              <CardTitle className="flex text-xl justify-center"> สร้างบัญชี </CardTitle>
              {oauthError && (
                <CardDescription className="text-destructive">
                  {oauthError}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <SignUpForm />
            </CardContent>
          </Card>
          {/* Right Section: White Box with Google Login */}
        </div>
      </div>
    </div>
  );
}
