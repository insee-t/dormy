import { useState } from 'react'; //  Added useState for mobile menu
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import DormyIcon from '../../public/assets/Logo.png';
import UserImg from '../../public/assets/userImg.jpg';
// import Bars from '../../public/assets/bars.png';
import { Menu as MenuIcon } from "lucide-react";  // Alias Menu icon as MenuIcon


const navigation = [
  { name: 'ดูบิลออนไลน์', href: '#' },
  { name: 'แจ้งชำระเงินออนไลน์', href: '#' },
  { name: 'กระดานข่าวสาร', href: '#' },
  { name: 'การแจ้งเตือน', href: '#' },
  { name: 'วิเคราะห์ค่าห้อง', href: '#' },
  { name: 'คอมมูนิตี้', href: '#' },
  { name: 'ส่วนกลาง', href: '#' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function UserNavbar() {
  const [isOpen, setIsOpen] = useState(false); //  Added mobile menu state

  return (
    <Disclosure as="nav" className="bg-#9bc7d7 w-full">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-2">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex items-center">
              <Image alt="DormyIcon" src={DormyIcon} className="h-12 w-auto" />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={classNames(
                      item.current ? 'bg-#3491b4 text-white' : 'text-#0B132A hover:bg-#3491b4 hover:text-#F8F8F8',
                      'rounded-md px-4 py-4 text-sm font-medium',
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:flex sm:items-center sm:gap-4 w-full sm:w-auto">
            {/* Profile Section */}
            <div className="ml-2 sm:block relative flex items-center justify-center rounded-full bg-white w-10 h-10">
              <Image src={UserImg} alt="Person Icon" className="size-full object-cover rounded-full" />
            </div>

            <div className="underline flex-1 text-black font-medium sm:text-right text-left mx-4 ">
              มานีมีใจ
            </div>

            {/* Profile dropdown (Desktop only) */}
            <Menu as="div" className="relative ml-3 hidden sm:block">
              <div>
                <MenuButton className="relative flex rounded-full text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                  <span className="absolute-inset-1.5" />
                  <MenuIcon/>
                  {/* <Image src={Bars} className="size-6 w-full" /> */}
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="bg-white absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <MenuItem>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-#EEEFF2">ข้อมูลส่วนตัว</a>
                </MenuItem>
                <MenuItem>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-#EEEFF2">ข้อมูลหอพัก</a>
                </MenuItem>
                <MenuItem>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-#EEEFF2">ออกจากระบบ</a>
                </MenuItem>
              </MenuItems>
            </Menu>

            {/* 🔹 Mobile Menu Button (Only on Mobile) */}
            <div className="sm:hidden flex justify-center">
              <button onClick={() => setIsOpen(!isOpen)} className="text-black focus:outline-none">
                {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/*  Mobile Fullscreen Menu (Only visible when open) */}
      {isOpen && (
        <div className="sm:hidden bg-white py-4 w-full">
          <div className="flex flex-col gap-2 px-4">
            {/* Navigation Links */}
            {navigation.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="block text-center border-2 bg-#EEEFF2 rounded-lg py-2 text-black hover:bg-gray-300"
              >
                {item.name}
              </a>
            ))}

            {/* Divider */}
            <hr className="border-gray-300 my-2" />

            {/* Profile Menu Items */}
            <a href="#" className="block text-center border-2 bg-#EEEFF2 rounded-lg py-2 text-black hover:bg-gray-300">ข้อมูลส่วนตัว</a>
            <a href="#" className="block text-center border-2 bg-#EEEFF2 rounded-lg py-2 text-black hover:bg-gray-300">ข้อมูลหอพัก</a>
            <a href="#" className="block text-center border-2 bg-#EEEFF2 rounded-lg py-2 text-black hover:bg-gray-300">ออกจากระบบ</a>
          </div>
        </div>
      )}
    </Disclosure>
  );
}
