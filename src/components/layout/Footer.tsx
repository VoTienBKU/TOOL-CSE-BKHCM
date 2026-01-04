import { GraduationCap, Mail, MapPin, MessageCircle } from "lucide-react";

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

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Liên hệ</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>support@cse.bkhcm.edu.vn</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" />
                <span>Thảo luận kiến thức CNTT trường BK</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>TP. Hồ Chí Minh, Việt Nam</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Tính năng</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Xem và tính điểm GPA</li>
              <li>• Tra cứu đồ án năm 4</li>
              <li>• Thông báo qua Discord</li>
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
