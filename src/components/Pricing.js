"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import {
  Building2, Gauge, DollarSign, FileText,
  Package, BarChart3, ClipboardList, Users,
  Receipt, CreditCard, Bell, HomeIcon,
  Users2, Gift, Building
} from 'lucide-react';

const Features = () => {
  const router = useRouter();

  const businessFeatures = [
    { title: "ผังห้อง", Icon: Building2 },
    { title: "มิเตอร์", Icon: Gauge },
    { title: "ทำบิล", Icon: DollarSign },
    { title: "สัญญาเช่า", Icon: FileText },
    { title: "พัสดุ", Icon: Package },
    { title: "วิเคราะห์ข้อมูล", Icon: BarChart3 },
    { title: "รายงานสรุป", Icon: ClipboardList },
    { title: "สื่อสารกับผู้เช่า", Icon: Users }
  ];

  const tenantFeatures = [
    { title: "ดูบิลออนไลน์", Icon: Receipt },
    { title: "แจ้งชำระเงินออนไลน์", Icon: CreditCard },
    { title: "กระดานข่าวสาร", Icon: ClipboardList },
    { title: "การแจ้งเตือน", Icon: Bell },
    { title: "วิเคราะห์ค่าห้อง", Icon: HomeIcon },
    { title: "คอมมูนิตี้", Icon: Users2 },
    { title: "สะสมแต้ม", Icon: Gift },
    { title: "ส่วนกลาง", Icon: Building }
  ];

  const handleFeatureClick = (feature, isBusinessSection) => {
    if (isBusinessSection) {
      router.push(`/site?tab=${encodeURIComponent(feature.title)}`);
    } else {
      router.push(`/sitetenant?tab=${encodeURIComponent(feature.title)}`);
    }
  };

  const FeatureSection = ({ title, features, isBusinessSection = false }) => (
    <div className="mb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
          {title}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[#01BCB4] to-[#FFAC3E] mx-auto rounded-full"></div>
      </motion.div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleFeatureClick(feature, isBusinessSection)}
            className="group bg-white rounded-xl p-6 flex flex-col items-center cursor-pointer transition-all duration-300 border border-gray-100 hover:border-[#01BCB4]/20 shadow-lg hover:shadow-2xl relative overflow-hidden"
          >
            {/* Background gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#01BCB4]/5 to-[#FFAC3E]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10 w-16 h-16 flex items-center justify-center bg-gradient-to-br from-[#01BCB4] to-[#01BCB4]/90 rounded-xl shadow-lg mb-4 group-hover:from-[#FFAC3E] group-hover:to-[#FFAC3E]/90 transition-all duration-300">
              <feature.Icon className="w-8 h-8 text-white" />
            </div>
            <span className="relative z-10 text-center text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
              {feature.title}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12" id="pricing">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            ฟีเจอร์ที่ครบครัน
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ระบบจัดการหอพักที่ออกแบบมาเพื่อตอบโจทย์ทั้งเจ้าของหอพักและผู้เช่า
          </p>
        </motion.div>
        
        <FeatureSection
          title="ฟังก์ชั่นฝั่งผู้ประกอบการ"
          features={businessFeatures}
          isBusinessSection={true}
        />
        <FeatureSection
          title="ฟังก์ชั่นฝั่งผู้เช่า"
          features={tenantFeatures}
          isBusinessSection={false}
        />
      </div>
    </div>
  );
};

export default Features;