import { getIconSvg } from '../utils/icons.js';

export class ResumeModal {
  constructor(soundManager) {
    this.sound = soundManager;
    this.modalEl = null;
    this.init();
  }

  init() {
    this.createModalDOM();
    this.bindTriggers();
  }

  createModalDOM() {
    let el = document.getElementById('resume-modal-root');
    if (!el) {
      el = document.createElement('div');
      el.id = 'resume-modal-root';
      document.body.appendChild(el);
    }
    this.modalEl = el;
  }

  bindTriggers() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-open-resume');
      if (btn) {
        this.open();
      }

      if (e.target.closest('#btn-close-resume') || e.target.classList.contains('resume-modal-backdrop')) {
        this.close();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }

  isOpen() {
    return this.modalEl && this.modalEl.innerHTML.trim() !== '';
  }

  open() {
    if (this.sound && this.sound.playClick) {
      this.sound.playClick(650);
    }

    this.modalEl.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 resume-modal-backdrop bg-slate-950/90 backdrop-blur-2xl animate-fade-in print:p-0 print:bg-white print:static">
        <div class="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-y-auto cyber-scroll code-font text-slate-200 print:max-h-none print:h-auto print:border-none print:shadow-none print:bg-white print:text-black print:p-8">
          
          <!-- Screen-only Action Toolbar -->
          <div class="flex items-center justify-between border-b border-white/10 pb-4 mb-6 print:hidden">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span class="text-xs uppercase font-black text-cyan-400 tracking-wider">HỒ SƠ NĂNG LỰC ỨNG VIÊN // CURRICULUM VITAE</span>
            </div>
            <div class="flex items-center gap-2.5">
              <button id="btn-copy-resume" class="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-cyan-300 hover:text-white hover:border-cyan-400 text-xs font-bold transition-all flex items-center gap-1.5">
                ${getIconSvg('copy', 'w-3.5 h-3.5')} <span>Sao Chép Tóm Tắt</span>
              </button>
              <button id="btn-print-resume" class="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-black text-xs hover:scale-105 transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-500/20">
                ${getIconSvg('printer', 'w-3.5 h-3.5')} <span>In / Tải PDF</span>
              </button>
              <button id="btn-close-resume" class="p-1.5 rounded-xl bg-slate-950/80 border border-white/10 text-slate-400 hover:text-white hover:border-rose-500/40 transition-all">
                ${getIconSvg('x', 'w-5 h-5')}
              </button>
            </div>
          </div>

          <!-- Printable Resume Sheet -->
          <div class="space-y-6 font-sans">
            
            <!-- Candidate Header -->
            <div class="border-b border-cyan-500/20 pb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h1 class="text-2xl sm:text-3xl font-black text-white print:text-black tracking-wide code-font">DƯƠNG TIẾN ĐẠT</h1>
                <p class="text-base text-cyan-400 font-bold code-font print:text-blue-700 mt-0.5">.NET Fullstack Developer</p>
                <p class="text-xs text-slate-400 print:text-gray-600 mt-2 flex items-center gap-1.5">
                  ${getIconSvg('map-pin', 'w-3.5 h-3.5 text-emerald-400')} Tô Hiệu, Hà Đông, Hà Nội
                </p>
              </div>
              <div class="code-font text-xs space-y-1 text-slate-300 print:text-gray-700 bg-slate-950/60 print:bg-transparent p-3 rounded-2xl border border-white/5 print:border-none">
                <p><strong>Kinh nghiệm:</strong> <span class="text-emerald-400 print:text-black">3+ Năm thực chiến</span></p>
                <p><strong>Học vấn:</strong> <span class="text-cyan-300 print:text-black">CĐ Kinh Tế Công Nghiệp HN</span></p>
                <p><strong>Chuyên môn:</strong> <span class="text-purple-300 print:text-black">ASP.NET Core • Angular • SQL Server</span></p>
              </div>
            </div>

            <!-- Career Objective -->
            <div>
              <h2 class="text-xs font-bold code-font uppercase tracking-wider text-cyan-400 print:text-blue-800 mb-2 flex items-center gap-1.5">
                ${getIconSvg('target', 'w-3.5 h-3.5')} MỤC TIÊU NGHỀ NGHIỆP
              </h2>
              <p class="text-xs sm:text-[13px] text-slate-300 print:text-gray-800 leading-relaxed">
                Kỹ sư phần mềm với hơn 3 năm kinh nghiệm phát triển hệ thống doanh nghiệp (HRM, BPM, B2B Portal, Realtime POS) bằng ASP.NET Core, SQL Server và các framework Frontend hiện đại (Angular, React, Vue.js, Electron). Mục tiêu phát huy chuyên môn sâu về tối ưu cơ sở dữ liệu, thiết kế Clean Architecture / Microservices và mở rộng quy mô phục vụ hàng ngàn người dùng đồng thời.
              </p>
            </div>

            <!-- Core Skills -->
            <div>
              <h2 class="text-xs font-bold code-font uppercase tracking-wider text-emerald-400 print:text-green-800 mb-2 flex items-center gap-1.5">
                ${getIconSvg('cpu', 'w-3.5 h-3.5')} KỸ NĂNG KỸ THUẬT NỔI BẬT
              </h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300 print:text-gray-800">
                <div class="p-2.5 rounded-xl bg-slate-950/60 print:bg-gray-50 border border-white/5 print:border-gray-200">
                  <strong class="text-cyan-300 print:text-black block code-font">Backend:</strong>
                  C#, .NET 6/8, ASP.NET Core Web API, Entity Framework Core, Dapper, LINQ, RESTful API, JWT, SignalR.
                </div>
                <div class="p-2.5 rounded-xl bg-slate-950/60 print:bg-gray-50 border border-white/5 print:border-gray-200">
                  <strong class="text-emerald-300 print:text-black block code-font">Frontend & Desktop:</strong>
                  Angular (v12-17), TypeScript, RxJS, React, Vue.js, Electron, Tailwind CSS, Vite, HTML5/SCSS.
                </div>
                <div class="p-2.5 rounded-xl bg-slate-950/60 print:bg-gray-50 border border-white/5 print:border-gray-200">
                  <strong class="text-amber-300 print:text-black block code-font">Database:</strong>
                  SQL Server (Tối ưu Stored Procedure, Indexing, Execution Plan), MongoDB, Redis Cache.
                </div>
                <div class="p-2.5 rounded-xl bg-slate-950/60 print:bg-gray-50 border border-white/5 print:border-gray-200">
                  <strong class="text-purple-300 print:text-black block code-font">Architecture & Tools:</strong>
                  Clean Architecture, CQRS, Repository Pattern, Git, Docker, Postman, Swagger, CI/CD.
                </div>
              </div>
            </div>

            <!-- Experience -->
            <div>
              <h2 class="text-xs font-bold code-font uppercase tracking-wider text-cyan-400 print:text-blue-800 mb-3 flex items-center gap-1.5">
                ${getIconSvg('briefcase', 'w-3.5 h-3.5')} KINH NGHIỆM LÀM VIỆC CHI TIẾT
              </h2>

              <div class="border-l-2 border-cyan-500/30 pl-4 space-y-4">
                <div>
                  <div class="flex flex-wrap items-center justify-between gap-1">
                    <h3 class="text-sm font-bold text-white print:text-black">CÔNG TY CỔ PHẦN KIDS PLAZA</h3>
                    <span class="text-xs code-font text-cyan-300 print:text-gray-600 font-bold">12/2022 — 08/2026 (3+ Năm)</span>
                  </div>
                  <div class="text-xs font-semibold text-emerald-400 print:text-green-700 code-font">Vị trí: .NET Fullstack Developer</div>
                  <ul class="list-disc list-inside text-xs sm:text-[13px] text-slate-300 print:text-gray-700 mt-2 space-y-1.5 leading-relaxed">
                    <li>Xây dựng và vận hành hệ thống cốt lõi quản trị nhân sự (HRM) và quản trị quy trình nghiệp vụ (BPM).</li>
                    <li>Thiết kế Workflow Engine đa cấp độ có thể cấu hình linh hoạt điều kiện rẽ nhánh và người duyệt.</li>
                    <li>Phát triển RESTful Web API với ASP.NET Core và EF Core kết nối thông suốt với các phân hệ Frontend.</li>
                    <li>Tối ưu hóa cơ sở dữ liệu SQL Server với hàng triệu bản ghi, giảm thời gian xử lý truy vấn từ phút xuống milli-giây.</li>
                    <li>Xây dựng ứng dụng Desktop Electron tích hợp SignalR Realtime đồng bộ hai chiều tại quầy thu ngân bán lẻ.</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Key Enterprise Projects -->
            <div>
              <h2 class="text-xs font-bold code-font uppercase tracking-wider text-purple-400 print:text-purple-800 mb-2 flex items-center gap-1.5">
                ${getIconSvg('folder-git-2', 'w-3.5 h-3.5')} DỰ ÁN TIÊU BIỂU
              </h2>
              <div class="space-y-2 text-xs text-slate-300 print:text-gray-800">
                <div class="p-2.5 rounded-xl bg-slate-950/40 print:bg-transparent border border-white/5 print:border-b print:border-gray-200">
                  <div class="flex justify-between font-bold text-cyan-300 print:text-black">
                    <span>1. Hệ Thống HRM & Workflow Engine</span>
                    <span>ASP.NET Core • Angular • SQL Server</span>
                  </div>
                  <p class="mt-0.5 text-slate-400 print:text-gray-600">Quản lý 1,500+ nhân viên; tự động hóa 100% quy trình phê duyệt công tác, lương thưởng nội bộ.</p>
                </div>
                <div class="p-2.5 rounded-xl bg-slate-950/40 print:bg-transparent border border-white/5 print:border-b print:border-gray-200">
                  <div class="flex justify-between font-bold text-emerald-300 print:text-black">
                    <span>2. Cổng Thông Tin Chuỗi Cung Ứng Đối Tác (B2B Portal)</span>
                    <span>.NET MVC • Angular • REST API</span>
                  </div>
                  <p class="mt-0.5 text-slate-400 print:text-gray-600">Kết nối 40-50 nhà cung cấp lớn; rút ngắn thời gian phê duyệt hồ sơ từ 20-30 ngày còn 3-5 ngày.</p>
                </div>
                <div class="p-2.5 rounded-xl bg-slate-950/40 print:bg-transparent border border-white/5 print:border-b print:border-gray-200">
                  <div class="flex justify-between font-bold text-sky-300 print:text-black">
                    <span>3. POS Customer Facing Display & Inspection</span>
                    <span>Electron • SignalR Realtime • React</span>
                  </div>
                  <p class="mt-0.5 text-slate-400 print:text-gray-600">Đồng bộ giỏ hàng và thanh toán QR tức thì với độ trễ &lt;15ms; hoạt động liên tục 16h/ngày.</p>
                </div>
              </div>
            </div>

            <!-- Education -->
            <div>
              <h2 class="text-xs font-bold code-font uppercase tracking-wider text-sky-400 print:text-blue-800 mb-2 flex items-center gap-1.5">
                ${getIconSvg('graduation-cap', 'w-3.5 h-3.5')} HỌC VẤN
              </h2>
              <div class="flex justify-between text-xs text-slate-300 print:text-gray-800">
                <span><strong>Cao Đẳng Kinh Tế Công Nghiệp Hà Nội</strong> — Chuyên ngành Công Nghệ Thông Tin</span>
                <span class="code-font text-cyan-400 print:text-gray-600">2020 — 2023</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    `;

    document.getElementById('btn-print-resume')?.addEventListener('click', () => {
      window.print();
    });

    document.getElementById('btn-copy-resume')?.addEventListener('click', (e) => {
      const summaryText = `DƯƠNG TIẾN ĐẠT - .NET Fullstack Developer (3+ năm kinh nghiệm)\nChuyên môn: ASP.NET Core, SQL Server, Angular, React, Electron, SignalR, Microservices, Workflow Engine.\nDự án: HRM Kids Plaza, Supplier Chain Portal, Realtime POS Display.\nĐịa chỉ: Tô Hiệu, Hà Đông, Hà Nội.`;
      navigator.clipboard.writeText(summaryText).then(() => {
        const btn = e.target.closest('button');
        if (btn) {
          const originalText = btn.innerHTML;
          btn.innerHTML = `<span class="text-emerald-400">${getIconSvg('check', 'w-3.5 h-3.5 inline mr-1')} Đã sao chép!</span>`;
          setTimeout(() => { btn.innerHTML = originalText; }, 2000);
        }
      });
    });

    document.body.style.overflow = 'hidden';
  }

  close() {
    if (this.sound && this.sound.playClick) {
      this.sound.playClick(400);
    }
    if (this.modalEl) {
      this.modalEl.innerHTML = '';
    }
    document.body.style.overflow = '';
  }
}
