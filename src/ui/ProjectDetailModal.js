import { getIconSvg } from '../utils/icons.js';

export const PROJECT_DETAILS = {
  hrm: {
    id: 'hrm',
    title: 'Hệ Thống Quản Trị Nhân Sự & Workflow Engine (HRM)',
    subtitle: 'Nền Tảng Quản Lý Nhân Sự & Tự Động Hóa Quy Trình Đa Cấp Doanh Nghiệp',
    role: '.NET Fullstack Developer',
    timeline: '12/2022 — Hiện tại',
    teamSize: '3 kỹ sư',
    client: 'Kids Plaza Retail Corp',
    icon: 'server',
    accentColor: 'cyan',
    badge: 'Core Enterprise System',
    overview: 'Hệ thống cốt lõi quản lý hơn 1,500 nhân sự trên toàn quốc, tích hợp công cụ Workflow Engine động cho phép các phòng ban tự thiết lập luồng phê duyệt từ 1 đến 5 cấp độ (Trưởng nhóm, Quản lý, Giám đốc, Ban kiểm soát, TGĐ) kèm phân quyền RBAC và ghi nhật ký kiểm toán (Audit Trail) chi tiết.',
    architecture: [
      { step: '1. Client Tier', desc: 'Angular 14+ SPA, Reactive Forms động, RxJS State Management, Angular Material custom theme.' },
      { step: '2. API Gateway & Auth', desc: 'ASP.NET Core Web API, JWT Bearer Token, Role-Based Access Control (RBAC) & Claim-Based Authorization.' },
      { step: '3. Business Logic Tier', desc: 'CQRS Pattern kết hợp MediatR, Workflow State Machine (Xử lý chuyển đổi trạng thái bản ghi và phân nhánh điều kiện).' },
      { step: '4. Data & Persistence', desc: 'Entity Framework Core, SQL Server 2019, Repository & Unit of Work Pattern, Tối ưu Index Seek cho bảng hàng triệu dòng.' }
    ],
    challenges: [
      {
        problem: 'Xử lý luồng phê duyệt đa cấp biến thiên linh hoạt',
        solution: 'Thiết kế cấu trúc dữ liệu State Machine dạng Graph có hướng (DAG), lưu trữ sơ đồ bước duyệt và điều kiện rẽ nhánh (threshold số tiền, phòng ban) trong SQL Server dưới dạng JSON column có index, giúp doanh nghiệp thay đổi quy trình mà không cần sửa code hay triển khai lại backend.'
      },
      {
        problem: 'Hiện tượng Deadlock và nghẽn ghi log Audit Trail khi hàng trăm chi nhánh cùng chấm công/đệ trình đơn',
        solution: 'Tách luồng ghi log lịch sử (Audit Log) sang chế độ bất đồng bộ (Channel / BackgroundService), dùng cơ chế hàng đợi in-memory giúp các thao tác chính phản hồi ngay <50ms mà không bị khóa bảng vật lý.'
      },
      {
        problem: 'Nghiệp vụ tính lương và phân quyền đa cấp phức tạp',
        solution: 'Áp dụng Dynamic LINQ và Stored Procedure tối ưu cho các báo cáo tính công cuối tháng, giảm thời gian tổng hợp từ 45 phút xuống dưới 2 phút.'
      }
    ],
    metrics: [
      { label: 'Tự Động Hóa', val: '100%', sub: 'Quy trình nội bộ' },
      { label: 'Thời Gian Phê Duyệt', val: '-70%', sub: 'So với thủ công' },
      { label: 'Tốc Độ API', val: '< 80ms', sub: 'Thời gian phản hồi' },
      { label: 'Nhân Sự Quản Lý', val: '1,500+', sub: 'Toàn hệ thống' }
    ],
    techStack: ['C#', 'ASP.NET Core', 'Angular', 'SQL Server', 'Entity Framework Core', 'JWT', 'RxJS', 'Tailwind CSS']
  },

  supplier: {
    id: 'supplier',
    title: 'Cổng Thông Tin Chuỗi Cung Ứng Đối Tác (Supplier Portal)',
    subtitle: 'Hệ Thống Kết Nối & Tự Động Hóa Phê Duyệt Đơn Hàng Nhà Cung Cấp',
    role: 'Fullstack Developer (.NET MVC & Angular)',
    timeline: '05/2024 — 05/2025',
    teamSize: '5 kỹ sư',
    client: 'Chuỗi Cung Ứng Bán Lẻ Kids Plaza',
    icon: 'workflow',
    accentColor: 'emerald',
    badge: 'B2B Procurement Platform',
    overview: 'Cổng giao tiếp điện tử giữa chuỗi bán lẻ và hàng chục đối tác cung ứng. Tự động hóa tiếp nhận bảng giá, theo dõi trạng thái đơn đặt hàng (Purchase Orders), đối soát hóa đơn VAT và phê duyệt hồ sơ năng lực nhà cung cấp trực tuyến.',
    architecture: [
      { step: '1. External Portal', desc: 'Angular & .NET MVC giao diện thân thiện cho đối tác ngoài tra cứu, tải chứng từ và cập nhật tồn kho.' },
      { step: '2. Integration Layer', desc: 'REST API bảo mật hai chiều với API Key & HMAC SHA-256 xác thực nguồn gốc giao dịch.' },
      { step: '3. Processing Engine', desc: 'Dịch vụ đối soát hóa đơn tự động và đồng bộ danh mục hàng hóa (Catalog Sync Engine).' },
      { step: '4. Database Layer', desc: 'SQL Server phân vùng Partitioning theo năm tài chính, lưu vết chi tiết trạng thái PO.' }
    ],
    challenges: [
      {
        problem: 'Quy trình xét duyệt hồ sơ nhà cung cấp trước đây mất 20 - 30 ngày qua giấy tờ thủ công',
        solution: 'Số hóa 100% hồ sơ pháp lý, biểu mẫu thẩm định và tự động điều phối tới các phòng ban chức năng (Thu mua, Pháp chế, Kế toán) theo luồng song song, rút ngắn thời gian xét duyệt chỉ còn 3 - 5 ngày.'
      },
      {
        problem: 'Độ trễ và sai lệch dữ liệu tồn kho giữa chuỗi cửa hàng và nhà cung cấp',
        solution: 'Xây dựng cơ chế webhook thông báo trạng thái đơn hàng thời gian thực, tự động gửi cảnh báo qua Email và Portal khi có biến động đơn giao nhận.'
      }
    ],
    metrics: [
      { label: 'Rút Ngắn Xét Duyệt', val: '3 - 5 Ngày', sub: 'Từ 20 - 30 ngày trước' },
      { label: 'Đối Tác Kết Nối', val: '40 - 50', sub: 'Nhà cung cấp lớn' },
      { label: 'Đơn Hàng Xử Lý', val: '10,000+', sub: 'Giao dịch / tháng' },
      { label: 'Độ Chính Xác', val: '99.8%', sub: 'Đối soát hóa đơn' }
    ],
    techStack: ['.NET MVC', 'Angular', 'C#', 'SQL Server', 'RESTful API', 'BPM Portal', 'Bootstrap']
  },

  bpm: {
    id: 'bpm',
    title: 'Hệ Thống BPM - Portal Quy Trình Doanh Nghiệp',
    subtitle: 'Nền Tảng Tự Động Hóa & Giám Sát Luồng Công Việc Thời Gian Thực',
    role: 'Frontend Developer (Angular Lead)',
    timeline: '10/2025 — Hiện tại',
    teamSize: '10 kỹ sư',
    client: 'Kids Plaza Digital Transformation',
    icon: 'layout',
    accentColor: 'purple',
    badge: 'Enterprise Workflow Engine',
    overview: 'Nền tảng Business Process Management (BPM) cấp doanh nghiệp, cung cấp trình tạo form động (Dynamic Form Builder), quản lý danh sách tác vụ cần duyệt (Task Inbox), theo dõi tiến độ SLA và dashboard báo cáo hiệu suất xử lý công việc.',
    architecture: [
      { step: '1. Frontend Shell', desc: 'Angular Micro-Frontend kiến trúc Module lười (Lazy-Loaded Feature Modules), RxJS State.' },
      { step: '2. Dynamic Form Engine', desc: 'Engine biên dịch cấu hình JSON schema thành form nhập liệu tương tác với đầy đủ validation nghiệp vụ.' },
      { step: '3. Backend Microservices', desc: 'ASP.NET Core REST API, Workflow Core Service, Audit Tracking Service.' },
      { step: '4. Cache & Database', desc: 'Redis Cache lưu trữ phiên làm việc và mẫu form, SQL Server lưu trữ dữ liệu nghiệp vụ.' }
    ],
    challenges: [
      {
        problem: 'Form nhập liệu thay đổi liên tục theo từng loại quy trình và từng phòng ban',
        solution: 'Thiết kế bộ parser chuyển đổi cấu hình JSON Schema thành các Angular Control tương ứng (Text, Dropdown, Table, File Upload, Conditional Logic) giúp mở rộng loại form mới mà không cần release code.'
      },
      {
        problem: 'Hiệu năng render danh sách hàng ngàn tác vụ xử lý',
        solution: 'Áp dụng CDK Virtual Scroll kết hợp ChangeDetectionStrategy.OnPush, giảm tải DOM và tối ưu hóa 60fps mượt mà trên mọi thiết bị.'
      }
    ],
    metrics: [
      { label: 'Thời Gian Khởi Tạo Form', val: '< 1 Giờ', sub: 'Không cần viết code mới' },
      { label: 'Tốc Độ Render', val: '60 FPS', sub: 'Virtual Scroll mượt mà' },
      { label: 'Quy Trình Áp Dụng', val: '30+', sub: 'Quy trình nội bộ' },
      { label: 'Độ Trễ Phản Hồi', val: '< 100ms', sub: 'Chuyển tab tức thì' }
    ],
    techStack: ['Angular', 'TypeScript', 'RxJS', 'Tailwind CSS', 'Angular Material', 'REST API', 'JSON Schema']
  },

  pos: {
    id: 'pos',
    title: 'Hệ Thống POS & Màn Hình Phụ Khách Hàng Realtime',
    subtitle: 'Ứng Dụng Desktop Electron & Đồng Bộ Hai Chiều Realtime SignalR',
    role: 'Frontend & Desktop Developer',
    timeline: '04/2026 — 05/2026',
    teamSize: '5 kỹ sư',
    client: 'Hệ Thống Chuỗi Cửa Hàng Bán Lẻ',
    icon: 'monitor',
    accentColor: 'sky',
    badge: 'High-Availability Retail Tech',
    overview: 'Giải pháp màn hình thứ hai (Customer Facing Display) chạy trên nền tảng Electron Desktop, đồng bộ thời gian thực 2 chiều với máy thu ngân qua SignalR. Khách hàng nhìn thấy giỏ hàng, khuyến mãi, quét mã thanh toán QR động và xem video quảng cáo khi máy ở trạng thái rảnh.',
    architecture: [
      { step: '1. Electron Desktop App', desc: 'Ứng dụng Electron đa nền tảng tối ưu tài nguyên, chống crash, tự động phục hồi khi mất kết nối.' },
      { step: '2. React & TypeScript UI', desc: 'Giao diện khách hàng hiện đại, hiệu ứng chuyển cảnh mượt mà, hỗ trợ phát video quảng cáo HD.' },
      { step: '3. SignalR Realtime Hub', desc: 'Kênh kết nối WebSocket nội bộ hai chiều giữa ứng dụng thu ngân và màn hình khách hàng.' },
      { step: '4. Angular Inspection Tool', desc: 'Phân hệ quản trị kiểm tra và đối chiếu dữ liệu giao dịch bán lẻ theo thời gian thực.' }
    ],
    challenges: [
      {
        problem: 'Mất kết nối mạng cục bộ giữa máy thu ngân và màn hình phụ làm đứt quãng trải nghiệm tính tiền',
        solution: 'Cơ chế SignalR Auto-Reconnect thông minh kèm Heartbeat Ping định kỳ 2 giây. Nếu đứt kết nối, màn hình phụ tự động chuyển sang chế độ Standalone Promotion Banner và tự nối lại ngay khi mạng khôi phục mà không cần khởi động lại máy.'
      },
      {
        problem: 'Rò rỉ bộ nhớ (Memory Leak) trong Electron khi chạy liên tục 16 tiếng/ngày tại cửa hàng',
        solution: 'Tái cấu trúc vòng đời component React, hủy bỏ triệt để các event listener và timer, giới hạn kích thước cache video quảng cáo, duy trì mức RAM ổn định <120MB.'
      }
    ],
    metrics: [
      { label: 'Độ Trễ Đồng Bộ', val: '< 15ms', sub: 'SignalR Realtime' },
      { label: 'Thời Gian Uptime', val: '99.9%', sub: 'Hoạt động liên tục' },
      { label: 'Mức Tiêu Thụ RAM', val: '< 120MB', sub: 'Electron tối ưu' },
      { label: 'Tốc Độ Quét QR', val: 'Tức Thì', sub: 'VietQR / Momo / VNPAY' }
    ],
    techStack: ['Electron', 'React', 'SignalR', 'TypeScript', 'Angular', 'RxJS', 'Tailwind CSS']
  },

  kpi: {
    id: 'kpi',
    title: 'Báo Cáo KPI Tổng Quan & Data Warehouse (DWH)',
    subtitle: 'Dashboard Phân Tích Dữ Liệu Kinh Doanh Trực Quan Cho Ban Lãnh Đạo',
    role: 'Frontend Developer (Vue.js & Data Viz)',
    timeline: '01/2026 — 06/2026',
    teamSize: 'Đối tác chiến lược',
    client: 'Hệ Thống Phân Tích Chỉ Số Doanh Nghiệp',
    icon: 'bar-chart-3',
    accentColor: 'amber',
    badge: 'Executive Analytics Platform',
    overview: 'Bảng điều khiển phân tích thông minh tổng hợp dữ liệu từ Kho dữ liệu lớn (DWH), biểu diễn trực quan các chỉ số doanh thu, tỷ suất lợi nhuận, hiệu quả chuỗi cung ứng và tỷ lệ hoàn thành KPI của từng đơn vị.',
    architecture: [
      { step: '1. Presentation Layer', desc: 'Vue.js 3 với Composition API, Pinia State Management, Vite build siêu tốc.' },
      { step: '2. Visualization Engine', desc: 'Tích hợp thư viện biểu đồ linh hoạt (Charts, Treemaps, Heatmaps) tối ưu vẽ trên Canvas / SVG.' },
      { step: '3. Data Aggregation API', desc: 'REST API trả về các khối dữ liệu tiền xử lý (pre-aggregated) từ kho DWH.' },
      { step: '4. Export Engine', desc: 'Xuất báo cáo PDF / Excel chi tiết theo thời gian thực chuẩn định dạng kế toán.' }
    ],
    challenges: [
      {
        problem: 'Khối lượng dữ liệu báo cáo DWH hàng trăm ngàn dòng gây đơ giật giao diện trình duyệt',
        solution: 'Sử dụng kỹ thuật Lazy Calculation, phân trang dữ liệu theo block thời gian và vẽ biểu đồ tối ưu với Web Worker xử lý tính toán số liệu ở background thread.'
      },
      {
        problem: 'Yêu cầu tải trang cực nhanh phục vụ các cuộc họp của Ban Giám Đốc',
        solution: 'Tận dụng Vite SSR/SSG caching và Tree-shaking tối đa, giảm dung lượng bundle tải về còn dưới 180KB, thời gian mở dashboard < 0.6s.'
      }
    ],
    metrics: [
      { label: 'Tốc Độ Mở Trang', val: '< 0.6s', sub: 'Vite tối ưu bundle' },
      { label: 'Khối Lượng Xử Lý', val: '1.5M+', sub: 'Bản ghi giao dịch' },
      { label: 'Tần Suất Cập Nhật', val: '5 Phút', sub: 'Tự động đồng bộ DWH' },
      { label: 'Chỉ Số Đo Lường', val: '40+', sub: 'KPI tài chính & vận hành' }
    ],
    techStack: ['Vue.js 3', 'TypeScript', 'Vite', 'Pinia', 'Tailwind CSS', 'Canvas Charts', 'DWH REST API']
  }
};

