"use client"

import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from "next/link";
import LogoVPN from "/public/assets/icon.png";

export default function HeaderComponent({handleLogoClickAction} : {handleLogoClickAction: () => void}) {
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [scrollActive, setScrollActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollActive(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    
    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSmoothScroll = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={
          "fixed top-0 w-full z-30 transition-all duration-300 " +
            (scrollActive 
              ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 pt-0" 
              : "bg-white/80 backdrop-blur-sm pt-4"
            )
        }
      >
        <nav className="max-w-screen-xl px-6 sm:px-8 lg:px-16 mx-auto grid grid-flow-col py-2">
          <div
            onClick={handleLogoClickAction}
            className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
          >
            <Image
              src={LogoVPN}
              alt="Logo VPN"
              width={50}
              height={50}
              className="object-contain"
            />
          </div>
          <ul className="hidden lg:flex col-start-4 col-end-8 text-gray-600 items-center">
            <button
              onClick={() => {
                handleSmoothScroll("about");
                setActiveLink("about");
              }}
              className={
                "px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative font-medium transition-all duration-300" +
                  (activeLink === "about"
                    ? " text-[#01BCB4] font-semibold"
                    : " text-gray-600 hover:text-[#01BCB4] hover:font-medium"
                  )
              }
            >
              หน้าหลัก
            </button>
            <button
              onClick={() => {
                handleSmoothScroll("pricing");
                setActiveLink("pricing");
              }}
              className={
                "px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative font-medium transition-all duration-300" +
                  (activeLink === "pricing"
                    ? " text-[#01BCB4] font-semibold"
                    : " text-gray-600 hover:text-[#01BCB4] hover:font-medium"
                  )
              }
            >
              ฟังก์ชัน
            </button>
            <Link
              className="px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative font-medium text-gray-600 hover:text-[#01BCB4] hover:font-medium transition-all duration-300"
              href="/dashboard/subscription"
            >
              แพ็กเกจ
            </Link>
            <button
              onClick={() => {
                handleSmoothScroll("testimoni");
                setActiveLink("testimoni");
              }}
              className={
                "px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative font-medium transition-all duration-300" +
                  (activeLink === "testimoni"
                    ? " text-[#01BCB4] font-semibold"
                    : " text-gray-600 hover:text-[#01BCB4] hover:font-medium"
                  )
              }
            >
              ติดต่อเรา
            </button>
          </ul>
          <div className="col-start-10 col-end-12 font-medium flex justify-end items-center">
            <Link 
              href="/sign-up"
              className="text-[#01BCB4] hover:text-[#01BCB4]/80 font-semibold transition-colors duration-300"
            >
              เริ่มต้นใช้งานฟรี 90 วัน
            </Link>
            <Link
              href="/sign-in"
              className="px-6 py-2 border-2 border-[#01BCB4] rounded-lg text-[#01BCB4] hover:bg-[#01BCB4] hover:text-white transition-all duration-300 ml-5 font-semibold hover:shadow-lg transform hover:-translate-y-0.5"
            >
              เข้าสู่ระบบ
            </Link>
          </div>
        </nav>
      </header>

      <nav className="fixed lg:hidden bottom-0 left-0 right-0 z-20 px-4 sm:px-8 shadow-t bg-white/95 backdrop-blur-md border-t border-gray-100">
        <div className="sm:px-3">
          <ul className="flex w-full justify-between items-center text-gray-600">
            <button
              onClick={() => {
                handleSmoothScroll("about");
                setActiveLink("about");
              }}
              className={
                "mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs border-t-2 transition-all font-medium " +
                  (activeLink === "about"
                    ? " border-[#01BCB4] text-[#01BCB4]"
                    : " border-transparent text-gray-600 hover:text-[#01BCB4]")
              }
            >
              หน้าหลัก
            </button>
            <button
              onClick={() => {
                handleSmoothScroll("pricing");
                setActiveLink("pricing");
              }}
              className={
                "mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs border-t-2 transition-all font-medium " +
                  (activeLink === "pricing"
                    ? " border-[#01BCB4] text-[#01BCB4]"
                    : " border-transparent text-gray-600 hover:text-[#01BCB4]")
              }
            >
              ฟังก์ชัน
            </button>
            <button
              onClick={() => {
                handleSmoothScroll("testimoni");
                setActiveLink("testimoni");
              }}
              className={
                "mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs border-t-2 transition-all font-medium " +
                  (activeLink === "testimoni"
                    ? " border-[#01BCB4] text-[#01BCB4]"
                    : " border-transparent text-gray-600 hover:text-[#01BCB4]")
              }
            >
              ติดต่อเรา
            </button>
          </ul>
        </div>
      </nav>
    </>
  );
};
