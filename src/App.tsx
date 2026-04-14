import { useEffect, useRef, useState } from 'react'
import './App.css'

type Locale = 'vi' | 'en'
type Theme = 'dark' | 'light'

type LabelValue = {
  label: string
  value: string
}

type LinkValue = {
  label: string
  value: string
  href: string
}

type Pillar = {
  title: string
  text: string
}

type SkillItem = {
  label: string
  icon: SkillIconKind
}

type SkillGroup = {
  title: string
  items: SkillItem[]
  icon: SkillIconKind
}

type SkillIconKind =
  | 'backend'
  | 'frontend'
  | 'data'
  | 'csharp'
  | 'dotnet'
  | 'api'
  | 'entity'
  | 'jwt'
  | 'angular'
  | 'typescript'
  | 'html'
  | 'css'
  | 'scss'
  | 'material'
  | 'rxjs'
  | 'sql'
  | 'mongo'
  | 'git'
  | 'github'
  | 'postman'
  | 'swagger'
  | 'docker'

type StreamItem = {
  label: string
  icon: StreamIconKind
  tone: StreamTone
}

type StreamIconKind =
  | 'flow'
  | 'api'
  | 'database'
  | 'shield'
  | 'speed'
  | 'dashboard'
  | 'code'
  | 'tools'
  | 'approval'
  | 'audit'
  | 'integration'
  | 'docs'
  | 'branch'
  | 'screen'

type StreamTone = 'blue' | 'cyan' | 'green' | 'amber' | 'violet' | 'rose'

type TimelineItem = {
  period: string
  title: string
  text: string
}

type ProjectItem = {
  name: string
  summary: string
  stack: string[]
}

type ProfileStat = {
  value: string
  label: string
}

type SidebarContent = {
  eyebrow: string
  title: string
  role: string
  summary: string
  personalLabel: string
  personalInfo: LabelValue[]
  contactLabel: string
  contacts: LinkValue[]
  socialLabel: string
  socials: SocialLinkValue[]
  interestsLabel: string
  interests: string[]
}

type SocialLinkValue = {
  label: string
  value: string
  href: string
  icon: SocialIconKind
}

type SocialIconKind = 'zalo' | 'facebook' | 'instagram' | 'twitter'

type LocaleContent = {
  brand: string
  nav: {
    objective: string
    skills: string
    experience: string
    projects: string
    education: string
    achievements: string
    contact: string
  }
  hero: {
    intro: string
    title: string
    subtitle: string
    badges: string[]
    actions: {
      contact: string
      projects: string
    }
    caption: string
    note: string
    stats: ProfileStat[]
  }
  stream: {
    eyebrow: string
    title: string
    subtitle: string
  }
  sidebar: SidebarContent
  objective: {
    eyebrow: string
    title: string
    body: string[]
    pillars: Pillar[]
  }
  skills: {
    eyebrow: string
    title: string
    groups: SkillGroup[]
  }
  experience: {
    eyebrow: string
    title: string
    timeline: TimelineItem[]
  }
  projects: {
    eyebrow: string
    title: string
    items: ProjectItem[]
  }
  education: {
    eyebrow: string
    title: string
    items: TimelineItem[]
  }
  achievements: {
    eyebrow: string
    title: string
    items: TimelineItem[]
  }
  contact: {
    eyebrow: string
    title: string
    body: string
    email: string
    phone: string
    themeToggleToLight: string
    themeToggleToDark: string
    languageToggle: string
  }
}

