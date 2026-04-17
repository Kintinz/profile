export type Locale = "vi" | "en";

export type LabelValue = {
  label: string;
  value: string;
};

export type LinkValue = {
  label: string;
  value: string;
  href: string;
};

export type ContactLinkValue = LinkValue & {
  kind: "phone" | "mail";
};

export type Pillar = {
  title: string;
  text: string;
};

export type SkillItem = {
  label: string;
  icon: SkillIconKind;
};

export type SkillGroup = {
  title: string;
  items: SkillItem[];
  icon: SkillIconKind;
};

export type SkillIconKind =
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

export type StreamItem = {
  label: string;
  icon: StreamIconKind;
  tone: StreamTone;
};

export type StreamIconKind =
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

export type StreamTone =
  | "blue"
  | "cyan"
  | "green"
  | "amber"
  | "violet"
  | "rose";

export type TimelineItem = {
  period: string;
  title: string;
  text: string;
};

export type ProjectItem = {
  name: string;
  summary: string;
  stack: string[];
};

export type ProfileStat = {
  value: string;
  label: string;
};

export type SkillAnalysisItem = {
  label: string;
  value: number;
};

export type SkillChartMode = "bars" | "radar" | "donut" | "line";

export type InterestItem = {
  label: string;
  kind: "music" | "travel" | "code";
};

export type SocialLinkValue = {
  label: string;
  value: string;
  href: string;
  icon: SocialIconKind;
};

export type SocialIconKind = "zalo" | "facebook" | "instagram" | "twitter";

export type SidebarContent = {
  eyebrow: string;
  title: string;
  role: string;
  summary: string;
  personalLabel: string;
  personalInfo: LabelValue[];
  contactLabel: string;
  contacts: ContactLinkValue[];
  socialLabel: string;
  socials: SocialLinkValue[];
  interestsLabel: string;
  interests: InterestItem[];
  analysisLabel: string;
  analysis: SkillAnalysisItem[];
  analysisModes: Record<SkillChartMode, string>;
};

export type ChartCopy = {
  skillBarsLabel: string;
  radarLegendLabel: string;
  donutLegendLabel: string;
  lineLegendLabel: string;
  barHint: string;
  pointHint: string;
  segmentHint: string;
  averageLabel: string;
  trendLabel: string;
};

export type LocaleContent = {
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
    tracks: StreamItem[][];
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
  ui: {
    scrollTopLabel: string;
    mobileMenuOpenLabel: string;
    mobileMenuCloseLabel: string;
    mobileMenuBackdropLabel: string;
    quickNavLabel: string;
    avatarAlt: string;
    sidebarHighlights: string[];
    projectKicker: string;
    chart: ChartCopy;
  };
};

