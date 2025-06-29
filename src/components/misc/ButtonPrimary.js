import React from "react";

const ButtonPrimary = ({ children, addClass }) => {
  return (
    <button
      className={
        "py-3 lg:py-4 px-12 lg:px-16 text-white font-semibold rounded-lg bg-gradient-to-r from-[#01BCB4] to-[#01BCB4]/90 hover:from-[#01BCB4]/90 hover:to-[#01BCB4] transition-all duration-300 outline-none shadow-lg hover:shadow-xl transform hover:-translate-y-1 " +
        addClass
      }
    >
      {children}
    </button>
  );
};

export default ButtonPrimary;