const localeContent: Record<Locale, LocaleContent> = {
  vi: {
    brand: 'CV / Hồ sơ nghề nghiệp',
    nav: {
      objective: 'Mục tiêu',
      skills: 'Kỹ năng',
      experience: 'Kinh nghiệm',
      projects: 'Dự án',
      education: 'Học vấn',
      achievements: 'Thành tựu',
      contact: 'Liên hệ',
    },
    hero: {
      intro: 'Xin chào, tôi là',
      title: 'Lập trình viên hệ thống nội bộ',
      subtitle:
        'Lập trình viên .NET với hơn 3 năm kinh nghiệm phát triển HRM/BPM, RESTful API và giao diện Angular. Chuyên xử lý các bài toán nghiệp vụ nội bộ theo hướng ổn định, bảo mật và dễ mở rộng.',
      badges: ['Hà Đông, Hà Nội', '.NET Developer', 'Angular Frontend'],
      actions: {
        contact: 'Liên hệ ngay',
        projects: 'Xem dự án',
      },
      caption: 'Hồ sơ chuyên nghiệp',
      note: 'Ảnh minh họa tạm thời',
      stats: [
        { value: '3+', label: 'Năm kinh nghiệm HRM/BPM' },
        { value: '4+', label: 'Nhóm công nghệ chính' },
        { value: '2', label: 'Dự án trọng điểm' },
      ],
    },
    stream: {
      eyebrow: 'Dòng thông tin kỹ thuật',
      title: 'Luồng hệ thống chạy liên tục',
      subtitle: 'Các tín hiệu nghiệp vụ, công nghệ và quy trình vận hành được mô phỏng như một data stream.',
    },
    sidebar: {
      eyebrow: 'Thông tin cá nhân',
      title: 'Dương Tiến Đạt',
      role: 'Internal System Developer',
      summary: 'Tập trung phát triển hệ thống nội bộ, workflow phê duyệt và lớp tích hợp giữa backend .NET và frontend Angular.',
      personalLabel: 'Tóm tắt hồ sơ',
      personalInfo: [
        { label: 'Họ và tên', value: 'Dương Tiến Đạt' },
        { label: 'Vị trí', value: 'Internal System Developer' },
        { label: 'Khu vực', value: 'Hà Đông, Hà Nội' },
        { label: 'Kinh nghiệm', value: '3+ năm' },
      ],
      contactLabel: 'Liên hệ',
      contacts: [
        { label: 'Điện thoại', value: '0393828088', href: 'tel:0393828088' },
        { label: 'Email', value: 'datduongnvty@gmail.com', href: 'mailto:datduongnvty@gmail.com' },
      ],
      socialLabel: 'Mạng xã hội',
      socials: [
        { label: 'Zalo', value: 'zalo.me/0393828088', href: 'https://zalo.me/0393828088', icon: 'zalo' },
        { label: 'Facebook', value: 'facebook.com', href: 'https://www.facebook.com/', icon: 'facebook' },
        { label: 'Instagram', value: 'instagram.com', href: 'https://www.instagram.com/', icon: 'instagram' },
        { label: 'Twitter', value: 'x.com', href: 'https://x.com/', icon: 'twitter' },
      ],
      interestsLabel: 'Sở thích',
      interests: ['Nghe nhạc', 'Du lịch', 'Tìm hiểu công nghệ mới'],
    },
    objective: {
      eyebrow: 'Mục tiêu nghề nghiệp',
      title: 'Phát triển hệ thống doanh nghiệp ổn định, bảo mật và dễ mở rộng trong dài hạn.',
      body: [
        'Tôi mong muốn tham gia xây dựng các hệ thống quy mô lớn, tối ưu quy trình vận hành, đảm bảo khả năng mở rộng và duy trì chất lượng ổn định trong môi trường doanh nghiệp.',
        'Định hướng trong 2–3 năm tới là phát triển lên vị trí Senior Developer, tiếp tục đào sâu vào kiến trúc hệ thống, workflow nghiệp vụ và trải nghiệm người dùng cho các ứng dụng nội bộ.',
      ],
      pillars: [
        {
          title: 'Hệ thống hóa nghiệp vụ',
          text: 'Ưu tiên cấu trúc màn hình rõ ràng, luồng xử lý dễ hiểu và giảm ma sát khi người dùng thao tác.',
        },
        {
          title: 'Triển khai ổn định',
          text: 'Tập trung vào tính ổn định, khả năng mở rộng và tối ưu hiệu năng ở cả frontend lẫn backend.',
        },
        {
          title: 'Phối hợp liên phòng ban',
          text: 'Làm việc hiệu quả với BA, backend, frontend và vận hành để đưa tính năng đi vào sử dụng thực tế.',
        },
      ],
    },
    skills: {
      eyebrow: 'Các kỹ năng',
      title: 'Tập trung vào backend .NET, frontend Angular và hệ sinh thái công cụ triển khai.',
      groups: [
        {
          title: 'Backend',
          icon: 'backend',
          items: [
            { label: 'C#', icon: 'csharp' },
            { label: 'ASP.NET Core', icon: 'dotnet' },
            { label: 'Entity Framework', icon: 'entity' },
            { label: 'RESTful API', icon: 'api' },
            { label: 'JWT Authentication', icon: 'jwt' },
          ],
        },
        {
          title: 'Frontend',
          icon: 'frontend',
          items: [
            { label: 'Angular (v12+)', icon: 'angular' },
            { label: 'TypeScript', icon: 'typescript' },
            { label: 'HTML', icon: 'html' },
            { label: 'CSS', icon: 'css' },
            { label: 'SCSS', icon: 'scss' },
            { label: 'Angular Material', icon: 'material' },
            { label: 'RxJS', icon: 'rxjs' },
          ],
        },
        {
          title: 'Database & Tool',
          icon: 'data',
          items: [
            { label: 'SQL Server', icon: 'sql' },
            { label: 'MongoDB', icon: 'mongo' },
            { label: 'Git', icon: 'git' },
            { label: 'GitHub/GitLab', icon: 'github' },
            { label: 'Postman', icon: 'postman' },
            { label: 'Swagger', icon: 'swagger' },
            { label: 'Docker cơ bản', icon: 'docker' },
          ],
        },
      ],
    },
    experience: {
      eyebrow: 'Kinh nghiệm làm việc',
      title: 'Hành trình phát triển tập trung vào HRM, BPM, API và tích hợp frontend.',
      timeline: [
        {
          period: '10/2025 - Hiện tại',
          title: 'Frontend Developer (Angular) - BPM Portal',
          text: 'Phát triển giao diện cho hệ thống xử lý quy trình nội bộ, xây dựng màn hình phê duyệt, form nghiệp vụ và dashboard; tích hợp dữ liệu từ API backend và tối ưu trải nghiệm người dùng.',
        },
        {
          period: '12/2022 - Hiện tại',
          title: 'Developer .NET - Công ty Cổ phần Kids Plaza',
          text: 'Tham gia phát triển và vận hành hệ thống HRM/BPM, xây dựng workflow phê duyệt cho đánh giá nhân sự, nghỉ phép và đề xuất; thiết kế RESTful API bằng ASP.NET Core, tích hợp Angular và tối ưu truy vấn SQL Server.',
        },
      ],
    },
    projects: {
      eyebrow: 'Dự án & phạm vi đóng góp',
      title: 'Những hệ thống tôi đã tham gia phát triển và vận hành thực tế.',
      items: [
        {
          name: 'Hệ thống quản trị nhân sự',
          summary: 'Dự án HRM với quy mô team 3 người, phục vụ quản lý hồ sơ, workflow phê duyệt nhiều bước, phân quyền, log lịch sử và báo cáo thống kê.',
          stack: ['ASP.NET Core', 'Entity Framework', 'SQL Server', 'Angular', 'JWT', 'REST API'],
        },
        {
          name: 'Cổng thông tin chuỗi cung ứng với nhà cung cấp',
          summary: 'Nền tảng phục vụ quản lý và kết nối nhà cung cấp, theo dõi đơn hàng, phê duyệt hồ sơ và dashboard báo cáo.',
          stack: ['.NET MVC', 'Angular', 'SQL Server', 'REST API', 'BPM Portal'],
        },
        {
          name: 'Hệ thống quy trình nội bộ',
          summary: 'Front-end Angular cho các màn hình xử lý phê duyệt, form nghiệp vụ và dashboard, tập trung tích hợp API và xử lý lỗi giao diện.',
          stack: ['Angular', 'TypeScript', 'HTML', 'CSS', 'REST API'],
        },
      ],
    },
    education: {
      eyebrow: 'Học vấn & chứng chỉ',
      title: 'Nền tảng học tập và chứng nhận chuyên môn liên quan đến CNTT.',
      items: [
        {
          period: '2020 - 2023',
          title: 'Cao đẳng Kinh tế Công nghiệp Hà Nội',
          text: 'Chuyên ngành Công nghệ Thông tin.',
        },
        {
          period: '2020 - 2023',
          title: 'Bằng chứng nhận kỹ năng thực hành',
          text: 'Bằng chứng nhận kỹ năng thực hành chuyên ngành Công nghệ Thông tin.',
        },
      ],
    },
    achievements: {
      eyebrow: 'Thành tựu nổi bật',
      title: 'Những điểm đóng góp làm rõ năng lực trong môi trường doanh nghiệp.',
      items: [
        {
          period: 'Impact',
          title: 'Tối ưu hệ thống quy trình nội bộ',
          text: 'Tham gia xây dựng các workflow phê duyệt nhiều bước cho đánh giá nhân sự, nghỉ phép và đề xuất, giúp chuẩn hóa vận hành nghiệp vụ.',
        },
        {
          period: 'Impact',
          title: 'Kết nối frontend và backend hiệu quả',
          text: 'Thiết kế RESTful API bằng ASP.NET Core, tích hợp Angular với backend và xử lý lỗi giao diện để đảm bảo trải nghiệm ổn định.',
        },
        {
          period: 'Impact',
          title: 'Tối ưu hiệu năng truy vấn',
          text: 'Đóng góp trong việc rà soát và cải thiện truy vấn SQL Server để nâng cao tốc độ phản hồi của hệ thống.',
        },
      ],
    },
    contact: {
      eyebrow: 'Liên hệ',
      title: 'Sẵn sàng cho những cơ hội phù hợp với hệ thống doanh nghiệp và sản phẩm nội bộ.',
      body: 'Nếu cần, tôi có thể tiếp tục chỉnh trang này theo phong cách corporate hơn nữa, hoặc thay ảnh chân dung thật, thêm link GitHub, LinkedIn và bố cục CV một trang.',
      email: 'datduongnvty@gmail.com',
      phone: '0393828088',
      themeToggleToLight: 'Đổi sang sáng',
      themeToggleToDark: 'Đổi sang tối',
      languageToggle: 'EN',
    },
  },
  en: {
    brand: 'CV / Professional Profile',
    nav: {
      objective: 'Objective',
      skills: 'Skills',
      experience: 'Experience',
      projects: 'Projects',
      education: 'Education',
      achievements: 'Highlights',
      contact: 'Contact',
    },
    hero: {
      intro: 'Hello, I am',
      title: 'Internal System Developer',
      subtitle:
        'A .NET developer with more than 3 years of experience in HRM/BPM systems, RESTful APIs, and Angular interfaces. Focused on stable, secure, and scalable internal business solutions.',
      badges: ['Ha Dong, Hanoi', '.NET Developer', 'Angular Frontend'],
      actions: {
        contact: 'Contact me',
        projects: 'View projects',
      },
      caption: 'Professional profile',
      note: 'Temporary illustration',
      stats: [
        { value: '3+', label: 'Years in HRM/BPM' },
        { value: '4+', label: 'Core technology groups' },
        { value: '2', label: 'Key projects' },
      ],
    },
    stream: {
      eyebrow: 'Technical stream',
      title: 'Continuous system flow',
      subtitle: 'Business signals, technologies, and process operations presented as an infinite data stream.',
    },
    sidebar: {
      eyebrow: 'Personal Information',
      title: 'Dương Tiến Đạt',
      role: 'Internal System Developer',
      summary: 'Focused on internal systems, approval workflows, and the integration layer between .NET backend and Angular frontend.',
      personalLabel: 'Profile Summary',
      personalInfo: [
        { label: 'Full name', value: 'Dương Tiến Đạt' },
        { label: 'Role', value: 'Internal System Developer' },
        { label: 'Location', value: 'Ha Dong, Hanoi' },
        { label: 'Experience', value: '3+ years' },
      ],
      contactLabel: 'Contact',
      contacts: [
        { label: 'Phone', value: '0393828088', href: 'tel:0393828088' },
        { label: 'Email', value: 'datduongnvty@gmail.com', href: 'mailto:datduongnvty@gmail.com' },
      ],
      socialLabel: 'Social',
      socials: [
        { label: 'Zalo', value: 'zalo.me/0393828088', href: 'https://zalo.me/0393828088', icon: 'zalo' },
        { label: 'Facebook', value: 'facebook.com', href: 'https://www.facebook.com/', icon: 'facebook' },
        { label: 'Instagram', value: 'instagram.com', href: 'https://www.instagram.com/', icon: 'instagram' },
        { label: 'Twitter', value: 'x.com', href: 'https://x.com/', icon: 'twitter' },
      ],
      interestsLabel: 'Interests',
      interests: ['Listening to music', 'Travel', 'Exploring new technology'],
    },
    objective: {
      eyebrow: 'Career Objective',
      title: 'Build stable, secure, and scalable enterprise systems for the long term.',
      body: [
        'I want to contribute to large-scale systems, improve operational workflows, and maintain quality in a demanding enterprise environment.',
        'My 2–3 year direction is to grow into a Senior Developer role while deepening my work on system architecture, business workflows, and internal user experience.',
      ],
      pillars: [
        {
          title: 'Structured business logic',
          text: 'I prefer clear screen structures, understandable flows, and less friction during daily operations.',
        },
        {
          title: 'Stable delivery',
          text: 'I focus on reliability, extensibility, and performance across both frontend and backend layers.',
        },
        {
          title: 'Cross-functional collaboration',
          text: 'I work closely with BA, backend, frontend, and operations teams to turn features into working solutions.',
        },
      ],
    },
    skills: {
      eyebrow: 'Skills',
      title: 'Focused on .NET backend, Angular frontend, and the tools needed to ship enterprise software.',
      groups: [
        {
          title: 'Backend',
          icon: 'backend',
          items: [
            { label: 'C#', icon: 'csharp' },
            { label: 'ASP.NET Core', icon: 'dotnet' },
            { label: 'Entity Framework', icon: 'entity' },
            { label: 'RESTful API', icon: 'api' },
            { label: 'JWT Authentication', icon: 'jwt' },
          ],
        },
        {
          title: 'Frontend',
          icon: 'frontend',
          items: [
            { label: 'Angular (v12+)', icon: 'angular' },
            { label: 'TypeScript', icon: 'typescript' },
            { label: 'HTML', icon: 'html' },
            { label: 'CSS', icon: 'css' },
            { label: 'SCSS', icon: 'scss' },
            { label: 'Angular Material', icon: 'material' },
            { label: 'RxJS', icon: 'rxjs' },
          ],
        },
        {
          title: 'Database & Tools',
          icon: 'data',
          items: [
            { label: 'SQL Server', icon: 'sql' },
            { label: 'MongoDB', icon: 'mongo' },
            { label: 'Git', icon: 'git' },
            { label: 'GitHub/GitLab', icon: 'github' },
            { label: 'Postman', icon: 'postman' },
            { label: 'Swagger', icon: 'swagger' },
            { label: 'Basic Docker', icon: 'docker' },
          ],
        },
      ],
    },
    experience: {
      eyebrow: 'Experience',
      title: 'A career path centered on HRM, BPM, APIs, and frontend integration.',
      timeline: [
        {
          period: '10/2025 - Present',
          title: 'Frontend Developer (Angular) - BPM Portal',
          text: 'Build internal workflow screens, approval forms, and dashboards; integrate backend APIs and refine the user experience for internal operations.',
        },
        {
          period: '12/2022 - Present',
          title: 'Developer .NET - Kids Plaza Joint Stock Company',
          text: 'Help develop and operate HRM/BPM systems, build multi-step approval workflows, design ASP.NET Core RESTful APIs, integrate Angular, and optimize SQL Server queries.',
        },
      ],
    },
    projects: {
      eyebrow: 'Projects & Scope',
      title: 'Systems I helped ship and operate in real business settings.',
      items: [
        {
          name: 'HR Management System',
          summary: 'A 3-person team HRM project for employee records, multi-step approval workflows, permissions, audit logs, and reporting.',
          stack: ['ASP.NET Core', 'Entity Framework', 'SQL Server', 'Angular', 'JWT', 'REST API'],
        },
        {
          name: 'Supplier Supply Chain Portal',
          summary: 'A platform for supplier management, order tracking, approval handling, and reporting dashboards.',
          stack: ['.NET MVC', 'Angular', 'SQL Server', 'REST API', 'BPM Portal'],
        },
        {
          name: 'Internal Workflow System',
          summary: 'Angular frontend for approval flows, business forms, and dashboards, with a strong focus on API integration and UI error handling.',
          stack: ['Angular', 'TypeScript', 'HTML', 'CSS', 'REST API'],
        },
      ],
    },
    education: {
      eyebrow: 'Education & Certificate',
      title: 'Academic background and certifications related to Information Technology.',
      items: [
        {
          period: '2020 - 2023',
          title: 'Hanoi College of Industry and Economics',
          text: 'Information Technology major.',
        },
        {
          period: '2020 - 2023',
          title: 'Practical IT Skills Certificate',
          text: 'Practical certification in Information Technology skills.',
        },
      ],
    },
    achievements: {
      eyebrow: 'Highlights',
      title: 'Concrete contributions that demonstrate enterprise-ready execution.',
      items: [
        {
          period: 'Impact',
          title: 'Streamlined internal workflows',
          text: 'Helped shape multi-step approval flows for performance reviews, leave requests, and internal proposals, making operations more consistent.',
        },
        {
          period: 'Impact',
          title: 'Effective frontend-backend integration',
          text: 'Designed RESTful APIs with ASP.NET Core, connected Angular to backend services, and resolved UI issues to keep the experience stable.',
        },
        {
          period: 'Impact',
          title: 'Improved query performance',
          text: 'Contributed to reviewing and improving SQL Server queries to enhance system response time.',
        },
      ],
    },
    contact: {
      eyebrow: 'Contact',
      title: 'Open to opportunities in enterprise systems and internal product development.',
      body: 'If needed, I can also turn this into a more corporate-style one-page CV, add real portrait photos, or include GitHub and LinkedIn links.',
      email: 'datduongnvty@gmail.com',
      phone: '0393828088',
      themeToggleToLight: 'Switch to light',
      themeToggleToDark: 'Switch to dark',
      languageToggle: 'VI',
    },
  },
}

