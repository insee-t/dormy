"use client"

import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from "next/link";
import { Link as LinkScroll } from "react-scroll";
import LogoVPN from "/public/assets/Logo.png";

export default function HeaderComponent({handleLogoClickAction} : {handleLogoClickAction: () => void}) {
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [scrollActive, setScrollActive] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScrollActive(window.scrollY > 20);
    });
  }, []);

  return (
    <>
      <header
        className={
          "fixed top-0 w-full  z-30 bg-white transition-all " +
            (scrollActive ? " shadow-md pt-0" : " pt-4")
        }
      >
        <nav className="max-w-screen-xl px-6 sm:px-8 lg:px-16 mx-auto grid grid-flow-col py-3 sm:py-4">
          <div
            onClick={handleLogoClickAction}
            className="cursor-pointer"
          >
            <Image
              src={LogoVPN}
              alt="Logo VPN"
              width={200}
              height={50}
              className="object-contain"
            />
          </div>
          <ul className="hidden lg:flex col-start-4 col-end-8 text-[#4F5665] items-center">
            <LinkScroll
              activeClass="active"
              to="about"
              spy={true}
              smooth={true}
              duration={1000}
              onSetActive={() => {
                setActiveLink("about");
              }}
              className={
                "px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative" +
                  (activeLink === "about"
                    ? " text-orange-500 animation-active "
                    : " text-[#4F5665] hover:text-orange-500 a")
              }
            >
              หน้าหลัก
            </LinkScroll>
            <LinkScroll
              activeClass="active"
              to="pricing"
              spy={true}
              smooth={true}
              duration={1000}
              onSetActive={() => {
                setActiveLink("pricing");
              }}
              className={
                "px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative" +
                  (activeLink === "pricing"
                    ? " text-orange-500 animation-active "
                    : " text-[#4F5665] hover:text-orange-500 ")
              }
            >
              ฟังก์ชัน
            </LinkScroll>
            <Link
              className="px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative  text-[#4F5665] hover:text-orange-500 "
              href="/dashboard/subscription"
            >
              แพ็กเกจ
            </Link>
            <LinkScroll
              activeClass="active"
              to="testimoni"
              spy={true}
              smooth={true}
              duration={1000}
              onSetActive={() => {
                setActiveLink("testimoni");
              }}
              className={
                "px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative" +
                  (activeLink === "testimoni"
                    ? " text-orange-500 animation-active "
                    : " text-[#4F5665] hover:text-orange-500 ")
              }
            >
              ติดต่อเรา
            </LinkScroll>
          </ul>
          <div className="col-start-10 col-end-12 font-medium flex justify-end items-center">
            <Link href="/sign-up">
              เริ่มต้นใช้งานฟรี 90 วัน
            </Link>
              <Link
                href="/sign-in"
                className="px-4 py-2 border border-current rounded-md text-[#4F5665] hover:text-gray-800 hover:border-gray-800 transition-colors ml-5"
              >
                เข้าสู่ระบบ
              </Link>
          </div>
        </nav>
      </header>

      <nav className="fixed lg:hidden bottom-0 left-0 right-0 z-20 px-4 sm:px-8 shadow-t ">
        <div className="bg-white sm:px-3">
          <ul className="flex w-full justify-between items-center text-[#4F5665]">
            <LinkScroll
              activeClass="active"
              to="about"
              spy={true}
              smooth={true}
              duration={1000}
              onSetActive={() => {
                setActiveLink("about");
              }}
              className={
                "mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs border-t-2 transition-all text-[#4F5665] " +
                  (activeLink === "about"
                    ? "  border-orange-500 text-orange-500"
                    : " border-transparent")
              }
            >
              {/* <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              >
               <path
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth={2}
               d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
               />
               </svg> */}
              หน้าหลัก
            </LinkScroll>
            <LinkScroll
              activeClass="active"
              to="pricing"
              spy={true}
              smooth={true}
              duration={1000}
              onSetActive={() => {
                setActiveLink("pricing");
              }}
              className={
                "mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs border-t-2 transition-all " +
                  (activeLink === "pricing"
                    ? "  border-orange-500 text-orange-500"
                    : " border-transparent ")
              }
            >
              {/* <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              >
               <path
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth={2}
               d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
               />
               </svg> */}
              ฟังก์ชัน
            </LinkScroll>
            <LinkScroll
              activeClass="active"
              to="testimoni"
              spy={true}
              smooth={true}
              duration={1000}
              onSetActive={() => {
                setActiveLink("testimoni");
              }}
              className={
                "mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs border-t-2 transition-all " +
                  (activeLink === "testimoni"
                    ? "  border-orange-500 text-orange-500"
                    : " border-transparent ")
              }
            >
              {/* <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              >
               <path
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth={2}
               d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
               />
               </svg> */}
              ติดต่อเรา
            </LinkScroll>
          </ul>
        </div>
      </nav>
    </>
  );
};
