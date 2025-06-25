import React from "react";
// import Logo from "../../public/assets/kkbs.png";
// import Facebook from "../../public/assets/Icon/facebook.svg";
// import Twitter from "../../public/assets/Icon/twitter.svg";
// import Instagram from "../../public/assets/Icon/instagram.svg";


const Footer = () => {
  return (
    <div className="bg-#F8F8F8 pt-40 pb-24" id="testimoni">
      <div className="max-w-screen-xl w-full mx-auto px-6 sm:px-8 lg:px-16 grid grid-rows-6 sm:grid-rows-1 grid-flow-row sm:grid-flow-col grid-cols-3 sm:grid-cols-12 gap-4">
        <div className="row-span-2 sm:col-span-4 col-start-1 col-end-4 sm:col-end-5 flex flex-col items-start ">
          <img src="/assets/Logo.png" alt="KKBS Logo" className="h-20 w-auto mb-6" />
          <p className="mb-4">
            <strong className="font-medium">LinkCo.</strong> ระบบจัดการหอพัก อพาร์ทเมนท์ที่ช่วยให้เจ้าของหอพักบริหารจัดการค่าใช้จ่ายและดูแลผู้เช่าได้อย่างมีประสิทธิภาพ
          </p>
          {/* <div className="flex w-full mt-2 mb-8 -mx-2">
            <div className="mx-2 bg-white rounded-full items-center justify-center flex p-2 shadow-md">
              <Facebook className="h-6 w-6" />
            </div>
            <div className="mx-2 bg-white rounded-full items-center justify-center flex p-2 shadow-md">
              <Twitter className="h-6 w-6" />
            </div>
            <div className="mx-2 bg-white rounded-full items-center justify-center flex p-2 shadow-md">
              <Instagram className="h-6 w-6" />
            </div>
          </div> */}
          {/* <p className="text-#AFB5C0">©{new Date().getFullYear()} - LaslesVPN</p> */}
        </div>
        {/* <div className=" row-span-2 sm:col-span-2 sm:col-start-7 sm:col-end-9 flex flex-col">
          <p className="text-#0B132A mb-4 font-medium text-lg">Product</p>
          <ul className="text-#4F5665 ">
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              Download{" "}
            </li>
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              Pricing{" "}
            </li>
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              Locations{" "}
            </li>
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              Server{" "}
            </li>
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              Countries{" "}
            </li>
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              Blog{" "}
            </li>
          </ul>
        </div> */}
        <div className="row-span-2 sm:col-span-2 sm:col-start-9 sm:col-end-11 flex flex-col">
          <p className="text-#0B132A mb-4 font-medium text-lg">Support</p>
          <ul className="text-#4F5665">
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              LinkCo คืออะไร ?{" "}
            </li>
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              คู่มือการใช้งาน{" "}
            </li>
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              ติดต่อฝ่ายช่วยเหลือ{" "}
            </li>

          </ul>
        </div>
        <div className="row-span-2 sm:col-span-2 sm:col-start-11 sm:col-end-13 flex flex-col">
          <p className="text-#0B132A mb-4 font-medium text-lg">ติดต่อเรา</p>
          <ul className="text-#4F5665">
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              support@linkco.com{" "}
            </li>
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              ขอนแก่น, ประเทศไทย{" "}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
