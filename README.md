# Portfolio Giới Thiệu Cá Nhân

Trang React + Vite một trang để giới thiệu bản thân theo phong cách CV/portfolio hiện đại, có hỗ trợ đổi ngôn ngữ, đổi giao diện sáng tối, các khối nội dung rõ ràng và phần luồng thông tin động ở cuối trang.

## Tính Năng Chính

- Giao diện một trang, bố cục CV rõ ràng
- Hỗ trợ tiếng Việt và tiếng Anh
- Chuyển giao diện sáng/tối
- Khối thông tin cá nhân, liên hệ và mạng xã hội
- Kỹ năng, kinh nghiệm, dự án, học vấn và thành tựu
- Luồng thông tin kỹ thuật chạy liên tục ở cuối trang
- Ảnh đại diện nhỏ để thay ảnh thật vào nhanh chóng
- Icon SVG màu cho các khu vực và kênh liên lạc

## Chạy Dự Án

```bash
npm install
npm run dev
```

## Build Sản Phẩm

```bash
npm run build
```

## Cấu Trúc Chính

- `src/App.tsx`: Nội dung, dữ liệu, chuyển ngôn ngữ, theme và các icon
- `src/App.css`: Bố cục, card, spacing, icon và hiệu ứng
- `src/index.css`: Biến màu, font toàn cục và nền trang
- `public/`: Tài nguyên tĩnh nếu cần thay ảnh thật hoặc icon riêng

## Nội Dung Có Thể Thay Nhanh

- Ảnh đại diện trong khối thông tin cá nhân
- Tên, chức danh, mô tả ngắn và mục tiêu nghề nghiệp
- Email, số điện thoại và các liên kết mạng xã hội
- Kỹ năng, kinh nghiệm, dự án, học vấn và thành tựu

## Ghi Chú

- Ảnh đại diện hiện tại là placeholder nhỏ để bạn thay bằng ảnh thật.
- Các liên kết mạng xã hội đang để mẫu, bạn có thể đổi sang tài khoản thật của mình.
- Dữ liệu hiện tại đã được tổ chức để dễ chỉnh sửa mà không phải đổi cấu trúc giao diện.
