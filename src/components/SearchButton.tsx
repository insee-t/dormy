"use client"

import { Button } from "./ui/button";

export default function SearchButton() {
    return <>
        <Button
            type="button"
            variant="outline"
            onClick={() => window.location.href = `/dashboard/tenants`}
        >
            ล้าง
        </Button>
    </>
}