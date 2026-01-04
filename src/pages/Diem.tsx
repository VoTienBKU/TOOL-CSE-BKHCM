import { useState } from "react";
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
} from "lucide-react";

/* ===================== TYPES ===================== */

type GradeWithOriginal = GradeItem & {
  originalGrade: string;
  isPredicted?: boolean;
  isRequired?: boolean;
};

/* ===================== CONSTANTS ===================== */

const GRADE_OPTIONS = [
  "A+", "A", "B+", "B", "C+", "C", "D+", "D", "F", "DT",
] as const;

/* ===================== HELPERS ===================== */
function buildCourses(grades: GradeItem[]): GradeWithOriginal[] {
  const gradeMap = new Map<string, GradeItem>();

  /* ===== LẤY ĐIỂM TỐT NHẤT CHO MỖI MÔN ===== */
  grades
    .filter(g => g.soTinChi > 0 && isGradedSubject(g.diemChu))
    .forEach(g => {
      const ex = gradeMap.get(g.maMonHoc);
      if (!ex || convertToGPA4(g.diemChu) > convertToGPA4(ex.diemChu)) {
        gradeMap.set(g.maMonHoc, g);
      }
    });

  /* ===== REQUIRED COURSES ===== */
  const required: GradeWithOriginal[] = REQUIRED_COURSES.map(rc => {
    const real = gradeMap.get(rc.monHocId);

    if (real) {
      gradeMap.delete(rc.monHocId);
      return {
        ...real,
        originalGrade: real.diemChu,
        isRequired: true,
      };
    }

    return {
      maMonHoc: rc.monHocId,
      tenMonHoc: rc.tenMonHoc,
      soTinChi: rc.soTinChi,
      diemChu: rc.Dudoan_diemChu,
      originalGrade: rc.Dudoan_diemChu,
      isPredicted: true,
      isRequired: true,
    };
  });

  /* ===== ADVANCED ELECTIVE COURSES ===== */
  const advancedElectives: GradeWithOriginal[] =
    ADVANCED_ELECTIVE_COURSES.map(ec => {
      const real = gradeMap.get(ec.monHocId);

      if (real) {
        gradeMap.delete(ec.monHocId);
        return {
          ...real,
          originalGrade: real.diemChu,
          isRequired: false,
        };
      }

      return {
        maMonHoc: ec.monHocId,
        tenMonHoc: ec.tenMonHoc,
        soTinChi: ec.soTinChi,
        diemChu: ec.Dudoan_diemChu,
        originalGrade: ec.Dudoan_diemChu,
        isPredicted: true,
        isRequired: false,
      };
    });

  /* ===== CÁC MÔN CÒN LẠI (TỰ DO) ===== */
  const freeElectives: GradeWithOriginal[] = Array.from(gradeMap.values()).map(
    g => ({
      ...g,
      originalGrade: g.diemChu,
      isRequired: false,
    })
  );

  /* ===== GỘP + CHỌN 8 MÔN TỐT NHẤT ===== */
  const optionalAll = [...advancedElectives, ...freeElectives].sort(
    (a, b) => convertToGPA4(b.diemChu) - convertToGPA4(a.diemChu)
  );

  const optionalFinal = optionalAll.map((c, index) => {
    if (index < 8) return c;
    return {
      ...c,
      diemChu: "F",
      originalGrade: "F",
    };
  });

  return [...required, ...optionalFinal];
}

/* ===================== COMPONENT ===================== */

