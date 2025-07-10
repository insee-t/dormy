"use client";

import React from "react";
import Image from "next/image";
import ButtonPrimary from "./misc/ButtonPrimary";
import ScrollAnimationWrapper from "./Layout/ScrollAnimationWrapper";
import ButtonOutline from "./misc/ButtonOutline.";

const Hero = ({
  listUser = [
    {
      name: "Users",
      number: "390",
      icon: "/assets/Icon/heroicons_sm-user.svg",
    },
    {
      name: "Locations",
      number: "20",
      icon: "/assets/Icon/gridicons_location.svg",
    },
    {
      name: "Server",
      number: "50",
      icon: "/assets/Icon/bx_bxs-server.svg",
    },
  ],
}) => {
  return (
    <div className="w-full bg-gradient-to-br from-[#01BCB4]/20 via-[#01BCB4]/10 to-[#FFAC3E]/5 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#01BCB4]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFAC3E]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-[#01BCB4]/5 to-[#FFAC3E]/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-screen-xl mx-auto px-8 xl:px-16 relative z-10" id="about">
        <ScrollAnimationWrapper>
          <div className="grid grid-flow-row sm:grid-flow-col grid-rows-2 md:grid-rows-1 sm:grid-cols-2 gap-8 py-6 sm:py-16">
            <div className="flex flex-col justify-center items-start row-start-2 sm:row-start-1 pt-12">
              <div className="animate-fade-in">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-800 leading-tight mb-6">
                  จัดการหอพักด้วย
                  &nbsp;<strong className="text-[#FFAC3E] drop-shadow-[0_3px_4px_rgba(0,0,0,0.3)] drop-shadow-[0_4px_2px_rgba(0,0,0,0.5)]">DORMY</strong>
                </h1>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  ระบบจัดการหอพัก อพาร์ทเมนท์ที่ช่วยให้เจ้าของหอพักบริหารจัดการค่าใช้จ่ายและดูแลผู้เช่าได้อย่างมีประสิทธิภาพ
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* <ButtonOutline>เริ่มต้นใช้งาน 30 วัน คลิกเลย</ButtonOutline> */}
                  {/* <button className="px-8 py-3 bg-gradient-to-r from-[#01BCB4] to-[#01BCB4]/90 text-white rounded-lg font-semibold hover:from-[#01BCB4]/90 hover:to-[#01BCB4] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    ดูตัวอย่างฟรี
                  </button> */}
                  <button className="px-8 py-3 bg-gradient-to-r from-[#01BCB4] to-[#01BCB4]/90 text-white rounded-lg font-semibold hover:from-[#01BCB4]/90 hover:to-[#01BCB4] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    เริ่มต้นใช้งาน 30 วัน คลิกเลย
                  </button>
                </div>
              </div>
            </div>
            <div className="flex w-full">
              <div className="h-full w-full animate-fade-in-scale">
                <Image
                  src="/assets/Hero-2.png"
                  alt="VPN Illustrasi"
                  quality={100}
                  width={1769}
                  height={857}
                  layout="responsive"
                  className="drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </ScrollAnimationWrapper>
      </div>
    </div>
  );
};

export default Hero;
