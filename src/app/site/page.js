"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import FeatureSite from "../../components/FeatureSite";
import HeroSection from "./HeroSection";
import Header from "../../components/Layout/Header";

const FeatureLayoutContent = () => {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("ดูบิลออนไลน์");

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');     // อ่านค่า tab จาก URL parameters
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  return (
    <div>
      <Header />
      <div className="min-h-screen w-full bg-gradient-to-b from-[#01BCB4]/30 to-white">
        <FeatureSite activeTab={activeTab} onTabChange={setActiveTab} />
        <HeroSection activeTab={activeTab} />
      </div>
    </div>
  );
};

const FeatureLayout = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FeatureLayoutContent />
    </Suspense>
  );
};

export default FeatureLayout;