import { useState, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  GradeItem,
  calculateGPA,
  isGradedSubject,
  getGradeColor,
  convertToGPA4,
  REQUIRED_COURSES,
  ADVANCED_ELECTIVE_COURSES
} from "@/types/grade";
import {
  BarChart3,
  Calculator,
  AlertCircle,
  RotateCcw,
  ShieldCheck,
  FileText,
  PieChart,
} from "lucide-react";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import gradeDistributionData from "@/data/gradeDistribution.json";

/* ===================== GRADE DISTRIBUTION TYPES ===================== */
interface GradeDistribution {
  monHocId: string;
  tenMonHoc: string;
  phanBoDiem: {
    "A+": number;
    "A": number;
    "B+": number;
    "B": number;
    "C+": number;
    "C": number;
    "D+": number;
    "D": number;
    "F": number;
  };
}

const GRADE_VALUES: Record<string, number> = {
  "A+": 4.0,
  "A": 4.0,
  "B+": 3.5,
  "B": 3.0,
  "C+": 2.5,
  "C": 2.0,
  "D+": 1.5,
  "D": 1.0,
  "F": 0
};

const PIE_COLORS = [
  "#22c55e", // A+ - green
  "#16a34a", // A - green darker
  "#3b82f6", // B+ - blue
  "#2563eb", // B - blue darker
  "#f59e0b", // C+ - amber
  "#d97706", // C - amber darker
  "#f97316", // D+ - orange
  "#ea580c", // D - orange darker
  "#ef4444", // F - red
];

function calculateAverageGrade(phanBoDiem: GradeDistribution["phanBoDiem"]): number {
  let totalPoints = 0;
  let totalStudents = 0;

  Object.entries(phanBoDiem).forEach(([grade, count]) => {
    totalPoints += GRADE_VALUES[grade] * count;
    totalStudents += count;
  });

  return totalStudents > 0 ? totalPoints / totalStudents : 0;
}

/* ===================== TYPES ===================== */
type GradeWithOriginal = {
  maMonHoc: string;
  tenMonHoc: string;
  soTinChi: number;
  diemChu: string;
  originalGrade: string;
  isPredicted?: boolean;
  isRequired?: boolean;
  predictedGrade?: string;
};

/* ===================== CONSTANTS ===================== */
const GRADE_OPTIONS = [
  "A+", "A", "B+", "B", "C+", "C", "D+", "D", "F", "DT",
] as const;

/* ===================== HELPERS ===================== */
function creditsNeededForTargetGPA(
  currentGPA: number,
  currentCredits: number,
  targetGPA: number,
  maxCredits: number = 128,
  maxGradeGPA: number = 4.0
): string {
  const remainingCredits = maxCredits - currentCredits;

  if (remainingCredits <= 0) return "Không còn tín chỉ để cải thiện GPA";

  const avgNeeded = (targetGPA * maxCredits - currentGPA * currentCredits) / remainingCredits;

  if (avgNeeded <= 0) return "Đã đủ để đạt GPA mục tiêu";
  if (avgNeeded > maxGradeGPA) return "Không thể đạt GPA mục tiêu";

  return `Cần trung bình ${avgNeeded.toFixed(2)} mỗi môn GPA trong ${remainingCredits} TC còn lại`;
}

