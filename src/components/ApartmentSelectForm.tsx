import React from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface Apartment {
  id: number;
  name: string;
  address: string;
}

interface ApartmentSelectFormProps {
  apartments: Apartment[];
  currentApartment: number;
}

const ApartmentSelectForm: React.FC<ApartmentSelectFormProps> = ({ apartments, currentApartment }) => {
  const currentApartmentData = apartments[currentApartment];
  
  return (
    <div className="flex gap-2 items-center">
      <form method="get" className="flex gap-2 items-center">
        <button className="flex px-3 py-1 bg-slate-100 border border-slate-300 rounded-md text-[#018c98] items-center hover:bg-slate-200">
          เลือก
        </button>
        <select
          name="apartment"
          className="px-3 py-1 text-xl font-semibold rounded-md w-64 border border-slate-300"
          defaultValue={currentApartment}
        >
          {apartments.map((apartment, index) => (
            <option key={apartment.id} value={index}>
              {apartment.name} - {apartment.address}
            </option>
          ))}
        </select>
      </form>
      
      {currentApartmentData && (
        <Button
          asChild
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <a href={`/dashboard/apartments/${currentApartmentData.id}/edit`}>
            <Edit className="h-4 w-4" />
            แก้ไข
          </a>
        </Button>
      )}
    </div>
  );
};

export default ApartmentSelectForm; 