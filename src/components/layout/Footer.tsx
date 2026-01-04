import { Facebook, Phone, GraduationCap, Mail, MapPin, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                TOOL-CSE<span className="text-primary">-BKHCM</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Ứng dụng hỗ trợ sinh viên Khoa Khoa học và Kỹ thuật Máy tính - Trường Đại học Bách Khoa TP.HCM
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Liên hệ</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>votien10cham@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Facebook className="h-4 w-4" />
                <a
                  href="https://www.facebook.com/groups/khmt.ktmt.cse.bku"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-600"
                >
                  Thảo luận kiến thức CNTT trường BK
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>TP Hồ Chí Minh, Việt Nam</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Tính năng</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Xem và tính điểm GPA</li>
              <li>• Tra cứu đồ án năm 4</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          © 2024 TOOL-CSE-BKHCM. Tất cả quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
}
