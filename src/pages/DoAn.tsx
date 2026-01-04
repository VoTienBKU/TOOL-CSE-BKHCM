import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FolderKanban, Search, ChevronLeft, ChevronRight, User, BookOpen } from "lucide-react";
import projectsData from "@/data/projects.json";

const ITEMS_PER_PAGE = 6;

const boMonColors: Record<string, string> = {
  "Khoa học Máy tính": "bg-primary/10 text-primary border-primary/20",
  "Hệ thống thông tin": "bg-success/10 text-success border-success/20",
  "Kỹ thuật Máy tính": "bg-warning/10 text-warning border-warning/20",
  "Kỹ thuật Phần mềm": "bg-accent/10 text-accent border-accent/20",
};

export default function DoAn() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBoMon, setSelectedBoMon] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const boMonList = useMemo(() => {
    const unique = new Set(projectsData.map((p) => p.boMon));
    return Array.from(unique);
  }, []);

  const filteredProjects = useMemo(() => {
    return projectsData.filter((project) => {
      const matchesSearch = 
        project.tenDoAn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.cbhd.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.boMon.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesBoMon = !selectedBoMon || project.boMon === selectedBoMon;
      
      return matchesSearch && matchesBoMon;
    });
  }, [searchQuery, selectedBoMon]);

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (boMon: string | null) => {
    setSelectedBoMon(boMon);
    setCurrentPage(1);
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
              <FolderKanban className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Đồ án năm 4</h1>
          </div>
          <p className="text-muted-foreground">
            Danh sách các đồ án tốt nghiệp năm 4 - Khoa Khoa học và Kỹ thuật Máy tính
          </p>
        </div>

        {/* Search & Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo bộ môn, tên đồ án hoặc CBHD..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedBoMon === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange(null)}
                >
                  Tất cả bộ môn
                </Button>
                {boMonList.map((boMon) => (
                  <Button
                    key={boMon}
                    variant={selectedBoMon === boMon ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange(boMon)}
                  >
                    {boMon}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <p className="mb-4 text-sm text-muted-foreground">
          Hiển thị {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
          {Math.min(currentPage * ITEMS_PER_PAGE, filteredProjects.length)} trong tổng số{" "}
          {filteredProjects.length} đồ án
        </p>

        {/* Projects Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {paginatedProjects.map((project) => (
            <Card 
              key={project.id} 
              className="group transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
            >
              <CardHeader className="pb-3">
                <Badge 
                  variant="outline" 
                  className={boMonColors[project.boMon] || "bg-muted text-muted-foreground"}
                >
                  {project.boMon}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="min-h-[80px]">
                  <h3 className="font-semibold text-foreground line-clamp-3 group-hover:text-primary transition-colors">
                    {project.tenDoAn}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>CBHD: {project.cbhd}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {paginatedProjects.length === 0 && (
          <Card className="mt-8">
            <CardContent className="py-12">
              <div className="text-center">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">
                  Không tìm thấy đồ án nào phù hợp với tiêu chí tìm kiếm
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page: number;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="w-10"
                  >
                    {page}
                  </Button>
                );
              })}
              
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="px-2 py-1 text-muted-foreground">...</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                    className="w-10"
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
