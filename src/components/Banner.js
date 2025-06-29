"use client"

import React, { useMemo } from "react";
import Image from 'next/image';
import getScrollAnimation from "../utils/getScrollAnimation";
import { motion } from "framer-motion";
import ScrollAnimationWrapper from "./Layout/ScrollAnimationWrapper";

const Header = () => {
  const scrollAnimation = useMemo(() => getScrollAnimation(), []);

  return (
    <div className="bg-gradient-to-r from-[#01BCB4]/5 via-white to-[#FFAC3E]/5">
      <ScrollAnimationWrapper>
        <motion.div 
          className="flex items-center w-full mx-auto "
          variants={scrollAnimation}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
            <div className="w-full shadow-xl">
              <Image
                src="/assets/banner.png"
                alt="Logo"
                width={2000}
                height={300}
                className="w-full object-contain"
              />
            </div>
        </motion.div>
      </ScrollAnimationWrapper>
    </div>
  );
};

export default Header;
