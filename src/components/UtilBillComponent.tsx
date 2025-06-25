interface meter {
      id: number;
      late: boolean | null;
      paid: boolean;
      meter: number;
}

export default function UtilBillComponent(
  { name, waterMeterCurrent, waterMeterPrev, electricMeterCurrent, electricMeterPrev} : {
    name: string,
    waterMeterCurrent: meter | null ,
    waterMeterPrev: meter | null,
    electricMeterCurrent: meter | null,
    electricMeterPrev: meter | null}) {
  return <>
           <td className="px-4 py-0.25">{name}</td>
           <td className="px-4 py-0.25 text-center">
             <input
               type="number"
               defaultValue={waterMeterCurrent ? waterMeterCurrent.meter : 0}
               className="text-center border border-slate-300 w-28 bg-white rounded-md"/>
           </td>
           <td className="px-4 py-0.25 text-center">
             {
               waterMeterPrev ? waterMeterPrev.meter : (
                 <input
                   type="number"
                   defaultValue={0}
                   className="text-center border border-slate-300 w-22 bg-white rounded-md"/>)
             }
           </td>
           <td className="px-4 py-0.25 text-center">
             <input
               type="number"
               defaultValue={electricMeterCurrent ? electricMeterCurrent.meter : 0}
               className="text-center border border-slate-300 w-28 bg-white rounded-md"/>
           </td>
           <td className="px-4 py-0.25 text-center">
             {
               electricMeterPrev ? electricMeterPrev.meter : (
                 <input
                   type="number"
                   defaultValue={0}
                   className="text-center border border-slate-300 w-22 bg-white rounded-md"/>)
             }
           </td>
           <td className="px-4 py-0.25 text-center">
             <button
               className="bg-[#018c98] hover:bg-[#FFAC3E] rounded-lg text-white px-2">
               พิมพ์
             </button>
           </td>
           <td className="px-4 py-0.25 text-center">
             {!electricMeterCurrent || ! waterMeterCurrent ? "N/A" : (waterMeterCurrent.paid && electricMeterCurrent.paid ? "ชำระแล้ว": "ยังไม่ชำระ") }
           </td>
         </>
}
