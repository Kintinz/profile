import { getIconSvg } from '../utils/icons.js';

/**
 * GameGuideModal.js
 * Trung tâm lưu trữ hướng dẫn chi tiết, luật chơi, phím điều khiển và mẹo cao thủ
 * cho toàn bộ 16 trò chơi (10 Casual & 6 Dev Arenas).
 */

export const GAME_GUIDES = {
  // ==========================================
  // 10 TRÒ CHƠI GIẢI TRÍ (CASUAL GAMES)
  // ==========================================
  snake: {
    title: 'Cyber Snake',
    subtitle: 'Rắn Săn Mồi Neon Lượng Tử',
    icon: 'activity',
    badge: 'Arcade Phản Xạ',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    difficulty: '★★☆☆☆',
    objective: 'Điều khiển rắn neon di chuyển thông minh trong ma trận dữ liệu, thu thập tối đa Data Byte và Crypto Chip để đạt điểm số kỷ lục mà không va vào viền tường hoặc tự cắn vào đuôi.',
    controls: {
      pc: 'Dùng các phím W / A / S / D hoặc 4 phím Mũi Tên để đổi hướng. Nhấn phím P để Tạm Dừng / Tiếp Tục.',
      mobile: 'Bấm 4 nút D-Pad ảo (Chevrons) bên dưới bàn chơi hoặc vuốt ngón tay trực tiếp trên bề mặt.'
    },
    rules: [
      'Byte Dữ Liệu Xanh: +10 điểm, thân rắn dài thêm 1 đốt.',
      'Crypto Chip Vàng: +50 điểm, xuất hiện ngẫu nhiên trong thời gian ngắn.',
      'Rắn càng dài, tốc độ di chuyển của ma trận sẽ tăng dần tạo độ kịch tính.'
    ],
    difficulties: {
      easy: 'Cấp Dễ: Tốc độ 135ms thong thả, điểm mồi x1.0, tăng độ dài từ tốn.',
      normal: 'Cấp Chuẩn: Tốc độ chuẩn 100ms, điểm mồi x1.5, cân bằng phản xạ.',
      hard: 'Cấp Cyber God: Tốc độ 65ms siêu tốc, điểm x2.5, chỉ dành cho cao thủ phản xạ!'
    },
    tips: 'Khi thân rắn bắt đầu dài, hãy di chuyển theo hình chữ Z (zigzag) men theo 4 góc tường ngoài cùng để chừa khoảng trống trung tâm, tránh bị tự khóa đầu.'
  },

  defender: {
    title: 'Cyber Defender',
    subtitle: 'Chiến Cơ Không Gian & Diệt Virus Vũ Trụ',
    icon: 'rocket',
    badge: 'Bắn Súng Không Gian',
    badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
    difficulty: '★★★★☆',
    objective: 'Điều khiển chiến đấu cơ lượng tử bay tuần tra, tiêu diệt hạm đội Drone virus ngoài không gian, né tránh làn đạn kẻ địch và hạ gục Boss Mẹ khổng lồ.',
    controls: {
      pc: 'Rê chuột để chiến cơ bay theo tọa độ ngang. Nhấn phím Space hoặc Click chuột trái để khai hỏa súng Laser. Phím P để tạm dừng.',
      mobile: 'Chạm và kéo ngón tay trên màn hình để di chuyển chiến cơ. Tự động bắn khi chạm.'
    },
    rules: [
      'Drone Trinh Sát: 50 điểm. Drone Bọc Thép: 150 điểm. Siêu Boss Hạm Đội: 1000 điểm.',
      'Nhặt Lõi Năng Lượng: Tự động nâng cấp súng lên Laser 2 tia, 3 tia và chùm đạn xuyên phá.',
      'Nhặt Khiên Lục Giác: Tạo màng chắn phòng hộ chống chịu 1 lần va đạn của địch.',
      'Máu chiến cơ giảm về 0% sẽ dẫn tới kết thúc ván đấu.'
    ],
    difficulties: {
      easy: 'Cấp Dễ: Máu 150%, quái bay chậm hơn 15%, tần suất xuất hiện thưa.',
      normal: 'Cấp Chuẩn: Máu 100%, tốc độ và tần suất xuất hiện quái chuẩn.',
      hard: 'Cấp Cyber God: Máu 80%, quái dồn dập gấp 1.4x, tốc độ đạn tăng 35%, điểm thưởng x2.5!'
    },
    tips: 'Luôn giữ chiến cơ ở khoảng 1/3 góc dưới màn hình. Khi Boss xuất hiện, hãy tập trung bắn phá 2 khẩu pháo phụ bên sườn trước khi tấn công trực diện vào lò phản ứng chính.'
  },

  breaker: {
    title: 'Firewall Breaker',
    subtitle: 'Bắn Bóng Phá Tường Lửa Arkanoid 2.0',
    icon: 'boxes',
    badge: 'Phá Gạch Cổ Điển',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    difficulty: '★★★☆☆',
    objective: 'Điều khiển thanh trượt lượng tử hứng quả cầu năng lượng, đập tan 5 tầng tường lửa bảo mật (Root, Kernel, Gateway, Crypto, Packet) trước khi hết mạng.',
    controls: {
      pc: 'Di chuyển chuột sang trái / phải để thanh trượt bám theo. Phím P để tạm dừng.',
      mobile: 'Đặt ngón tay và vuốt ngang mượt mà trên bàn chơi.'
    },
    rules: [
      'Gạch Packet, Crypto, Gateway (tầng dưới): Phá hủy trong 1 lần va chạm (30 - 90đ).',
      'Gạch Kernel, Root (tầng trên): Cần 2 lần đập phá (120 - 150đ).',
      'Vật phẩm rơi ngẫu nhiên: Multi-Ball (nhân 3 quả cầu), Laser Cannon (súng gắn trên thanh trượt), Paddle Expansion (mở rộng chiều dài thanh trượt).'
    ],
    difficulties: {
      easy: 'Cấp Dễ: Thanh trượt 120px rộng rãi, bóng bay vừa phải, 5 Mạng.',
      normal: 'Cấp Chuẩn: Thanh trượt 96px tiêu chuẩn, tốc độ bóng chuẩn, 3 Mạng.',
      hard: 'Cấp Cyber God: Thanh trượt 72px hẹp, bóng bay cực nhanh, chỉ 2 Mạng, điểm gạch x2.5!'
    },
    tips: 'Đón quả cầu ở 2 mép biên của thanh trượt để tạo góc nghiêng cực nhọn, giúp bóng luồn thẳng lên phía trên hàng gạch và nảy dội liên tục giải phóng toàn bộ màn chơi.'
  },

  runner: {
    title: 'Neon Runner 3D',
    subtitle: 'Đua Xe Phi Thuyền Cao Tốc Phối Cảnh 3D',
    icon: 'gauge',
    badge: 'Endless Runner 3D',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    difficulty: '★★★☆☆',
    objective: 'Lướt phi thuyền siêu tốc trên xa lộ neon 3 làn vô tận, né tránh các bức tường lỗi glitch, drone chắn đường và kích hoạt Nitro để bứt phá kỷ lục quãng đường.',
    controls: {
      pc: 'Phím A / D hoặc Mũi Tên Trái / Phải để đổi làn. Phím Space hoặc Mũi Tên Lên để phun Nitro tăng tốc.',
      mobile: 'Chạm nửa trái màn hình để sang trái, nửa phải để sang phải, chạm nút Nitro để tăng tốc.'
    },
    rules: [
      'Quãng đường bay càng xa thì điểm số và tốc độ xa lộ càng tăng cao.',
      'Nhặt Quả Cầu Năng Lượng: Hồi phục 20% thanh Nitro.',
      'Kích hoạt Nitro: Phi thuyền tăng tốc gấp đôi và nhận trạng thái khiên bất tử húc bay chướng ngại vật trong 1.2 giây.'
    ],
    difficulties: {
      easy: 'Cấp Dễ: Tốc độ lướt 6.0, chướng ngại vật thưa, dễ thu thập Nitro.',
      normal: 'Cấp Chuẩn: Tốc độ lướt 8.5, chướng ngại vật tiêu chuẩn, nhịp độ kịch tính.',
      hard: 'Cấp Cyber God: Tốc độ 12.0 Hyper Warp, vật cản dày đặc, khoảng né hẹp, điểm x2.5!'
    },
    tips: 'Ưu tiên giữ vị trí phi thuyền ở làn giữa. Khi gặp cụm chướng ngại vật liên hoàn, việc ở giữa sẽ cho bạn 2 hướng thoát (trái hoặc phải) thay vì bị dồn vào góc cụt.'
  },

  flappy: {
    title: 'Flappy Cyber Drone',
    subtitle: 'Phi Cơ Lượng Tử Luồn Khe Laser',
    icon: 'navigation',
    badge: 'Physics Arcade',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    difficulty: '★★★★☆',
    objective: 'Cân bằng quán tính và lực đẩy phản lực của drone lượng tử, bay xuyên qua các trụ laser bảo mật đa tầng có khoảng hở biến thiên mà không được va chạm.',
    controls: {
      pc: 'Nhấn phím Space, phím W, Mũi Tên Lên hoặc Click chuột trái để kích hoạt lực đẩy bay lên. Phím P tạm dừng.',
      mobile: 'Chạm bất kỳ vị trí nào trên màn hình để nâng độ cao drone.'
    },
    rules: [
      'Mỗi lần vượt qua 1 cặp trụ laser thành công: +1 điểm.',
      'Điểm số càng cao, các cột laser sẽ di chuyển nhanh hơn và khe hở hẹp dần.',
      'Va chạm vào trụ, rơi chạm sàn hoặc bay đụng trần nhà sẽ kích nổ drone ngay lập tức.'
    ],
    difficulties: {
      easy: 'Cấp Dễ: Khe laser 160px rộng thoáng, tốc độ lướt 2.2, dễ giữ độ cao.',
      normal: 'Cấp Chuẩn: Khe laser 130px tiêu chuẩn, tốc độ 2.8, thử thách phản xạ.',
      hard: 'Cấp Cyber God: Khe laser 100px siêu hẹp, tốc độ 3.7, cột laser dày đặc!'
    },
    tips: 'Nhấp từng nhịp nhẹ nhàng, giữ drone ở tầm cao vừa phải trước khi tiến vào cổng laser. Đừng nhấp liên tục khiến drone bay vọt lên quá cao khó hãm đà rơi.'
  },

  '2048': {
    title: 'Matrix 2048',
    subtitle: 'Hợp Nhất Khối Byte & Lõi Lượng Tử',
    icon: 'binary',
    badge: 'Trí Tuệ & Tư Duy',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    difficulty: '★★★☆☆',
    objective: 'Dồn các ô dữ liệu byte cùng giá trị va vào nhau để nhân đôi dung lượng (2B → 4B → 8B → ... → 2048TB và đạt đến Lõi Lượng Tử Singularity).',
    controls: {
      pc: 'Dùng các phím Mũi Tên hoặc W / A / S / D để trượt khối theo 4 hướng. Phím P để tạm dừng.',
      mobile: 'Vuốt ngón tay theo 4 hướng trên bàn chơi hoặc bấm cụm nút mũi tên ảo bên dưới.'
    },
    rules: [
      'Hai khối có cùng dung lượng khi va chạm sẽ gộp lại thành 1 khối có dung lượng gấp đôi và cộng điểm tương ứng.',
      'Nút Hoàn Tác (Undo): Cho phép phục hồi lại 1 nước đi liền trước nếu trượt nhầm.',
      'Trò chơi kết thúc khi ma trận đầy kín và không còn ô kề nhau nào có thể gộp được.'
    ],
    difficulties: {
      easy: 'Lưới 5x5 (Dễ): Ma trận 25 ô rộng rãi, dễ dàng tạo chuỗi combo tới 4096-8192TB.',
      normal: 'Lưới 4x4 (Chuẩn): Ma trận 16 ô kinh điển, chuẩn mực chiến thuật quy hoạch không gian.',
      hard: 'Lưới 3x3 (Cao Thủ): Ma trận 9 ô cực hẹp, cực kỳ thách thức, chỉ 1 sai lầm là tắc nghẽn!'
    },
    tips: 'Chiến thuật kinh điển: Luôn giữ khối có giá trị lớn nhất nằm cố định ở một góc (khuyên dùng góc dưới cùng bên trái), sắp xếp các khối nhỏ giảm dần kế tiếp nhau.'
  },

  pong: {
    title: 'Cyber Pong Battle',
    subtitle: 'Bóng Bàn Lượng Tử Đối Đầu AI 3 Cấp Độ',
    icon: 'circle-dot',
    badge: 'Đối Kháng Phản Xạ',
    badgeColor: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
    difficulty: '★★★☆☆ đến ★★★★★',
    objective: 'Đỡ bóng bàn phản xạ siêu tốc, đánh bóng xoáy vạt góc hiểm hóc vượt qua tầm vợt của AI. Người chơi ghi được 7 bàn thắng trước sẽ chiến thắng chung cuộc.',
    controls: {
      pc: 'Di chuột dọc theo bàn đấu hoặc dùng phím W / S, Mũi Tên Lên / Xuống. Phím P tạm dừng.',
      mobile: 'Vuốt ngón tay lên / xuống ở nửa trái màn hình để điều khiển thanh vợt.'
    },
    rules: [
      'Bóng chạm vào 2 vách biên trên dưới sẽ nảy bật lại với góc phản xạ tự nhiên.',
      '3 Cấp độ AI: Tập Sự (chậm, có độ trễ), Cao Thủ (bám đuổi chính xác), Cyber God (tính toán quỹ đạo tức thì).',
      'Mỗi pha đỡ bóng thành công sẽ tăng dần vận tốc của quả bóng lên tới mức cực đại.'
    ],
    difficulties: {
      easy: 'AI Tập Sự: Phản ứng chậm, có độ trễ quán tính 18px, bóng nảy vừa tầm.',
      normal: 'AI Cao Thủ: Phản xạ nhạy bén, bám sát bóng với độ trễ 8px.',
      hard: 'AI Cyber God: Tốc độ phản xạ tức thời (0 delay), xoáy bóng hiểm hóc!'
    },
    tips: 'Di chuyển thanh vợt đón bóng khi vợt đang có đà lướt lên hoặc lướt xuống để tạo lực xoáy, khiến bóng đổi góc bay gắt làm AI không kịp phản ứng.'
  },

  whack: {
    title: 'Whack-A-Bug Blitz',
    subtitle: 'Đập Bọ Lỗi & Diệt Virus Hệ Thống 45 Giây',
    icon: 'target',
    badge: 'Tốc Độ Blitz',
    badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    difficulty: '★★☆☆☆',
    objective: 'Quan sát 9 cổng máy chủ ma trận, nhấp chuột hoặc chạm cực nhanh để vá lỗi bug và tiêu diệt virus trước khi chúng kịp biến mất trong vòng 45 giây đếm ngược.',
    controls: {
      pc: 'Click chuột trái thật nhanh và chính xác vào cổng máy chủ đang có bọ xuất hiện.',
      mobile: 'Chạm ngón tay trực tiếp vào ô có bọ.'
    },
    rules: [
      'Null Pointer Bug (+100đ): Bọ cơ bản.',
      'Memory Leak (+200đ): Rút lui nhanh hơn bình thường.',
      'Ransomware (+300đ): Mã độc nguy hiểm, điểm thưởng cao.',
      'Golden Byte (+500đ): Bọ vàng may mắn, tăng điểm đột biến.',
      'Decoy Trap (-150đ): Bẫy tường lửa đánh lạc hướng, ĐỪNG BẤM! Sẽ bị trừ điểm và đứt chuỗi Combo!',
      'Hệ thống Combo Streak: Đập trúng liên tục từ 3 con trở lên sẽ nhân điểm x2, x3, x4!'
    ],
    difficulties: {
      easy: 'Cấp Dễ (60s): Bọ ngoi lên 1.2s, tần suất thưa, ít bẫy Decoy.',
      normal: 'Cấp Chuẩn (45s): Bọ ngoi lên 0.85s, xuất hiện đều đặn và nhịp độ vừa phải.',
      hard: 'Cấp Cyber God (35s): Bọ chớp tắt 0.55s, bẫy Decoy dày đặc, điểm thưởng x2.5!'
    },
    tips: 'Tập trung tầm nhìn vào toàn bộ khung 3x3 thay vì nhìn 1 ô. Đừng nóng vội bấm vào chiếc khiên tím Decoy để bảo toàn hệ số Combo x4.'
  },

  tetris: {
    title: 'Tetris Matrix Neon',
    subtitle: 'Xếp Gạch Neon Huyền Thoại',
    icon: 'shapes',
    badge: 'Xếp Hình Kinh Điển',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    difficulty: '★★★☆☆',
    objective: 'Điều khiển và xoay 7 khối Tetromino phát sáng rơi từ trên xuống, ghép kín các hàng ngang để triệt tiêu dòng, ghi điểm và thăng hạng cấp độ.',
    controls: {
      pc: 'Mũi Tên Trái / Phải: Di chuyển ngang. Mũi Tên Lên: Xoay khối. Mũi Tên Xuống: Rơi nhanh (Soft Drop). Phím Space: Rơi tức thì (Hard Drop). Phím C hoặc Shift: Giữ khối (Hold Piece).',
      mobile: 'Sử dụng hàng nút cảm ứng ảo bên dưới: [◀ Trái] [🔄 Xoay] [Phải ▶] [▼ Thả] [⚡ Rơi].'
    },
    rules: [
      'Bóng Chiếu Chân (Ghost Piece): Vùng mờ chiếu thẳng xuống sàn giúp bạn căn chuẩn 100% vị trí hạ cánh.',
      'Xóa dòng: 1 dòng (100đ), 2 dòng (300đ), 3 dòng (500đ), 4 dòng cùng lúc TETRIS (800đ x Cấp độ)!',
      'Cứ mỗi 10 dòng xóa được sẽ tăng 1 Cấp độ (Level) và tốc độ rơi sẽ nhanh hơn.'
    ],
    difficulties: {
      easy: 'Cấp Level 1: Tốc độ rơi 900ms từ tốn, thích hợp luyện ghép hàng cơ bản.',
      normal: 'Cấp Level 3: Tốc độ rơi 600ms tiêu chuẩn, nhịp độ kịch tính.',
      hard: 'Cấp Level 6 (Thần Tốc): Tốc độ rơi 320ms siêu nhanh, điểm ăn dòng nhân x2.5!'
    },
    tips: 'Luôn xếp bằng phẳng ở 9 cột bên trái và chừa trống đúng 1 cột thứ 10 ngoài cùng. Khi khối dài I màu xanh ngọc xuất hiện, thả thẳng xuống để ăn trọn cú TETRIS 4 dòng!'
  },

  mines: {
    title: 'Cyber Minesweeper',
    subtitle: 'Gỡ Bom Lõi Lượng Tử Vi Mạch',
    icon: 'shield-alert',
    badge: 'Tư Duy Logic',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    difficulty: '★★★☆☆',
    objective: 'Quét toàn bộ vi mạch mạng lưới, xác định tọa độ và khóa thành công tất cả các lõi hạt nhân EMP ẩn giấu mà không được làm phát nổ bất kỳ quả nào.',
    controls: {
      pc: 'Chuột trái để Quét / Mở ô an toàn. Chuột phải để Cắm Cờ hoặc hủy cờ khóa mìn. Phím P để tạm dừng.',
      mobile: 'Bấm nút chuyển đổi [Mở Ô / Cắm Cờ] phía trên, sau đó chạm vào ô muốn thao tác.'
    },
    rules: [
      'Bảo đảm nước đi đầu tiên luôn an toàn 100% (mìn chỉ được kích hoạt sau cú nhấp đầu).',
      'Mỗi ô số chỉ ra chính xác số lượng mìn nằm trong 8 ô bao quanh nó.',
      'Mở trúng ô trống (0 mìn) sẽ tự động loang mở toàn bộ vùng an toàn liền kề (Flood Fill).',
      'Gỡ sạch toàn bộ các ô không chứa mìn trong thời gian ngắn nhất để lập kỷ lục!'
    ],
    difficulties: {
      easy: 'Lưới 8x8 (10 mìn): Tân binh rà phá bom mìn cơ bản, bước khởi đầu an toàn.',
      normal: 'Lưới 10x10 (16 mìn): Chuẩn logic vi mạch, mật độ bom vừa phải.',
      hard: 'Lưới 12x12 (26 mìn): Cấp độ Chuyên Gia lượng tử, đòi hỏi phán đoán xác suất cao!'
    },
    tips: 'Nếu 1 ô số 1 nằm ở góc tường và chỉ tiếp giáp duy nhất 1 ô chưa mở, thì ô đó chắc chắn 100% là mìn. Hãy cắm cờ vào đó, và các ô kề cạnh khác xung quanh số 1 đều an toàn.'
  },

  // ==========================================
  // 6 ĐẤU TRƯỜNG LẬP TRÌNH (DEV ARENAS)
  // ==========================================
  quiz: {
    title: 'Git & Code Arena',
    subtitle: 'Đấu Trí Lập Trình .NET, Architecture & Git',
    icon: 'terminal',
    badge: 'Đấu Trí Chuyên Sâu',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    difficulty: '★★★★☆',
    objective: 'Vượt qua ngân hàng hơn 60 câu hỏi tình huống thực chiến về C#/.NET Core, Entity Framework, Microservices, SQL Server, Docker và Git nâng cao.',
    controls: {
      pc: 'Nhấp chuột vào 1 trong 4 phương án trả lời. Phím số 1, 2, 3, 4 để chọn nhanh.',
      mobile: 'Chạm trực tiếp vào phương án lựa chọn.'
    },
    rules: [
      'Bạn có 3 Mạng chơi (Lives). Mỗi câu trả lời sai sẽ bị trừ 1 mạng.',
      'Mỗi câu đúng cộng 100 điểm, kèm điểm thưởng phản xạ nếu trả lời trong 10 giây đầu.',
      'Sau mỗi câu hỏi, hệ thống cung cấp giải thích kỹ thuật và best practice kiến trúc chuyên sâu.'
    ],
    difficulties: {
      easy: '25 giây/câu: Thoải mái đọc hiểu kỹ lưỡng và củng cố kiến thức nền tảng.',
      normal: '15 giây/câu: Chuẩn phỏng vấn tuyển dụng Senior Software Engineer.',
      hard: '8 giây/câu: Thử thách Hackathon Speedrun phản xạ cực hạn, điểm thưởng x2.5!'
    },
    tips: 'Chú ý kỹ các từ khóa trong câu hỏi như DbContext Lifetime, AsNoTracking, IQueryable vs IEnumerable, Rebase vs Merge để chọn đáp án tối ưu nhất.'
  },

  typer: {
    title: 'Terminal Speed Typer',
    subtitle: 'Luyện Gõ Lệnh CLI Thần Tốc',
    icon: 'keyboard',
    badge: 'Kỹ Năng Dòng Lệnh',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    difficulty: '★★★☆☆',
    objective: 'Gõ phím thần tốc các câu lệnh CLI thực tế (.NET CLI, Git, Docker, Kubernetes, SQL, Linux) với độ chính xác và tốc độ gõ (WPM) cao nhất.',
    controls: {
      pc: 'Nhập trực tiếp các ký tự hiển thị trên màn hình dòng lệnh. Phím Tab hoặc Enter để sang lệnh kế tiếp.',
      mobile: 'Chạm vào ô nhập lệnh để mở bàn phím ảo di động.'
    },
    rules: [
      'Ký tự gõ đúng sẽ phát sáng màu xanh Cyan, ký tự sai sẽ báo đỏ.',
      'Hệ thống đo lường thời gian thực: Tốc độ từ (WPM), Độ chính xác (Accuracy %) và Chuỗi gõ hoàn hảo (Streak).',
      'Kèm phần mô tả nghiệp vụ thực tế của câu lệnh để củng cố kiến thức DevOps.'
    ],
    difficulties: {
      easy: 'Thời gian 90s: Các lệnh CLI cơ bản, phù hợp làm quen ngón tay.',
      normal: 'Thời gian 60s: Các câu lệnh phổ biến trong môi trường Docker, Git, Linux.',
      hard: 'Thời gian 40s: Lệnh nâng cao với nhiều tham số cờ phức tạp, đòi hỏi WPM cao!'
    },
    tips: 'Đừng vội vàng gõ quá nhanh ở những ký tự đầu; hãy giữ nhịp gõ đều đặn để duy trì độ chính xác 100%, điểm WPM sẽ tự động tăng cao.'
  },

  hunter: {
    title: 'Code Bug Hunter',
    subtitle: 'Truy Lùng & Vá Lỗi Mã Nguồn Thực Chiến',
    icon: 'bug',
    badge: 'Debug & Review Code',
    badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    difficulty: '★★★★☆',
    objective: 'Phân tích các đoạn mã nguồn thực tế (C#, SQL, JavaScript, Dockerfile), phát hiện dòng code tiềm ẩn lỗi nghiêm trọng (Memory Leak, N+1 Query, Race Condition, SQLi) và chọn giải pháp vá lỗi chuẩn.',
    controls: {
      pc: 'Nhấp chọn dòng code nghi vấn và chọn 1 trong các phương án sửa lỗi đề xuất.',
      mobile: 'Chạm để kiểm tra dòng code và chọn đáp án vá lỗi.'
    },
    rules: [
      'Tìm đúng dòng chứa bug: +100 điểm.',
      'Chọn đúng giải pháp vá lỗi: +150 điểm kèm lời giải thích cơ chế sâu sắc.',
      'Mỗi kịch bản mô phỏng sự cố thực tế thường gặp trong môi trường sản xuất (Production).'
    ],
    difficulties: {
      easy: 'Cấp Dễ: Nhận 3 gợi ý khoanh vùng lỗi, thích hợp cho người mới bắt đầu.',
      normal: 'Cấp Chuẩn: 1 gợi ý duy nhất, tự lực rà soát luồng thực thi code.',
      hard: 'Cấp Chuyên Gia (Zero Hint): Không gợi ý, tự phát hiện lỗi như sự cố thật!'
    },
    tips: 'Để ý các lỗi kinh điển như async void trong Controller, foreach gọi database query lặp lại, hoặc thiếu Using/Dispose giải phóng tài nguyên unmanaged.'
  },

  sql: {
    title: 'SQL Query Forge',
    subtitle: 'Rèn Giũa Cú Pháp Truy Vấn SQL Server',
    icon: 'database',
    badge: 'Cơ Sở Dữ Liệu SQL',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    difficulty: '★★★★☆',
    objective: 'Sắp xếp và ghép nối các khối lệnh SQL Server (SELECT, JOIN, WHERE, GROUP BY, INDEX...) để giải quyết các bài toán báo cáo dữ liệu HRM/BPM phức tạp.',
    controls: {
      pc: 'Nhấp chọn các khối lệnh theo thứ tự chuẩn cú pháp để tạo câu query hoàn chỉnh.',
      mobile: 'Chạm lần lượt các thẻ từ khóa hiển thị trên màn hình.'
    },
    rules: [
      'Cú pháp SQL chuẩn xác: +150 điểm.',
      'Tối ưu hóa Index & Execution Plan: +100 điểm thưởng.',
      'Kiểm tra tính đúng đắn dựa trên schema cơ sở dữ liệu quan hệ thực tế.'
    ],
    difficulties: {
      easy: 'Cấp Dễ: Truy vấn đơn bảng cơ bản (SELECT, WHERE, ORDER BY).',
      normal: 'Cấp Chuẩn: Truy vấn đa bảng liên kết (INNER/LEFT JOIN, GROUP BY, HAVING).',
      hard: 'Cấp Cao Thủ: Truy vấn phân tích sâu (Window Functions, CTE, Index Tuning).'
    },
    tips: 'Nhớ thứ tự thực thi logic của SQL: FROM → ON → JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → TOP/LIMIT.'
  },

  git: {
    title: 'Git Branch Master',
    subtitle: 'Mô Phỏng Cây Nhánh & Điều Hướng Git Flow',
    icon: 'git-branch',
    badge: 'Kiến Trúc Git Flow',
    badgeColor: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
    difficulty: '★★★☆☆',
    objective: 'Thực thi các câu lệnh Git (commit, branch, merge, rebase, cherry-pick) để dịch chuyển con trỏ HEAD và tái cấu trúc cây commit đồ họa đúng theo yêu cầu dự án.',
    controls: {
      pc: 'Gõ lệnh git hoặc nhấp nút lệnh tương ứng trong thanh công cụ giả lập.',
      mobile: 'Bấm các nút lệnh Git nhanh trên giao diện.'
    },
    rules: [
      'Quan sát đồ thị cây commit trực quan biến đổi theo thời gian thực.',
      'Hoàn thành đúng cấu trúc nhánh mục tiêu trong số lượt lệnh ít nhất để đạt 3 sao.',
      'Hiểu sâu cơ chế Squash, Fast-forward, Cherry-pick và Rebase tương tác.'
    ],
    difficulties: {
      easy: 'Cấp Dễ: Thao tác commit nhánh cơ bản (Commit, Checkout, Merge Fast-forward).',
      normal: 'Cấp Chuẩn: Phân nhánh chuyên nghiệp (Feature branches, 3-way Merge, Squash).',
      hard: 'Cấp Cao Thủ: Kỹ thuật Git đỉnh cao (Interactive Rebase, Cherry-pick).'
    },
    tips: 'Trước khi Rebase hoặc Merge, luôn kiểm tra vị trí của con trỏ HEAD hiện tại đang trỏ vào nhánh nào để tránh hợp nhất nhầm nhánh.'
  },

  matrix: {
    title: 'Code Syntax Matrix',
    subtitle: 'Thử Thách Trí Nhớ Cú Pháp & Logic',
    icon: 'cpu',
    badge: 'Trí Nhớ Cú Pháp',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    difficulty: '★★☆☆☆',
    objective: 'Lật các thẻ bài 3D neon trong ma trận 16 ô, tìm và ghép đúng các cặp khái niệm công nghệ tương ứng (Dependency Injection, Entity Framework, SignalR, JWT, Docker, Redis, REST API...).',
    controls: {
      pc: 'Nhấp chuột trái vào từng thẻ bài để lật mở.',
      mobile: 'Chạm ngón tay vào thẻ bài để lật mở.'
    },
    rules: [
      'Mỗi lần lật được 2 thẻ bài. Nếu trùng cặp công nghệ: Giữ nguyên trạng thái mở và cộng điểm.',
      'Nếu không trùng: Thẻ sẽ tự động úp lại sau 0.8 giây.',
      'Hoàn thành tất cả các cặp thẻ trong số bước lật ít nhất để nhận cúp vinh danh.'
    ],
    difficulties: {
      easy: 'Lưới 4x4 (16 thẻ): 8 cặp khái niệm cơ bản, thích hợp làm quen.',
      normal: 'Lưới 6x4 (24 thẻ): 12 cặp công nghệ mở rộng, thử thách ghi nhớ trung cấp.',
      hard: 'Lưới 6x6 & 8x6 (36 - 48 thẻ): Ma trận siêu cấp dành cho Hacker trí nhớ siêu phàm!'
    },
    tips: 'Tập trung ghi nhớ vị trí của 4 thẻ ở 4 góc trước, chúng thường là chìa khóa mở đường cho các cặp còn lại trong bàn chơi.'
  }
};

