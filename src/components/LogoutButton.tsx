"use client"

import { logOut } from "@/auth/nextjs/actions";

export default function LogOutButton() {
    return <>
        <button
            className="text-sm font-medium bg-[#ff5757] text-white py-1.5 px-2 rounded-md hover:bg-[#e73333]"
            onClick={async () => await logOut()}
        >
            ออกจากระบบ
        </button>
    </>

}