"use client";

import React, { useState } from "react";
import FeatureSite from "../../components/FeatureSite";
import Header from "../../components/Layout/Header";
import { div } from "framer-motion/client";
import Image from "next/image";



const HeroSection = ({ activeTab }) => {
  const heroContent = {

    ผังห้อง: {
      title: "ผังห้อง",
      titleHighlight: " ",
      description:
        "ระบบจัดการผังห้องพักที่ช่วยให้คุณบริหารห้องพักได้อย่างมีประสิทธิภาพ ดูสถานะห้องแบบเรียลไทม์",
      image: "/assets/room.png",
      imageAlt: "ระบบจัดการผังห้องพัก",
    },
    มิเตอร์: {
      title: "มิเตอร์",
      titleHighlight: "แบบระบบคำนวณอัตโนมัติ",
      description:
        "ระบบมิเตอร์ที่สามารถคำนวณค่าน้ำและค่าไฟฟ้าโดยอัตโนมัติ ช่วยบันทึกการใช้พลังงานแบบเรียลไทม์ และออกใบแจ้งหนี้ได้ทันที",
        image: "/assets/meter.png",
      imageAlt: "มิเตอร์ระบบอัตโนมัติ",
    },
    ทำบิล: {
      title: "ทำบิล",
      titleHighlight: " ",
      description:
        "ออกใบแจ้งค่าเช่าและส่งบิลให้ผู้เช่าได้ง่ายๆ ออนไลน์ ผ่าน Web Dormy ผู้เช่าสามารถรับบิลได้ทุกที่ และออกใบเสร็จอัตโนมัติหลังการชำระเงินเรียบร้อยแล้ว",
      image: "/assets/rent-bill.png",
      imageAlt: "ระบบจัดการผังห้องพัก",
    },
    สัญญาเช่า: {
      title: "สัญญาเช่า",
      titleHighlight: " ",
      description:
        "สร้างสัญญาเช่าได้ตามต้องการ สามารถทำสัญญาออนไลน์ให้ผู้เช่าลงลายเซ็นอิเล็กทรอนิกส์อย่างปลอดภัย พร้อมระบบแจ้งเตือนเมื่อสัญญาใกล้หมดอายุ",
      image: "/assets/lease.png",
      imageAlt: "ระบบจัดการผังห้องพัก",
    },
    พัสดุ: {
      title: "พัสดุ",
      titleHighlight: " ",
      description:
        "จัดการพัสดุที่เข้ามาในแต่ละวันได้ง่าย พร้อมแจ้งเตือนผู้เช่าเพื่อลดปัญหาพัสดุหายหรือหยิบสลับกัน",
      image: "/assets/pack.png",
      imageAlt: "ระบบจัดการผังห้องพัก",
    },
    วิเคราะห์ข้อมูล: {
      title: "วิเคราะห์ข้อมูล",
      titleHighlight: " ",
      description:
        "วิเคราะห์ผลประกอบการธุรกิจในด้านรายรับและรายจ่าย รวมถึงรายรับค่าเช่ารายเดือนและการเข้า-ออกของผู้เช่า เพื่อใช้ข้อมูลในการวางแผนการตลาดและบริหารหอพักให้เติบโตอย่างมั่นคง",
      image: "/assets/analys.png",
      imageAlt: "ระบบจัดการผังห้องพัก",
    },
    รายงานสรุป: {
      title: "รายงานสรุป",
      titleHighlight: " ",
      description:
        "สรุปรายงานประจำเดือน เช่น บิลค่าเช่า, การจอง, และการย้ายเข้า-ออก พร้อมสามารถส่งออกเป็นไฟล์ Excel ได้",
      image: "/assets/summary.png",
      imageAlt: "ระบบจัดการผังห้องพัก",
    },
    สื่อสารกับผู้เช่า: {
      title: "สื่อสารกับผู้เช่า",
      titleHighlight: " ",
      description:
        "เจ้าของหอสามารถสื่อสารกับผู้เช่าได้สะดวก โดยแจ้งข่าวสารหรือประชาสัมพันธ์ผ่านระบบตลอดเวลา",
      image: "/assets/commu.png",
      imageAlt: "ระบบจัดการผังห้องพัก",
    },
  };

  const content = heroContent[activeTab] || heroContent.ผังห้อง;

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="w-full">
            <img
              src={content.image}
              alt={content.imageAlt}
              width={800}
              // height={600}
              className="rounded-lg w-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <h2 className="text-4xl font-bold mb-6">
              {content.title}{" "}
              <span className="text-[#67aac3]">{content.titleHighlight}</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">{content.description}</p>
            {/* <div className="flex space-x-4">
              <button className="bg-#67aac3 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                เริ่มต้นใช้งาน
              </button>
              <button className="bg-#EEEFF2 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                ดูรายละเอียด
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;