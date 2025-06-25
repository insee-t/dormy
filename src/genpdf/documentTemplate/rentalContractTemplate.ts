interface RentalData {
  contractCreationPlace: string;
  contractCreationDate: string;
  dormName: string;
  dormAddress: {
    houseNumber: string;
    alley: string;
    road: string;
    subDistrict: string;
    district: string;
    province: string;
  };
  tenantName: string;
  tenantAddress: {
    houseNumber: string;
    alley: string;
    road: string;
    subDistrict: string;
    district: string;
    province: string;
  };
  tenantNationalId: string;
  tenantPhoneNumber: string;
  roomNumber: string;
  floorNumber: string;
  contractDuration: string;
  monthlyRent: string;
  monthlyRentTextThai: string;
  contractStartDate: string;
  paymentDueDate: string;
  roomDeposit: string;
  roomDepositTextThai: string;
  latePaymentFee: string;
  returnRoomPeriod: string;
  additionalCondition: string[];
}

const rentalContractTemplate = (rentalData: RentalData): string => {
  const getThaiDate = (date: string) => {
    const dateObj = new Date(date) || null;
    return {
      day: dateObj.getDate().toString().padStart(2, "0") || "",
      month: dateObj.toLocaleString("th-TH", { month: "long" }) || "",
      year: dateObj.getFullYear() + 543 || "", // Convert to Buddhist calendar
    };
  };
  
  const contractCreateDate = getThaiDate(rentalData.contractCreationDate);
  const contractStartDate = getThaiDate(rentalData.contractStartDate);

  return `
      <!DOCTYPE html>
<html lang="th">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;700&display=swap"
      rel="stylesheet"
    />

    <title>สัญญาเช่าทั่วไป</title>
    <style>
    
      @page {
        size: A4;
        margin-top:3.175cm;
        margin-bottom:3.175cm;
        margin-right:2.54cm;
        margin-left:2.54cm; 
      }

      body {
      /* chat said it render to pdf as it render on browser */
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;

        font-family: "Sarabun", mono;
        font-style: normal;
        line-height: 1.6;
        font-size: 16px;
        font-weight: normal;
        font-weight: 300;
        // word-wrap: break-word;
        // overflow-wrap: break-word;
      }

      /* Allow page breaks between sections if needed */
      .contract-content {
      page-break-after: auto;
      }

      /* Avoid breaking signature sections */
      .signature-space {
        page-break-inside: avoid;
      }

      .contract-title {
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        font-weight:600;
      }

      .right-align {
        text-align: right;
      }

      .signature-space {
        display: flex;
        flex-direction: column;
        width: 100%;
        align-items: flex-end;
      }

      .dataSlot {
        font-style: italic;
        text-decoration-line: underline;
        text-decoration-style: solid;
      }
    </style>
  </head>
  <body>
    <div class="contract">
      <div class="contract-title">สัญญาเช่าทั่วไป</div>
      <p></p>
      <div class="contract-content">
        <div class="right-align">
          ทำที่
          <span class="dataSlot"> ${rentalData.contractCreationPlace} </span>
        </div>
        <div class="right-align">
          วันที่
          <span class="dataSlot"> ${contractCreateDate.day} </span>
          เดือน
          <span class="dataSlot"> ${contractCreateDate.month} </span>
          พ.ศ.
          <span class="dataSlot"> ${contractCreateDate.year} </span>
        </div>
        <p></p>
        <p class="">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          สัญญาเช่าฉบับนี้ทำขึ้นระหว่าง
          <span class="dataSlot"> ${rentalData.dormName} </span>
          <br />
          อยู่บ้านเลขที่
          <span class="dataSlot"> ${rentalData.dormAddress.houseNumber} </span>
          ตรอก/ซอย
          <span class="dataSlot"> ${rentalData.dormAddress.alley} </span>
          ถนน
          <span class="dataSlot"> ${rentalData.dormAddress.road} </span>
          <br />
          ตำบล/แขวง
          <span class="dataSlot"> ${rentalData.dormAddress.subDistrict} </span>
          อำเภอ/เขต
          <span class="dataSlot"> ${rentalData.dormAddress.district} </span>
          จังหวัด
          <span class="dataSlot"> ${rentalData.dormAddress.province} </span>
          <br />
          ซึ่งต่อไปในสัญญานี้จะเรียกว่า
          <span className="font-weight:bold">"ผู้ให้เช่า"</span> ฝ่ายหนึ่งกับ
          <span class="dataSlot"> ${rentalData.tenantName} </span>
          หมายเลขบัตรประชาชน
          <span class="dataSlot"> ${rentalData.tenantNationalId} </span>
          <br />
          อยู่บ้านเลขที่
          <span class="dataSlot"> ${rentalData.dormAddress.houseNumber} </span>
          ตรอก/ซอย
          <span class="dataSlot"> ${rentalData.dormAddress.alley} </span>
          ถนน
          <span class="dataSlot"> ${rentalData.dormAddress.road} </span>
          <br />
          ตำบล/แขวง
          <span class="dataSlot"> ${rentalData.dormAddress.subDistrict} </span>
          อำเภอ/เขต
          <span class="dataSlot"> ${rentalData.dormAddress.district} </span>
          จังหวัด
          <span class="dataSlot"> ${rentalData.dormAddress.province} </span>
          <br />
          ซึ่งต่อไปนี้ในสัญญานี้จะเรียกว่า
          <span class="dataSlot">"ผู้เช่า"</span> อีกฝ่ายหนึ่ง
          ทั้งสองฝ่ายได้ตกลงทำสัญญาเช่ากันมีข้อความดังนี้
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          ข้อ 1.ผู้ให้เช่าตกลงให้เช่าและผู้เช่าตกลงเช่า
          <span class="dataSlot"> ${rentalData.dormName} </span> ชั้น
          <span class="dataSlot"> ${rentalData.floorNumber} </span>
          ห้อง
          <span class="dataSlot"> ${rentalData.roomNumber} </span>
          มีกำหนดระยะเวลาการเช่า
          <span class="dataSlot"> ${rentalData.contractDuration} </span>
          ปี นับแต่วันทำสัญญาเช่าฉบับนี้เป็นต้นไป
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp
          ข้อ 2.ผู้เช่ามีวัตถุประสงค์ในการเช่าทรัพย์ตามข้อ 1
          เพื่ออยู่อาศัยโดยผู้เช่าจะใช้ทรัพย์สินเพื่อการอย่างอื่น
          นอกจากที่ระบุไว้ได้โดยได้รับความยินยอมเป็นหนังสือจากผู้ให้เช่า
          แต่ผู้เช่าจะใช้ทรัพย์สินที่เช่าเพื่อการอันไม่ชอบด้วยกฎหมายนั้นไม่ได้เด็ดขาด
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          ข้อ 3.ในการทำสัญญาดังกล่าวในข้อ 1
          ผู้เช่าตกลงที่จะชำระค่าเช่าให้แก่ผู้ให้เช่าเป็นรายเดือนในอัตราค่าเช่า
          <span class="dataSlot"> ${rentalData.monthlyRent} </span> บาท (
          <span class="dataSlot"> ${rentalData.monthlyRentTextThai} </span>
          ) โดยผู้เช่าตกลงจะชำระเงินค่าเช่าให้แก่ผู้ให้เช่าภายในวันที่
          <span class="dataSlot"> ${rentalData.paymentDueDate} </span>
          ของทุกเดือน เริ่มตั้งแต่ วันที่
          <span class="dataSlot"> ${contractStartDate.day} </span>
          เดือน
          <span class="dataSlot"> ${contractStartDate.month} </span>
          พ.ศ.
          <span class="dataSlot"> ${contractStartDate.year} </span>
          เป็นต้นไป ถ้าผู้เช่าผิดนัดไม่ชำระค่าเช่าตามกำหนดดังกล่าวแล้ว
          ผู้เช่ายินยอมให้ถือว่าสัญญาเช่านี้ระงับลงโดยมิพักต้องบอกกล่าวก่อน
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ข้อ
          4.เพื่อเป็นการประกันในการปฏิบัติตามสัญญาเช่า
          ผู้เช่าตกลงมอบเงินเป็นประกันการเช่าจำนวน
          <span class="dataSlot"> ${rentalData.roomDeposit} </span> บาท (
          <span class="dataSlot"> ${rentalData.roomDepositTextThai} </span>
          )
          ให้แก่ผู้ให้เช่าและผู้ให้เช่าได้รับเงินจำนวนดังกล่าวไปเรียบร้อยแล้วในวันที่ทำสัญญาฉบับนี้
          ถ้าผู้เช่าเช่าครบกำหนดตามสัญญาผู้ให้เช่ายินดีคืนเงินประกันให้
          โดยหักค่าใช้จ่ายหรือค่าเสียหายเท่าที่จำเป็น
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ข้อ
          5.ผู้เช่ารับว่าจะไม่ให้ผู้อื่นเช่าช่วงหรือโอนสิทธิตามสัญญาเช่าไม่ว่าทั้งหมดหรือแต่บางส่วนให้แก่บุคคลภายนอก
          เว้นแต่จะได้รับอนุญาตจากผู้ให้เช่าเป็นลายลักษณ์อักษรเสียก่อน
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ข้อ
          6.ผู้เช่าต้องยินยอมให้ผู้ให้เช่าหรือตัวแทนของผู้ให้เช่าเข้าตรวจตราทรัพย์สินที่เช่าเป็นครั้งคราวในเวลาและระยะเวลาอันสมควร
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ข้อ
          7.ทรัพย์สินที่เช่านั้นผู้เช่าจะทำการดัดแปลงหรือต่อเติมอย่างหนึ่งอย่างใดหาได้ไม่
          นอกจากที่ใช้กันตามจารีตประเพณีนิยมปกติ
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ข้อ
          8.ผู้เช่าต้องรับผิดชอบในการดูแลรักษาทรัพย์สินที่เช่าและเครื่องใช้ต่างๆ
          ให้อยู่ในสภาพที่ดีและใช้อย่างระมัดระวัง
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ข้อ
          9.เมื่อครบกำหนดสัญญาเช่าหรือเมื่อสัญญาเช่าถูกยกเลิก
          ผู้เช่าต้องส่งมอบทรัพย์สินที่เช่าให้แก่ผู้ให้เช่าในสภาพเดิม
          เว้นแต่ความเสื่อมสภาพตามปกติ
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ข้อ
          10.หากผู้เช่าประสงค์จะต่อสัญญาเช่า
          ต้องแจ้งให้ผู้ให้เช่าทราบล่วงหน้าอย่างน้อย 30 วัน
          ก่อนครบกำหนดสัญญา
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ข้อ
          11.สัญญาเช่าฉบับนี้มีผลบังคับใช้ตั้งแต่วันที่ลงนามเป็นต้นไป
          และให้ถือเป็นสัญญาที่สมบูรณ์ระหว่างคู่สัญญาทั้งสองฝ่าย
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ข้อ
          12.หากมีข้อพิพาทใดๆ เกิดขึ้นจากสัญญาเช่าฉบับนี้
          ให้คู่สัญญาทั้งสองฝ่ายพยายามแก้ไขโดยการเจรจา
          หากไม่สามารถตกลงกันได้ ให้ยื่นฟ้องต่อศาลที่มีเขตอำนาจ
          <br />
          <br />
          <br />
          <div class="signature-space">
            <p>
              ลงนามผู้ให้เช่า
              <br />
              <br />
              <br />
              <br />
              (________________________)
              <br />
              วันที่ _________________
            </p>
            <p>
              ลงนามผู้เช่า
              <br />
              <br />
              <br />
              <br />
              (________________________)
              <br />
              วันที่ _________________
            </p>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
  `;
};

export default rentalContractTemplate; 