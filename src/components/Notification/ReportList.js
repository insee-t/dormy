import ReportItem from "./ReportItem";


const ReportList = ({ reports, updateReportStatus }) => {
  return (
    <>
      {reports.length > 0 ? (
        reports.map((report) => (
          <ReportItem key={report.id} report={report} updateReportStatus={updateReportStatus} />
        ))
      ) : (
        <p className="text-center text-#DDDDDD">ไม่มีข้อมูลการแจ้ง</p>
      )}
    </>
  );
};

export default ReportList;
