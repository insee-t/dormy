import React from "react";
// import Logo from "../../public/assets/kkbs.png";
// import Facebook from "../../public/assets/Icon/facebook.svg";
// import Twitter from "../../public/assets/Icon/twitter.svg";
// import Instagram from "../../public/assets/Icon/instagram.svg";


const Footer = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20 pb-12 relative overflow-hidden" id="testimoni">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#01BCB4]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#FFAC3E]/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-screen-xl w-full mx-auto px-6 sm:px-8 lg:px-16 grid grid-rows-6 sm:grid-rows-1 grid-flow-row sm:grid-flow-col grid-cols-3 sm:grid-cols-12 gap-8 relative z-10">
        <div className="row-span-2 sm:col-span-4 col-start-1 col-end-4 sm:col-end-5 flex flex-col items-start">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
            <img src="/assets/Logo.png" alt="Dormy Logo" className="h-16 w-auto" />
          </div>
          <p className="mb-6 text-gray-300 leading-relaxed">
            <strong className="font-semibold text-white">Dormy.</strong> ระบบจัดการหอพัก อพาร์ทเมนท์ที่ช่วยให้เจ้าของหอพักบริหารจัดการค่าใช้จ่ายและดูแลผู้เช่าได้อย่างมีประสิทธิภาพ
          </p>
          <div className="flex space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-[#01BCB4] to-[#01BCB4]/80 rounded-full flex items-center justify-center hover:from-[#FFAC3E] hover:to-[#FFAC3E]/80 transition-all duration-300 cursor-pointer transform hover:scale-110">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-[#01BCB4] to-[#01BCB4]/80 rounded-full flex items-center justify-center hover:from-[#FFAC3E] hover:to-[#FFAC3E]/80 transition-all duration-300 cursor-pointer transform hover:scale-110">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
              </svg>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-[#01BCB4] to-[#01BCB4]/80 rounded-full flex items-center justify-center hover:from-[#FFAC3E] hover:to-[#FFAC3E]/80 transition-all duration-300 cursor-pointer transform hover:scale-110">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="row-span-2 sm:col-span-2 sm:col-start-9 sm:col-end-11 flex flex-col">
          <h3 className="text-white mb-6 font-semibold text-lg border-b border-[#01BCB4]/30 pb-2">Support</h3>
          <ul className="space-y-3">
            <li className="text-gray-300 hover:text-[#01BCB4] cursor-pointer transition-colors duration-300 hover:translate-x-1 transform">
              Dormy คืออะไร ?
            </li>
            <li className="text-gray-300 hover:text-[#01BCB4] cursor-pointer transition-colors duration-300 hover:translate-x-1 transform">
              คู่มือการใช้งาน
            </li>
            <li className="text-gray-300 hover:text-[#01BCB4] cursor-pointer transition-colors duration-300 hover:translate-x-1 transform">
              ติดต่อฝ่ายช่วยเหลือ
            </li>
          </ul>
        </div>
        
        <div className="row-span-2 sm:col-span-2 sm:col-start-11 sm:col-end-13 flex flex-col">
          <h3 className="text-white mb-6 font-semibold text-lg border-b border-[#FFAC3E]/30 pb-2">ติดต่อเรา</h3>
          <ul className="space-y-3">
            <li className="text-gray-300 hover:text-[#FFAC3E] cursor-pointer transition-colors duration-300 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
              support@mydormy.com
            </li>
            <li className="text-gray-300 hover:text-[#FFAC3E] cursor-pointer transition-colors duration-300 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
              ขอนแก่น, ประเทศไทย
            </li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-gray-700 mt-12 pt-8 text-center">
        <p className="text-gray-400 text-sm">
          ©{new Date().getFullYear()} Dormy. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
