"use client";

import React, { useState } from "react";
import FeatureSite from "../../components/Feature-tenant";
import Header from "../../components/Layout/Header";
import Image from "next/image";

const HeroSection = ({ activeTab }) => {
  const heroContent = {

    ดูบิลออนไลน์: {
      title: "ดูบิลออนไลน์",
      titleHighlight: " ",
      description:
        "เจ้าของหอสามารถสื่อสารกับผู้เช่าได้สะดวก โดยแจ้งข่าวสารหรือประชาสัมพันธ์ผ่านระบบตลอดเวลา",
      image: "/assets/rent-bill.png",
      imageAlt: "ระบบจัดการผังห้องพัก",
    },
    แจ้งชำระเงินออนไลน์: {
      title: "แจ้งชำระเงินออนไลน์",
      titleHighlight: " ",
      description:
        "เมื่อชำระค่าเช่าเรียบร้อย สามารถอัปโหลดสลิปโอนเงิน ผ่าน App กดส่งไปยังหอพักได้ทันที พร้อมเห็นสถานะบิลของตนเองว่าอยู่ขั้นตอนไหน",
      image: "/assets/payment.png",
      imageAlt: "มิเตอร์ระบบอัตโนมัติ",
    },
    กระดานข่าวสาร: {
      title: "กระดานข่าวสาร",
      titleHighlight: " ",
      description:
        "หมวดกระดานข่าวสารที่คุณสามารถติดต่อสื่อสาร พูดคุยกับทางหอพัก หรืออพาร์ทเมนท์ได้อย่างสะดวก รวดเร็ว มาพร้อมกับการแจ้งเตือนทันที เมื่อมีการรับ-ส่งข่าวสาร",
      image: "/assets/board.png",
      imageAlt: "ระบบจัดการผังห้องพัก",
    },
    การแจ้งเรื่อง: {
      title: "การแจ้งเรื่อง",
      titleHighlight: " ",
      description:
        "ผู้เช่า สามารถแจ้งซ่อม แจ้งทำความสะอาด แจ้งฉุกเฉิน แจ้งย้ายออกให้ผู้ดูแล หรือเจ้าของทราบได้ง่ายขึ้น โดยแจ้งเรื่องที่ต้องการ แนบภาพถ่าย ผ่านแอป ทางหอพักจะได้รับข้อความทันที พร้อมพูดคุยนัดเวลาการดำเนินการได้อย่างรวดเร็ว ระบบจะบันทึกข้อมูลนั้นๆ ไว้ให้อีกด้วย สามารถเรียกดูข้อมูลย้อนหลังได้",
      image: "/assets/noti.png",
      imageAlt: "ระบบจัดการผังห้องพัก",
    },
    วิเคราะห์ค่าห้อง: {
      title: "วิเคราะห์ค่าห้อง",
      titleHighlight: " ",
      description:
        "ดูผลวิเคราะห์ค่าเช่า การใช้น้ำ และไฟของตนเองในเดือนนั้นๆ ได้อย่างรวดเร็ว พร้อมแผนภูมิแท่งแสดงการเปรียบเทียบผลในแต่ละเดือน ทำให้คุณทราบการใช้จ่ายของตนเองได้อย่างชัดเจน",
      image: "/assets/analyzroom.png",
      imageAlt: "ระบบจัดการผังห้องพัก",
    },
    คอมมูนิตี้: {
      title: "คอมมูนิตี้",
      titleHighlight: " ",
      description:
        "ฟีเจอร์คอมมูนิตี้ช่วยให้ผู้เช่าทุกคนสามารถติดต่อและเชื่อมต่อกันได้อย่างง่ายดาย ไม่ว่าจะเป็นการแชร์ข่าวสาร พูดคุย หรือร่วมกิจกรรมต่าง ๆ ที่จัดขึ้นโดยหอพักหรือชุมชน คุณสามารถติดตามข่าวสารล่าสุดจากเจ้าของหอพัก หรือสื่อสารกับเพื่อนผู้เช่าได้ทันที สร้างความสัมพันธ์ที่ดีและบรรยากาศอบอุ่นในหอพักของคุณ",
      image: "/assets/commu.png",
      imageAlt: "ระบบจัดการผังห้องพัก",
    },
    สะสมแต้ม: {
      title: "สะสมแต้ม",
      titleHighlight: " ",
      description:
        "ทุกการทำกิจกรรมกับหอพักของคุณมีความหมาย ฟีเจอร์สะสมแต้มช่วยให้คุณได้รับคะแนนจากการจ่ายค่าเช่าตรงเวลา การร่วมกิจกรรมภายในหอพัก หรือการใช้บริการต่าง ๆ แต้มสะสมเหล่านี้สามารถแลกรับสิทธิพิเศษหรือส่วนลดในบริการต่าง ๆ ทำให้การอยู่อาศัยของคุณสะดวกสบายและสนุกสนานยิ่งขึ้น",
      image: "/assets/points.png",
      imageAlt: "ระบบจัดการผังห้องพัก",
    },
    ส่วนกลาง: {
      title: "ส่วนกลาง",
      titleHighlight: " ",
      description:
        "ระบบตรวจสอบสถานะอุปกรณ์ส่วนกลาง เช่น เครื่องซักผ้า ตู้กดน้ำ และอุปกรณ์ซ่อมบำรุง ช่วยให้ผู้ใช้งานสามารถดูสถานะการทำงาน การชำรุด หรือการใช้งานได้แบบเรียลไทม์ ลดปัญหาการรอใช้อุปกรณ์หรือแจ้งซ่อมล่าช้า",
      image: "/assets/central.png",
      imageAlt: "ระบบจัดการผังห้องพัก",
    },
  };

  const content = heroContent[activeTab] || heroContent["ดูบิลออนไลน์"];

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col">
            <h2 className="text-4xl font-bold mb-6">
              {content.title}{" "}
              <span className="text-#67aac3">{content.titleHighlight}</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">{content.description}</p>
          </div>
          <div className="w-full">
            <img
              src={content.image}
              alt={content.imageAlt}
              width={800}
              // height={600}
              className="rounded-lg w-full object-cover"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroSection;