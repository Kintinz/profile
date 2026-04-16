import { useEffect, useRef, useState } from "react";
import "./App.css";
import { BackdropScene } from "./BackdropScene";
import profilePortrait from "./assets/avatar.jpg";
import {
  FaCss3Alt,
  FaCompactDisc,
  FaFacebookF,
  FaInstagram,
  FaLaptopCode,
  FaPlane,
  FaXTwitter,
} from "react-icons/fa6";
import { DiMsqlServer } from "react-icons/di";
import {
  SiAngular,
  SiDocker,
  SiDotnet,
  SiFramework,
  SiGit,
  SiGithub,
  SiHtml5,
  SiMongodb,
  SiPostman,
  SiSharp,
  SiSass,
  SiSwagger,
  SiTypescript,
  SiZalo,
  SiMaterialdesign,
} from "react-icons/si";

type Locale = "vi" | "en";
type Theme = "dark" | "light";

type LabelValue = {
  label: string;
  value: string;
};

type LinkValue = {
  label: string;
  value: string;
  href: string;
};

type Pillar = {
  title: string;
  text: string;
};

type SkillItem = {
  label: string;
  icon: SkillIconKind;
};

type SkillGroup = {
  title: string;
  items: SkillItem[];
  icon: SkillIconKind;
};

type SkillIconKind =
  | "backend"
  | "frontend"
  | "data"
  | "csharp"
  | "dotnet"
  | "api"
  | "entity"
  | "jwt"
  | "angular"
  | "typescript"
  | "html"
  | "css"
  | "scss"
  | "material"
  | "rxjs"
  | "sql"
  | "mongo"
  | "git"
  | "github"
  | "postman"
  | "swagger"
  | "docker";

type StreamItem = {
  label: string;
  icon: StreamIconKind;
  tone: StreamTone;
};

type StreamIconKind =
  | "flow"
  | "api"
  | "database"
  | "shield"
  | "speed"
  | "dashboard"
  | "code"
  | "tools"
  | "approval"
  | "audit"
  | "integration"
  | "docs"
  | "branch"
  | "screen"
  | "angular"
  | "sqlserver"
  | "csharp"
  | "dotnet"
  | "typescript"
  | "entityframework"
  | "material"
  | "postman"
  | "swagger"
  | "git";

type StreamTone = "blue" | "cyan" | "green" | "amber" | "violet" | "rose";

type TimelineItem = {
  period: string;
  title: string;
  text: string;
};

type ProjectItem = {
  name: string;
  summary: string;
  stack: string[];
};

type ProfileStat = {
  value: string;
  label: string;
};

type SidebarContent = {
  eyebrow: string;
  title: string;
  role: string;
  summary: string;
  personalLabel: string;
  personalInfo: LabelValue[];
  contactLabel: string;
  contacts: LinkValue[];
  socialLabel: string;
  socials: SocialLinkValue[];
  interestsLabel: string;
  interests: InterestItem[];
  analysisLabel: string;
  analysis: SkillAnalysisItem[];
  analysisModes: Record<SkillChartMode, string>;
};

type SkillAnalysisItem = {
  label: string;
  value: number;
};

type SkillChartMode = "bars" | "radar" | "donut" | "line";

type InterestItem = {
  label: string;
  kind: "music" | "travel" | "code";
};

type SocialLinkValue = {
  label: string;
  value: string;
  href: string;
  icon: SocialIconKind;
};

type SocialIconKind = "zalo" | "facebook" | "instagram" | "twitter";

type LocaleContent = {
  brand: string;
  nav: {
    objective: string;
    skills: string;
    experience: string;
    projects: string;
    education: string;
    achievements: string;
    contact: string;
  };
  hero: {
    intro: string;
    title: string;
    subtitle: string;
    badges: string[];
    actions: {
      contact: string;
      projects: string;
    };
    caption: string;
    note: string;
    stats: ProfileStat[];
  };
  stream: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  sidebar: SidebarContent;
  objective: {
    eyebrow: string;
    title: string;
    body: string[];
    pillars: Pillar[];
  };
  skills: {
    eyebrow: string;
    title: string;
    groups: SkillGroup[];
  };
  experience: {
    eyebrow: string;
    title: string;
    timeline: TimelineItem[];
  };
  projects: {
    eyebrow: string;
    title: string;
    items: ProjectItem[];
  };
  education: {
    eyebrow: string;
    title: string;
    items: TimelineItem[];
  };
  achievements: {
    eyebrow: string;
    title: string;
    items: TimelineItem[];
  };
  contact: {
    eyebrow: string;
    title: string;
    body: string;
    email: string;
    phone: string;
    themeToggleToLight: string;
    themeToggleToDark: string;
    languageToggle: string;
  };
};

