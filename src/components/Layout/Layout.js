"use server"

import React from "react";
import Footer from "./Footer.js";
import Header from "./Header";

export default async function Layout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};