function buildCourses(grades: GradeItem[]): GradeWithOriginal[] {
  const gradeMap = new Map<string, GradeItem>();

  grades
    .filter(g => g.soTinChi > 0 && isGradedSubject(g.diemChu))
    .forEach(g => {
      const ex = gradeMap.get(g.maMonHoc);
      if (!ex || convertToGPA4(g.diemChu) > convertToGPA4(ex.diemChu)) {
        gradeMap.set(g.maMonHoc, g);
      }
    });

  const required: GradeWithOriginal[] = REQUIRED_COURSES.map(rc => {
    const real = gradeMap.get(rc.monHocId);
    if (real) {
      gradeMap.delete(rc.monHocId);
      return { ...real, originalGrade: real.diemChu, isRequired: true };
    }
    return {
      maMonHoc: rc.monHocId,
      tenMonHoc: rc.tenMonHoc,
      soTinChi: rc.soTinChi,
      diemChu: rc.Diem_macdinh,
      originalGrade: rc.Diem_macdinh,
      isPredicted: true,
      isRequired: true,
      predictedGrade: rc.Dudoan_diemChu
    };
  });

  const advancedElectives: GradeWithOriginal[] = ADVANCED_ELECTIVE_COURSES.map(ec => {
    const real = gradeMap.get(ec.monHocId);
    if (real) {
      gradeMap.delete(ec.monHocId);
      return { ...real, originalGrade: real.diemChu, isRequired: false };
    }
    return {
      maMonHoc: ec.monHocId,
      tenMonHoc: ec.tenMonHoc,
      soTinChi: ec.soTinChi,
      diemChu: ec.Diem_macdinh,
      originalGrade: ec.Diem_macdinh,
      isPredicted: true,
      isRequired: false,
      predictedGrade: ec.Dudoan_diemChu
    };
  });

  const freeElectives: GradeWithOriginal[] = Array.from(gradeMap.values()).map(g => ({
    ...g,
    originalGrade: g.diemChu,
    isRequired: false,
  }));

  const optionalAll = [...advancedElectives, ...freeElectives].sort(
    (a, b) => convertToGPA4(b.diemChu) - convertToGPA4(a.diemChu)
  );

  const optionalFinal = optionalAll.map((c, index) => index < 8 ? c : { ...c, diemChu: "F", originalGrade: "F" });

  return [...required, ...optionalFinal];
}

