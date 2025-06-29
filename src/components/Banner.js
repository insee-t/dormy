"use client"

import React from "react";
import Image from 'next/image';
import ScrollAnimationWrapper from "./Layout/ScrollAnimationWrapper";

const Header = () => {
  return (
    <div className="bg-gradient-to-r from-[#01BCB4]/5 via-white to-[#FFAC3E]/5">
      <ScrollAnimationWrapper>
        <div className="flex items-center w-full mx-auto animate-fade-in">
            <div className="w-full shadow-xl">
              <Image
                src="/assets/banner.png"
                alt="Logo"
                width={2000}
                height={300}
                className="w-full object-contain"
              />
            </div>
        </div>
      </ScrollAnimationWrapper>
    </div>
  );
};

export default Header;
