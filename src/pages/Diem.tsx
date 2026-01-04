import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  GradeItem, 
  calculateGPA, 
  isGradedSubject, 
  getGradeColor,
  convertToGPA4
} from "@/types/grade";
import { BarChart3, Upload, Calculator, AlertCircle } from "lucide-react";

// Lọc và xử lý trùng mã môn - lấy điểm cao nhất
function processGrades(grades: GradeItem[]): GradeItem[] {
  // Bỏ TC=0 và điểm không hợp lệ (DT, MT, KD...)
  const filtered = grades.filter(g => g.soTinChi > 0 && isGradedSubject(g.diemChu));
  
  // Gộp theo mã môn, giữ điểm cao hơn
  const gradeMap = new Map<string, GradeItem>();
  filtered.forEach(grade => {
    const existing = gradeMap.get(grade.maMonHoc);
    if (!existing || convertToGPA4(grade.diemChu) > convertToGPA4(existing.diemChu)) {
      gradeMap.set(grade.maMonHoc, grade);
    }
  });
  
  return Array.from(gradeMap.values());
}

const sampleData = `[
  {
    "maMonHoc": "LA1003",
    "tenMonHoc": "Anh văn 1",
    "soTinChi": 2,
    "diemChu": "B+"
  },
  {
    "maMonHoc": "MT1003",
    "tenMonHoc": "Giải tích 1",
    "soTinChi": 4,
    "diemChu": "A"
  }
]`;

export default function Diem() {
  const [jsonInput, setJsonInput] = useState("");
  const [grades, setGrades] = useState<GradeItem[]>([]);
  const { toast } = useToast();

  const parseGrades = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        throw new Error("Dữ liệu phải là một mảng");
      }
      const processed = processGrades(parsed);
      setGrades(processed);
      toast({
        title: "Thành công!",
        description: `Đã tải ${processed.length} môn học (lọc từ ${parsed.length} bản ghi)`,
      });
    } catch (error) {
      toast({
        title: "Lỗi phân tích dữ liệu",
        description: "Vui lòng kiểm tra định dạng JSON",
        variant: "destructive",
      });
    }
  };

  const loadSample = () => {
    setJsonInput(sampleData);
  };

  const gpa = calculateGPA(grades);
  const totalCredits = grades.reduce((sum, g) => sum + g.soTinChi, 0);
  const gradedCredits = grades
    .filter((g) => isGradedSubject(g.diemChu))
    .reduce((sum, g) => sum + g.soTinChi, 0);

  // Chia thành 2 cột
  const midIndex = Math.ceil(grades.length / 2);
  const leftColumn = grades.slice(0, midIndex);
  const rightColumn = grades.slice(midIndex);

  const renderGradeItem = (grade: GradeItem, index: number) => (
    <div key={index} className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
      <div className="flex-1 min-w-0 pr-2">
        <p className="text-xs text-muted-foreground font-mono">{grade.maMonHoc}</p>
        <p className="text-sm font-medium truncate">{grade.tenMonHoc}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs text-muted-foreground">{grade.soTinChi} TC</span>
        <Badge className={`${getGradeColor(grade.diemChu)} min-w-[42px] justify-center`} variant="outline">
          {grade.diemChu}
        </Badge>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Xem điểm & Tính GPA</h1>
          </div>
          <p className="text-muted-foreground">
            Nhập dữ liệu điểm JSON và tính điểm trung bình hệ 4
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Nhập dữ liệu JSON
            </CardTitle>
            <CardDescription>
              Dán dữ liệu điểm từ API vào đây
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Dán dữ liệu JSON điểm tại đây..."
              className="min-h-[150px] font-mono text-sm"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={parseGrades} className="flex-1">
                <Calculator className="mr-2 h-4 w-4" />
                Phân tích điểm
              </Button>
              <Button variant="outline" onClick={loadSample}>
                Dữ liệu mẫu
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {grades.length > 0 && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="gradient-primary text-primary-foreground">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm opacity-80">GPA hệ 4</p>
                    <p className="text-4xl font-bold">{gpa.toFixed(2)}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Tổng tín chỉ</p>
                    <p className="text-4xl font-bold text-foreground">{totalCredits}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Tín chỉ tính GPA</p>
                    <p className="text-4xl font-bold text-foreground">{gradedCredits}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Grades - 2 Columns */}
            <Card>
              <CardHeader>
                <CardTitle>Chi tiết điểm ({grades.length} môn)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-0">
                    {leftColumn.map((grade, index) => renderGradeItem(grade, index))}
                  </div>
                  {rightColumn.length > 0 && (
                    <div className="space-y-0">
                      {rightColumn.map((grade, index) => renderGradeItem(grade, index + midIndex))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {grades.length === 0 && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">
                  Chưa có dữ liệu điểm. Vui lòng nhập dữ liệu JSON và nhấn "Phân tích điểm"
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
