export interface GradeItem {
  sinhVienId: number;
  namHocHocKyId: number;
  maHocKy: string;
  monHocId: number;
  maMonHoc: string;
  tenMonHoc: string;
  soTinChi: number;
  diemChu: string;
  diemSo: number;
  diemDat: string;
  tinhTrangDiem: string | null;
  diemKhongIn: string;
  nhomTo: string;
  ghiChu: string;
  code: string;
  msg: string;
}

export interface GradeWithGPA extends GradeItem {
  diemHe4: number;
}

export function convertToGPA4(diemChu: string): number {
  const gradeMap: Record<string, number> = {
    "A+": 4.0,
    "A": 4.0,
    "B+": 3.5,
    "B": 3.0,
    "C+": 2.5,
    "C": 2.0,
    "D+": 1.5,
    "D": 1.0,
    "F": 0,
    "DT": 4,
    "MT": 0,
  };

  return gradeMap[diemChu] ?? 0;
}

export function isGradedSubject(diemChu: string): boolean {
  const excludedGrades = ["MT", "KD", ""];
  return !excludedGrades.includes(diemChu);
}

function isCountedForGPA(diemChu: string): boolean {
  return ["A+", "A", "B+", "B", "C+", "C", "D+", "D"].includes(diemChu);
}

export function calculateGPA(grades: GradeItem[]): number {
  let totalPoints = 0;
  let totalCredits = 0;

  for (const g of grades) {
    if (!isCountedForGPA(g.diemChu)) continue;

    totalCredits += g.soTinChi;
    totalPoints += convertToGPA4(g.diemChu) * g.soTinChi;
  }

  return totalCredits > 0 ? totalPoints / totalCredits : 0;
}

export function getGradeColor(diemChu: string): string {
  if (["A+", "A"].includes(diemChu)) return "text-success";
  if (["B+", "B"].includes(diemChu)) return "text-primary";
  if (["C+", "C"].includes(diemChu)) return "text-warning";
  if (["D+", "D"].includes(diemChu)) return "text-orange-500";
  if (diemChu === "F") return "text-destructive";
  return "text-muted-foreground";
}

