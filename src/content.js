// Nội dung đối chiếu với CV TopCV ngày 27/10/2026; không suy diễn thành tích.
export const identity = {
  name: 'Dương Tiến Đạt', role: '.NET Developer',
  phone: '0393828088', email: 'datduongnvty@gmail.com', address: 'Tô Hiệu, Hà Đông, Hà Nội',
  goal: 'Mong muốn tiếp tục phát triển chuyên môn kỹ thuật, đóng góp vào các hệ thống lớn với khả năng scale và maintain tốt.',
};

export const skills = [
  { title: 'Backend', items: ['C#', 'ASP.NET Core', 'Entity Framework', 'RESTful API', 'JWT Authentication'] },
  { title: 'Frontend', items: ['Angular (v12+)', 'React', 'Vue.js', 'TypeScript', 'HTML', 'CSS', 'SCSS', 'RxJS', 'Angular Material', 'Vite', 'Responsive Design'] },
  { title: 'Database', items: ['SQL Server', 'MongoDB'] },
  { title: 'DevOps & Tool', items: ['Git', 'GitHub/GitLab', 'Postman', 'Swagger', 'Docker (cơ bản)'] },
];

export const experience = [
  'Phát triển và vận hành hệ thống quản trị nhân sự (HRM) và quy trình nghiệp vụ (BPM).',
  'Xây dựng engine workflow phê duyệt đa cấp, hỗ trợ nhiều loại quy trình nội bộ.',
  'Thiết kế và phát triển RESTful API bằng ASP.NET Core và Entity Framework, tích hợp với frontend Angular.',
  'Tối ưu truy vấn SQL Server, cải thiện hiệu năng hệ thống.',
  'Phát triển giao diện frontend trên nhiều framework khác nhau (Angular, React, Vue.js) tùy theo yêu cầu dự án.',
  'Tham gia phân tích yêu cầu nghiệp vụ và hỗ trợ vận hành hệ thống.',
];

export const projects = [
  {
    title: 'Hệ thống quản trị nhân sự', period: '06/2023–Hiện tại', role: '.NET Developer', team: '3 người',
    description: 'Quản lý hồ sơ nhân sự, engine workflow phê duyệt đa cấp có thể cấu hình động, phân quyền người dùng theo vai trò, ghi log lịch sử thao tác (audit trail), báo cáo thống kê.',
    result: 'Giảm đáng kể thời gian xử lý phê duyệt thủ công.',
    work: ['Tiếp nhận quản lý source code vận hành, tối ưu, nâng cấp sang một hệ thống mới khi hệ thống cũ hiện tại.'],
    tech: ['ASP.NET Core', 'Entity Framework', 'SQL Server', 'TypeScript', 'JWT', 'REST API'],
  },
  {
    title: 'Cổng thông tin chuỗi cung ứng với nhà cung cấp', period: '05/2024–05/2025', role: 'Developer', team: '5 người',
    description: 'Quản lý thông tin nhà cung cấp, theo dõi đơn hàng, phê duyệt hồ sơ, dashboard báo cáo.',
    result: 'Kết nối 40 đến 50 nhà cung cấp / rút ngắn quy trình phê duyệt.',
    tech: ['.NET MVC', 'Angular', 'SQL Server', 'REST API'],
  },
  {
    title: 'BPM — Cổng thông tin quản lý quy trình nghiệp vụ doanh nghiệp', period: '10/2025–10/2026', role: 'Frontend Developer (Angular)', team: '10 người',
    description: 'Phát triển giao diện cho hệ thống xử lý quy trình nội bộ.',
    work: ['Xây dựng màn hình phê duyệt, form nghiệp vụ và dashboard.', 'Tích hợp dữ liệu từ API backend.', 'Tối ưu trải nghiệm người dùng.'],
    tech: ['Angular', 'TypeScript', 'HTML', 'CSS', 'REST API'],
  },
  {
    title: 'Hệ thống Bán hàng & Kiểm tra Giao dịch', period: '04/2026–05/2026', role: 'Frontend Developer', team: '5 người',
    description: 'Phát triển các module frontend phục vụ quy trình bán hàng tại quầy và kiểm tra, đối chiếu giao dịch.',
    parts: [
      { title: 'Màn hình hiển thị khách hàng', work: ['Xây dựng các trạng thái hiển thị cho giỏ hàng, thanh toán và hoàn tất giao dịch.', 'Tự động đưa màn hình về trạng thái chờ hoặc hiển thị quảng cáo sau khi hoàn tất giao dịch.', 'Đồng bộ dữ liệu thời gian thực giữa màn hình bán hàng và màn hình khách hàng qua SignalR.'], tech: ['Electron', 'React', 'TypeScript', 'SignalR'] },
      { title: 'Báo cáo kiểm tra giao dịch', work: ['Xây dựng giao diện tìm kiếm và hiển thị kết quả kiểm tra giao dịch.', 'Phối hợp làm rõ yêu cầu hiển thị dữ liệu với đội nghiệp vụ.'], tech: ['Angular', 'TypeScript', 'REST API', 'RxJS'] },
    ],
  },
  {
    title: 'Báo cáo KPI tổng quan / DWH', period: '01/2026–06/2026', role: 'Frontend Developer', team: 'Làm việc với đối tác bên ngoài',
    description: 'Phát triển giao diện báo cáo tổng quan giúp người dùng theo dõi các chỉ số kinh doanh.',
    work: ['Xây dựng hiển thị KPI, biểu đồ và thông tin so sánh.', 'Định dạng số và tỷ lệ phần trăm phù hợp chuẩn.'],
    tech: ['Vue.js', 'TypeScript', 'Vite'],
  },
];

export const sections = [
  { id: 'about', label: 'Về bản thân', color: '#157d79', soft: '#e9f3f1' },
  { id: 'skills', label: 'Kỹ năng', color: '#2868b5', soft: '#edf3fa' },
  { id: 'experience', label: 'Kinh nghiệm', color: '#6252a0', soft: '#f0eef7' },
  { id: 'projects', label: 'Dự án', color: '#bd4b24', soft: '#fcf0e9' },
  { id: 'education', label: 'Học vấn', color: '#67783b', soft: '#f1f4e9' },
];