export class ProjectDetailModal {
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
    let el = document.getElementById('project-detail-modal-root');
    if (!el) {
      el = document.createElement('div');
      el.id = 'project-detail-modal-root';
      document.body.appendChild(el);
    }
    this.modalEl = el;
  }

  bindTriggers() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-project-detail');
      if (btn) {
        const projectId = btn.getAttribute('data-project');
        if (projectId && PROJECT_DETAILS[projectId]) {
          this.open(projectId);
        }
      }

      if (e.target.closest('#btn-close-project-modal') || e.target.classList.contains('project-modal-backdrop')) {
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
    return this.modalEl && !this.modalEl.classList.contains('hidden') && this.modalEl.innerHTML.trim() !== '';
  }

  open(projectId) {
    const data = PROJECT_DETAILS[projectId];
    if (!data) return;

    if (this.sound && this.sound.playClick) {
      this.sound.playClick(600);
    }

    const iconSvg = getIconSvg(data.icon, 'w-6 h-6 text-cyan-400', 24);

    this.modalEl.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 project-modal-backdrop bg-slate-950/85 backdrop-blur-xl animate-fade-in">
        <div class="relative w-full max-w-4xl max-h-[90vh] bg-slate-900/95 border border-cyan-500/40 rounded-3xl p-5 sm:p-8 shadow-2xl overflow-y-auto cyber-scroll code-font text-slate-200">
          
          <!-- Corner brackets -->
          <div class="corner-bracket-tl border-cyan-400"></div>
          <div class="corner-bracket-tr border-cyan-400"></div>
          <div class="corner-bracket-bl border-cyan-400"></div>
          <div class="corner-bracket-br border-cyan-400"></div>

          <!-- Header -->
          <div class="flex items-start justify-between border-b border-white/10 pb-4 mb-6">
            <div class="flex items-center gap-3.5">
              <div class="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/15 shrink-0">
                ${iconSvg}
              </div>
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    ${data.badge}
                  </span>
                  <span class="text-xs text-slate-400">${data.timeline}</span>
                </div>
                <h3 class="text-xl sm:text-2xl font-black text-white mt-1">${data.title}</h3>
                <p class="text-xs text-slate-400 mt-0.5 font-sans">${data.subtitle}</p>
              </div>
            </div>

            <button id="btn-close-project-modal" class="p-2 rounded-xl bg-slate-950/80 border border-white/10 hover:border-rose-500/50 hover:text-rose-400 text-slate-400 transition-all shrink-0">
              ${getIconSvg('x', 'w-5 h-5')}
            </button>
          </div>

          <!-- Quick Metrics Ribbon -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            ${data.metrics.map(m => `
              <div class="bg-slate-950/80 border border-white/10 rounded-2xl p-3 text-center">
                <span class="text-[10px] text-slate-400 uppercase tracking-wider block">${m.sub}</span>
                <span class="digital-lcd text-lg sm:text-xl font-black text-cyan-300 block my-0.5">${m.val}</span>
                <span class="text-[11px] text-slate-300 font-bold">${m.label}</span>
              </div>
            `).join('')}
          </div>

          <!-- Project Overview & Context -->
          <div class="mb-6 bg-slate-950/60 p-4 rounded-2xl border border-white/5 font-sans text-xs sm:text-sm leading-relaxed text-slate-300">
            <h4 class="font-bold text-cyan-400 text-xs code-font uppercase tracking-wider mb-2 flex items-center gap-1.5">
              ${getIconSvg('info', 'w-3.5 h-3.5')} Tổng Quan & Nghiệp Vụ
            </h4>
            <p>${data.overview}</p>
            <div class="flex flex-wrap gap-4 mt-3 pt-3 border-t border-white/5 text-xs code-font text-slate-400">
              <span><strong>Vai trò:</strong> <span class="text-emerald-400">${data.role}</span></span>
              <span><strong>Quy mô team:</strong> <span class="text-white">${data.teamSize}</span></span>
              <span><strong>Khách hàng / Doanh nghiệp:</strong> <span class="text-white">${data.client}</span></span>
            </div>
          </div>

          <!-- Architecture & Data Flow -->
          <div class="mb-6">
            <h4 class="font-bold text-cyan-400 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              ${getIconSvg('cpu', 'w-3.5 h-3.5')} Sơ Đồ Khối & Kiến Trúc Hệ Thống (Architecture Blueprint)
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              ${data.architecture.map((arch, idx) => `
                <div class="bg-slate-950/80 border border-cyan-500/20 rounded-2xl p-3.5 relative overflow-hidden">
                  <span class="text-[10px] font-bold text-cyan-400 block mb-1 uppercase tracking-wider">${arch.step}</span>
                  <p class="text-xs text-slate-300 font-sans leading-relaxed">${arch.desc}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Hard Problems & Solutions -->
          <div class="mb-6">
            <h4 class="font-bold text-amber-400 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              ${getIconSvg('zap', 'w-3.5 h-3.5')} Bài Toán Kỹ Thuật Hóc Búa Đã Giải Quyết
            </h4>
            <div class="space-y-3">
              ${data.challenges.map((c, i) => `
                <div class="bg-slate-950/90 border border-amber-500/20 rounded-2xl p-4">
                  <div class="text-xs font-bold text-amber-300 mb-1 flex items-center gap-2">
                    <span class="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px] text-amber-400 font-mono">${i + 1}</span>
                    <span>Thách thức: ${c.problem}</span>
                  </div>
                  <div class="text-xs sm:text-[13px] text-slate-300 font-sans pl-7 leading-relaxed border-l-2 border-amber-500/30 ml-2.5 mt-2">
                    <strong class="text-emerald-400 font-bold block mb-0.5">Giải pháp kỹ thuật:</strong>
                    ${c.solution}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Tech Stack Badges -->
          <div class="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div class="flex flex-wrap items-center gap-1.5 text-xs">
              <span class="text-slate-400 mr-1 text-[11px]">Công nghệ:</span>
              ${data.techStack.map(t => `
                <span class="px-2.5 py-1 rounded-xl bg-slate-950 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono font-bold">
                  ${t}
                </span>
              `).join('')}
            </div>
            <button id="btn-modal-back" class="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-black text-xs hover:scale-105 transition-all">
              Đóng Cửa Sổ
            </button>
          </div>

        </div>
      </div>
    `;

    document.getElementById('btn-modal-back')?.addEventListener('click', () => this.close());
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