const localeContent: Record<Locale, LocaleContent> = {
  vi: {
    brand: "CV / Hồ sơ nghề nghiệp",
    nav: {
      objective: "Mục tiêu",
      skills: "Kỹ năng",
      experience: "Kinh nghiệm",
      projects: "Dự án",
      education: "Học vấn",
      achievements: "Thành tựu",
      contact: "Liên hệ",
    },
    hero: {
      intro: "Xin chào, tôi là",
      title: "Lập trình viên hệ thống nội bộ",
      subtitle:
        "Lập trình viên .NET với hơn 3 năm kinh nghiệm phát triển HRM/BPM, RESTful API và giao diện Angular. Chuyên xử lý các bài toán nghiệp vụ nội bộ theo hướng ổn định, bảo mật và dễ mở rộng.",
      badges: ["Hà Đông, Hà Nội", ".NET Developer", "Angular Frontend"],
      actions: {
        contact: "Liên hệ ngay",
        projects: "Xem dự án",
      },
      caption: "Hồ sơ chuyên nghiệp",
      note: "Ảnh minh họa tạm thời",
      stats: [
        { value: "3+", label: "Năm kinh nghiệm HRM/BPM" },
        { value: "4+", label: "Nhóm công nghệ chính" },
        { value: "2", label: "Dự án trọng điểm" },
      ],
    },
    stream: {
      eyebrow: "Dòng thông tin kỹ thuật",
      title: "Nhịp vận hành của hệ thống",
      subtitle:
        "những mảng tôi thường làm việc cùng nhau: nghiệp vụ, công nghệ và cách hệ thống vận hành trong thực tế.",
    },
    sidebar: {
      eyebrow: "Thông tin cá nhân",
      title: "Dương Tiến Đạt",
      role: "Internal System Developer",
      summary:
        "Tập trung phát triển hệ thống nội bộ, workflow phê duyệt và lớp tích hợp giữa backend .NET và frontend Angular.",
      personalLabel: "Tóm tắt hồ sơ",
      personalInfo: [
        { label: "Họ và tên", value: "Dương Tiến Đạt" },
        { label: "Vị trí", value: "Internal System Developer" },
        { label: "Khu vực", value: "Hà Đông, Hà Nội" },
        { label: "Kinh nghiệm", value: "3+ năm" },
      ],
      contactLabel: "Liên hệ",
      contacts: [
        { label: "Điện thoại", value: "0393828088", href: "tel:0393828088" },
        {
          label: "Email",
          value: "datduongnvty@gmail.com",
          href: "mailto:datduongnvty@gmail.com",
        },
      ],
      socialLabel: "Mạng xã hội",
      socials: [
        {
          label: "Zalo",
          value: "zalo.me/0393828088",
          href: "https://zalo.me/0393828088",
          icon: "zalo",
        },
        {
          label: "Facebook",
          value: "facebook.com",
          href: "https://www.facebook.com/",
          icon: "facebook",
        },
        {
          label: "Instagram",
          value: "instagram.com",
          href: "https://www.instagram.com/",
          icon: "instagram",
        },
        {
          label: "Twitter",
          value: "x.com",
          href: "https://x.com/",
          icon: "twitter",
        },
      ],
      interestsLabel: "Sở thích",
      interests: [
        { label: "Đĩa nhạc", kind: "music" },
        { label: "Máy bay", kind: "travel" },
        { label: "Tìm hiểu công nghệ", kind: "code" },
      ],
      analysisLabel: "Phân tích trình độ chuyên môn",
      analysis: [
        { label: "Backend .NET", value: 92 },
        { label: "Angular / Frontend", value: 84 },
        { label: "SQL Server", value: 78 },
        { label: "Workflow & BPM", value: 88 },
      ],
      analysisModes: {
        bars: "Cột",
        radar: "Radar",
        donut: "Vòng tròn",
        line: "Đường",
      },
    },
    objective: {
      eyebrow: "Mục tiêu nghề nghiệp",
      title:
        "Phát triển hệ thống doanh nghiệp ổn định, bảo mật và dễ mở rộng trong dài hạn.",
      body: [
        "Tôi mong muốn tham gia xây dựng các hệ thống quy mô lớn, tối ưu quy trình vận hành, đảm bảo khả năng mở rộng và duy trì chất lượng ổn định trong môi trường doanh nghiệp.",
        "Định hướng trong 2–3 năm tới là phát triển lên vị trí Senior Developer, tiếp tục đào sâu vào kiến trúc hệ thống, workflow nghiệp vụ và trải nghiệm người dùng cho các ứng dụng nội bộ.",
      ],
      pillars: [
        {
          title: "Hệ thống hóa nghiệp vụ",
          text: "Ưu tiên cấu trúc màn hình rõ ràng, luồng xử lý dễ hiểu và giảm ma sát khi người dùng thao tác.",
        },
        {
          title: "Triển khai ổn định",
          text: "Tập trung vào tính ổn định, khả năng mở rộng và tối ưu hiệu năng ở cả frontend lẫn backend.",
        },
        {
          title: "Phối hợp liên phòng ban",
          text: "Làm việc hiệu quả với BA, backend, frontend và vận hành để đưa tính năng đi vào sử dụng thực tế.",
        },
      ],
    },
    skills: {
      eyebrow: "Các kỹ năng",
      title:
        "Tập trung vào backend .NET, frontend Angular và hệ sinh thái công cụ triển khai.",
      groups: [
        {
          title: "Backend",
          icon: "backend",
          items: [
            { label: "C#", icon: "csharp" },
            { label: "ASP.NET Core", icon: "dotnet" },
            { label: "Entity Framework", icon: "entity" },
            { label: "RESTful API", icon: "api" },
            { label: "JWT Authentication", icon: "jwt" },
          ],
        },
        {
          title: "Frontend",
          icon: "frontend",
          items: [
            { label: "Angular (v12+)", icon: "angular" },
            { label: "TypeScript", icon: "typescript" },
            { label: "HTML", icon: "html" },
            { label: "CSS", icon: "css" },
            { label: "SCSS", icon: "scss" },
            { label: "Angular Material", icon: "material" },
            { label: "RxJS", icon: "rxjs" },
          ],
        },
        {
          title: "Database & Tool",
          icon: "data",
          items: [
            { label: "SQL Server", icon: "sql" },
            { label: "MongoDB", icon: "mongo" },
            { label: "Git", icon: "git" },
            { label: "GitHub/GitLab", icon: "github" },
            { label: "Postman", icon: "postman" },
            { label: "Swagger", icon: "swagger" },
            { label: "Docker cơ bản", icon: "docker" },
          ],
        },
      ],
    },
    experience: {
      eyebrow: "Kinh nghiệm làm việc",
      title:
        "Hành trình phát triển tập trung vào HRM, BPM, API và tích hợp frontend.",
      timeline: [
        {
          period: "10/2025 - Hiện tại",
          title: "Frontend Developer (Angular) - BPM Portal",
          text: "Phát triển giao diện cho hệ thống xử lý quy trình nội bộ, xây dựng màn hình phê duyệt, form nghiệp vụ và dashboard; tích hợp dữ liệu từ API backend và tối ưu trải nghiệm người dùng.",
        },
        {
          period: "12/2022 - Hiện tại",
          title: "Developer .NET - Công ty Cổ phần Kids Plaza",
          text: "Tham gia phát triển và vận hành hệ thống HRM/BPM, xây dựng workflow phê duyệt cho đánh giá nhân sự, nghỉ phép và đề xuất; thiết kế RESTful API bằng ASP.NET Core, tích hợp Angular và tối ưu truy vấn SQL Server.",
        },
      ],
    },
    projects: {
      eyebrow: "Dự án & phạm vi đóng góp",
      title: "Những hệ thống tôi đã tham gia phát triển và vận hành thực tế.",
      items: [
        {
          name: "Hệ thống quản trị nhân sự",
          summary:
            "Dự án HRM với quy mô team 3 người, phục vụ quản lý hồ sơ, workflow phê duyệt nhiều bước, phân quyền, log lịch sử và báo cáo thống kê.",
          stack: [
            "ASP.NET Core",
            "Entity Framework",
            "SQL Server",
            "Angular",
            "JWT",
            "REST API",
          ],
        },
        {
          name: "Cổng thông tin chuỗi cung ứng với nhà cung cấp",
          summary:
            "Nền tảng phục vụ quản lý và kết nối nhà cung cấp, theo dõi đơn hàng, phê duyệt hồ sơ và dashboard báo cáo.",
          stack: [
            ".NET MVC",
            "Angular",
            "SQL Server",
            "REST API",
            "BPM Portal",
          ],
        },
        {
          name: "Hệ thống quy trình nội bộ",
          summary:
            "Front-end Angular cho các màn hình xử lý phê duyệt, form nghiệp vụ và dashboard, tập trung tích hợp API và xử lý lỗi giao diện.",
          stack: ["Angular", "TypeScript", "HTML", "CSS", "REST API"],
        },
      ],
    },
    education: {
      eyebrow: "Học vấn & chứng chỉ",
      title: "Nền tảng học tập và chứng nhận chuyên môn liên quan đến CNTT.",
      items: [
        {
          period: "2020 - 2023",
          title: "Cao đẳng Kinh tế Công nghiệp Hà Nội",
          text: "Chuyên ngành Công nghệ Thông tin.",
        },
        {
          period: "2020 - 2023",
          title: "Bằng chứng nhận kỹ năng thực hành",
          text: "Bằng chứng nhận kỹ năng thực hành chuyên ngành Công nghệ Thông tin.",
        },
      ],
    },
    achievements: {
      eyebrow: "Thành tựu nổi bật",
      title:
        "Những điểm đóng góp làm rõ năng lực trong môi trường doanh nghiệp.",
      items: [
        {
          period: "Impact",
          title: "Tối ưu hệ thống quy trình nội bộ",
          text: "Tham gia xây dựng các workflow phê duyệt nhiều bước cho đánh giá nhân sự, nghỉ phép và đề xuất, giúp chuẩn hóa vận hành nghiệp vụ.",
        },
        {
          period: "Impact",
          title: "Kết nối frontend và backend hiệu quả",
          text: "Thiết kế RESTful API bằng ASP.NET Core, tích hợp Angular với backend và xử lý lỗi giao diện để đảm bảo trải nghiệm ổn định.",
        },
        {
          period: "Impact",
          title: "Tối ưu hiệu năng truy vấn",
          text: "Đóng góp trong việc rà soát và cải thiện truy vấn SQL Server để nâng cao tốc độ phản hồi của hệ thống.",
        },
      ],
    },
    contact: {
      eyebrow: "Liên hệ",
      title:
        "Sẵn sàng cho những cơ hội phù hợp với hệ thống doanh nghiệp và sản phẩm nội bộ.",
      body: "Tôi đang tìm các vị trí phát triển hệ thống nội bộ, HRM/BPM hoặc backend .NET. Nếu dự án của bạn cần một người tập trung vào độ ổn định, khả năng mở rộng và tích hợp nghiệp vụ, hãy liên hệ qua email hoặc số điện thoại bên dưới.",
      email: "datduongnvty@gmail.com",
      phone: "0393828088",
      themeToggleToLight: "Đổi sang sáng",
      themeToggleToDark: "Đổi sang tối",
      languageToggle: "EN",
    },
  },
  en: {
    brand: "CV / Professional Profile",
    nav: {
      objective: "Objective",
      skills: "Skills",
      experience: "Experience",
      projects: "Projects",
      education: "Education",
      achievements: "Highlights",
      contact: "Contact",
    },
    hero: {
      intro: "Hello, I am",
      title: "Internal System Developer",
      subtitle:
        "A .NET developer with more than 3 years of experience in HRM/BPM systems, RESTful APIs, and Angular interfaces. Focused on stable, secure, and scalable internal business solutions.",
      badges: ["Ha Dong, Hanoi", ".NET Developer", "Angular Frontend"],
      actions: {
        contact: "Contact me",
        projects: "View projects",
      },
      caption: "Professional profile",
      note: "Temporary illustration",
      stats: [
        { value: "3+", label: "Years in HRM/BPM" },
        { value: "4+", label: "Core technology groups" },
        { value: "2", label: "Key projects" },
      ],
    },
    stream: {
      eyebrow: "Technical stream",
      title: "The system's working rhythm",
      subtitle:
        "This section brings together the parts I work with most often: business needs, technology, and how the system behaves in practice.",
    },
    sidebar: {
      eyebrow: "Personal Information",
      title: "Dương Tiến Đạt",
      role: "Internal System Developer",
      summary:
        "Focused on internal systems, approval workflows, and the integration layer between .NET backend and Angular frontend.",
      personalLabel: "Profile Summary",
      personalInfo: [
        { label: "Full name", value: "Dương Tiến Đạt" },
        { label: "Role", value: "Internal System Developer" },
        { label: "Location", value: "Ha Dong, Hanoi" },
        { label: "Experience", value: "3+ years" },
      ],
      contactLabel: "Contact",
      contacts: [
        { label: "Phone", value: "0393828088", href: "tel:0393828088" },
        {
          label: "Email",
          value: "datduongnvty@gmail.com",
          href: "mailto:datduongnvty@gmail.com",
        },
      ],
      socialLabel: "Social",
      socials: [
        {
          label: "Zalo",
          value: "zalo.me/0393828088",
          href: "https://zalo.me/0393828088",
          icon: "zalo",
        },
        {
          label: "Facebook",
          value: "facebook.com",
          href: "https://www.facebook.com/",
          icon: "facebook",
        },
        {
          label: "Instagram",
          value: "instagram.com",
          href: "https://www.instagram.com/",
          icon: "instagram",
        },
        {
          label: "Twitter",
          value: "x.com",
          href: "https://x.com/",
          icon: "twitter",
        },
      ],
      interestsLabel: "Interests",
      interests: [
        { label: "Vinyl Record", kind: "music" },
        { label: "Airplane", kind: "travel" },
        { label: "Tech Exploration", kind: "code" },
      ],
      analysisLabel: "Professional skill analysis",
      analysis: [
        { label: "Backend .NET", value: 92 },
        { label: "Angular / Frontend", value: 84 },
        { label: "SQL Server", value: 78 },
        { label: "Workflow & BPM", value: 88 },
      ],
      analysisModes: {
        bars: "Bars",
        radar: "Radar",
        donut: "Donut",
        line: "Line",
      },
    },
    objective: {
      eyebrow: "Career Objective",
      title:
        "Build stable, secure, and scalable enterprise systems for the long term.",
      body: [
        "I want to contribute to large-scale systems, improve operational workflows, and maintain quality in a demanding enterprise environment.",
        "My 2–3 year direction is to grow into a Senior Developer role while deepening my work on system architecture, business workflows, and internal user experience.",
      ],
      pillars: [
        {
          title: "Structured business logic",
          text: "I prefer clear screen structures, understandable flows, and less friction during daily operations.",
        },
        {
          title: "Stable delivery",
          text: "I focus on reliability, extensibility, and performance across both frontend and backend layers.",
        },
        {
          title: "Cross-functional collaboration",
          text: "I work closely with BA, backend, frontend, and operations teams to turn features into working solutions.",
        },
      ],
    },
    skills: {
      eyebrow: "Skills",
      title:
        "Focused on .NET backend, Angular frontend, and the tools needed to ship enterprise software.",
      groups: [
        {
          title: "Backend",
          icon: "backend",
          items: [
            { label: "C#", icon: "csharp" },
            { label: "ASP.NET Core", icon: "dotnet" },
            { label: "Entity Framework", icon: "entity" },
            { label: "RESTful API", icon: "api" },
            { label: "JWT Authentication", icon: "jwt" },
          ],
        },
        {
          title: "Frontend",
          icon: "frontend",
          items: [
            { label: "Angular (v12+)", icon: "angular" },
            { label: "TypeScript", icon: "typescript" },
            { label: "HTML", icon: "html" },
            { label: "CSS", icon: "css" },
            { label: "SCSS", icon: "scss" },
            { label: "Angular Material", icon: "material" },
            { label: "RxJS", icon: "rxjs" },
          ],
        },
        {
          title: "Database & Tools",
          icon: "data",
          items: [
            { label: "SQL Server", icon: "sql" },
            { label: "MongoDB", icon: "mongo" },
            { label: "Git", icon: "git" },
            { label: "GitHub/GitLab", icon: "github" },
            { label: "Postman", icon: "postman" },
            { label: "Swagger", icon: "swagger" },
            { label: "Basic Docker", icon: "docker" },
          ],
        },
      ],
    },
    experience: {
      eyebrow: "Experience",
      title:
        "A career path centered on HRM, BPM, APIs, and frontend integration.",
      timeline: [
        {
          period: "10/2025 - Present",
          title: "Frontend Developer (Angular) - BPM Portal",
          text: "Build internal workflow screens, approval forms, and dashboards; integrate backend APIs and refine the user experience for internal operations.",
        },
        {
          period: "12/2022 - Present",
          title: "Developer .NET - Kids Plaza Joint Stock Company",
          text: "Help develop and operate HRM/BPM systems, build multi-step approval workflows, design ASP.NET Core RESTful APIs, integrate Angular, and optimize SQL Server queries.",
        },
      ],
    },
    projects: {
      eyebrow: "Projects & Scope",
      title: "Systems I helped ship and operate in real business settings.",
      items: [
        {
          name: "HR Management System",
          summary:
            "A 3-person team HRM project for employee records, multi-step approval workflows, permissions, audit logs, and reporting.",
          stack: [
            "ASP.NET Core",
            "Entity Framework",
            "SQL Server",
            "Angular",
            "JWT",
            "REST API",
          ],
        },
        {
          name: "Supplier Supply Chain Portal",
          summary:
            "A platform for supplier management, order tracking, approval handling, and reporting dashboards.",
          stack: [
            ".NET MVC",
            "Angular",
            "SQL Server",
            "REST API",
            "BPM Portal",
          ],
        },
        {
          name: "Internal Workflow System",
          summary:
            "Angular frontend for approval flows, business forms, and dashboards, with a strong focus on API integration and UI error handling.",
          stack: ["Angular", "TypeScript", "HTML", "CSS", "REST API"],
        },
      ],
    },
    education: {
      eyebrow: "Education & Certificate",
      title:
        "Academic background and certifications related to Information Technology.",
      items: [
        {
          period: "2020 - 2023",
          title: "Hanoi College of Industry and Economics",
          text: "Information Technology major.",
        },
        {
          period: "2020 - 2023",
          title: "Practical IT Skills Certificate",
          text: "Practical certification in Information Technology skills.",
        },
      ],
    },
    achievements: {
      eyebrow: "Highlights",
      title:
        "Concrete contributions that demonstrate enterprise-ready execution.",
      items: [
        {
          period: "Impact",
          title: "Streamlined internal workflows",
          text: "Helped shape multi-step approval flows for performance reviews, leave requests, and internal proposals, making operations more consistent.",
        },
        {
          period: "Impact",
          title: "Effective frontend-backend integration",
          text: "Designed RESTful APIs with ASP.NET Core, connected Angular to backend services, and resolved UI issues to keep the experience stable.",
        },
        {
          period: "Impact",
          title: "Improved query performance",
          text: "Contributed to reviewing and improving SQL Server queries to enhance system response time.",
        },
      ],
    },
    contact: {
      eyebrow: "Contact",
      title:
        "Open to opportunities in enterprise systems and internal product development.",
      body: "If needed, I can also turn this into a more corporate-style one-page CV, add real portrait photos, or include GitHub and LinkedIn links.",
      email: "datduongnvty@gmail.com",
      phone: "0393828088",
      themeToggleToLight: "Switch to light",
      themeToggleToDark: "Switch to dark",
      languageToggle: "VI",
    },
  },
};