/**
 * Hiển thị Modal Hướng Dẫn Hologram Chi Tiết
 */
export function showGameGuideModal(gameKey, soundManager = null) {
  const guide = GAME_GUIDES[gameKey];
  if (!guide) return;

  if (soundManager && soundManager.playClick) {
    soundManager.playClick(620);
  }

  const existingModal = document.getElementById('cyber-guide-modal');
  if (existingModal) existingModal.remove();

  const modal = document.createElement('div');
  modal.id = 'cyber-guide-modal';
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200';

  const iconSvg = getIconSvg(guide.icon, 'w-8 h-8 text-cyan-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]', 32);

  modal.innerHTML = `
    <div class="relative w-full max-w-2xl bg-slate-900/95 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-500/10 max-h-[90vh] overflow-y-auto text-slate-100 code-font">
      <!-- Nút đóng góc trên -->
      <button id="guide-modal-close-btn" class="absolute top-5 right-5 w-9 h-9 rounded-2xl bg-slate-950 border border-white/10 hover:border-cyan-400/50 flex items-center justify-center text-slate-400 hover:text-white transition-all">
        ✕
      </button>

      <!-- Header modal -->
      <div class="flex items-start gap-4 mb-6">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-400/40 flex items-center justify-center shadow-lg shrink-0">
          ${iconSvg}
        </div>
        <div>
          <div class="flex flex-wrap items-center gap-2 mb-1">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${guide.badgeColor}">
              ${guide.badge}
            </span>
            <span class="text-xs text-amber-400 font-bold">
              Độ khó: ${guide.difficulty}
            </span>
          </div>
          <h3 class="text-xl sm:text-2xl font-black text-white leading-tight">
            ${guide.title}
          </h3>
          <p class="text-xs text-slate-400 mt-0.5">${guide.subtitle}</p>
        </div>
      </div>

      <!-- Nội dung chi tiết -->
      <div class="flex flex-col gap-4 text-xs leading-relaxed">
        <!-- 1. Mục tiêu -->
        <div class="bg-slate-950/80 rounded-2xl p-4 border border-white/5">
          <h4 class="font-black text-cyan-400 mb-1.5 flex items-center gap-2">
            ${getIconSvg('crosshair', 'w-4 h-4 text-cyan-400')} <span>MỤC TIÊU & LUẬT CHƠI</span>
          </h4>
          <p class="text-slate-300">${guide.objective}</p>
        </div>

        <!-- 2. Điều khiển -->
        <div class="bg-slate-950/80 rounded-2xl p-4 border border-white/5">
          <h4 class="font-black text-emerald-400 mb-2 flex items-center gap-2">
            ${getIconSvg('gamepad-2', 'w-4 h-4 text-emerald-400')} <span>PHÍM BẤM & ĐIỀU KHIỂN</span>
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="bg-slate-900/90 p-2.5 rounded-xl border border-white/5">
              <span class="text-white font-bold block mb-1 flex items-center gap-1.5">
                ${getIconSvg('monitor', 'w-3.5 h-3.5 text-cyan-400')} <span>Máy Tính (PC/Laptop):</span>
              </span>
              <span class="text-slate-300">${guide.controls.pc}</span>
            </div>
            <div class="bg-slate-900/90 p-2.5 rounded-xl border border-white/5">
              <span class="text-white font-bold block mb-1 flex items-center gap-1.5">
                ${getIconSvg('smartphone', 'w-3.5 h-3.5 text-emerald-400')} <span>Điện Thoại / Cảm Ứng:</span>
              </span>
              <span class="text-slate-300">${guide.controls.mobile}</span>
            </div>
          </div>
        </div>

        <!-- 3. Cơ chế tính điểm -->
        <div class="bg-slate-950/80 rounded-2xl p-4 border border-white/5">
          <h4 class="font-black text-amber-400 mb-1.5 flex items-center gap-2">
            ${getIconSvg('zap', 'w-4 h-4 text-amber-400')} <span>CƠ CHẾ & TÍNH ĐIỂM</span>
          </h4>
          <ul class="list-disc list-inside space-y-1 text-slate-300">
            ${guide.rules.map(r => `<li>${r}</li>`).join('')}
          </ul>
        </div>

        <!-- 4. Tùy chọn độ khó -->
        ${guide.difficulties ? `
        <div class="bg-slate-950/80 rounded-2xl p-4 border border-white/5">
          <h4 class="font-black text-rose-400 mb-2.5 flex items-center gap-2">
            ${getIconSvg('flame', 'w-4 h-4 text-rose-400')} <span>CÁC MỨC ĐỘ THỬ THÁCH (DIFFICULTY MODES)</span>
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div class="bg-emerald-950/30 border border-emerald-500/30 p-2.5 rounded-xl">
              <span class="text-emerald-400 font-black block mb-1">CẤP DỄ / CƠ BẢN</span>
              <span class="text-slate-300 text-[11px] leading-relaxed">${guide.difficulties.easy}</span>
            </div>
            <div class="bg-amber-950/30 border border-amber-500/30 p-2.5 rounded-xl">
              <span class="text-amber-400 font-black block mb-1">TIÊU CHUẨN</span>
              <span class="text-slate-300 text-[11px] leading-relaxed">${guide.difficulties.normal}</span>
            </div>
            <div class="bg-rose-950/30 border border-rose-500/30 p-2.5 rounded-xl">
              <span class="text-rose-400 font-black block mb-1">CYBER GOD</span>
              <span class="text-slate-300 text-[11px] leading-relaxed">${guide.difficulties.hard}</span>
            </div>
          </div>
        </div>
        ` : ''}

        <!-- 5. Mẹo cao thủ -->
        <div class="bg-gradient-to-r from-cyan-950/60 to-purple-950/60 rounded-2xl p-4 border border-cyan-500/20">
          <h4 class="font-black text-purple-300 mb-1.5 flex items-center gap-2">
            ${getIconSvg('sparkles', 'w-4 h-4 text-purple-400')} <span>MẸO CAO THỦ ĐẠT ĐIỂM CAO</span>
          </h4>
          <p class="text-slate-200 italic">${guide.tips}</p>
        </div>
      </div>

      <!-- Nút Đã Hiểu -->
      <div class="mt-6 text-center">
        <button id="guide-modal-action-btn" class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-black text-xs hover:scale-105 transition-all shadow-lg shadow-cyan-500/20">
          SẴN SÀNG CHIẾN NGAY!
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const closeModal = () => {
    if (soundManager && soundManager.playClick) soundManager.playClick(440);
    modal.classList.add('opacity-0');
    setTimeout(() => modal.remove(), 200);
    window.removeEventListener('keydown', onEsc);
  };

  const onEsc = (e) => {
    if (e.key === 'Escape') closeModal();
  };

  window.addEventListener('keydown', onEsc);
  modal.querySelector('#guide-modal-close-btn')?.addEventListener('click', closeModal);
  modal.querySelector('#guide-modal-action-btn')?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

/**
 * Trả về khối HTML hướng dẫn nhanh (Inline Collapsible Guide Card)
 * để nhúng trực tiếp ngay dưới khung chơi của từng game.
 */
export function getInlineGuideCardHtml(gameKey) {
  const guide = GAME_GUIDES[gameKey];
  if (!guide) return '';

  const headerIcon = getIconSvg(guide.icon, 'w-4 h-4 text-cyan-400 inline-block', 18);

  return `
    <div class="cyber-inline-guide mt-4 rounded-2xl bg-slate-950/80 border border-white/10 p-3 sm:p-4 text-xs code-font">
      <div class="flex items-center justify-between cursor-pointer group select-none toggle-inline-guide" data-guide-target="guide-content-${gameKey}">
        <div class="flex items-center gap-2">
          ${headerIcon}
          <span class="font-bold text-white group-hover:text-cyan-400 transition-colors">HƯỚNG DẪN CHƠI & MẸO PRO: ${guide.title.toUpperCase()}</span>
        </div>
        <span class="text-slate-400 text-[11px] group-hover:text-white transition-colors flex items-center gap-1">
          <span>Xem chi tiết</span> <span class="guide-toggle-icon text-cyan-400 inline-flex items-center">${getIconSvg('chevron-down', 'w-3.5 h-3.5')}</span>
        </span>
      </div>
      <div id="guide-content-${gameKey}" class="hidden mt-3 pt-3 border-t border-white/5 space-y-2.5 text-slate-300">
        <p><strong class="text-cyan-400 flex items-center gap-1.5 inline-flex">${getIconSvg('crosshair', 'w-3.5 h-3.5')} Mục tiêu:</strong> ${guide.objective}</p>
        <p><strong class="text-emerald-400 flex items-center gap-1.5 inline-flex">${getIconSvg('gamepad-2', 'w-3.5 h-3.5')} Phím bấm:</strong> ${guide.controls.pc}</p>
        ${guide.difficulties ? `
        <div class="pt-1.5 border-t border-white/5">
          <p class="font-bold text-rose-400 mb-1 flex items-center gap-1.5">${getIconSvg('flame', 'w-3.5 h-3.5')} Các mức độ khó:</p>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[11px]">
            <div class="bg-slate-900/80 p-2 rounded-lg border border-white/5"><span class="text-emerald-400 font-bold">Dễ:</span> ${guide.difficulties.easy}</div>
            <div class="bg-slate-900/80 p-2 rounded-lg border border-white/5"><span class="text-amber-400 font-bold">Chuẩn:</span> ${guide.difficulties.normal}</div>
            <div class="bg-slate-900/80 p-2 rounded-lg border border-white/5"><span class="text-rose-400 font-bold">Khó:</span> ${guide.difficulties.hard}</div>
          </div>
        </div>
        ` : ''}
        <p><strong class="text-purple-400 flex items-center gap-1.5 inline-flex">${getIconSvg('sparkles', 'w-3.5 h-3.5')} Mẹo cao thủ:</strong> <span class="italic text-slate-200">${guide.tips}</span></p>
      </div>
    </div>
  `;
}
