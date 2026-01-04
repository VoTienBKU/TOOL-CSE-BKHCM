import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, FolderKanban, Bell, GraduationCap, BookOpen, Users } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Xem điểm & Tính GPA",
    description: "Nhập dữ liệu điểm JSON, tính điểm trung bình hệ 4 và xem chi tiết từng môn học",
    link: "/diem",
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
    title: "Thông báo Discord",
    description: "Gửi thông báo điểm qua Discord webhook để theo dõi kịp thời",
    link: "/diem",
    color: "text-warning",
  },
];

const stats = [
  { icon: BookOpen, value: "240+", label: "Đồ án" },
  { icon: Users, value: "50+", label: "Giảng viên" },
  { icon: GraduationCap, value: "1000+", label: "Sinh viên" },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero py-20 lg:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur">
              <GraduationCap className="h-4 w-4" />
              <span>Khoa Khoa học và Kỹ thuật Máy tính</span>
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              TOOL-CSE
              <span className="block text-white/80">BKHCM</span>
            </h1>
            
            <p className="mb-10 text-lg text-white/80 sm:text-xl">
              Công cụ hỗ trợ sinh viên Bách Khoa - Quản lý điểm số, tra cứu đồ án và nhiều tiện ích khác
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

      {/* Stats Section */}
      <section className="border-b border-border bg-card py-8">
        <div className="container">
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground sm:text-3xl">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
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
