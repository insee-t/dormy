import { Bell, CreditCard, HomeIcon, Users, Megaphone } from "lucide-react";
import { SidebarItemType } from "./sidebar";
import Image from "next/image";
import layoutIcon from "/public/assets/icon/layout.png"
import billIcon from "/public/assets/icon/bill.png"
import meterIcon from "/public/assets/icon/meter.png"
import summaryIcon from "/public/assets/icon/summary.png"
import packageIcon from "/public/assets/icon/packages.png"
import contractIcon from "/public/assets/icon/contract.png"
import complaintIcon from "/public/assets/icon/complaint.png"

const LayoutIcon = () => (
  <img 
    src={layoutIcon.src} 
    alt="Layout" 
    width={24} 
    height={24}
    className="text-default-500 group-data-[selected=true]:text-foreground"
  />
);

const BillIcon = () => (
  <img 
    src={billIcon.src} 
    alt="Bill" 
    width={24} 
    height={24}
    className="text-default-500 group-data-[selected=true]:text-foreground"
  />
);

const MeterIcon = () => (
  <img 
    src={meterIcon.src} 
    alt="Meter" 
    width={24} 
    height={24}
    className="text-default-500 group-data-[selected=true]:text-foreground"
  />
);

const SummaryIcon = () => (
  <img 
    src={summaryIcon.src} 
    alt="Summary" 
    width={24} 
    height={24}
    className="text-default-500 group-data-[selected=true]:text-foreground"
  />
);

const PackageIcon = () => (
  <img 
    src={packageIcon.src} 
    alt="Review Reciept" 
    width={24} 
    height={24}
    className="text-default-500 group-data-[selected=true]:text-foreground"
  />
);

const ContractIcon = () => (
  <img 
    src={contractIcon.src} 
    alt="Lease" 
    width={24} 
    height={24}
    className="text-default-500 group-data-[selected=true]:text-foreground"
  />
);

const ComplaintIcon = () => (
  <img 
    src={complaintIcon.src} 
    alt="Layout" 
    width={24} 
    height={24}
    className="text-default-500 group-data-[selected=true]:text-foreground"
  />
);

 
export const sectionItemsWithTeams = [
  {
    key: "main",
    title: "เมนูหลัก",
    items: [
      {
        key: "room_layout",
        href: "/dashboard",
        startContent: <LayoutIcon />,
        title: "ผังห้อง",
      },
      {
        key: "rent_bill",
        href: "/dashboard/rent-bill",
        startContent: <BillIcon />,
        title: "บิลค่าเช่า",
      },
      {
        key: "meter",
        href: "/dashboard/meter",
        startContent: <MeterIcon />,
        title: "ค่าน้ำ ค่าไฟ",
      },
      {
        key: "review_receipt",
        href: "/dashboard/review-reciept",
        startContent: <SummaryIcon />,
        title: "ตรวจสอบใบเสร็จ",
      },
      // {
      //   key: "payment",
      //   href: "#",
      //   icon: "solar:hand-money-outline",
      //   title: "จ่ายบิล",
      // },
      // {
      //   key: "calendar",
      //   href: "#",
      //   icon: "solar:calendar-mark-outline",
      //   title: "ปฏิทิน",
      // },
      {
        key: "packages",
        href: "/dashboard/packages",
        startContent: <PackageIcon />,
        title: "พัสดุ",
      },
      {
        key: "reports",
        href: "/dashboard/complaints",
        startContent: <Bell size={24} className="text-default-500 group-data-[selected=true]:text-foreground" />,
        title: "ร้องเรียน",
      },
      {
        key: "bank",
        href: "/dashboard/bank",
        startContent: <CreditCard size={24} className="text-default-500 group-data-[selected=true]:text-foreground" />,
        title: "บัญชีธนาคาร",
      },
      {
        key: "lease",
        href: "/dashboard/lease",
        startContent: <ContractIcon />,
        title: "สัญญาเช่า",
      },
      {
        key: "tenants",
        href: "/dashboard/tenants",
        startContent: <Users size={24} className="text-default-500 group-data-[selected=true]:text-foreground" />,
        title: "ผู้เช่า",
      },
      {
        key: "announcements",
        href: "/dashboard/announcements",
        startContent: <Megaphone size={24} className="text-default-500 group-data-[selected=true]:text-foreground" />,
        title: "ประกาศ",
      },
      {
        key: "new_apartment",
        href: "/dashboard/new-apartment",
        startContent: <HomeIcon size={24} className="text-default-500 group-data-[selected=true]:text-foreground" />,
        title: "เพิ่มหอพัก",
      },
    // ]
  // },
  // {
  //   key: "finance",
  //   title: "การเงิน",
  //   items: [
  //     {
  //       key: "transactions",
  //       href: "#",
  //       icon: "solar:wallet-money-outline",
  //       title: "รายรับ-จ่าย",
  //     },
  //     {
  //       key: "analytics",
  //       href: "#",
  //       icon: "solar:chart-outline",
  //       title: "วิเคราะห์",
  //     },
  //     {
  //       key: "reports",
  //       href: "#",
  //       icon: "solar:document-text-outline",
  //       title: "รายงานสรุป",
  //     }
  //   ]
  // },
  // {
  //   key: "management",
  //   title: "การจัดการ",
  //   items: [
      // {
      //   key: "tenants",
      //   href: "/dashboard/tenants",
      //   icon: "solar:users-group-two-rounded-outline",
      //   title: "ผู้เช่า",
      // },
  //     {
  //       key: "vehicles",
  //       href: "#",
  //       icon: "lucide:car",
  //       title: "ยานพาหนะ",
  //     },
  //     {
  //       key: "personnel",
  //       href: "#",
  //       icon: "solar:user-id-outline",
  //       title: "บุคลากร",
  //     }
  //   ]
  // },
  // {
  //   key: "settings",
  //   title: "ระบบ",
  //   items: [
  //     {
  //       key: "accounting",
  //       href: "#",
  //       icon: "solar:calculator-outline",
  //       title: "บัญชี",
  //     },







      // {
      //   key: "settings",
      //   href: "/dashboard/settings/billing",
      //   icon: "solar:settings-outline",
      //   title: "ตั้งค่าหอ",
      // }
    ]
  }
];

// Export other variations if needed
export const items = sectionItemsWithTeams[0].items;
export const sectionItems = sectionItemsWithTeams;
export const brandItems = sectionItemsWithTeams;
export const sectionLongList = sectionItemsWithTeams;
export const sectionNestedItems = items;
