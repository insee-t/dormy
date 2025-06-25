import Image from 'next/image';

interface BankProviderLogoProps {
  bankProvider: string;
  className?: string;
}

export default function BankProviderLogo({ bankProvider, className = "max-w-32 h-auto" }: BankProviderLogoProps) {
  const getLogoPath = (provider: string) => {
    const logoMap: Record<string, string> = {
      'ธนาคารกรุงเทพ': '/assets/bankLogo/กรุงเทพ.png',
      'ธนาคารกสิกรไทย': '/assets/bankLogo/กสิกร.png',
      'ธนาคารกรุงไทย': '/assets/bankLogo/กรุงไทย2.png',
      'ธนาคารกรุงศรี': '/assets/bankLogo/กรุงศรี 2.png',
      'ธนาคารไทยพาณิชย์': '/assets/bankLogo/ไทยพาณิชย์ SCB.png',
      'ธนาคาร ธกส': '/assets/bankLogo/ธนาคาร ธกส.png',
      'ธนาคารออมสิน': '/assets/bankLogo/ออมสิน2.png',
      'ธนาคารอิสลาม': '/assets/bankLogo/ธนาคารอิสลาม.png',
      'promptpay': '/assets/bankLogo/พร้อมเพย์ 4.png',
    };

    return logoMap[provider] || '/assets/bankLogo/ttb.png'; // fallback
  };

  return (
    <div className="flex m-2 mr-4">
      <Image
        src={getLogoPath(bankProvider)}
        alt={`${bankProvider} logo`}
        width={128}
        height={128}
        className={className}
      />
    </div>
  );
} 