export default function Diem() {
  const [jsonInput, setJsonInput] = useState("");
  const [courses, setCourses] = useState<GradeWithOriginal[]>([]);
  const { toast } = useToast();

  const parseGrades = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) throw new Error();

      const merged = buildCourses(parsed);
      setCourses(merged);

      toast({
        title: "Thành công",
        description: `Đã xử lý ${merged.length} môn`,
      });
    } catch {
      toast({
        title: "Lỗi",
        description: "JSON không hợp lệ",
        variant: "destructive",
      });
    }
  };

  const updateGrade = (id: string, diemChu: string) => {
    setCourses(prev =>
      prev.map(c =>
        c.maMonHoc === id ? { ...c, diemChu } : c
      )
    );
  };

  const resetGrade = (id: string) => {
    setCourses(prev =>
      prev.map(c =>
        c.maMonHoc === id
          ? { ...c, diemChu: c.originalGrade }
          : c
      )
    );
  };

  /* ===================== STATS ===================== */

  const gpa = calculateGPA(courses);

  const requiredCredits = courses
    .filter(c => c.isRequired && c.diemChu !== "F")
    .reduce((s, c) => s + c.soTinChi, 0);

  const optionalCredits = courses
    .filter(
      c =>
        !c.isRequired &&
        c.diemChu !== "F"
    )
    .reduce((s, c) => s + c.soTinChi, 0);

  const requiredCourses = courses.filter(c => c.isRequired);
  const optionalCourses = courses.filter(c => !c.isRequired);

  /* ===================== RENDER ITEM ===================== */

  const renderItem = (c: GradeWithOriginal) => {
    const changed = c.diemChu !== c.originalGrade;

    return (
      <div
        key={c.maMonHoc}
        className={`
          p-3 rounded-md border flex justify-between gap-2
          ${changed ? "bg-red-50 border-red-300" : "border-border"}
          ${c.isPredicted ? "ring-1 ring-dashed ring-orange-400" : ""}
        `}
      >
        <div className="min-w-0">
          <p className="text-xs font-mono text-muted-foreground">
            {c.maMonHoc}
          </p>
          <p className="text-sm font-medium truncate">
            {c.tenMonHoc}
          </p>
          {c.isPredicted && (
            <p className="text-xs text-orange-600">(Điểm dự đoán)</p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs">{c.soTinChi} TC</span>

          <select
            value={c.diemChu}
            onChange={e => updateGrade(c.maMonHoc, e.target.value)}
            className={`${getGradeColor(c.diemChu)} text-xs px-2 py-1 rounded-md border`}
          >
            {GRADE_OPTIONS.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          {changed && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => resetGrade(c.maMonHoc)}
            >
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
          <h1 className="text-3xl font-bold">Xem điểm & Dự đoán GPA</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hướng dẫn nhập JSON</CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              Vào{" "}
              <a
                href="https://mybk.hcmut.edu.vn/app/sinh-vien/ket-qua-hoc-tap/bang-diem-mon-hoc"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-primary"
              >
                myBK &gt; Bảng điểm môn học
              </a>
              , mở <b>F12</b> → tab <b>Console</b> → tìm dòng{" "}
              <code className="px-1 bg-muted rounded">Array(…)</code> trong file
              <code className="px-1 bg-muted rounded ml-1">
                bang-diem-mon-hoc.js
              </code>
              , kích chuột phải vào array sau đó chọn copy object
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={jsonInput}
              onChange={e => setJsonInput(e.target.value)}
              className="min-h-[150px] font-mono"
              placeholder="Hướng dẫn bên trên và ng tính tín chỉ, không tính GPADán JSON bảng điểm tại đây..."
            />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <Button onClick={parseGrades}>
                <Calculator className="mr-2 h-4 w-4" />
                Phân tích
              </Button>

              <div className="space-y-1">
                <p>
                  <span className="font-semibold text-red-600">F</span>: không tính tín chỉ, không tính GPA
                </p>
                <p>
                  <span className="font-semibold text-orange-600">DT</span>: tính tín chỉ, không tính GPA
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {courses.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center">
              <AlertCircle className="mx-auto mb-2" />
              Chưa có dữ liệu
            </CardContent>
          </Card>
        )}

        {courses.length > 0 && (
          <>
            {/* GPA */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="gradient-primary text-primary-foreground">
                <CardContent className="pt-6 text-center">
                  <p className="text-sm">GPA hệ 4</p>
                  <p className="text-4xl font-bold">{gpa.toFixed(1)}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Tín chỉ bắt buộc
                  </p>
                  <p className="text-4xl font-bold">
                    {requiredCredits}/104
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Tín chỉ tự chọn (8 môn)
                  </p>
                  <p className="text-4xl font-bold">
                    {optionalCredits}/24
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Môn bắt buộc</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-3">
                {requiredCourses.map(renderItem)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Môn tự chọn & tự do</CardTitle>
                <CardDescription>
                  Chỉ lấy 8 môn có điểm cao nhất
                </CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-3">
                {optionalCourses.map(renderItem)}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}
