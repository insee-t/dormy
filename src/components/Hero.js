"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import ButtonPrimary from "./misc/ButtonPrimary";
import { motion } from "framer-motion";
import getScrollAnimation from "../utils/getScrollAnimation";
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
  const scrollAnimation = useMemo(() => getScrollAnimation(), []);

  return (
    <div className="w-full bg-gradient-to-b from-#3491b4/50 via-blue-400/30 to-transparent mt-12">
      <div className="max-w-screen-xl mx-auto px-8 xl:px-16" id="about">
        <ScrollAnimationWrapper>
          <motion.div
            className="grid grid-flow-row sm:grid-flow-col grid-rows-2 md:grid-rows-1 sm:grid-cols-2 gap-8 py-6 sm:py-16"
            variants={scrollAnimation}
          >
            <div className="flex flex-col justify-center items-start row-start-2 sm:row-start-1 pt-12">
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-medium text-white leading-normal">
                เจอเรื่องยุ่ง? <br />
                ลอง<strong>Link</strong>ดู
              </h1>
              <p className="text-white mt-4 mb-6">
                ระบบจัดการหอพัก อพาร์ทเมนท์ที่ช่วยให้เจ้าของหอพักบริหารจัดการค่าใช้จ่ายและดูแลผู้เช่าได้อย่างมีประสิทธิภาพ
              </p>
              <ButtonOutline>เริ่มต้นใช้งาน 90 วัน คลิกเลย</ButtonOutline>
            </div>
            <div className="flex w-full">
              <motion.div className="h-full w-full" variants={scrollAnimation}>
                <Image
                  src="/assets/Hero-2.png"
                  alt="VPN Illustrasi"
                  quality={100}
                  width={1769}
                  height={857}
                  layout="responsive"
                />
              </motion.div>
            </div>
          </motion.div>
        </ScrollAnimationWrapper>
      </div>

      
    </div>
  );
};

export default Hero;
