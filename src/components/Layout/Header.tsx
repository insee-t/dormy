"use client"

import { useRouter } from "next/navigation";
import HeaderComponent from "./HeaderComponent";

export default function Header() {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <HeaderComponent handleLogoClickAction={handleLogoClick}></HeaderComponent>
  );
};
