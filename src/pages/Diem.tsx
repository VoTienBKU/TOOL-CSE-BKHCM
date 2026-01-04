import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  GradeItem, 
  calculateGPA, 
  convertToGPA4, 
  isGradedSubject, 
  getGradeColor 
} from "@/types/grade";
import { BarChart3, Send, Upload, Calculator, AlertCircle } from "lucide-react";

const sampleData = `[
  {
    "sinhVienId": 197072,
    "namHocHocKyId": 603,
    "maHocKy": "BL",
    "monHocId": 6646,
    "maMonHoc": "LA1003",
    "tenMonHoc": "Anh văn 1",
    "soTinChi": 2,
    "diemChu": "DT",
    "diemSo": 21,
    "diemDat": "1",
    "tinhTrangDiem": null,
    "diemKhongIn": "0",
    "nhomTo": "DT07",
    "ghiChu": "AV NHU CAU 221",
    "code": "0",
    "msg": "done"
  }
]`;

export default function Diem() {
  const [jsonInput, setJsonInput] = useState("");
  const [grades, setGrades] = useState<GradeItem[]>([]);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [minGrade, setMinGrade] = useState("D");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const parseGrades = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        throw new Error("Dữ liệu phải là một mảng");
      }
      setGrades(parsed);
      toast({
        title: "Thành công!",
        description: `Đã tải ${parsed.length} môn học`,
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

  const gradeOrder = ["F", "D", "D+", "C", "C+", "B", "B+", "A", "A+"];
  
  const filteredGradesForDiscord = grades.filter((g) => {
    if (!isGradedSubject(g.diemChu)) return false;
    const gradeIndex = gradeOrder.indexOf(g.diemChu);
    const minIndex = gradeOrder.indexOf(minGrade);
    return gradeIndex >= minIndex;
  });

  const sendToDiscord = async () => {
    if (!webhookUrl) {
      toast({
        title: "Thiếu Webhook URL",
        description: "Vui lòng nhập Discord Webhook URL",
        variant: "destructive",
      });
      return;
    }

    if (filteredGradesForDiscord.length === 0) {
      toast({
        title: "Không có dữ liệu",
        description: `Không có môn học nào đạt từ ${minGrade} trở lên`,
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      const gradesList = filteredGradesForDiscord
        .map((g) => `• **${g.tenMonHoc}** (${g.maMonHoc}): ${g.diemChu} - ${g.soTinChi} TC`)
        .join("\n");

      const message = {
        embeds: [
          {
            title: "📊 Thông báo điểm BKHCM",
            description: `**GPA hệ 4:** ${gpa.toFixed(2)}\n**Tổng tín chỉ:** ${totalCredits}\n\n**Danh sách môn từ ${minGrade} trở lên:**\n${gradesList}`,
            color: 0x0066b3,
            footer: {
              text: "TOOL-CSE-BKHCM",
            },
            timestamp: new Date().toISOString(),
          },
        ],
      };

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });

      if (response.ok) {
        toast({
          title: "Đã gửi thành công!",
          description: "Thông báo đã được gửi tới Discord",
        });
      } else {
        throw new Error("Failed to send");
      }
    } catch (error) {
      toast({
        title: "Lỗi gửi tin nhắn",
        description: "Vui lòng kiểm tra Webhook URL",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

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
            Nhập dữ liệu điểm JSON, tính điểm trung bình hệ 4 và gửi thông báo qua Discord
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Section */}
          <Card>
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
                className="min-h-[200px] font-mono text-sm"
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

          {/* Discord Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Gửi thông báo Discord
              </CardTitle>
              <CardDescription>
                Gửi kết quả điểm qua Discord Webhook
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook">Discord Webhook URL</Label>
                <Input
                  id="webhook"
                  placeholder="https://discord.com/api/webhooks/..."
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minGrade">Điểm tối thiểu gửi thông báo</Label>
                <select
                  id="minGrade"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={minGrade}
                  onChange={(e) => setMinGrade(e.target.value)}
                >
                  {gradeOrder.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                <p className="text-sm text-muted-foreground">
                  Chỉ gửi các môn từ điểm {minGrade} trở lên ({filteredGradesForDiscord.length} môn)
                </p>
              </div>
              <Button 
                onClick={sendToDiscord} 
                disabled={grades.length === 0 || isSending}
                className="w-full"
              >
                <Send className="mr-2 h-4 w-4" />
                {isSending ? "Đang gửi..." : "Gửi thông báo"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        {grades.length > 0 && (
          <div className="mt-8 space-y-6">
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

            {/* Grades Table */}
            <Card>
              <CardHeader>
                <CardTitle>Chi tiết điểm ({grades.length} môn)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mã môn</TableHead>
                        <TableHead>Tên môn học</TableHead>
                        <TableHead className="text-center">Tín chỉ</TableHead>
                        <TableHead className="text-center">Điểm chữ</TableHead>
                        <TableHead className="text-center">Điểm hệ 4</TableHead>
                        <TableHead>Ghi chú</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {grades.map((grade, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-sm">{grade.maMonHoc}</TableCell>
                          <TableCell className="font-medium">{grade.tenMonHoc}</TableCell>
                          <TableCell className="text-center">{grade.soTinChi}</TableCell>
                          <TableCell className="text-center">
                            <Badge className={getGradeColor(grade.diemChu)} variant="outline">
                              {grade.diemChu}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {isGradedSubject(grade.diemChu) 
                              ? convertToGPA4(grade.diemChu).toFixed(1) 
                              : "-"}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {grade.ghiChu || "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {grades.length === 0 && (
          <Card className="mt-8">
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