const streamTracks: StreamItem[][] = [
  [
    { label: 'HRM', icon: 'dashboard', tone: 'blue' },
    { label: 'BPM', icon: 'flow', tone: 'cyan' },
    { label: 'REST API', icon: 'api', tone: 'violet' },
    { label: 'Angular', icon: 'code', tone: 'rose' },
    { label: 'SQL Server', icon: 'database', tone: 'green' },
    { label: 'Security', icon: 'shield', tone: 'amber' },
    { label: 'Scalability', icon: 'speed', tone: 'blue' },
    { label: 'Workflow', icon: 'integration', tone: 'cyan' },
  ],
  [
    { label: 'Processing', icon: 'tools', tone: 'green' },
    { label: 'Approval', icon: 'approval', tone: 'rose' },
    { label: 'Audit', icon: 'audit', tone: 'amber' },
    { label: 'Integration', icon: 'branch', tone: 'violet' },
    { label: 'Performance', icon: 'speed', tone: 'blue' },
    { label: 'Dashboard', icon: 'dashboard', tone: 'cyan' },
    { label: 'Reliable UI', icon: 'screen', tone: 'green' },
    { label: 'Backend', icon: 'database', tone: 'rose' },
  ],
  [
    { label: 'C#', icon: 'code', tone: 'violet' },
    { label: 'ASP.NET Core', icon: 'api', tone: 'blue' },
    { label: 'TypeScript', icon: 'code', tone: 'cyan' },
    { label: 'Entity Framework', icon: 'database', tone: 'green' },
    { label: 'Angular Material', icon: 'screen', tone: 'amber' },
    { label: 'Postman', icon: 'tools', tone: 'rose' },
    { label: 'Swagger', icon: 'docs', tone: 'violet' },
    { label: 'Git', icon: 'branch', tone: 'blue' },
  ],
]

