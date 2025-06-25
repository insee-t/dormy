import React from "react";

const ButtonOutline = ({ children }) => {
  return (
    <button className="font-medium tracking-wide py-2 px-5 sm:px-8 border border-orange-500 text-orange-500 bg-white outline-none rounded-l-full rounded-r-full capitalize hover:bg-orange-500 hover:text-white transition-all hover:shadow-orange ">
      {" "}
      {children}
    </button>
  );
};

export default ButtonOutline;