export const siteContent: { locales: Record<Locale, LocaleContent> } = {
  locales: {
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
        tracks: [
          [
            { label: "HRM", icon: "dashboard", tone: "blue" },
            { label: "BPM", icon: "flow", tone: "cyan" },
            { label: "REST API", icon: "api", tone: "violet" },
            { label: "Angular", icon: "angular", tone: "rose" },
            { label: "SQL Server", icon: "sqlserver", tone: "green" },
            { label: "Bảo mật", icon: "shield", tone: "amber" },
            { label: "Mở rộng", icon: "speed", tone: "blue" },
            { label: "Workflow", icon: "integration", tone: "cyan" },
          ],
          [
            { label: "Xử lý", icon: "tools", tone: "green" },
            { label: "Phê duyệt", icon: "approval", tone: "rose" },
            { label: "Kiểm soát", icon: "audit", tone: "amber" },
            { label: "Tích hợp", icon: "branch", tone: "violet" },
            { label: "Hiệu năng", icon: "speed", tone: "blue" },
            { label: "Dashboard", icon: "dashboard", tone: "cyan" },
            { label: "UI ổn định", icon: "screen", tone: "green" },
            { label: "Backend", icon: "dotnet", tone: "rose" },
          ],
          [
            { label: "C#", icon: "csharp", tone: "violet" },
            { label: "ASP.NET Core", icon: "dotnet", tone: "blue" },
            { label: "TypeScript", icon: "typescript", tone: "cyan" },
            {
              label: "Entity Framework",
              icon: "entityframework",
              tone: "green",
            },
            { label: "Angular Material", icon: "material", tone: "amber" },
            { label: "Postman", icon: "postman", tone: "rose" },
            { label: "Swagger", icon: "swagger", tone: "violet" },
            { label: "Git", icon: "branch", tone: "blue" },
          ],
        ],
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
          {
            label: "Điện thoại",
            value: "0393828088",
            href: "tel:0393828088",
            kind: "phone",
          },
          {
            label: "Email",
            value: "datduongnvty@gmail.com",
            href: "mailto:datduongnvty@gmail.com",
            kind: "mail",
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
        interestsLabel: "Sở thích của tôi",
        interests: [
          { label: "Nghe nhạc", kind: "music" },
          { label: "Du lịch", kind: "travel" },
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
      ui: {
        scrollTopLabel: "Cuộn lên đầu trang",
        mobileMenuOpenLabel: "Mở thanh menu",
        mobileMenuCloseLabel: "Đóng thanh menu",
        mobileMenuBackdropLabel: "Đóng menu",
        quickNavLabel: "Điều hướng nhanh",
        avatarAlt: "Ảnh chân dung của tôi",
        sidebarHighlights: [".NET", "Angular", "HRM/BPM"],
        projectKicker: "Dự án nổi bật",
        chart: {
          skillBarsLabel: "Biểu đồ kỹ năng dạng cột",
          radarLegendLabel: "Chú giải radar kỹ năng",
          donutLegendLabel: "Chú giải vòng tròn kỹ năng",
          lineLegendLabel: "Chú giải biểu đồ đường",
          barHint: "Di chuột hoặc chạm vào một cột để xem chi tiết",
          pointHint: "Di chuột hoặc chạm vào một điểm để xem chi tiết",
          segmentHint: "Di chuột hoặc chạm vào một phần để xem chi tiết",
          averageLabel: "Mức thành thạo trung bình",
          trendLabel: "Tổng quan xu hướng",
        },
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
        tracks: [
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
            {
              label: "Entity Framework",
              icon: "entityframework",
              tone: "green",
            },
            { label: "Angular Material", icon: "material", tone: "amber" },
            { label: "Postman", icon: "postman", tone: "rose" },
            { label: "Swagger", icon: "swagger", tone: "violet" },
            { label: "Git", icon: "branch", tone: "blue" },
          ],
        ],
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
          {
            label: "Phone",
            value: "0393828088",
            href: "tel:0393828088",
            kind: "phone",
          },
          {
            label: "Email",
            value: "datduongnvty@gmail.com",
            href: "mailto:datduongnvty@gmail.com",
            kind: "mail",
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
        interestsLabel: "My interests",
        interests: [
          { label: "Listening to music", kind: "music" },
          { label: "Travel", kind: "travel" },
          { label: "Exploring technology", kind: "code" },
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
      ui: {
        scrollTopLabel: "Scroll to top",
        mobileMenuOpenLabel: "Open menu bar",
        mobileMenuCloseLabel: "Close menu bar",
        mobileMenuBackdropLabel: "Close menu",
        quickNavLabel: "Quick navigation",
        avatarAlt: "My portrait photo",
        sidebarHighlights: [".NET", "Angular", "HRM/BPM"],
        projectKicker: "Featured work",
        chart: {
          skillBarsLabel: "Skill bars",
          radarLegendLabel: "Radar legend",
          donutLegendLabel: "Skill donut legend",
          lineLegendLabel: "Trend line legend",
          barHint: "Hover or tap a bar to inspect it",
          pointHint: "Hover or tap a point to inspect it",
          segmentHint: "Hover or tap a segment to inspect it",
          averageLabel: "Average proficiency",
          trendLabel: "Trend line overview",
        },
      },
    },
  },
};
