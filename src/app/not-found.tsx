"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Home, 
  Search, 
  ArrowLeft, 
  RefreshCw, 
  AlertTriangle, 
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Shield
} from 'lucide-react';

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
      // You can implement actual search functionality here
      // For now, we'll just navigate to the dashboard
      router.push('/dashboard');
    }, 1000);
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const quickLinks = [
    {
      title: 'แดชบอร์ด',
      description: 'เข้าถึงแดชบอร์ดหลักของคุณ',
      href: '/dashboard',
      icon: <Shield className="h-5 w-5" />,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      title: 'พอร์ทัลผู้เช่า',
      description: 'เข้าสู่ระบบและจัดการผู้เช่า',
      href: '/tenant/login',
      icon: <MapPin className="h-5 w-5" />,
      color: 'bg-green-100 text-green-800'
    },
    {
      title: 'การสมัครสมาชิก',
      description: 'จัดการการสมัครสมาชิกของคุณ',
      href: '/dashboard/subscription',
      icon: <ExternalLink className="h-5 w-5" />,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      title: 'ติดต่อฝ่ายสนับสนุน',
      description: 'รับความช่วยเหลือจากทีมของเรา',
      href: 'mailto:support@mydormy.com',
      icon: <Mail className="h-5 w-5" />,
      color: 'bg-orange-100 text-orange-800'
    }
  ];

  const commonPages = [
    { name: 'หน้าแรก', href: '/' },
    { name: 'แดชบอร์ด', href: '/dashboard' },
    { name: 'เข้าสู่ระบบผู้เช่า', href: '/tenant/login' },
    { name: 'เข้าสู่ระบบ', href: '/sign-in' },
    { name: 'สมัครสมาชิก', href: '/sign-up' },
    { name: 'การสมัครสมาชิก', href: '/dashboard/subscription' },
    { name: 'จัดการธนาคาร', href: '/dashboard/bank' },
    { name: 'แพ็คเกจ', href: '/dashboard/packages' },
    { name: 'ร้องเรียน', href: '/dashboard/complaints' },
    { name: 'อ่านมิเตอร์', href: '/dashboard/meter' },
    { name: 'ใบแจ้งหนี้ค่าเช่า', href: '/dashboard/rent-bill' },
    { name: 'สร้างห้อง', href: '/dashboard/create-rooms' },
    { name: 'อพาร์ทเมนต์ใหม่', href: '/dashboard/new-apartment' },
    { name: 'ตรวจสอบใบเสร็จ', href: '/dashboard/review-reciept' },
    { name: 'ใบแจ้งหนี้ผู้เช่า', href: '/tenant/bills' },
    { name: 'ซ่อมบำรุงผู้เช่า', href: '/tenant/maintenance' },
    { name: 'แดชบอร์ดผู้เช่า', href: '/tenant/dashboard' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#018c98]/5 via-white to-[#018c98]/10 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/assets/Logo.png"
              alt="Dormy Logo"
              width={200}
              height={60}
              className="mx-auto mb-6"
            />
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="w-24 h-24 bg-[#018c98]/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-12 h-12 text-[#018c98]" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#018c98] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">4</span>
              </div>
              <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-[#018c98] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">4</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            ไม่พบหน้าเว็บ
          </h1>
          
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            อุ๊ปส์! หน้าเว็บที่คุณกำลังค้นหาไม่มีอยู่ อาจถูกย้าย ลบ หรือคุณป้อน URL ผิด
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              onClick={handleGoBack}
              variant="outline"
              className="flex items-center gap-2 border-[#018c98] text-[#018c98] hover:bg-[#018c98] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              กลับไป
            </Button>
            
            <Button 
              onClick={handleRefresh}
              variant="outline"
              className="flex items-center gap-2 border-[#018c98] text-[#018c98] hover:bg-[#018c98] hover:text-white"
            >
              <RefreshCw className="h-4 w-4" />
              รีเฟรชหน้า
            </Button>
            
            <Link href="/">
              <Button className="flex items-center gap-2 bg-[#018c98] hover:bg-[#018c98]/90">
                <Home className="h-4 w-4" />
                หน้าแรก
              </Button>
            </Link>
          </div>
        </div>

        {/* Search Section */}
        <Card className="mb-8 border-[#018c98]/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#018c98]">
              <Search className="h-5 w-5" />
              ค้นหาสิ่งที่คุณต้องการ
            </CardTitle>
            <CardDescription>
              หาสิ่งที่คุณต้องการไม่เจอ? ลองค้นหาในเว็บไซต์ของเรา
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="ค้นหาหน้าเว็บ ฟีเจอร์ หรือความช่วยเหลือ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-[#018c98]/30 focus:border-[#018c98] focus:ring-[#018c98]/20"
              />
              <Button type="submit" disabled={isSearching} className="bg-[#018c98] hover:bg-[#018c98]/90">
                {isSearching ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                {isSearching ? 'กำลังค้นหา...' : 'ค้นหา'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
            นำทางด่วน
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => (
              <Link key={index} href={link.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full border-[#018c98]/10 hover:border-[#018c98]/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${link.color}`}>
                        {link.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{link.title}</h3>
                        <p className="text-sm text-gray-600">{link.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Common Pages */}
        <Card className="border-[#018c98]/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#018c98]">หน้าที่ยอดนิยม</CardTitle>
            <CardDescription>
              นี่คือหน้าที่ยอดนิยมที่อาจช่วยให้คุณพบสิ่งที่คุณกำลังค้นหา
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {commonPages.map((page, index) => (
                <Link key={index} href={page.href}>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-left h-auto p-2 hover:bg-[#018c98]/10 hover:text-[#018c98]"
                  >
                    {page.name}
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <Alert className="max-w-2xl mx-auto border-[#018c98]/20 bg-[#018c98]/5">
            <AlertTriangle className="h-4 w-4 text-[#018c98]" />
            <AlertDescription>
              <strong>ต้องการความช่วยเหลือ?</strong> หากคุณยังคงมีปัญหาในการค้นหาสิ่งที่ต้องการ 
              กรุณาติดต่อทีมสนับสนุนของเราที่{' '}
              <a href="mailto:support@mydormy.com" className="text-[#018c98] hover:underline font-medium">
                support@mydormy.com
              </a>{' '}
              หรือโทรหาเราที่{' '}
              <a href="tel:+66123456789" className="text-[#018c98] hover:underline font-medium">
                +66 123 456 789
              </a>
            </AlertDescription>
          </Alert>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500">
          <p className="text-sm">
            ข้อผิดพลาด 404 • ไม่พบหน้าเว็บ • ระบบจัดการ Dormy
          </p>
          <p className="text-xs mt-2">
            หากคุณเชื่อว่านี่เป็นข้อผิดพลาด กรุณารายงานให้ทีมเทคนิคของเราทราบ
          </p>
        </div>
      </div>
    </div>
  );
} 