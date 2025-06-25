"use server"

import { redirect } from "next/navigation";
import HeaderComponent from "./HeaderComponent";

async function handleLogoClick() {
  "use server"
  redirect("/")
};

export default async function Header() {
  return (
    <HeaderComponent handleLogoClickAction={handleLogoClick}></HeaderComponent>
  );
};
