"use client";

import React from "react";
import { Avatar, Button, ScrollShadow, Spacer, Tooltip } from "@heroui/react";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@heroui/react";
import { useRouter } from "next/navigation";
import { LogOut, Info, MinusCircle, PanelLeftClose, Clock } from "lucide-react";

import { AcmeIcon } from "./acme";
import { sectionItemsWithTeams } from "./sidebar-items.tsx";
import Sidebar from "./sidebar";
import { logOut } from "@/auth/nextjs/actions";

export default function Component({ children, title = "Overview", userName }) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isCompact = isCollapsed || isMobile;
  const router = useRouter();
  // const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const onToggle = React.useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  // const userImage = session?.user?.image;

  return (
    <div className="w-full h-screen ">
      {/* Fixed Sidebar - unchanged */}
      <div
        className={cn(
          "fixed left-0 top-0 h-screen flex-col !border-r-small border-divider p-6 transition-width bg-white shadow-sm",
          {
            "w-72": !isCompact,
            "w-16 items-center px-2 py-6": isCompact,
          },
        )}
      >
        <div
          className={cn("flex items-center justify-center px-3 ", {
            "px-2": isCompact,
          })}
        >
          <img
            src="../../assets/Logo.png"
            alt="Dormy"
            className={cn("h-auto w-auto transition-all duration-200", {
              "w-8 h-8 object-contain": isCompact,
            })}
          />
        </div>

        <ScrollShadow className="-mr-6 h-full max-h-full py-6 pr-6">
          <Sidebar
            defaultSelectedKey="home"
            isCompact={isCompact}
            items={sectionItemsWithTeams}
          />
        </ScrollShadow>

        <Spacer y={2} />

        {/* tool tip */}
        <div
          className={cn("mt-auto flex flex-col ", {
            "items-center": isCompact,
          })}
        >
          <Tooltip
            content="Help & Feedback"
            isDisabled={!isCompact}
            placement="right"
          >
            <Button
              fullWidth
              className={cn(
                "justify-start truncate text-blue-500 data-[hover=true]:text-foreground",
                {
                  "justify-center": isCompact,
                },
              )}
              isIconOnly={isCompact}
              startContent={
                isCompact ? null : (
                  <Info
                    className="flex-none text-blue-500"
                    size={24}
                  />
                )
              }
              variant="light"
            >
              {isCompact ? (
                <Info
                  className="text-blue-500"
                  size={24}
                />
              ) : (
                "Help & Information"
              )}
            </Button>
          </Tooltip>
          <Tooltip content="Log Out" isDisabled={!isCompact} placement="right">
            <Button
              className={cn(
                "justify-start text-blue-500 data-[hover=true]:text-foreground",
                {
                  "justify-center": isCompact,
                },
              )}
              isIconOnly={isCompact}
              onPress={handleLogout}
              startContent={
                isCompact ? null : (
                  <LogOut
                    className="flex-none text-blue-500"
                    size={24}
                  />
                )
              }
              variant="light"
            >
              {isCompact ? (
                <LogOut
                  className="text-blue-500"
                  size={24}
                />
              ) : (
                "Log Out"
              )}
            </Button>
          </Tooltip>
        </div>
      </div>

      <div
        className={cn("flex-1 min-h-screen bg-[#f9f9f9] ", {
          "ml-72": !isCompact,
          "ml-16": isCompact,
        })}
      >
        <div className="h-4">
        </div>
        <header className="flex items-center justify-between rounded-2xl border-small border-divider p-3 mr-4 ml-4  bg-white shadow-sm ">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <Button isIconOnly size="sm" variant="light" onPress={onToggle}>
              <PanelLeftClose
                className="text-blue-500"
                size={24}
                color="#01BCB4"
              />
            </Button>
            <h2 className="text-medium font-medium text-[#4F5665] hidden sm:block">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-blue-50 px-3 py-1 rounded-full flex items-center">
              <Clock
                className="mr-2"
                size={20}
                color="black"
              />
              <span className="text-sm text-[#4F5665] hidden sm:block">
                แพ็คเกจเหลือ 29 วัน
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium">{userName}</div>
              </div>
                  {/*<Avatar
                src={userImage}
                name={userName}
                className="cursor-pointer"
                 // onClick={() => router.push("/profile")}
              />*/}
              <button
                className="text-sm font-medium bg-[#ff5757] text-white py-1.5 px-2 rounded-md hover:bg-[#e73333]"
                onClick={async () => await logOut()}>
                  ออกจากระบบ
              </button>
            </div>
          </div>
        </header>

        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
