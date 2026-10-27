import { identity, skills, sections } from './content.js';

export const englishContent = {
  identity: {
    ...identity,
    goal: 'I want to continue developing my technical expertise and contribute to large systems with good scalability and maintainability.',
  },
  skills: skills.map(skill => ({ ...skill, title: skill.title === 'DevOps & Tool' ? 'DevOps & Tools' : skill.title, items: skill.items.map(item => item === 'Docker (cơ bản)' ? 'Docker (basic)' : item) })),
  experience: [
    'Develop and operate Human Resource Management (HRM) and Business Process Management (BPM) systems.',
    'Build a multi-level approval workflow engine supporting various internal processes.',
    'Design and develop RESTful APIs with ASP.NET Core and Entity Framework, integrated with an Angular frontend.',
    'Optimize SQL Server queries to improve system performance.',
    'Develop frontend interfaces using Angular, React, or Vue.js depending on project requirements.',
    'Participate in business requirements analysis and support system operations.',
  ],
  projects: [
    {
      title: 'Human Resource Management System', period: '06/2023–Present', role: '.NET Developer', team: '3 people',
      description: 'Employee records management, a dynamically configurable multi-level approval workflow engine, role-based user permissions, activity logging (audit trail), and statistical reports.',
      result: 'Significantly reduced manual approval processing time.',
      // The original CV's final clause is incomplete; no additional reason or outcome is inferred.
      work: ['Take over source code management and operations, optimize the existing system, and upgrade to a new system.'],
      tech: ['ASP.NET Core', 'Entity Framework', 'SQL Server', 'TypeScript', 'JWT', 'REST API'],
    },
    {
      title: 'Supplier Supply Chain Portal', period: '05/2024–05/2025', role: 'Developer', team: '5 people',
      description: 'Supplier information management, order tracking, document approval, and reporting dashboards.',
      result: 'Connected 40 to 50 suppliers / shortened the approval process.',
      tech: ['.NET MVC', 'Angular', 'SQL Server', 'REST API'],
    },
    {
      title: 'BPM — Enterprise Business Process Management Portal', period: '10/2025–10/2026', role: 'Frontend Developer (Angular)', team: '10 people',
      description: 'Develop interfaces for the internal business process management system.',
      work: ['Build approval screens, business forms, and dashboards.', 'Integrate data from backend APIs.', 'Improve the user experience.'],
      tech: ['Angular', 'TypeScript', 'HTML', 'CSS', 'REST API'],
    },
    {
      title: 'Sales & Transaction Verification System', period: '04/2026–05/2026', role: 'Frontend Developer', team: '5 people',
      description: 'Develop frontend modules for in-store sales workflows and transaction verification and reconciliation.',
      parts: [
        { title: 'Customer-Facing Display', work: ['Build display states for the shopping cart, payment, and completed transactions.', 'Automatically return the display to idle or show advertising after a transaction is completed.', 'Synchronize data in real time between the sales screen and customer display using SignalR.'], tech: ['Electron', 'React', 'TypeScript', 'SignalR'] },
        { title: 'Transaction Verification Reports', work: ['Build search interfaces and display transaction verification results.', 'Work with the business team to clarify data display requirements.'], tech: ['Angular', 'TypeScript', 'REST API', 'RxJS'] },
      ],
    },
    {
      title: 'KPI Overview Reports / DWH', period: '01/2026–06/2026', role: 'Frontend Developer', team: 'Work with an external partner',
      description: 'Develop overview reporting interfaces that help users monitor business indicators.',
      work: ['Build KPI displays, charts, and comparative information.', 'Format numbers and percentages according to the appropriate conventions.'],
      tech: ['Vue.js', 'TypeScript', 'Vite'],
    },
  ],
  sections: sections.map((section, index) => ({ ...section, label: ['About me', 'Skills', 'Experience', 'Projects', 'Education'][index] })),
};