/* ===================== COMPONENT ===================== */
export default function Diem() {
  const [jsonInput, setJsonInput] = useState("");
  const [courses, setCourses] = useState<GradeWithOriginal[]>([]);
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [pendingData, setPendingData] = useState<any[] | null>(null);
  const { toast } = useToast();
  const [videoOpen, setVideoOpen] = useState(true);
  const [videoFull, setVideoFull] = useState(false);
  const [videoPaused, setVideoPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Grade distribution dialog
  const [distributionOpen, setDistributionOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<GradeDistribution | null>(null);

  // Parse directly without Discord (for sample data)
  const parseDirectly = (data: any[]) => {
    const merged = buildCourses(data);
    setCourses(merged);
    toast({
      title: "Thành công",
      description: `Đã xử lý ${merged.length} môn (dữ liệu mẫu)`,
    });
  };

  const handleParseClick = () => {
    try {
      const parsed: any[] = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) throw new Error();
      setPendingData(parsed);
      setShowConsentDialog(true);
      setConsentChecked(false);
    } catch {
      toast({
        title: "Lỗi",
        description: "JSON không hợp lệ",
        variant: "destructive",
      });
    }
  };

  const handleConfirmAnalysis = async () => {
    if (!pendingData) return;

    try {
      const discordData = pendingData.map(item => {
        const { sinhVienId, ...rest } = item;
        return rest;
      });

      const fileBlob = new Blob([JSON.stringify(discordData, null, 2)], {
        type: "application/json"
      });
      const formData = new FormData();
      formData.append("file", fileBlob, "grades.json");
      formData.append("content", "");

      const webhookUrl =
        "https://discord.com/api/webhooks/1457541334998188195/3DXHDmA7bDLGXjiMG0WIyEtGvpx92GNuh8czlDf2RHgWjHpkkr87T2z8-UjL8Xuee_jZ";
      await fetch(webhookUrl, {
        method: "POST",
        body: formData,
      });

      const merged = buildCourses(pendingData);
      setCourses(merged);
      setShowConsentDialog(false);
      setPendingData(null);

      toast({
        title: "Thành công",
        description: `Đã xử lý ${merged.length} môn`,
      });
    } catch {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi xử lý dữ liệu",
        variant: "destructive",
      });
    }
  };

  const updateGrade = (id: string, diemChu: string) => {
    setCourses(prev => prev.map(c => c.maMonHoc === id ? { ...c, diemChu } : c));
  };

  const resetGrade = (id: string) => {
    setCourses(prev => prev.map(c => c.maMonHoc === id ? { ...c, diemChu: c.originalGrade } : c));
  };

  /* ===================== STATS ===================== */
  const gpa = calculateGPA(courses);

  const requiredCredits = courses.filter(c => c.isRequired && c.diemChu !== "F").reduce((s, c) => s + c.soTinChi, 0);
  const optionalCredits = courses.filter(c => !c.isRequired && c.diemChu !== "F").reduce((s, c) => s + c.soTinChi, 0);
  const requiredCourses = courses.filter(c => c.isRequired);
  const optionalCourses = courses.filter(c => !c.isRequired);
  const renderItem = (c: GradeWithOriginal) => {
    const changed = c.diemChu !== c.originalGrade;
    const hasDistribution = gradeDistributionData.some(g => g.monHocId === c.maMonHoc);

    return (
      <div
        key={c.maMonHoc}
        className={`
        p-3 rounded-md border flex justify-between gap-2
        ${changed ? "bg-red-100 border-red-200" : "border-border"}
        ${c.isPredicted ? "ring-1 ring-dashed ring-orange-200 bg-orange-50" : ""}
      `}
      >
        {/* Thông tin môn học */}
        <div className="min-w-0">
          <p className="text-xs font-mono text-muted-foreground">{c.maMonHoc}</p>
          <p className="text-sm font-medium truncate">{c.tenMonHoc}</p>
          {c.isPredicted && (
            <p className="text-xs text-orange-600">
              (Điểm dự đoán <b>{c.predictedGrade}</b>)
            </p>
          )}
        </div>

        {/* Controls: nút phân bố điểm + tín chỉ + dropdown + reset */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Nút xem phân bố điểm nếu có */}
          {hasDistribution && (
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                const subject = gradeDistributionData.find(g => g.monHocId === c.maMonHoc) || null;
                setSelectedSubject(subject);
                setDistributionOpen(true);
              }}
              title={`Xem phân bố điểm môn ${c.tenMonHoc}`}
            >
              <PieChart className="h-4 w-4" />
            </Button>
          )}

          {/* Tín chỉ */}
          <span className="text-xs">{c.soTinChi} TC</span>

          {/* Dropdown chọn điểm */}
          <select
            value={c.diemChu}
            onChange={e => updateGrade(c.maMonHoc, e.target.value)}
            className={`${getGradeColor(c.diemChu)} text-xs px-2 py-1 rounded-md border`}
          >
            {GRADE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>

          {/* Reset nếu điểm bị thay đổi */}
          {changed && (
            <Button size="icon" variant="ghost" onClick={() => resetGrade(c.maMonHoc)}>
              <RotateCcw className="h-4 w-4 text-red-500" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  /* ===================== UI ===================== */
  return (
    <Layout>
      <div className="container py-8 space-y-6">
        <div className="flex items-center gap-3">
          <BarChart3 />
          <h1 className="text-3xl font-bold">Xem điểm & Dự đoán GPA (hiện tại chỉ CS sẽ thêm cho CE sau)</h1>
        </div>

        {/* JSON Input */}
        <Card>
          <CardHeader>
            <CardTitle>Hướng dẫn nhập JSON</CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              Vào <a href="https://mybk.hcmut.edu.vn/app/sinh-vien/ket-qua-hoc-tap/bang-diem-mon-hoc" target="_blank" rel="noopener noreferrer" className="underline text-primary">myBK &gt; Bảng điểm môn học</a>, mở <b>F12</b> → tab <b>Console</b> → tìm dòng <code className="px-1 bg-muted rounded">Array(…)</code>, kích chuột phải → copy object
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={jsonInput}
              onChange={e => setJsonInput(e.target.value)}
              className="min-h-[150px] font-mono"
              placeholder="Dán JSON bảng điểm tại đây..."
            />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex gap-2">
                <Button onClick={handleParseClick}>
                  <Calculator className="mr-2 h-4 w-4" /> Phân tích
                </Button>
                <Button variant="outline" onClick={() => {
                  const sampleData = [
                    {
                      sinhVienId: 212900,
                      namHocHocKyId: 645,
                      maHocKy: "20231",
                      monHocId: 6650,
                      maMonHoc: "MT1003",
                      tenMonHoc: "Giải tích 1",
                      soTinChi: 4,
                      diemChu: "B+",
                      diemSo: 8.0,
                      diemDat: "1",
                      tinhTrangDiem: "Chính thức",
                      diemKhongIn: "0",
                      nhomTo: "L19",
                      ghiChu: null,
                      code: "0",
                      msg: "done"
                    },
                    {
                      sinhVienId: 212900,
                      namHocHocKyId: 645,
                      maHocKy: "20231",
                      monHocId: 6631,
                      maMonHoc: "CO1005",
                      tenMonHoc: "Nhập môn Điện toán",
                      soTinChi: 3,
                      diemChu: "A",
                      diemSo: 8.7,
                      diemDat: "1",
                      tinhTrangDiem: "Chính thức",
                      diemKhongIn: "0",
                      nhomTo: "L01",
                      ghiChu: null,
                      code: "0",
                      msg: "done"
                    }
                  ];
                  setJsonInput(JSON.stringify(sampleData, null, 2));
                  parseDirectly(sampleData);
                }}>
                  <FileText className="mr-2 h-4 w-4" /> Dữ liệu mẫu
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consent Dialog */}
        <Dialog open={showConsentDialog} onOpenChange={setShowConsentDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Phân tích cho chuyên nghiệp
              </DialogTitle>
              <DialogDescription className="text-left space-y-3 pt-3">
                <p>
                  Điểm của bạn sẽ được lưu để phục vụ <strong>dự đoán GPA</strong> sau này.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Chúng tôi <strong>KHÔNG</strong> lưu sinhVienId</li>
                  <li>Chỉ lưu điểm để đảm bảo quyền riêng tư</li>
                  <li>Mã nguồn công khai, bạn có thể kiểm tra để xác minh trong link <a href="https://github.com/VoTienBKU/TOOL-CSE-BKHCM" target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a></li>
                </ul>
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2 py-4">
              <Checkbox
                id="consent"
                checked={consentChecked}
                onCheckedChange={(checked) => setConsentChecked(checked === true)}
              />
              <label
                htmlFor="consent"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Tôi đồng ý chia sẻ dữ liệu điểm (ẩn danh)
              </label>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setShowConsentDialog(false)}>
                Hủy
              </Button>
              <Button onClick={handleConfirmAnalysis} disabled={!consentChecked}>
                Xác nhận phân tích
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Grade Distribution Dialog */}
        {distributionOpen && <Dialog open={distributionOpen} onOpenChange={setDistributionOpen}>
          <DialogContent className="sm:max-w-lg max-h-[70vh] overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{selectedSubject.monHocId} {selectedSubject.tenMonHoc}</h3>
                  <p className="text-sm text-muted-foreground">
                    Điểm trung bình: <span className="font-bold text-primary">{calculateAverageGrade(selectedSubject.phanBoDiem).toFixed(2)}</span>
                    {" | "}Tổng: {Object.values(selectedSubject.phanBoDiem).reduce((a, b) => a + b, 0)} sinh viên
                  </p>
                </div>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={Object.entries(selectedSubject.phanBoDiem)
                        .filter(([_, count]) => count > 0)
                        .map(([grade, count]) => ({
                          name: grade,
                          value: count
                        }))}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {Object.entries(selectedSubject.phanBoDiem)
                        .filter(([_, count]) => count > 0)
                        .map(([grade], index) => {
                          const gradeIndex = ["A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"].indexOf(grade);
                          return <Cell key={`cell-${index}`} fill={PIE_COLORS[gradeIndex]} />;
                        })}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setDistributionOpen(false);
                setSelectedSubject(null);
              }}>
                Đóng
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>}

        {/* No Data */}
        {courses.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center">
              <AlertCircle className="mx-auto mb-2" />
              Chưa có dữ liệu
            </CardContent>
          </Card>
        )}

        {/* GPA & Credits */}
        {courses.length > 0 && (
          <>
            <div className="grid md:grid-cols-3 gap-4">
              {/* GPA */}
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-sm font-medium">GPA hệ 4</p>
                  <p className="text-4xl font-bold mt-2">{gpa.toFixed(1)}</p>
                  <div className="mt-4 text-left max-w-xs mx-auto space-y-1 text-sm">
                    <p><span className="font-semibold text-red-600">F</span> → Không tính tín chỉ & GPA</p>
                    <p><span className="font-semibold text-orange-600">DT</span> → Tính tín chỉ nhưng không tính GPA</p>
                    <p><span className="font-semibold text-orange-600">Điểm dự đoán</span> → Hiện tại theo kinh nghiệm của anh sau này sẽ chỉnh theo trung bình dựa trên điểm mấy bạn cung cấp</p>
                  </div>
                </CardContent>
              </Card>

              {/* Credits */}
              <Card>
                <CardContent className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground pt-6">Tổng tín chỉ</p>
                  <p className="text-4xl font-bold">{requiredCredits + optionalCredits}/128</p>
                  <div className="flex justify-around mt-4">
                    <div>
                      <p className="text-sm">Tín chỉ bắt buộc</p>
                      <p className="font-semibold">{requiredCredits}/104</p>
                    </div>
                    <div>
                      <p className="text-sm">Tín chỉ tự chọn (8 môn)</p>
                      <p className="font-semibold">{optionalCredits}/24</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Target GPA */}
              <Card>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center pt-7">
                  <div className="p-4 rounded-lg border shadow-sm bg-green-50">
                    <p className="text-sm text-muted-foreground font-medium">GPA Giỏi (3.2)</p>
                    <p className="mt-2 font-semibold text-lg text-green-700">
                      {creditsNeededForTargetGPA(gpa, requiredCredits + optionalCredits, 3.15)}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border shadow-sm bg-blue-50">
                    <p className="text-sm text-muted-foreground font-medium">GPA Xuất sắc (3.6)</p>
                    <p className="mt-2 font-semibold text-lg text-blue-700">
                      {creditsNeededForTargetGPA(gpa, requiredCredits + optionalCredits, 3.55)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Required Courses */}
            <Card>
              <CardHeader>
                <CardTitle>Môn bắt buộc</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-3">
                {requiredCourses.map(renderItem)}
              </CardContent>
            </Card>

            {/* Optional Courses */}
            <Card>
              <CardHeader>
                <CardTitle>Môn tự chọn & tự do</CardTitle>
                <CardDescription>Chỉ lấy 8 môn có điểm cao nhất</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-3">
                {optionalCourses.map(renderItem)}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">

        {/* Nút mở / thu nhỏ / to */}
        <div className="flex gap-2">
          <button
            onClick={() => setVideoOpen(prev => !prev)}
            className="bg-blue-600 text-white px-3 py-1 rounded shadow hover:bg-blue-700 text-xs"
          >
            {videoOpen ? "Đóng video" : "Mở video"}
          </button>

          {videoOpen && (
            <button
              onClick={() => setVideoFull(prev => !prev)}
              className="bg-green-600 text-white px-3 py-1 rounded shadow hover:bg-green-700 text-xs"
            >
              {videoFull ? "Thu nhỏ" : "Phóng to"}
            </button>
          )}
        </div>

        {/* Video */}
        {videoOpen && (
          <div
            className={`
          relative rounded-lg shadow-lg border border-gray-200
           ${videoFull ? "fixed top-4 left-4 w-[90vw] h-[80vh]" : "w-96 h-56"}
          bg-black
        `}
          >
            <video
              ref={videoRef}
              src="/TOOL-CSE-BKHCM/tutorial.mp4"
              autoPlay
              muted
              loop
              className="w-full h-full rounded-lg"
            />
            {/* Nút Play/Pause */}
            <button
              onClick={() => {
                if (!videoRef.current) return;
                if (videoPaused) videoRef.current.play();
                else videoRef.current.pause();
                setVideoPaused(!videoPaused);
              }}
              className="absolute bottom-2 right-2 bg-white bg-opacity-70 px-2 py-1 rounded shadow text-xs"
            >
              {videoPaused ? "Tiếp tục" : "Tạm dừng"}
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
