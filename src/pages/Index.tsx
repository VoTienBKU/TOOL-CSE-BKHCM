import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, FolderKanban, Bell, GraduationCap, BookOpen, Users } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Xem điểm & Tính GPA CS",
    description: "Nhập dữ liệu điểm JSON, tính điểm trung bình hệ 4 và xem chi tiết từng môn học",
    link: "/diem",
    color: "text-primary",
  },
  {
    icon: BarChart3,
    title: "Xem điểm & Tính GPA CE",
    description: "Nhập dữ liệu điểm JSON, tính điểm trung bình hệ 4 và xem chi tiết từng môn học",
    link: "/diem_ce",
    color: "text-primary",
  },
  {
    icon: FolderKanban,
    title: "Đồ án năm 4",
    description: "Tra cứu danh sách đồ án tốt nghiệp, tìm kiếm theo bộ môn hoặc CBHD",
    link: "/do-an",
    color: "text-success",
  },
  {
    icon: Bell,
    title: "Review môn học và đề thi (đang cập nhật)",
    description: "",
    link: "/",
    color: "text-warning",
  },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero py-20 lg:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              TOOL-CSE-BKHCM
            </h1>

            <p className="mb-10 text-lg text-white/80 sm:text-xl">
              Công cụ hỗ trợ sinh viên Máy Tính Bách Khoa - Quản lý điểm số, tra cứu đồ án và nhiều tiện ích khác
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                <Link to="/diem">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Xem điểm ngay
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                <Link to="/do-an">
                  <FolderKanban className="mr-2 h-5 w-5" />
                  Tra cứu đồ án
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">Tính năng chính</h2>
            <p className="text-muted-foreground">Các công cụ hữu ích dành cho sinh viên CSE</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link key={index} to={feature.link}>
                  <Card className="group h-full transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
                    <CardHeader>
                      <div className={`mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 ${feature.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="text-sm font-medium text-primary group-hover:underline">
                        Xem chi tiết →
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}
