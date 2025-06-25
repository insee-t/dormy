import { CheckCircle, XCircle, Check } from "lucide-react";

// Mapping report types to Thai
const reportTypeMapping = {
  "repairing": "แจ้งซ่อม",
  "cleaning": "แจ้งทำความสะอาด",
  "moving-out": "แจ้งย้ายออก",
  "emergency": "แจ้งฉุกเฉิน",
  "other": "แจ้งอื่นๆ"
};

// Function to format date to Thai format
const formatDateToThai = (dateString) => {
  if (!dateString) return "ไม่ระบุวันที่"; // Fallback if no date is provided

  const date = new Date(dateString);

  return new Intl.DateTimeFormat("th-TH", {
    weekday: "long",
    day: "numeric", month: "long",
    year: "numeric",
  }).format(date);
};

const ReportItem = ({ report, updateReportStatus }) => {
  const translatedType = reportTypeMapping[report.typeOfReport] || "ไม่ระบุ"; // Translate report type

  return (
    <div className="p-4 border-b flex justify-between items-center">
      <div>
        <p>{translatedType}</p>
        <p>{formatDateToThai(report.timeStamp)}</p>
        <p><strong>ผู้แจ้ง:</strong> {report.user || "ไม่ระบุผู้แจ้ง"}</p> {/* Fallback for user */}
        <p><strong>รายละเอียด:</strong> {report.detail || "ไม่มีรายละเอียด"}</p> {/* Fallback for details */}
        <p><strong>สถานะ:</strong> {report.status === "done" ? "✅ เสร็จสิ้น" : report.status === "pending" ? "⏳ รอดำเนินการ" : "❌ ถูกยกเลิก"}</p>
      </div>

      {/* Display the buttons only if the status is 'pending' */}
      {report.status === "pending" && (
        <div className="flex gap-3">
          {/* Approve Button */}
          <button
            className="flex items-center gap-2 bg-#2FAB73 text-white px-4 py-2 rounded-lg hover:bg-#04924e"
            onClick={() => updateReportStatus(report.id, "done")} // Update status to "approved"
          >
            <Check className="h-5 w-5" />
            อนุมัติ
          </button>

          {/* Cancel Button */}
          <button
            className="flex items-center gap-2 bg-#ff5757 text-white px-4 py-2 rounded-lg hover:bg-#e73333"
            onClick={() => updateReportStatus(report.id, "cancel")} // Update status to "cancelled"
          >
            <XCircle className="h-5 w-5" />
            ยกเลิก
          </button>
        </div>
      )}

      {/* Display the 'Done' button only if the status is not 'done' */}
      {report.status === "approved" && (
        <button
          className="flex items-center gap-2 bg-#9bc7d7 text-white px-4 py-2 rounded-lg hover:bg-#04924e"
          onClick={() => updateReportStatus(report.id, "done")} // Update status to "done"
        >
          <CheckCircle className="h-5 w-5" />
          ทำเครื่องหมายเสร็จสิ้น
        </button>
      )}
    </div>
  );
};

export default ReportItem;
