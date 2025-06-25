"use client"

import React, { useMemo } from "react";
import Image from 'next/image';
import getScrollAnimation from "../utils/getScrollAnimation";
import { motion } from "framer-motion";
import ScrollAnimationWrapper from "./Layout/ScrollAnimationWrapper";

const Header = () => {
  const scrollAnimation = useMemo(() => getScrollAnimation(), []);

  return (
    <ScrollAnimationWrapper>
      <motion.div 
        className="flex items-center w-full"
        variants={scrollAnimation}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <Image
          src="/assets/banner.png"
          alt="Logo"
          width={2000}
          height={300}
          className="w-full object-contain"
        />
      </motion.div>
    </ScrollAnimationWrapper>
  );
};

export default Header;
