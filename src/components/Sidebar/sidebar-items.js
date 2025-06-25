import { Icon } from "@iconify/react";
import { SidebarItemType } from "./sidebar";

export const sectionItemsWithTeams = [
  {
    key: "main",
    title: "เมนูหลัก",
    items: [
      {
        key: "room_layout",
        href: "/dashboard",
        icon: "solar:buildings-2-outline",
        title: "ผังห้อง",
      },
      {
        key: "rent_bill",
        href: "/dashboard/rent-bill",
        icon: "solar:bill-list-outline",
        title: "บิลค่าเช่า",
      },
      {
        key: "meter",
        href: "/dashboard/meter",
        icon: "solar:battery-charge-outline",
        title: "ค่าน้ำ ค่าไฟ",
      },
      {
        key: "review_receipt",
        href: "/dashboard/review-reciept",
        icon: "solar:clipboard-text-outline",
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
        icon: "solar:box-outline",
        title: "พัสดุ",
      },
      {
        key: "reports",
        href: "/dashboard/complaints",
        icon: "solar:bell-outline",
        title: "ร้องเรียน",
      },
      {
        key: "bank",
        href: "/dashboard/bank",
        icon: "solar:card-outline",
        title: "บัญชีธนาคาร",
      },
      {
        key: "lease",
        href: "/dashboard/lease",
        icon: "solar:document-outline",
        title: "สัญญาเช่า",
      },
      {
        key: "new_apartment",
        href: "/dashboard/new-apartment",
        icon: "solar:home-add-outline",
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
