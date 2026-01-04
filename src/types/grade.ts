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

export function calculateGPA(grades: GradeItem[]): number {
  const gradedItems = grades.filter((g) => isGradedSubject(g.diemChu));

  if (gradedItems.length === 0) return 0;

  const totalPoints = gradedItems.reduce((sum, grade) => {
    return sum + (grade.diemChu != "DT" ? convertToGPA4(grade.diemChu) * grade.soTinChi : 0);
  }, 0);

  const totalCredits = gradedItems.reduce((sum, grade) => sum + grade.soTinChi, 0);

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