const streamTracks: StreamItem[][] = [
  [
    { label: "HRM", icon: "dashboard", tone: "blue" },
    { label: "BPM", icon: "flow", tone: "cyan" },
    { label: "REST API", icon: "api", tone: "violet" },
    { label: "Angular", icon: "angular", tone: "rose" },
    { label: "SQL Server", icon: "sqlserver", tone: "green" },
    { label: "Security", icon: "shield", tone: "amber" },
    { label: "Scalability", icon: "speed", tone: "blue" },
    { label: "Workflow", icon: "integration", tone: "cyan" },
  ],
  [
    { label: "Processing", icon: "tools", tone: "green" },
    { label: "Approval", icon: "approval", tone: "rose" },
    { label: "Audit", icon: "audit", tone: "amber" },
    { label: "Integration", icon: "branch", tone: "violet" },
    { label: "Performance", icon: "speed", tone: "blue" },
    { label: "Dashboard", icon: "dashboard", tone: "cyan" },
    { label: "Reliable UI", icon: "screen", tone: "green" },
    { label: "Backend", icon: "dotnet", tone: "rose" },
  ],
  [
    { label: "C#", icon: "csharp", tone: "violet" },
    { label: "ASP.NET Core", icon: "dotnet", tone: "blue" },
    { label: "TypeScript", icon: "typescript", tone: "cyan" },
    { label: "Entity Framework", icon: "entityframework", tone: "green" },
    { label: "Angular Material", icon: "material", tone: "amber" },
    { label: "Postman", icon: "postman", tone: "rose" },
    { label: "Swagger", icon: "swagger", tone: "violet" },
    { label: "Git", icon: "branch", tone: "blue" },
  ],
];

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "dark";
  }

  const savedTheme = window.localStorage.getItem("profile-theme");
  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function getInitialLocale(): Locale {
  if (typeof window === "undefined") {
    return "vi";
  }

  const savedLocale = window.localStorage.getItem("profile-locale");
  if (savedLocale === "vi" || savedLocale === "en") {
    return savedLocale;
  }

  return "vi";
}