export const REQUIRED_COURSES = [
  { monHocId: "CO1007", tenMonHoc: "Cấu trúc Rời rạc cho Khoa học Máy tính", soTinChi: 4, Diem_macdinh: "F", Dudoan_diemChu: "B" },
  { monHocId: "CO2011", tenMonHoc: "Mô hình hóa Toán học", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "B" },

  { monHocId: "MT1003", tenMonHoc: "Giải tích 1", soTinChi: 4, Diem_macdinh: "F", Dudoan_diemChu: "A" },
  { monHocId: "MT1005", tenMonHoc: "Giải tích 2", soTinChi: 4, Diem_macdinh: "F", Dudoan_diemChu: "A" },
  { monHocId: "MT1007", tenMonHoc: "Đại số Tuyến tính", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "A" },
  { monHocId: "MT2013", tenMonHoc: "Xác suất và Thống kê", soTinChi: 4, Diem_macdinh: "F", Dudoan_diemChu: "A" },

  { monHocId: "CH1003", tenMonHoc: "Hóa đại cương", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "A" },
  { monHocId: "PH1003", tenMonHoc: "Vật lý 1", soTinChi: 4, Diem_macdinh: "F", Dudoan_diemChu: "A" },
  { monHocId: "PH1007", tenMonHoc: "Thí nghiệm Vật lý", soTinChi: 1, Diem_macdinh: "F", Dudoan_diemChu: "A" },

  { monHocId: "SP1007", tenMonHoc: "Pháp luật Việt Nam Đại cương", soTinChi: 2, Diem_macdinh: "F", Dudoan_diemChu: "B" },
  { monHocId: "SP1031", tenMonHoc: "Triết học Mác - Lênin", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "B" },
  { monHocId: "SP1033", tenMonHoc: "Kinh tế Chính trị Mác - Lênin", soTinChi: 2, Diem_macdinh: "F", Dudoan_diemChu: "B" },
  { monHocId: "SP1035", tenMonHoc: "Chủ nghĩa Xã hội Khoa học", soTinChi: 2, Diem_macdinh: "F", Dudoan_diemChu: "B" },
  { monHocId: "SP1037", tenMonHoc: "Tư tưởng Hồ Chí Minh", soTinChi: 2, Diem_macdinh: "F", Dudoan_diemChu: "B" },
  { monHocId: "SP1039", tenMonHoc: "Lịch sử Đảng Cộng sản Việt Nam", soTinChi: 2, Diem_macdinh: "F", Dudoan_diemChu: "B" },

  { monHocId: "LA1003", tenMonHoc: "Anh văn 1", soTinChi: 2, Diem_macdinh: "DT", Dudoan_diemChu: "DT" },
  { monHocId: "LA1005", tenMonHoc: "Anh văn 2", soTinChi: 2, Diem_macdinh: "DT", Dudoan_diemChu: "DT" },
  { monHocId: "LA1007", tenMonHoc: "Anh văn 3", soTinChi: 2, Diem_macdinh: "DT", Dudoan_diemChu: "DT" },
  { monHocId: "LA1009", tenMonHoc: "Anh văn 4", soTinChi: 2, Diem_macdinh: "DT", Dudoan_diemChu: "DT" },

  { monHocId: "CO1005", tenMonHoc: "Nhập môn Điện toán", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "A" },

  { monHocId: "IM1013", tenMonHoc: "Kinh tế học Đại cương", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "B" },
  { monHocId: "IM1023", tenMonHoc: "Quản lý Sản xuất cho Kỹ sư", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "B" },
  { monHocId: "IM1025", tenMonHoc: "Quản lý Dự án cho Kỹ sư", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "B" },
  { monHocId: "IM1027", tenMonHoc: "Kinh tế Kỹ thuật", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "B" },
  { monHocId: "IM3001", tenMonHoc: "Quản trị Kinh doanh cho Kỹ sư", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "B" },

  { monHocId: "CO2001", tenMonHoc: "Kỹ năng Chuyên nghiệp cho Kỹ sư", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "A" },

  { monHocId: "CO1023", tenMonHoc: "Hệ thống số", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "B" },
  { monHocId: "CO1027", tenMonHoc: "Kỹ thuật Lập trình", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "A" },
  { monHocId: "CO2003", tenMonHoc: "Cấu trúc Dữ liệu và Giải Thuật", soTinChi: 4, Diem_macdinh: "F", Dudoan_diemChu: "A" },
  { monHocId: "CO2007", tenMonHoc: "Kiến trúc Máy tính", soTinChi: 4, Diem_macdinh: "F", Dudoan_diemChu: "B" },
  { monHocId: "CO2013", tenMonHoc: "Hệ cơ sở Dữ liệu", soTinChi: 4, Diem_macdinh: "F", Dudoan_diemChu: "B" },
  { monHocId: "CO2039", tenMonHoc: "Lập trình Nâng cao", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "A" },

  { monHocId: "CO2017", tenMonHoc: "Hệ điều hành", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "B" },
  { monHocId: "CO3001", tenMonHoc: "Công nghệ Phần mềm", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "B" },
  { monHocId: "CO3005", tenMonHoc: "Nguyên lý Ngôn ngữ Lập trình", soTinChi: 4, Diem_macdinh: "F", Dudoan_diemChu: "C" },
  { monHocId: "CO3093", tenMonHoc: "Mạng máy tính", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "B" },

  { monHocId: "CO3101", tenMonHoc: "Đồ án Tổng hợp - Hướng Trí tuệ Nhân tạo", soTinChi: 1, Diem_macdinh: "F", Dudoan_diemChu: "A" },
  { monHocId: "CO3103", tenMonHoc: "Đồ án Tổng hợp - Hướng Công nghệ Phần mềm", soTinChi: 1, Diem_macdinh: "F", Dudoan_diemChu: "A" },
  { monHocId: "CO3105", tenMonHoc: "Đồ án Tổng hợp - Hướng Hệ thống Thông tin", soTinChi: 1, Diem_macdinh: "F", Dudoan_diemChu: "A" },
  { monHocId: "CO3127", tenMonHoc: "Đồ án tổng hợp - Hướng kỹ thuật dữ liệu", soTinChi: 1, Diem_macdinh: "F", Dudoan_diemChu: "A" },

  { monHocId: "CO3107", tenMonHoc: "Thực tập Đồ án môn học Đa ngành - Hướng Trí tuệ Nhân tạo", soTinChi: 1, Diem_macdinh: "F", Dudoan_diemChu: "A" },
  { monHocId: "CO3109", tenMonHoc: "Thực tập Đồ án môn học Đa ngành - Hướng Công nghệ Phần mềm", soTinChi: 1, Diem_macdinh: "F", Dudoan_diemChu: "A" },
  { monHocId: "CO3111", tenMonHoc: "Thực tập Đồ án môn học Đa ngành - Hướng Hệ thống Thông tin", soTinChi: 1, Diem_macdinh: "F", Dudoan_diemChu: "A" },

  { monHocId: "CO3335", tenMonHoc: "Thực tập Ngoài trường", soTinChi: 2, Diem_macdinh: "F", Dudoan_diemChu: "A" },
  { monHocId: "CO4029", tenMonHoc: "Đồ án Chuyên ngành", soTinChi: 2, Diem_macdinh: "F", Dudoan_diemChu: "B" },
  { monHocId: "CO4337", tenMonHoc: "Đồ án Tốt nghiệp (Khoa học Máy tính)", soTinChi: 4, Diem_macdinh: "F", Dudoan_diemChu: "B" }
];

