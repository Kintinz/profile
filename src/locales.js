import * as vietnameseContent from './content.js';
import { englishContent } from './content.en.js';

const vi = {
  dragHint: 'Giữ và kéo cung để chọn mục, hoặc chạm vào mục muốn xem.',
  personalProfile: 'Hồ sơ cá nhân', navigation: 'Các mục hồ sơ', home: 'Về bản thân',
  previousPage: 'Trang nội dung trước', nextPage: 'Trang nội dung tiếp',
  previousProject: 'Dự án trước', nextProject: 'Dự án tiếp',
  experience: 'Kinh nghiệm', expertise: 'Chuyên môn',
  role: 'Vai trò', teamSize: 'Quy mô team', collaboration: 'Phối hợp', result: 'Kết quả', technology: 'Công nghệ',
  major: 'Chuyên ngành', subject: 'Công nghệ Thông tin', project: 'Dự án', detail: 'Chi tiết',
  skillGroup: 'Nhóm kỹ năng', content: 'Nội dung', page: 'trang', of: 'trên',
  company: 'Công ty Cổ phần Kids Plaza', school: 'Cao đẳng kinh tế công nghiệp Hà Nội',
  settings: 'Ngôn ngữ và giao diện', language: 'Ngôn ngữ', toDark: 'Chuyển sang giao diện tối', toLight: 'Chuyển sang giao diện sáng',
};
const en = {
  dragHint: 'Hold and drag the arc to select a section, or tap a section to open it.',
  personalProfile: 'Personal profile', navigation: 'Profile sections', home: 'About me',
  previousPage: 'Previous content page', nextPage: 'Next content page',
  previousProject: 'Previous project', nextProject: 'Next project',
  experience: 'Experience', expertise: 'Core technologies',
  role: 'Role', teamSize: 'Team size', collaboration: 'Collaboration', result: 'Result', technology: 'Technologies',
  major: 'Major', subject: 'Information Technology', project: 'Project', detail: 'Details',
  skillGroup: 'Skill group', content: 'Content', page: 'page', of: 'of',
  // Proper organization names retain the spelling supplied in the CV.
  company: 'Công ty Cổ phần Kids Plaza', school: 'Cao đẳng kinh tế công nghiệp Hà Nội',
  settings: 'Language and appearance', language: 'Language', toDark: 'Switch to dark theme', toLight: 'Switch to light theme',
};

export function getContent(language) {
  return language === 'en' ? { ...englishContent, ui: en } : { ...vietnameseContent, ui: vi };
}
