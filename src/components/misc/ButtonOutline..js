import React from "react";

const ButtonOutline = ({ children }) => {
  return (
    <button className="font-semibold tracking-wide py-3 px-6 sm:px-8 border-2 border-[#01BCB4] text-[#01BCB4] bg-white outline-none rounded-lg capitalize hover:bg-[#01BCB4] hover:text-white transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5">
      {" "}
      {children}
    </button>
  );
};

export default ButtonOutline;