export const ADVANCED_ELECTIVE_COURSES = [
  { monHocId: "CO3011", tenMonHoc: "Quản lý Dự án Phần mềm", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "DT" },
  { monHocId: "CO3015", tenMonHoc: "Kiểm tra Phần mềm", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "DT" },
  { monHocId: "CO3017", tenMonHoc: "Kiến trúc Phần mềm", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "DT" },
  { monHocId: "CO3021", tenMonHoc: "Hệ Quản trị Cơ sở Dữ Liệu", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "DT" },
  { monHocId: "CO3023", tenMonHoc: "Cơ sở Dữ liệu Phân tán và Hướng đối tượng", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "DT" },
  { monHocId: "CO3027", tenMonHoc: "Thương mại Điện tử", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "DT" },
  { monHocId: "CO3029", tenMonHoc: "Khai phá Dữ liệu", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "DT" },
  { monHocId: "CO3031", tenMonHoc: "Phân tích và Thiết kế Giải Thuật", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "DT" },
  { monHocId: "CO3033", tenMonHoc: "Bảo mật Hệ thống Thông tin", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "DT" },
  { monHocId: "CO3035", tenMonHoc: "Hệ thời gian thực", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "DT" },
  { monHocId: "CO3037", tenMonHoc: "Phát triển Ứng dụng Internet of Things", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "DT" },
  { monHocId: "CO3041", tenMonHoc: "Hệ thống Thông minh", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "DT" },
  { monHocId: "CO3043", tenMonHoc: "Phát triển Ứng dụng trên Thiết bị Di động", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "DT" },
  { monHocId: "CO3045", tenMonHoc: "Lập trình Game", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "DT" },
  { monHocId: "CO3047", tenMonHoc: "Mạng máy tính nâng cao", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "DT" },
  { monHocId: "CO3049", tenMonHoc: "Lập trình Web", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "DT" },
  { monHocId: "CO3051", tenMonHoc: "Hệ thống thiết bị di động", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "DT" },
  { monHocId: "CO3057", tenMonHoc: "Xử lý Ảnh số và Thị giác Máy tính", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "DT" },
  { monHocId: "CO3059", tenMonHoc: "Đồ họa Máy tính", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "DT" },
  { monHocId: "CO3061", tenMonHoc: "Nhập môn Trí tuệ Nhân tạo", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "DT" },
  { monHocId: "CO3065", tenMonHoc: "Công nghệ Phần mềm Nâng cao", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "DT" },
  { monHocId: "CO3067", tenMonHoc: "Tính toán Song song", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "DT" },
  { monHocId: "CO3069", tenMonHoc: "Mật mã và An ninh mạng", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "DT" },
  { monHocId: "CO3071", tenMonHoc: "Hệ phân bố", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "DT" },
  { monHocId: "CO3083", tenMonHoc: "Mật mã học và Mã hóa Thông tin", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "DT" },
  { monHocId: "CO3085", tenMonHoc: "Xử lý Ngôn ngữ Tự nhiên", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "DT" },
  { monHocId: "CO3089", tenMonHoc: "Những Chủ đề Nâng cao trong Khoa học Máy tính", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "DT" },
  { monHocId: "CO3115", tenMonHoc: "Phân tích và Thiết kế Hệ thống", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "DT" },
  { monHocId: "CO3117", tenMonHoc: "Học máy", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "DT" },
  { monHocId: "CO4025", tenMonHoc: "Mạng xã hội và Thông tin", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "DT" },
  { monHocId: "CO4031", tenMonHoc: "Kho dữ Liệu và Hệ hỗ trợ Quyết định", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "DT" },
  { monHocId: "CO4033", tenMonHoc: "Phân tích Dữ liệu lớn và Trí tuệ Kinh doanh", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "DT" },
  { monHocId: "CO4035", tenMonHoc: "Hệ hoạch Định tài Nguyên tổ chức", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "DT" },
  { monHocId: "CO4037", tenMonHoc: "Hệ thống thông tin quản lý", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "DT" },
  { monHocId: "CO4039", tenMonHoc: "Bảo mật sinh trắc", soTinChi: 3, Diem_macdinh: "F", Dudoan_diemChu: "DT" },
];