function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [locale, setLocale] = useState<Locale>(getInitialLocale);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<SkillChartMode>("bars");
  const revealRootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("profile-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem("profile-locale", locale);
  }, [locale]);

  useEffect(() => {
    const handleViewportChange = () => {
      if (window.matchMedia("(min-width: 721px)").matches) {
        setMobileNavOpen(false);
      }
    };

    handleViewportChange();
    window.addEventListener("resize", handleViewportChange);

    return () => {
      window.removeEventListener("resize", handleViewportChange);
    };
  }, []);

  useEffect(() => {
    const isMobileDrawer = window.matchMedia("(max-width: 720px)").matches;
    document.body.style.overflow = mobileNavOpen && isMobileDrawer ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  useEffect(() => {
    const updateScrollTopVisibility = () => {
      setShowScrollTop(window.scrollY > 320);
    };

    updateScrollTopVisibility();
    window.addEventListener("scroll", updateScrollTopVisibility, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollTopVisibility);
    };
  }, []);

  useEffect(() => {
    const root = revealRootRef.current;

    if (!root) {
      return;
    }

    const items = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle(
            "is-visible",
            entry.isIntersecting || entry.intersectionRatio > 0,
          );
        });
      },
      {
        root: null,
        threshold: 0.01,
        rootMargin: "0px 0px -2% 0px",
      },
    );

    items.forEach((item) => observer.observe(item));

    return () => {
      observer.disconnect();
    };
  }, [locale, theme]);

  const copy = localeContent[locale];
  const themeLabel =
    theme === "dark"
      ? copy.contact.themeToggleToLight
      : copy.contact.themeToggleToDark;
  const nextLocale = locale === "vi" ? "en" : "vi";

  const ThemeIcon = theme === "dark" ? MoonIcon : SunIcon;

  return (
    <main ref={revealRootRef} className="page-shell" id="top">
      <BackdropScene theme={theme} />
      {showScrollTop ? (
        <button
          className="scroll-top-button"
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Cuộn lên đầu trang"
        >
          <UpArrowIcon />
        </button>
      ) : null}
      <button
        className="mobile-rail-button"
        type="button"
        onClick={() => setMobileNavOpen((value) => !value)}
        aria-expanded={mobileNavOpen}
        aria-controls="mobile-nav-panel"
        aria-label={mobileNavOpen ? "Đóng thanh menu" : "Mở thanh menu"}
      >
        {mobileNavOpen ? <CloseIcon /> : <MenuIcon />}
        <span className="sr-only">
          {mobileNavOpen ? "Đóng thanh menu" : "Mở thanh menu"}
        </span>
      </button>
      {mobileNavOpen ? (
        <button
          className="mobile-menu-backdrop is-visible"
          type="button"
          aria-label="Đóng menu"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}
      <header
        className={`topbar reveal ${mobileNavOpen ? "topbar-open" : "topbar-closed"}`}
        style={{ animationDelay: "0.04s" }}
      >
        <div className="topbar-shell">
          <div className="topbar-brand-row">
            <p className="eyebrow topbar-brand">{copy.brand}</p>
            <div className="topbar-ghost-spacer" aria-hidden="true" />
          </div>
          <div id="mobile-nav-panel" className="header-controls">
            <nav aria-label="Điều hướng nhanh" className="quick-nav">
              <a href="#objective" onClick={() => setMobileNavOpen(false)}>
                <span className="nav-label">{copy.nav.objective}</span>
              </a>
              <a href="#skills" onClick={() => setMobileNavOpen(false)}>
                <span className="nav-label">{copy.nav.skills}</span>
              </a>
              <a href="#experience" onClick={() => setMobileNavOpen(false)}>
                <span className="nav-label">{copy.nav.experience}</span>
              </a>
              <a href="#projects" onClick={() => setMobileNavOpen(false)}>
                <span className="nav-label">{copy.nav.projects}</span>
              </a>
              <a href="#education" onClick={() => setMobileNavOpen(false)}>
                <span className="nav-label">{copy.nav.education}</span>
              </a>
              <a href="#contact" onClick={() => setMobileNavOpen(false)}>
                <span className="nav-label">{copy.nav.contact}</span>
              </a>
            </nav>
            <div className="utility-actions">
              <button
                className="toggle-pill theme-toggle-pill"
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-pressed={theme === "light"}
                aria-label={themeLabel}
              >
                <ThemeIcon />
              </button>
              <button
                className="toggle-pill"
                type="button"
                onClick={() => setLocale(nextLocale)}
                aria-pressed={locale === "en"}
              >
                <LanguageIcon locale={nextLocale} />
                <span className="toggle-label">{copy.contact.languageToggle}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="profile-grid">
        <aside className="sidebar">
          <section
            className="panel sidebar-panel profile-panel reveal"
            style={{ animationDelay: "0.14s" }}
          >
            <div className="profile-avatar-shell">
              <img
                className="profile-avatar"
                src={profilePortrait}
                alt="Ảnh chân dung của tôi"
              />
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

          <section
            className="panel sidebar-panel reveal"
            style={{ animationDelay: "0.18s" }}
          >
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

          <section
            className="panel sidebar-panel reveal"
            style={{ animationDelay: "0.22s" }}
          >
            <h4 className="sidebar-title-with-icon">
              <SidebarBadgeIcon kind="contact" />
              <span>{copy.sidebar.contactLabel}</span>
            </h4>
            <div className="contact-list">
              {copy.sidebar.contacts.map((item) => (
                <a key={item.label} href={item.href} className="contact-link">
                  <span className="contact-link-label">
                    <ContactLinkIcon
                      kind={
                        item.label === "Điện thoại" || item.label === "Phone"
                          ? "phone"
                          : "mail"
                      }
                    />
                    <span>{item.label}</span>
                  </span>
                  <strong>{item.value}</strong>
                </a>
              ))}
            </div>
          </section>

          <section
            className="panel sidebar-panel reveal"
            style={{ animationDelay: "0.24s" }}
          >
            <h4 className="sidebar-title-with-icon">
              <SidebarBadgeIcon kind="social" />
              <span>{copy.sidebar.socialLabel}</span>
            </h4>
            <div className="social-grid">
              {copy.sidebar.socials.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="social-link"
                  target="_blank"
                  rel="noreferrer"
                >
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

          <section
            className="panel sidebar-panel reveal"
            style={{ animationDelay: "0.26s" }}
          >
            <h4 className="sidebar-title-with-icon">
              <SidebarBadgeIcon kind="interests" />
              <span>{copy.sidebar.interestsLabel}</span>
            </h4>
            <div className="chip-list compact">
              {copy.sidebar.interests.map((item) => (
                <span
                  key={item.label}
                  className={`interest-chip interest-chip-${item.kind}`}
                >
                  <InterestIcon kind={item.kind} />
                  <span>{item.label}</span>
                </span>
              ))}
            </div>
          </section>

          <section
            className="panel sidebar-panel skill-analysis-panel reveal"
            style={{ animationDelay: "0.3s" }}
          >
            <h4 className="sidebar-title-with-icon">
              <SidebarBadgeIcon kind="personal" />
              <span>{copy.sidebar.analysisLabel}</span>
            </h4>
            <div className="skill-chart-controls" role="tablist" aria-label={copy.sidebar.analysisLabel}>
              {(
                ["bars", "radar", "donut", "line"] as SkillChartMode[]
              ).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`skill-chart-tab ${analysisMode === mode ? "is-active" : ""}`}
                  onClick={() => setAnalysisMode(mode)}
                  aria-pressed={analysisMode === mode}
                >
                  {copy.sidebar.analysisModes[mode]}
                </button>
              ))}
            </div>
            <SkillAnalysisChart mode={analysisMode} items={copy.sidebar.analysis} />
          </section>
        </aside>

        <main className="main-column">
          <section
            id="objective"
            className="panel section-card reveal"
            style={{ animationDelay: "0.3s" }}
          >
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
              {copy.objective.body.map((paragraph, index) => (
                <p
                  key={paragraph}
                  className="reveal"
                  style={{ transitionDelay: `${0.02 + index * 0.04}s` }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="feature-grid">
              {copy.objective.pillars.map((item, index) => (
                <article
                  key={item.title}
                  className="mini-card reveal"
                  style={{ transitionDelay: `${0.06 + index * 0.06}s` }}
                >
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section
            id="skills"
            className="panel section-card reveal"
            style={{ animationDelay: "0.34s" }}
          >
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
              {copy.skills.groups.map((group, index) => (
                <article
                  key={group.title}
                  className="mini-card skill-card reveal"
                  style={{ transitionDelay: `${0.06 + index * 0.08}s` }}
                >
                  <h4>{group.title}</h4>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item.label} className="skill-item">
                        <span
                          className={`skill-item-icon skill-item-icon-${item.icon}`}
                          aria-hidden="true"
                        >
                          <SkillItemIcon kind={item.icon} />
                        </span>
                        <span className="skill-item-label">{item.label}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section
            id="experience"
            className="panel section-card reveal"
            style={{ animationDelay: "0.38s" }}
          >
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
              {copy.experience.timeline.map((entry, index) => (
                <article
                  key={entry.title}
                  className="timeline-card reveal"
                  style={{ transitionDelay: `${0.06 + index * 0.08}s` }}
                >
                  <span>{entry.period}</span>
                  <h4>{entry.title}</h4>
                  <p>{entry.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section
            id="projects"
            className="panel section-card reveal"
            style={{ animationDelay: "0.42s" }}
          >
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
              {copy.projects.items.map((project, index) => (
                <article
                  key={project.name}
                  className="mini-card project-card reveal"
                  style={{ transitionDelay: `${0.06 + index * 0.08}s` }}
                >
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

          <section
            id="education"
            className="panel section-card reveal"
            style={{ animationDelay: "0.46s" }}
          >
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
              {copy.education.items.map((item, index) => (
                <article
                  key={item.title}
                  className="timeline-card reveal"
                  style={{ transitionDelay: `${0.06 + index * 0.08}s` }}
                >
                  <span>{item.period}</span>
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section
            id="achievements"
            className="panel section-card reveal"
            style={{ animationDelay: "0.5s" }}
          >
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
              {copy.achievements.items.map((item, index) => (
                <article
                  key={item.title}
                  className="timeline-card reveal"
                  style={{ transitionDelay: `${0.06 + index * 0.08}s` }}
                >
                  <span>{item.period}</span>
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section
            id="contact"
            className="panel contact-panel reveal"
            style={{ animationDelay: "0.54s" }}
          >
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
              <a
                className="primary-action"
                href={`mailto:${copy.contact.email}`}
              >
                {copy.contact.email}
              </a>
              <a
                className="secondary-action"
                href={`tel:${copy.contact.phone}`}
              >
                {copy.contact.phone}
              </a>
            </div>
          </section>

          <section
            className="panel stream-panel reveal"
            style={{ animationDelay: "0.58s" }}
          >
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
                  className={`stream-track stream-track-${trackIndex === 0 ? "a" : trackIndex === 1 ? "b" : "c"}`}
                >
                  {[...track, ...track].map((item, index) => (
                    <span
                      key={`${item.label}-${trackIndex}-${index}`}
                      className={`stream-chip stream-tone-${item.tone}`}
                    >
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
  );
}

export default App;

function SunIcon() {
  return (
    <svg
      className="toggle-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-14v2m0 14v2m8-10h2M2 12h2m14.95 6.95 1.41 1.41M4.64 4.64l1.41 1.41m12.7 0 1.41-1.41M4.64 19.36l1.41-1.41"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      className="toggle-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.9 8.9 0 1 0 10.2 10.2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      className="toggle-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4 7h16M4 12h16M4 17h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      className="toggle-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M6 6 18 18M18 6 6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UpArrowIcon() {
  return (
    <svg
      className="toggle-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 5 6.5 10.5m5.5-5.5 5.5 5.5M12 5v14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LanguageIcon({ locale }: { locale: Locale }) {
  return locale === "vi" ? <VietnamIcon /> : <EnglishIcon />;
}

function VietnamIcon() {
  return (
    <svg
      className="toggle-icon skill-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3.5" y="5" width="17" height="14" rx="2.6" fill="#da251d" />
      <path
        d="M12 7.8 13.2 11.1h3.5l-2.8 2 1.1 3.2L12 14.3l-3 2 1.1-3.2-2.8-2h3.5L12 7.8Z"
        fill="#ffde00"
      />
    </svg>
  );
}

function EnglishIcon() {
  return (
    <svg
      className="toggle-icon skill-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id="english-flag-clip">
          <rect x="3.5" y="5" width="17" height="14" rx="2.6" />
        </clipPath>
      </defs>
      <rect x="3.5" y="5" width="17" height="14" rx="2.6" fill="#b22234" />
      <g clipPath="url(#english-flag-clip)">
        <rect x="3.5" y="6.1" width="17" height="1.08" fill="#fff" />
        <rect x="3.5" y="8.26" width="17" height="1.08" fill="#fff" />
        <rect x="3.5" y="10.42" width="17" height="1.08" fill="#fff" />
        <rect x="3.5" y="12.58" width="17" height="1.08" fill="#fff" />
        <rect x="3.5" y="14.74" width="17" height="1.08" fill="#fff" />
        <rect x="3.5" y="16.9" width="17" height="1.08" fill="#fff" />
        <rect x="3.5" y="5" width="7.2" height="7.56" fill="#3c3b6e" />
        <circle cx="4.8" cy="6.3" r="0.28" fill="#fff" />
        <circle cx="6.1" cy="6.3" r="0.28" fill="#fff" />
        <circle cx="7.4" cy="6.3" r="0.28" fill="#fff" />
        <circle cx="8.7" cy="6.3" r="0.28" fill="#fff" />
        <circle cx="10" cy="6.3" r="0.28" fill="#fff" />
        <circle cx="5.45" cy="7.45" r="0.28" fill="#fff" />
        <circle cx="6.75" cy="7.45" r="0.28" fill="#fff" />
        <circle cx="8.05" cy="7.45" r="0.28" fill="#fff" />
        <circle cx="9.35" cy="7.45" r="0.28" fill="#fff" />
        <circle cx="4.8" cy="8.6" r="0.28" fill="#fff" />
        <circle cx="6.1" cy="8.6" r="0.28" fill="#fff" />
        <circle cx="7.4" cy="8.6" r="0.28" fill="#fff" />
        <circle cx="8.7" cy="8.6" r="0.28" fill="#fff" />
        <circle cx="10" cy="8.6" r="0.28" fill="#fff" />
        <circle cx="5.45" cy="9.75" r="0.28" fill="#fff" />
        <circle cx="6.75" cy="9.75" r="0.28" fill="#fff" />
        <circle cx="8.05" cy="9.75" r="0.28" fill="#fff" />
        <circle cx="9.35" cy="9.75" r="0.28" fill="#fff" />
        <circle cx="4.8" cy="10.9" r="0.28" fill="#fff" />
        <circle cx="6.1" cy="10.9" r="0.28" fill="#fff" />
        <circle cx="7.4" cy="10.9" r="0.28" fill="#fff" />
        <circle cx="8.7" cy="10.9" r="0.28" fill="#fff" />
        <circle cx="10" cy="10.9" r="0.28" fill="#fff" />
      </g>
      <rect
        x="3.5"
        y="5"
        width="17"
        height="14"
        rx="2.6"
        fill="none"
        stroke="rgba(15, 23, 42, 0.18)"
        strokeWidth="0.9"
      />
    </svg>
  );
}

function SectionBadgeIcon({
  kind,
}: {
  kind:
    | "objective"
    | "skills"
    | "experience"
    | "projects"
    | "education"
    | "achievements"
    | "contact";
}) {
  switch (kind) {
    case "objective":
      return (
        <BadgeIcon tone="blue">
          <CompassGlyph />
        </BadgeIcon>
      );
    case "skills":
      return (
        <BadgeIcon tone="violet">
          <BracketsGlyph />
        </BadgeIcon>
      );
    case "experience":
      return (
        <BadgeIcon tone="green">
          <BriefcaseGlyph />
        </BadgeIcon>
      );
    case "projects":
      return (
        <BadgeIcon tone="amber">
          <SparkGlyph />
        </BadgeIcon>
      );
    case "education":
      return (
        <BadgeIcon tone="cyan">
          <BookGlyph />
        </BadgeIcon>
      );
    case "achievements":
      return (
        <BadgeIcon tone="rose">
          <TrophyGlyph />
        </BadgeIcon>
      );
    case "contact":
      return (
        <BadgeIcon tone="blue">
          <MailGlyph />
        </BadgeIcon>
      );
    default:
      return (
        <BadgeIcon tone="blue">
          <CompassGlyph />
        </BadgeIcon>
      );
  }
}

function SidebarBadgeIcon({
  kind,
}: {
  kind: "profile" | "personal" | "contact" | "social" | "interests";
}) {
  switch (kind) {
    case "profile":
      return (
        <BadgeIcon tone="blue">
          <UserGlyph />
        </BadgeIcon>
      );
    case "personal":
      return (
        <BadgeIcon tone="violet">
          <IdGlyph />
        </BadgeIcon>
      );
    case "contact":
      return (
        <BadgeIcon tone="green">
          <PhoneGlyph />
        </BadgeIcon>
      );
    case "social":
      return (
        <BadgeIcon tone="cyan">
          <GlobeGlyph />
        </BadgeIcon>
      );
    case "interests":
      return (
        <BadgeIcon tone="amber">
          <HeartGlyph />
        </BadgeIcon>
      );
    default:
      return (
        <BadgeIcon tone="blue">
          <UserGlyph />
        </BadgeIcon>
      );
  }
}

function SocialIcon({ kind }: { kind: SocialIconKind }) {
  switch (kind) {
    case "zalo":
      return (
        <SiZalo
          className="social-brand-icon"
          aria-hidden="true"
          focusable="false"
        />
      );
    case "facebook":
      return (
        <FaFacebookF
          className="social-brand-icon"
          aria-hidden="true"
          focusable="false"
        />
      );
    case "instagram":
      return (
        <FaInstagram
          className="social-brand-icon"
          aria-hidden="true"
          focusable="false"
        />
      );
    case "twitter":
      return (
        <FaXTwitter
          className="social-brand-icon"
          aria-hidden="true"
          focusable="false"
        />
      );
    default:
      return <GlobeGlyph />;
  }
}

function ContactLinkIcon({ kind }: { kind: "phone" | "mail" }) {
  return kind === "phone" ? (
    <PhoneGlyph className="contact-glyph" />
  ) : (
    <MailGlyph className="contact-glyph" />
  );
}

function SkillItemIcon({ kind }: { kind: SkillIconKind }) {
  switch (kind) {
    case "csharp":
      return (
        <SiSharp
          className="skill-brand-icon"
          aria-hidden="true"
          focusable="false"
        />
      );
    case "dotnet":
      return (
        <SiDotnet
          className="skill-brand-icon"
          aria-hidden="true"
          focusable="false"
        />
      );
    case "entity":
      return (
        <SiFramework
          className="skill-brand-icon"
          aria-hidden="true"
          focusable="false"
        />
      );
    case "api":
      return <SkillApiIcon />;
    case "jwt":
      return <SkillShieldIcon />;
    case "angular":
      return (
        <SiAngular
          className="skill-brand-icon"
          aria-hidden="true"
          focusable="false"
        />
      );
    case "typescript":
      return (
        <SiTypescript
          className="skill-brand-icon"
          aria-hidden="true"
          focusable="false"
        />
      );
    case "html":
      return (
        <SiHtml5
          className="skill-brand-icon"
          aria-hidden="true"
          focusable="false"
        />
      );
    case "css":
      return (
        <FaCss3Alt
          className="skill-brand-icon"
          aria-hidden="true"
          focusable="false"
        />
      );
    case "scss":
      return (
        <SiSass
          className="skill-brand-icon"
          aria-hidden="true"
          focusable="false"
        />
      );
    case "material":
      return (
        <SiMaterialdesign
          className="skill-brand-icon"
          aria-hidden="true"
          focusable="false"
        />
      );
    case "rxjs":
      return <SkillRxjsIcon />;
    case "sql":
      return (
        <DiMsqlServer
          className="skill-brand-icon"
          aria-hidden="true"
          focusable="false"
        />
      );
    case "mongo":
      return (
        <SiMongodb
          className="skill-brand-icon"
          aria-hidden="true"
          focusable="false"
        />
      );
    case "git":
      return (
        <SiGit
          className="skill-brand-icon"
          aria-hidden="true"
          focusable="false"
        />
      );
    case "github":
      return (
        <SiGithub
          className="skill-brand-icon"
          aria-hidden="true"
          focusable="false"
        />
      );
    case "postman":
      return (
        <SiPostman
          className="skill-brand-icon"
          aria-hidden="true"
          focusable="false"
        />
      );
    case "swagger":
      return (
        <SiSwagger
          className="skill-brand-icon"
          aria-hidden="true"
          focusable="false"
        />
      );
    case "docker":
      return (
        <SiDocker
          className="skill-brand-icon"
          aria-hidden="true"
          focusable="false"
        />
      );
    default:
      return (
        <SiFramework
          className="skill-brand-icon"
          aria-hidden="true"
          focusable="false"
        />
      );
  }
}

function SkillApiIcon() {
  return (
    <SvgGlyph>
      <path
        d="M6 8h12M6 12h8M6 16h10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </SvgGlyph>
  );
}

function SkillShieldIcon() {
  return (
    <SvgGlyph>
      <path
        d="M12 4.8 18 7v4.5c0 3.8-2.6 6.3-6 8-3.4-1.7-6-4.2-6-8V7l6-2.2Z"
        fill="currentColor"
      />
      <path
        d="m9.4 12 1.7 1.7 3.6-4"
        fill="none"
        stroke="#fff"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgGlyph>
  );
}

function SkillRxjsIcon() {
  return (
    <SvgGlyph>
      <path
        d="M12 4.8c2 0 3.8.5 5.3 1.5l-1.5 2.1c-1-.7-2.3-1.1-3.8-1.1-2.8 0-4.8 1.7-5.7 4.3-.5 1.4-.5 2.9 0 4.3.9 2.6 2.9 4.3 5.7 4.3 1.5 0 2.8-.4 3.8-1.1l1.5 2.1C15.8 19.7 14 20.2 12 20.2c-4.2 0-7.5-2.6-8.8-6.5-.7-2-.7-4.3 0-6.3C4.5 7.4 7.8 4.8 12 4.8Z"
        fill="#1d4ed8"
        opacity="0.85"
      />
      <circle cx="8.2" cy="8.2" r="1.7" fill="#e11d48" />
      <circle cx="15.8" cy="8.2" r="1.7" fill="#a855f7" />
      <circle cx="12" cy="15.5" r="1.7" fill="#06b6d4" />
    </SvgGlyph>
  );
}

function InterestIcon({ kind }: { kind: InterestItem["kind"] }) {
  if (kind === "music") {
    return (
      <span className="interest-icon-wrap interest-icon-music" aria-hidden="true">
        <FaCompactDisc className="glyph-svg interest-glyph" />
      </span>
    );
  }

  if (kind === "travel") {
    return (
      <span className="interest-icon-wrap interest-icon-travel" aria-hidden="true">
        <FaPlane className="glyph-svg interest-glyph" />
      </span>
    );
  }

  return (
    <span className="interest-icon-wrap interest-icon-code" aria-hidden="true">
      <FaLaptopCode className="glyph-svg interest-glyph" />
    </span>
  );
}

function BadgeIcon({
  tone,
  children,
}: {
  tone: "blue" | "cyan" | "green" | "amber" | "violet" | "rose";
  children: React.ReactNode;
}) {
  return <span className={`badge-icon badge-tone-${tone}`}>{children}</span>;
}

function SkillAnalysisChart({
  mode,
  items,
}: {
  mode: SkillChartMode;
  items: SkillAnalysisItem[];
}) {
  const palette = ["#38bdf8", "#8b5cf6", "#22c55e", "#f59e0b"];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const focusedIndex = hoveredIndex ?? selectedIndex;
  const activeItem = items[focusedIndex] ?? items[0];
  const average = Math.round(
    items.reduce((total, item) => total + item.value, 0) / items.length,
  );

  const handleActivate = (index: number) => {
    setSelectedIndex(index);
    setHoveredIndex(index);
  };

  const clearHover = () => {
    setHoveredIndex(null);
  };

  if (mode === "bars") {
    return (
      <div className="skill-analysis-chart skill-analysis-bars">
        <div className="skill-analysis-list" role="list" aria-label="Skill bars">
          {items.map((item, index) => (
            <button
              key={item.label}
              type="button"
              className={`skill-analysis-item skill-analysis-item-button ${
                focusedIndex === index ? "is-active" : ""
              }`}
              role="listitem"
              aria-pressed={focusedIndex === index}
              onClick={() => handleActivate(index)}
              onPointerEnter={() => setHoveredIndex(index)}
              onPointerLeave={clearHover}
              onFocus={() => setHoveredIndex(index)}
              onBlur={clearHover}
            >
              <div className="skill-analysis-row">
                <span className="skill-analysis-label">{item.label}</span>
                <strong className="skill-analysis-value">{item.value}%</strong>
              </div>
              <div className="skill-analysis-bar" aria-hidden="true">
                <span
                  className="skill-analysis-fill"
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </button>
          ))}
        </div>
        <div className="skill-analysis-focus" aria-live="polite">
          <strong>{activeItem.value}%</strong>
          <span>{activeItem.label}</span>
          <small>Hover or tap a bar to inspect it</small>
        </div>
      </div>
    );
  }

  if (mode === "radar") {
    const polygonPoints = buildRadarPoints(items, 88, 120, 120);
    const outlinePoints = buildRadarPoints(
      items.map(() => ({ label: "", value: 100 })),
      88,
      120,
      120,
    );

    return (
      <div className="skill-analysis-chart skill-analysis-radar">
        <svg className="skill-radar-svg" viewBox="0 0 240 240" aria-hidden="true">
          <polygon className="skill-radar-grid" points={outlinePoints} />
          <polygon
            className="skill-radar-grid skill-radar-grid-inner"
            points={buildRadarPoints(
              items.map(() => ({ label: "", value: 66 })),
              58,
              120,
              120,
            )}
          />
          <polygon className="skill-radar-area" points={polygonPoints} />
          {items.map((item, index) => {
            const point = buildRadarPoint(item.value, 92, 120, 120, index, items.length);
            return (
              <g
                key={item.label}
                className={focusedIndex === index ? "is-active" : ""}
                role="button"
                tabIndex={0}
                aria-pressed={focusedIndex === index}
                onClick={() => handleActivate(index)}
                onPointerEnter={() => setHoveredIndex(index)}
                onPointerLeave={clearHover}
                onFocus={() => setHoveredIndex(index)}
                onBlur={clearHover}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleActivate(index);
                  }
                }}
              >
                <line
                  className={`skill-radar-axis ${focusedIndex === index ? "is-active" : ""}`}
                  x1="120"
                  y1="120"
                  x2={point.x}
                  y2={point.y}
                />
                <circle
                  className="skill-radar-hit"
                  cx={point.x}
                  cy={point.y}
                  r="10"
                />
                <circle
                  className={`skill-radar-dot ${focusedIndex === index ? "is-active" : ""}`}
                  cx={point.x}
                  cy={point.y}
                  r="4.5"
                />
              </g>
            );
          })}
        </svg>
        <div className="skill-radar-legend" role="list" aria-label="Radar legend">
          {items.map((item, index) => (
            <button
              key={item.label}
              type="button"
              className={`skill-radar-legend-item ${focusedIndex === index ? "is-active" : ""}`}
              role="listitem"
              aria-pressed={focusedIndex === index}
              onClick={() => handleActivate(index)}
              onPointerEnter={() => setHoveredIndex(index)}
              onPointerLeave={clearHover}
              onFocus={() => setHoveredIndex(index)}
              onBlur={clearHover}
            >
              <span
                className="skill-radar-swatch"
                style={{ background: palette[index % palette.length] }}
                aria-hidden="true"
              />
              <span>{item.label}</span>
              <strong>{item.value}%</strong>
            </button>
          ))}
        </div>
        <div className="skill-analysis-focus" aria-live="polite">
          <strong>{activeItem.value}%</strong>
          <span>{activeItem.label}</span>
          <small>Hover or tap a point to inspect it</small>
        </div>
        <div className="skill-analysis-summary">
          <strong>{average}%</strong>
          <span>Average proficiency</span>
        </div>
      </div>
    );
  }

  if (mode === "donut") {
    const total = items.reduce((sum, item) => sum + item.value, 0) || 1;
    let current = 0;

    const segments = items.map((item, index) => {
      const start = current;
      current += (item.value / total) * 100;
      const end = current;
      return `${palette[index % palette.length]} ${start}% ${end}%`;
    });

    return (
      <div className="skill-analysis-chart skill-analysis-donut">
        <div
          className="skill-donut-ring"
          style={{ background: `conic-gradient(${segments.join(", ")})` }}
        >
          <div className="skill-donut-center">
            <strong>{activeItem.value}%</strong>
            <span>{activeItem.label}</span>
          </div>
        </div>
        <div className="skill-donut-legend" role="list" aria-label="Skill donut legend">
          {items.map((item, index) => (
            <button
              key={item.label}
              type="button"
              className={`skill-donut-legend-item ${focusedIndex === index ? "is-active" : ""}`}
              role="listitem"
              aria-pressed={focusedIndex === index}
              onClick={() => handleActivate(index)}
              onPointerEnter={() => setHoveredIndex(index)}
              onPointerLeave={clearHover}
              onFocus={() => setHoveredIndex(index)}
              onBlur={clearHover}
            >
              <span
                className="skill-donut-swatch"
                style={{ background: palette[index % palette.length] }}
                aria-hidden="true"
              />
              <span>{item.label}</span>
              <strong>{item.value}%</strong>
            </button>
          ))}
        </div>
        <div className="skill-analysis-focus" aria-live="polite">
          <strong>{activeItem.value}%</strong>
          <span>{activeItem.label}</span>
          <small>Hover or tap a segment to inspect it</small>
        </div>
      </div>
    );
  }

  const linePoints = items.map((item, index) =>
    buildLinePoint(item.value, index, items.length, 20, 220, 20, 116),
  );
  const linePath = linePoints.map((point) => `${point.x},${point.y}`).join(" ");
  const areaBaseline = 138;
  const areaPath = `M ${linePoints[0].x} ${areaBaseline} ${linePath} L ${linePoints[linePoints.length - 1].x} ${areaBaseline} Z`;

  return (
    <div className="skill-analysis-chart skill-analysis-line">
      <svg className="skill-line-svg" viewBox="0 0 240 160" aria-hidden="true">
        <defs>
          <linearGradient id="skill-line-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(56, 189, 248, 0.45)" />
            <stop offset="100%" stopColor="rgba(56, 189, 248, 0.02)" />
          </linearGradient>
        </defs>
        <path className="skill-line-area" d={areaPath} />
        <polyline className="skill-line-path" points={linePath} />
        {linePoints.map((point, index) => (
          <g
            key={items[index].label}
            role="button"
            tabIndex={0}
            aria-pressed={focusedIndex === index}
            onClick={() => handleActivate(index)}
            onPointerEnter={() => setHoveredIndex(index)}
            onPointerLeave={clearHover}
            onFocus={() => setHoveredIndex(index)}
            onBlur={clearHover}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleActivate(index);
              }
            }}
            className={focusedIndex === index ? "is-active" : ""}
          >
            <circle className="skill-line-hit" cx={point.x} cy={point.y} r="11" />
            <circle className={`skill-line-dot ${focusedIndex === index ? "is-active" : ""}`} cx={point.x} cy={point.y} r="4.6" />
          </g>
        ))}
      </svg>
      <div className="skill-line-legend" role="list" aria-label="Trend line legend">
        {items.map((item, index) => (
          <button
            key={item.label}
            type="button"
            className={`skill-line-legend-item ${focusedIndex === index ? "is-active" : ""}`}
            role="listitem"
            aria-pressed={focusedIndex === index}
            onClick={() => handleActivate(index)}
            onPointerEnter={() => setHoveredIndex(index)}
            onPointerLeave={clearHover}
            onFocus={() => setHoveredIndex(index)}
            onBlur={clearHover}
          >
            <span
              className="skill-line-swatch"
              style={{ background: palette[index % palette.length] }}
              aria-hidden="true"
            />
            <span>{item.label}</span>
            <strong>{item.value}%</strong>
          </button>
        ))}
      </div>
      <div className="skill-analysis-focus" aria-live="polite">
        <strong>{activeItem.value}%</strong>
        <span>{activeItem.label}</span>
        <small>Hover or tap a point to inspect it</small>
      </div>
      <div className="skill-line-summary">
        <strong>{average}%</strong>
        <span>Trend line overview</span>
      </div>
    </div>
  );
}

function buildRadarPoint(
  value: number,
  radius: number,
  centerX: number,
  centerY: number,
  index: number,
  count: number,
) {
  const angle = -Math.PI / 2 + (Math.PI * 2 * index) / count;
  const effectiveRadius = (radius * value) / 100;
  const x = centerX + Math.cos(angle) * effectiveRadius;
  const y = centerY + Math.sin(angle) * effectiveRadius;

  return {
    x: Number(x.toFixed(1)),
    y: Number(y.toFixed(1)),
  };
}

function buildRadarPoints(
  items: SkillAnalysisItem[],
  radius: number,
  centerX: number,
  centerY: number,
) {
  return items
    .map((item, index) => {
      const point = buildRadarPoint(item.value, radius, centerX, centerY, index, items.length);
      return `${point.x},${point.y}`;
    })
    .join(" ");
}

function buildLinePoint(
  value: number,
  index: number,
  count: number,
  left: number,
  right: number,
  top: number,
  bottom: number,
) {
  const usableWidth = right - left;
  const usableHeight = bottom - top;
  const x = count === 1 ? (left + right) / 2 : left + (usableWidth * index) / (count - 1);
  const y = bottom - (usableHeight * value) / 100;

  return {
    x: Number(x.toFixed(1)),
    y: Number(y.toFixed(1)),
  };
}

function CompassGlyph() {
  return (
    <SvgGlyph>
      <path
        d="M12 4l2.8 6.2L21 13l-6.2 2.8L12 22l-2.8-6.2L3 13l6.2-2.8L12 4Z"
        fill="currentColor"
      />
    </SvgGlyph>
  );
}

function BracketsGlyph() {
  return (
    <SvgGlyph>
      <path
        d="M10 6 6 12l4 6M14 6l4 6-4 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgGlyph>
  );
}

function BriefcaseGlyph() {
  return (
    <SvgGlyph>
      <path
        d="M7 8h10a2 2 0 0 1 2 2v6.5A2.5 2.5 0 0 1 16.5 19h-9A2.5 2.5 0 0 1 5 16.5V10a2 2 0 0 1 2-2Z"
        fill="currentColor"
      />
      <path
        d="M9 8V7a3 3 0 0 1 6 0v1"
        fill="none"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </SvgGlyph>
  );
}

function SparkGlyph() {
  return (
    <SvgGlyph>
      <path
        d="M12 4l1.5 4.5L18 10l-4.5 1.5L12 16l-1.5-4.5L6 10l4.5-1.5L12 4Z"
        fill="currentColor"
      />
    </SvgGlyph>
  );
}

function BookGlyph() {
  return (
    <SvgGlyph>
      <path
        d="M6 5.5h8.5A2.5 2.5 0 0 1 17 8v10.5H8.5A2.5 2.5 0 0 0 6 21V5.5Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M8 8h6M8 11h5"
        fill="none"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </SvgGlyph>
  );
}

function TrophyGlyph() {
  return (
    <SvgGlyph>
      <path
        d="M7 5h10v2a5 5 0 0 1-4 4.9V14h2v2H9v-2h2v-2.1A5 5 0 0 1 7 7V5Z"
        fill="currentColor"
      />
    </SvgGlyph>
  );
}

function MailGlyph({ className }: { className?: string }) {
  return (
    <SvgGlyph className={className}>
      <path d="M5 7h14v10H5V7Z" fill="currentColor" opacity="0.9" />
      <path
        d="m6.5 8.5 5.5 4.2 5.5-4.2"
        fill="none"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgGlyph>
  );
}

function UserGlyph() {
  return (
    <SvgGlyph>
      <circle cx="12" cy="8" r="3.1" fill="currentColor" />
      <path
        d="M5.5 19a6.5 6.5 0 0 1 13 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </SvgGlyph>
  );
}

function IdGlyph() {
  return (
    <SvgGlyph>
      <rect
        x="5"
        y="4.5"
        width="14"
        height="15"
        rx="3"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M9 9h6M9 12h6M9 15h4"
        fill="none"
        stroke="#fff"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </SvgGlyph>
  );
}

function PhoneGlyph({ className }: { className?: string }) {
  return (
    <SvgGlyph className={className}>
      <path
        d="M8 5.5c1.7 0 4 2.6 4.3 3.9.2.9-.5 1.6-1 2.1l1.5 2.5c.8-.2 1.8-.3 2.5.2 1.2.7 2.2 2.4 2.2 3.7 0 .8-.7 1.5-1.5 1.5-6.7 0-12.1-5.4-12.1-12.1 0-.8.7-1.5 1.5-1.5H8Z"
        fill="currentColor"
      />
    </SvgGlyph>
  );
}

function HeartGlyph() {
  return (
    <SvgGlyph>
      <path
        d="M12 20s-6.5-3.8-8.2-8.1C2.8 8.8 4.2 6 7 6c1.6 0 2.9 1 3.6 2 .7-1 2-2 3.6-2 2.8 0 4.2 2.8 3.2 5.9C18.5 16.2 12 20 12 20Z"
        fill="currentColor"
      />
    </SvgGlyph>
  );
}

function GlobeGlyph() {
  return (
    <SvgGlyph>
      <circle
        cx="12"
        cy="12"
        r="8.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M4 12h16M12 4.2c2.4 2.2 3.7 4.8 3.7 7.8S14.4 17.8 12 20c-2.4-2.2-3.7-4.8-3.7-8s1.3-5.6 3.7-7.8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </SvgGlyph>
  );
}

function SvgGlyph({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      className={className ? `glyph-svg ${className}` : "glyph-svg"}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

function StreamItemIcon({ kind }: { kind: StreamIconKind }) {
  switch (kind) {
    case "flow":
      return <FlowIcon />;
    case "api":
      return <ApiStreamIcon />;
    case "database":
      return <DatabaseStreamIcon />;
    case "shield":
      return <ShieldStreamIcon />;
    case "speed":
      return <SpeedStreamIcon />;
    case "dashboard":
      return <DashboardStreamIcon />;
    case "code":
      return <CodeStreamIcon />;
    case "tools":
      return <ToolsStreamIcon />;
    case "approval":
      return <ApprovalStreamIcon />;
    case "audit":
      return <AuditStreamIcon />;
    case "integration":
      return <IntegrationStreamIcon />;
    case "docs":
      return <DocsStreamIcon />;
    case "branch":
      return <BranchStreamIcon />;
    case "screen":
      return <ScreenStreamIcon />;
    case "angular":
      return (
        <SiAngular
          className="stream-svg stream-brand-icon"
          aria-hidden="true"
          focusable="false"
        />
      );
    case "sqlserver":
      return (
        <DiMsqlServer
          className="stream-svg stream-brand-icon"
          aria-hidden="true"
          focusable="false"
        />
      );
    case "csharp":
      return (
        <SiSharp
          className="stream-svg stream-brand-icon"
          aria-hidden="true"
          focusable="false"
        />
      );
    case "dotnet":
      return (
        <SiDotnet
          className="stream-svg stream-brand-icon"
          aria-hidden="true"
          focusable="false"
        />
      );
    case "typescript":
      return (
        <SiTypescript
          className="stream-svg stream-brand-icon"
          aria-hidden="true"
          focusable="false"
        />
      );
    case "entityframework":
      return (
        <SiFramework
          className="stream-svg stream-brand-icon"
          aria-hidden="true"
          focusable="false"
        />
      );
    case "material":
      return (
        <SiMaterialdesign
          className="stream-svg stream-brand-icon"
          aria-hidden="true"
          focusable="false"
        />
      );
    case "postman":
      return (
        <SiPostman
          className="stream-svg stream-brand-icon"
          aria-hidden="true"
          focusable="false"
        />
      );
    case "swagger":
      return (
        <SiSwagger
          className="stream-svg stream-brand-icon"
          aria-hidden="true"
          focusable="false"
        />
      );
    case "git":
      return (
        <SiGit
          className="stream-svg stream-brand-icon"
          aria-hidden="true"
          focusable="false"
        />
      );
    default:
      return <FlowIcon />;
  }
}

function FlowIcon() {
  return (
    <svg
      className="stream-svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4 12h10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M11 8l4 4-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="18" cy="12" r="2.2" fill="currentColor" />
    </svg>
  );
}

function ApiStreamIcon() {
  return (
    <svg
      className="stream-svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M5 7h5l-3 5h5l-7 5 3-5H3l2-5Z"
        fill="currentColor"
        opacity="0.95"
      />
      <circle cx="17.5" cy="7.5" r="2.3" fill="currentColor" opacity="0.75" />
      <circle cx="17.5" cy="16.5" r="2.3" fill="currentColor" opacity="0.95" />
    </svg>
  );
}

function DatabaseStreamIcon() {
  return (
    <svg
      className="stream-svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse
        cx="12"
        cy="6.5"
        rx="7"
        ry="3.2"
        fill="currentColor"
        opacity="0.95"
      />
      <path
        d="M5 6.5v7c0 1.8 3.1 3.2 7 3.2s7-1.4 7-3.2v-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 13.5v4c0 1.8 3.1 3.2 7 3.2s7-1.4 7-3.2v-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldStreamIcon() {
  return (
    <svg
      className="stream-svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 3.5 19 6v6.2c0 4.2-2.8 6.8-7 8.5-4.2-1.7-7-4.3-7-8.5V6l7-2.5Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="m9.4 12 1.7 1.7 3.5-3.8"
        fill="none"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SpeedStreamIcon() {
  return (
    <svg
      className="stream-svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 5a7 7 0 1 0 7 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 12l4-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

function DashboardStreamIcon() {
  return (
    <svg
      className="stream-svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="4"
        fill="currentColor"
        opacity="0.18"
      />
      <path
        d="M7 8h4M13 8h4M7 12h4M13 12h4M7 16h10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CodeStreamIcon() {
  return (
    <svg
      className="stream-svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M9 7 5 12l4 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 7l4 5-4 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 6 11 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ToolsStreamIcon() {
  return (
    <svg
      className="stream-svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M8 4.8a3.5 3.5 0 0 0 4.7 4.7l5.5 5.5-2 2-5.5-5.5A3.5 3.5 0 0 0 8 4.8Z"
        fill="currentColor"
        opacity="0.9"
      />
      <circle cx="7" cy="17" r="2.3" fill="currentColor" opacity="0.95" />
    </svg>
  );
}

function ApprovalStreamIcon() {
  return (
    <svg
      className="stream-svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="8" fill="currentColor" opacity="0.9" />
      <path
        d="m8.8 12.2 2.1 2.1 4.3-4.7"
        fill="none"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AuditStreamIcon() {
  return (
    <svg
      className="stream-svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 4h8l4 4v12H6V4Z" fill="currentColor" opacity="0.18" />
      <path
        d="M14 4v4h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M8 12h8M8 16h5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IntegrationStreamIcon() {
  return (
    <svg
      className="stream-svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="6" cy="12" r="2.2" fill="currentColor" opacity="0.95" />
      <circle cx="18" cy="12" r="2.2" fill="currentColor" opacity="0.95" />
      <path
        d="M8.3 12h7.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="m13.2 8.8 2.5 3.2-2.5 3.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DocsStreamIcon() {
  return (
    <svg
      className="stream-svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M7 4h8l2 2v14H7V4Z" fill="currentColor" opacity="0.16" />
      <path
        d="M15 4v4h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M9 11h6M9 14h6M9 17h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BranchStreamIcon() {
  return (
    <svg
      className="stream-svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="7" cy="6.5" r="2" fill="currentColor" />
      <circle cx="17" cy="10.5" r="2" fill="currentColor" />
      <circle cx="7" cy="17.5" r="2" fill="currentColor" opacity="0.75" />
      <path
        d="M7 8.5v4c0 1.4.8 2.2 2.2 2.2H15"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M15 10.5h2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ScreenStreamIcon() {
  return (
    <svg
      className="stream-svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="4"
        y="5"
        width="16"
        height="11"
        rx="2.5"
        fill="currentColor"
        opacity="0.16"
      />
      <path
        d="M8 19h8M12 16v3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M7 8h4M13 8h4M7 11h10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