const profilePortrait =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#60a5fa" />
          <stop offset="100%" stop-color="#2563eb" />
        </linearGradient>
      </defs>
      <rect width="160" height="160" rx="28" fill="url(#bg)" />
      <circle cx="80" cy="64" r="28" fill="rgba(255,255,255,0.92)" />
      <path d="M38 138c10-24 27-36 42-36s32 12 42 36" fill="rgba(255,255,255,0.92)" />
      <circle cx="80" cy="64" r="18" fill="#1e293b" opacity="0.18" />
    </svg>
  `)

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  const savedTheme = window.localStorage.getItem('profile-theme')
  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'vi'
  }

  const savedLocale = window.localStorage.getItem('profile-locale')
  if (savedLocale === 'vi' || savedLocale === 'en') {
    return savedLocale
  }

  return 'vi'
}

function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [locale, setLocale] = useState<Locale>(getInitialLocale)
  const revealRootRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('profile-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = locale
    window.localStorage.setItem('profile-locale', locale)
  }, [locale])

  useEffect(() => {
    const root = revealRootRef.current

    if (!root) {
      return
    }

    const items = Array.from(root.querySelectorAll<HTMLElement>('.reveal'))

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach((item) => item.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-visible', entry.isIntersecting)
        })
      },
      {
        root: null,
        threshold: 0.18,
        rootMargin: '0px 0px -8% 0px',
      },
    )

    items.forEach((item) => observer.observe(item))

    return () => {
      observer.disconnect()
    }
  }, [locale, theme])

  const copy = localeContent[locale]
  const themeLabel =
    theme === 'dark' ? copy.contact.themeToggleToLight : copy.contact.themeToggleToDark

  const ThemeIcon = theme === 'dark' ? MoonIcon : SunIcon

  return (
    <main ref={revealRootRef} className="page-shell" id="top">
      <header className="topbar reveal" style={{ animationDelay: '0.04s' }}>
        <p className="eyebrow">{copy.brand}</p>
        <div className="header-controls">
          <nav aria-label="Điều hướng nhanh" className="quick-nav">
            <a href="#objective">{copy.nav.objective}</a>
            <a href="#skills">{copy.nav.skills}</a>
            <a href="#experience">{copy.nav.experience}</a>
            <a href="#projects">{copy.nav.projects}</a>
            <a href="#education">{copy.nav.education}</a>
            <a href="#contact">{copy.nav.contact}</a>
          </nav>
          <div className="utility-actions">
            <button
              className="toggle-pill"
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-pressed={theme === 'light'}
              aria-label={themeLabel}
            >
              <ThemeIcon />
              <span className="sr-only">{themeLabel}</span>
            </button>
            <button
              className="toggle-pill"
              type="button"
              onClick={() => setLocale(locale === 'vi' ? 'en' : 'vi')}
              aria-pressed={locale === 'en'}
            >
              <LanguageIcon locale={locale} />
              {copy.contact.languageToggle}
            </button>
          </div>
        </div>
      </header>

      <div className="profile-grid">
        <aside className="sidebar">
          <section className="panel sidebar-panel profile-panel reveal" style={{ animationDelay: '0.14s' }}>
            <div className="profile-avatar-shell">
              <img className="profile-avatar" src={profilePortrait} alt="Ảnh chân dung của tôi" />
            </div>
            <div className="section-heading compact-heading">
              <div className="heading-with-icon">
                <SidebarBadgeIcon kind="profile" />
                <div>
                  <p className="eyebrow">{copy.sidebar.eyebrow}</p>
                  <h3>{copy.sidebar.title}</h3>
                </div>
              </div>
            </div>
            <p className="sidebar-summary">{copy.sidebar.summary}</p>
            <div className="chip-list">
              <span>.NET</span>
              <span>Angular</span>
              <span>HRM/BPM</span>
            </div>
          </section>

          <section className="panel sidebar-panel reveal" style={{ animationDelay: '0.18s' }}>
            <h4 className="sidebar-title-with-icon">
              <SidebarBadgeIcon kind="personal" />
              <span>{copy.sidebar.personalLabel}</span>
            </h4>
            <dl className="details-list">
              {copy.sidebar.personalInfo.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="panel sidebar-panel reveal" style={{ animationDelay: '0.22s' }}>
            <h4 className="sidebar-title-with-icon">
              <SidebarBadgeIcon kind="contact" />
              <span>{copy.sidebar.contactLabel}</span>
            </h4>
            <div className="contact-list">
              {copy.sidebar.contacts.map((item) => (
                <a key={item.label} href={item.href} className="contact-link">
                  <span className="contact-link-label">
                    <ContactLinkIcon kind={item.label === 'Điện thoại' || item.label === 'Phone' ? 'phone' : 'mail'} />
                    <span>{item.label}</span>
                  </span>
                  <strong>{item.value}</strong>
                </a>
              ))}
            </div>
          </section>

          <section className="panel sidebar-panel reveal" style={{ animationDelay: '0.24s' }}>
            <h4 className="sidebar-title-with-icon">
              <SidebarBadgeIcon kind="social" />
              <span>{copy.sidebar.socialLabel}</span>
            </h4>
            <div className="social-grid">
              {copy.sidebar.socials.map((item) => (
                <a key={item.label} href={item.href} className="social-link" target="_blank" rel="noreferrer">
                  <span className={`social-icon social-icon-${item.icon}`}>
                    <SocialIcon kind={item.icon} />
                  </span>
                  <span className="social-copy">
                    <strong>{item.label}</strong>
                    <span>{item.value}</span>
                  </span>
                </a>
              ))}
            </div>
          </section>

          <section className="panel sidebar-panel reveal" style={{ animationDelay: '0.26s' }}>
            <h4 className="sidebar-title-with-icon">
              <SidebarBadgeIcon kind="interests" />
              <span>{copy.sidebar.interestsLabel}</span>
            </h4>
            <div className="chip-list compact">
              {copy.sidebar.interests.map((item, index) => (
                <span key={item} className="interest-chip">
                  <InterestIcon index={index} />
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </section>
        </aside>

        <main className="main-column">
          <section id="objective" className="panel section-card reveal" style={{ animationDelay: '0.3s' }}>
            <div className="section-heading">
              <div className="heading-with-icon">
                <SectionBadgeIcon kind="objective" />
                <div>
                <p className="eyebrow">{copy.objective.eyebrow}</p>
                <h3>{copy.objective.title}</h3>
                </div>
              </div>
            </div>
            <div className="copy-grid">
              {copy.objective.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="feature-grid">
              {copy.objective.pillars.map((item) => (
                <article key={item.title} className="mini-card">
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="skills" className="panel section-card reveal" style={{ animationDelay: '0.34s' }}>
            <div className="section-heading">
              <div className="heading-with-icon">
                <SectionBadgeIcon kind="skills" />
                <div>
                <p className="eyebrow">{copy.skills.eyebrow}</p>
                <h3>{copy.skills.title}</h3>
                </div>
              </div>
            </div>
            <div className="skill-grid">
              {copy.skills.groups.map((group) => (
                <article key={group.title} className="mini-card skill-card">
                  <h4>{group.title}</h4>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item.label}>
                        {item.label}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section id="experience" className="panel section-card reveal" style={{ animationDelay: '0.38s' }}>
            <div className="section-heading">
              <div className="heading-with-icon">
                <SectionBadgeIcon kind="experience" />
                <div>
                <p className="eyebrow">{copy.experience.eyebrow}</p>
                <h3>{copy.experience.title}</h3>
                </div>
              </div>
            </div>
            <div className="timeline-grid">
              {copy.experience.timeline.map((entry) => (
                <article key={entry.title} className="timeline-card">
                  <span>{entry.period}</span>
                  <h4>{entry.title}</h4>
                  <p>{entry.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="projects" className="panel section-card reveal" style={{ animationDelay: '0.42s' }}>
            <div className="section-heading">
              <div className="heading-with-icon">
                <SectionBadgeIcon kind="projects" />
                <div>
                <p className="eyebrow">{copy.projects.eyebrow}</p>
                <h3>{copy.projects.title}</h3>
                </div>
              </div>
            </div>
            <div className="project-grid">
              {copy.projects.items.map((project) => (
                <article key={project.name} className="mini-card project-card">
                  <p className="project-kicker">Featured work</p>
                  <h4>{project.name}</h4>
                  <p>{project.summary}</p>
                  <div className="project-tags">
                    {project.stack.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="education" className="panel section-card reveal" style={{ animationDelay: '0.46s' }}>
            <div className="section-heading">
              <div className="heading-with-icon">
                <SectionBadgeIcon kind="education" />
                <div>
                <p className="eyebrow">{copy.education.eyebrow}</p>
                <h3>{copy.education.title}</h3>
                </div>
              </div>
            </div>
            <div className="education-grid">
              {copy.education.items.map((item) => (
                <article key={item.title} className="timeline-card">
                  <span>{item.period}</span>
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="achievements" className="panel section-card reveal" style={{ animationDelay: '0.5s' }}>
            <div className="section-heading">
              <div className="heading-with-icon">
                <SectionBadgeIcon kind="achievements" />
                <div>
                <p className="eyebrow">{copy.achievements.eyebrow}</p>
                <h3>{copy.achievements.title}</h3>
                </div>
              </div>
            </div>
            <div className="timeline-grid">
              {copy.achievements.items.map((item) => (
                <article key={item.title} className="timeline-card">
                  <span>{item.period}</span>
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="contact" className="panel contact-panel reveal" style={{ animationDelay: '0.54s' }}>
            <div className="contact-copy">
              <div className="heading-with-icon">
                <SectionBadgeIcon kind="contact" />
                <div>
                  <p className="eyebrow">{copy.contact.eyebrow}</p>
                  <h3>{copy.contact.title}</h3>
                </div>
              </div>
              <p>{copy.contact.body}</p>
            </div>
            <div className="contact-actions">
              <a className="primary-action" href={`mailto:${copy.contact.email}`}>
                {copy.contact.email}
              </a>
              <a className="secondary-action" href={`tel:${copy.contact.phone}`}>
                {copy.contact.phone}
              </a>
            </div>
          </section>

          <section className="panel stream-panel reveal" style={{ animationDelay: '0.58s' }}>
            <div className="section-heading stream-heading">
              <div>
                <p className="eyebrow">{copy.stream.eyebrow}</p>
                <h3>{copy.stream.title}</h3>
                <p>{copy.stream.subtitle}</p>
              </div>
            </div>
            <div className="stream-scroller" aria-hidden="true">
              {streamTracks.map((track, trackIndex) => (
                <div
                  key={`stream-track-${trackIndex}`}
                  className={`stream-track stream-track-${trackIndex === 0 ? 'a' : trackIndex === 1 ? 'b' : 'c'}`}
                >
                  {[...track, ...track].map((item, index) => (
                    <span key={`${item.label}-${trackIndex}-${index}`} className={`stream-chip stream-tone-${item.tone}`}>
                      <StreamItemIcon kind={item.icon} />
                      <span className="stream-chip-label">{item.label}</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </main>
  )
}

export default App

function SunIcon() {
  return (
    <svg className="toggle-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-14v2m0 14v2m8-10h2M2 12h2m14.95 6.95 1.41 1.41M4.64 4.64l1.41 1.41m12.7 0 1.41-1.41M4.64 19.36l1.41-1.41"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg className="toggle-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.9 8.9 0 1 0 10.2 10.2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LanguageIcon({ locale }: { locale: Locale }) {
  return locale === 'vi' ? <VietnamIcon /> : <EnglishIcon />
}

function VietnamIcon() {
  return (
    <svg className="toggle-icon skill-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="8.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 6.8 13.6 11h4.4l-3.6 2.6 1.4 4.2-3.8-2.7-3.8 2.7 1.4-4.2L6 11h4.4L12 6.8Z"
        fill="currentColor"
      />
    </svg>
  )
}

function EnglishIcon() {
  return (
    <svg className="toggle-icon skill-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="4" y="5" width="16" height="14" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4 9h16M10 5v14M14 5v14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function SectionBadgeIcon({ kind }: { kind: 'objective' | 'skills' | 'experience' | 'projects' | 'education' | 'achievements' | 'contact' }) {
  switch (kind) {
    case 'objective':
      return <BadgeIcon tone="blue"><CompassGlyph /></BadgeIcon>
    case 'skills':
      return <BadgeIcon tone="violet"><BracketsGlyph /></BadgeIcon>
    case 'experience':
      return <BadgeIcon tone="green"><BriefcaseGlyph /></BadgeIcon>
    case 'projects':
      return <BadgeIcon tone="amber"><SparkGlyph /></BadgeIcon>
    case 'education':
      return <BadgeIcon tone="cyan"><BookGlyph /></BadgeIcon>
    case 'achievements':
      return <BadgeIcon tone="rose"><TrophyGlyph /></BadgeIcon>
    case 'contact':
      return <BadgeIcon tone="blue"><MailGlyph /></BadgeIcon>
    default:
      return <BadgeIcon tone="blue"><CompassGlyph /></BadgeIcon>
  }
}

function SidebarBadgeIcon({ kind }: { kind: 'profile' | 'personal' | 'contact' | 'social' | 'interests' }) {
  switch (kind) {
    case 'profile':
      return <BadgeIcon tone="blue"><UserGlyph /></BadgeIcon>
    case 'personal':
      return <BadgeIcon tone="violet"><IdGlyph /></BadgeIcon>
    case 'contact':
      return <BadgeIcon tone="green"><PhoneGlyph /></BadgeIcon>
    case 'social':
      return <BadgeIcon tone="cyan"><GlobeGlyph /></BadgeIcon>
    case 'interests':
      return <BadgeIcon tone="amber"><HeartGlyph /></BadgeIcon>
    default:
      return <BadgeIcon tone="blue"><UserGlyph /></BadgeIcon>
  }
}

function SocialIcon({ kind }: { kind: SocialIconKind }) {
  switch (kind) {
    case 'zalo':
      return <ZaloGlyph />
    case 'facebook':
      return <FacebookGlyph />
    case 'instagram':
      return <InstagramGlyph />
    case 'twitter':
      return <TwitterGlyph />
    default:
      return <GlobeGlyph />
  }
}

function ContactLinkIcon({ kind }: { kind: 'phone' | 'mail' }) {
  return kind === 'phone' ? <PhoneGlyph className="contact-glyph" /> : <MailGlyph className="contact-glyph" />
}

function InterestIcon({ index }: { index: number }) {
  if (index === 0) {
    return <MusicGlyph className="interest-glyph" />
  }

  if (index === 1) {
    return <TravelGlyph className="interest-glyph" />
  }

  return <CodeGlyph className="interest-glyph" />
}

function BadgeIcon({ tone, children }: { tone: 'blue' | 'cyan' | 'green' | 'amber' | 'violet' | 'rose'; children: React.ReactNode }) {
  return <span className={`badge-icon badge-tone-${tone}`}>{children}</span>
}

function CompassGlyph() {
  return <SvgGlyph><path d="M12 4l2.8 6.2L21 13l-6.2 2.8L12 22l-2.8-6.2L3 13l6.2-2.8L12 4Z" fill="currentColor" /></SvgGlyph>
}

function BracketsGlyph() {
  return <SvgGlyph><path d="M10 6 6 12l4 6M14 6l4 6-4 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></SvgGlyph>
}

function BriefcaseGlyph() {
  return <SvgGlyph><path d="M7 8h10a2 2 0 0 1 2 2v6.5A2.5 2.5 0 0 1 16.5 19h-9A2.5 2.5 0 0 1 5 16.5V10a2 2 0 0 1 2-2Z" fill="currentColor" /><path d="M9 8V7a3 3 0 0 1 6 0v1" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" /></SvgGlyph>
}

function SparkGlyph() {
  return <SvgGlyph><path d="M12 4l1.5 4.5L18 10l-4.5 1.5L12 16l-1.5-4.5L6 10l4.5-1.5L12 4Z" fill="currentColor" /></SvgGlyph>
}

function BookGlyph() {
  return <SvgGlyph><path d="M6 5.5h8.5A2.5 2.5 0 0 1 17 8v10.5H8.5A2.5 2.5 0 0 0 6 21V5.5Z" fill="currentColor" opacity="0.9" /><path d="M8 8h6M8 11h5" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" /></SvgGlyph>
}

function TrophyGlyph() {
  return <SvgGlyph><path d="M7 5h10v2a5 5 0 0 1-4 4.9V14h2v2H9v-2h2v-2.1A5 5 0 0 1 7 7V5Z" fill="currentColor" /></SvgGlyph>
}

function MailGlyph({ className }: { className?: string }) {
  return (
    <SvgGlyph className={className}>
      <path d="M5 7h14v10H5V7Z" fill="currentColor" opacity="0.9" />
      <path d="m6.5 8.5 5.5 4.2 5.5-4.2" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </SvgGlyph>
  )
}

function UserGlyph() {
  return <SvgGlyph><circle cx="12" cy="8" r="3.1" fill="currentColor" /><path d="M5.5 19a6.5 6.5 0 0 1 13 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></SvgGlyph>
}

function IdGlyph() {
  return <SvgGlyph><rect x="5" y="4.5" width="14" height="15" rx="3" fill="currentColor" opacity="0.9" /><path d="M9 9h6M9 12h6M9 15h4" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" /></SvgGlyph>
}

function PhoneGlyph({ className }: { className?: string }) {
  return (
    <SvgGlyph className={className}>
      <path d="M8 5.5c1.7 0 4 2.6 4.3 3.9.2.9-.5 1.6-1 2.1l1.5 2.5c.8-.2 1.8-.3 2.5.2 1.2.7 2.2 2.4 2.2 3.7 0 .8-.7 1.5-1.5 1.5-6.7 0-12.1-5.4-12.1-12.1 0-.8.7-1.5 1.5-1.5H8Z" fill="currentColor" /></SvgGlyph>
  )
}

function HeartGlyph() {
  return <SvgGlyph><path d="M12 20s-6.5-3.8-8.2-8.1C2.8 8.8 4.2 6 7 6c1.6 0 2.9 1 3.6 2 .7-1 2-2 3.6-2 2.8 0 4.2 2.8 3.2 5.9C18.5 16.2 12 20 12 20Z" fill="currentColor" /></SvgGlyph>
}

function GlobeGlyph() {
  return <SvgGlyph><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M4 12h16M12 4.2c2.4 2.2 3.7 4.8 3.7 7.8S14.4 17.8 12 20c-2.4-2.2-3.7-4.8-3.7-8s1.3-5.6 3.7-7.8Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></SvgGlyph>
}

function ZaloGlyph() {
  return <SvgGlyph><path d="M6 6.5h12A2.5 2.5 0 0 1 20.5 9v5A2.5 2.5 0 0 1 18 16.5h-5.2L9 20v-3.5H6A2.5 2.5 0 0 1 3.5 14V9A2.5 2.5 0 0 1 6 6.5Z" fill="#2d9cdb" /><path d="M8 10.2h6M8 13h4" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" /></SvgGlyph>
}

function FacebookGlyph() {
  return <SvgGlyph><circle cx="12" cy="12" r="9" fill="#1877f2" /><path d="M13.2 8.4h1.4V6.6h-1.7c-1.7 0-2.8 1.1-2.8 2.8v1.6H8.7v1.9h1.4V17h2.1v-4.1h1.8l.3-1.9h-2.1V9.6c0-.7.4-1.2 1-1.2Z" fill="#fff" /></SvgGlyph>
}

function InstagramGlyph() {
  return (
    <SvgGlyph>
      <defs>
        <linearGradient id="igGradient" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#feda75" />
          <stop offset="35%" stopColor="#fa7e1e" />
          <stop offset="65%" stopColor="#d62976" />
          <stop offset="100%" stopColor="#962fbf" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="16" height="16" rx="5" fill="url(#igGradient)" />
      <circle cx="12" cy="12" r="3.3" fill="none" stroke="#fff" strokeWidth="1.6" />
      <circle cx="16.2" cy="7.8" r="1.1" fill="#fff" />
    </SvgGlyph>
  )
}

function TwitterGlyph() {
  return <SvgGlyph><path d="M19.5 7.3c-.6.3-1.2.4-1.9.5.7-.4 1.1-1 1.3-1.8-.6.4-1.3.7-2 .9a3.1 3.1 0 0 0-5.4 2.1c0 .2 0 .5.1.7-2.6-.1-4.9-1.4-6.4-3.5-.3.5-.5 1.1-.5 1.8 0 1.2.6 2.3 1.5 3-.6 0-1.1-.2-1.6-.4v.1c0 1.8 1.2 3.2 2.8 3.5-.3.1-.7.1-1 .1-.2 0-.4 0-.7-.1.4 1.4 1.8 2.5 3.3 2.5A6.3 6.3 0 0 1 4 17.4 8.8 8.8 0 0 0 8.8 19c5.7 0 8.9-4.7 8.9-8.8v-.4c.6-.4 1.2-1 1.8-1.5Z" fill="#1d9bf0" /></SvgGlyph>
}

function MusicGlyph({ className }: { className?: string }) {
  return <SvgGlyph className={className}><path d="M14 5v10.2a2.8 2.8 0 1 1-1.8-2.7V8l7-1.4V15a2.8 2.8 0 1 1-1.8-2.7V6.8L14 7.6V5Z" fill="currentColor" /></SvgGlyph>
}

function TravelGlyph({ className }: { className?: string }) {
  return <SvgGlyph className={className}><path d="M12 4.5 17.5 8 12 19.5 6.5 8 12 4.5Z" fill="currentColor" opacity="0.9" /><circle cx="12" cy="8.2" r="1.4" fill="#fff" /></SvgGlyph>
}

function CodeGlyph({ className }: { className?: string }) {
  return <SvgGlyph className={className}><path d="M9 7 5 12l4 5M15 7l4 5-4 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></SvgGlyph>
}

function SvgGlyph({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <svg className={className ? `glyph-svg ${className}` : 'glyph-svg'} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

function StreamItemIcon({ kind }: { kind: StreamIconKind }) {
  switch (kind) {
    case 'flow':
      return <FlowIcon />
    case 'api':
      return <ApiStreamIcon />
    case 'database':
      return <DatabaseStreamIcon />
    case 'shield':
      return <ShieldStreamIcon />
    case 'speed':
      return <SpeedStreamIcon />
    case 'dashboard':
      return <DashboardStreamIcon />
    case 'code':
      return <CodeStreamIcon />
    case 'tools':
      return <ToolsStreamIcon />
    case 'approval':
      return <ApprovalStreamIcon />
    case 'audit':
      return <AuditStreamIcon />
    case 'integration':
      return <IntegrationStreamIcon />
    case 'docs':
      return <DocsStreamIcon />
    case 'branch':
      return <BranchStreamIcon />
    case 'screen':
      return <ScreenStreamIcon />
    default:
      return <FlowIcon />
  }
}

function FlowIcon() {
  return (
    <svg className="stream-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 12h10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M11 8l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="18" cy="12" r="2.2" fill="currentColor" />
    </svg>
  )
}

function ApiStreamIcon() {
  return (
    <svg className="stream-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 7h5l-3 5h5l-7 5 3-5H3l2-5Z" fill="currentColor" opacity="0.95" />
      <circle cx="17.5" cy="7.5" r="2.3" fill="currentColor" opacity="0.75" />
      <circle cx="17.5" cy="16.5" r="2.3" fill="currentColor" opacity="0.95" />
    </svg>
  )
}

function DatabaseStreamIcon() {
  return (
    <svg className="stream-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <ellipse cx="12" cy="6.5" rx="7" ry="3.2" fill="currentColor" opacity="0.95" />
      <path d="M5 6.5v7c0 1.8 3.1 3.2 7 3.2s7-1.4 7-3.2v-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 13.5v4c0 1.8 3.1 3.2 7 3.2s7-1.4 7-3.2v-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ShieldStreamIcon() {
  return (
    <svg className="stream-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 3.5 19 6v6.2c0 4.2-2.8 6.8-7 8.5-4.2-1.7-7-4.3-7-8.5V6l7-2.5Z" fill="currentColor" opacity="0.9" />
      <path d="m9.4 12 1.7 1.7 3.5-3.8" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SpeedStreamIcon() {
  return (
    <svg className="stream-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 5a7 7 0 1 0 7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 12l4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  )
}

function DashboardStreamIcon() {
  return (
    <svg className="stream-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="4" y="4" width="16" height="16" rx="4" fill="currentColor" opacity="0.18" />
      <path d="M7 8h4M13 8h4M7 12h4M13 12h4M7 16h10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function CodeStreamIcon() {
  return (
    <svg className="stream-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M9 7 5 12l4 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 7l4 5-4 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 6 11 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ToolsStreamIcon() {
  return (
    <svg className="stream-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M8 4.8a3.5 3.5 0 0 0 4.7 4.7l5.5 5.5-2 2-5.5-5.5A3.5 3.5 0 0 0 8 4.8Z" fill="currentColor" opacity="0.9" />
      <circle cx="7" cy="17" r="2.3" fill="currentColor" opacity="0.95" />
    </svg>
  )
}

function ApprovalStreamIcon() {
  return (
    <svg className="stream-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="8" fill="currentColor" opacity="0.9" />
      <path d="m8.8 12.2 2.1 2.1 4.3-4.7" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function AuditStreamIcon() {
  return (
    <svg className="stream-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6 4h8l4 4v12H6V4Z" fill="currentColor" opacity="0.18" />
      <path d="M14 4v4h4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M8 12h8M8 16h5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function IntegrationStreamIcon() {
  return (
    <svg className="stream-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="6" cy="12" r="2.2" fill="currentColor" opacity="0.95" />
      <circle cx="18" cy="12" r="2.2" fill="currentColor" opacity="0.95" />
      <path d="M8.3 12h7.4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="m13.2 8.8 2.5 3.2-2.5 3.2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DocsStreamIcon() {
  return (
    <svg className="stream-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7 4h8l2 2v14H7V4Z" fill="currentColor" opacity="0.16" />
      <path d="M15 4v4h4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 11h6M9 14h6M9 17h4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function BranchStreamIcon() {
  return (
    <svg className="stream-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="7" cy="6.5" r="2" fill="currentColor" />
      <circle cx="17" cy="10.5" r="2" fill="currentColor" />
      <circle cx="7" cy="17.5" r="2" fill="currentColor" opacity="0.75" />
      <path d="M7 8.5v4c0 1.4.8 2.2 2.2 2.2H15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15 10.5h2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function ScreenStreamIcon() {
  return (
    <svg className="stream-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="4" y="5" width="16" height="11" rx="2.5" fill="currentColor" opacity="0.16" />
      <path d="M8 19h8M12 16v3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 8h4M13 8h4M7 11h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
