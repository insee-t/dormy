"use client";

import { useState } from "react";
import generatePayload from "promptpay-qr";
import * as QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function TestQRPage() {
  const [phoneNumber, setPhoneNumber] = useState("0812345678");
  const [amount, setAmount] = useState("1000");
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const generateQR = async () => {
    try {
      // Remove any non-digit characters from phone number
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      
      // Generate PromptPay QR code payload
      const payload = generatePayload(cleanPhone, { amount: parseInt(amount) });
      console.log("PromptPay Payload:", payload);
      
      // Convert payload to QR code image
      const qrCodeImage = await QRCode.toDataURL(payload, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setQrCodeUrl(qrCodeImage);
    } catch (error) {
      console.error("Error generating QR code:", error);
      alert("Error generating QR code: " + error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test PromptPay QR Code Generation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="phone">Phone Number:</Label>
            <Input
              id="phone"
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="0812345678"
            />
          </div>
          
          <div>
            <Label htmlFor="amount">Amount (THB):</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1000"
            />
          </div>
          
          <Button onClick={generateQR} className="w-full">
            Generate QR Code
          </Button>
          
          {qrCodeUrl && (
            <div className="text-center space-y-4">
              <Image
                src={qrCodeUrl}
                alt="PromptPay QR Code"
                width={300}
                height={300}
                className="mx-auto border"
              />
              <p className="text-sm text-gray-600">
                Phone: {phoneNumber} | Amount: ฿{parseInt(amount).toLocaleString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 