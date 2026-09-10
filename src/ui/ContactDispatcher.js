import { getIconSvg } from '../utils/icons.js';

export class ContactDispatcher {
  constructor(containerId, soundManager, achievementsManager) {
    this.container = document.getElementById(containerId);
    this.sound = soundManager;
    this.achievements = achievementsManager;
    this.storageKey = 'cyber_dispatched_messages';
    this.isTransmitting = false;

    if (this.container) {
      this.init();
    }
  }

  init() {
    this.render();
    this.bindEvents();
  }

  getStoredMessages() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveMessage(msg) {
    try {
      const list = this.getStoredMessages();
      list.unshift(msg);
      localStorage.setItem(this.storageKey, JSON.stringify(list.slice(0, 15)));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }

  render() {
    const history = this.getStoredMessages();

    this.container.innerHTML = `
      <div class="mt-8 bg-slate-950/90 border border-emerald-500/40 rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden code-font">
        <!-- Top Tech Glow Bar -->
        <div class="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
              ${getIconSvg('radio', 'w-5 h-5 text-emerald-400')}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <h3 class="text-sm sm:text-base font-bold text-white tracking-wide">CYBER DISPATCHER // TRẠM PHÁT TÍN HIỆU TRỰC TUYẾN</h3>
              </div>
              <p class="text-[11px] text-slate-400">Gửi lời mời phỏng vấn, đề xuất dự án hoặc liên hệ hợp tác qua kênh mã hóa</p>
            </div>
          </div>
          <div class="hidden sm:flex items-center gap-2">
            <span class="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
              GATEWAY: HANOI-NODE-01
            </span>
          </div>
        </div>

        <!-- Dispatcher Form -->
        <form id="cyber-dispatch-form" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Caller Name -->
            <div>
              <label class="block text-xs text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
                ${getIconSvg('user', 'w-3.5 h-3.5 text-cyan-400')} TÊN CỦA BẠN / ĐƠN VỊ TUYỂN DỤNG *
              </label>
              <input type="text" id="disp-sender" required placeholder="VD: Hoàng Mai - HR Lead / FPT Software" 
                class="w-full bg-slate-900/90 border border-white/10 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all" />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-xs text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
                ${getIconSvg('mail', 'w-3.5 h-3.5 text-purple-400')} EMAIL PHẢN HỒI *
              </label>
              <input type="email" id="disp-email" required placeholder="recruiter@company.com" 
                class="w-full bg-slate-900/90 border border-white/10 focus:border-purple-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-400 transition-all" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Topic / Role -->
            <div>
              <label class="block text-xs text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
                ${getIconSvg('briefcase', 'w-3.5 h-3.5 text-emerald-400')} MỤC ĐÍCH / VỊ TRÍ HỢP TÁC
              </label>
              <select id="disp-topic" 
                class="w-full bg-slate-900/90 border border-white/10 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all">
                <option value="Senior .NET Fullstack Developer">Vị trí: Senior .NET Core Fullstack Developer</option>
                <option value="Backend .NET Core & SQL Specialist">Vị trí: Backend .NET Core & Tối Ưu SQL</option>
                <option value="Frontend Lead (Angular / Vue)">Vị trí: Frontend Developer (Angular / Vue / React)</option>
                <option value="Microservices & Enterprise Architecture">Tư vấn Kiến Trúc Hệ Thống & Microservices</option>
                <option value="Freelance / Offshore Project">Dự án Phần Mềm Gia Công / Hợp Đồng Tự Do</option>
                <option value="General Inquiry">Trao Đổi Khác</option>
              </select>
            </div>

            <!-- Priority -->
            <div>
              <label class="block text-xs text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
                ${getIconSvg('zap', 'w-3.5 h-3.5 text-amber-400')} MỨC ĐỘ ƯU TIÊN
              </label>
              <select id="disp-priority" 
                class="w-full bg-slate-900/90 border border-white/10 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all">
                <option value="Standard">Tiêu Chuẩn (Phản hồi trong 24h)</option>
                <option value="Urgent">Khẩn Cấp // Urgent (Đang mở đợt tuyển dụng gấp)</option>
                <option value="Direct Interview">Đặt Lịch Phỏng Vấn Trực Tiếp</option>
              </select>
            </div>
          </div>

          <!-- Message Body -->
          <div>
            <label class="block text-xs text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
              ${getIconSvg('file-text', 'w-3.5 h-3.5 text-cyan-400')} THÔNG ĐIỆP CHI TIẾT (Yêu cầu, đãi ngộ, mô tả dự án...) *
            </label>
            <textarea id="disp-message" required rows="4" placeholder="Xin chào Đạt, chúng tôi ấn tượng với các dự án HRM/BPM và kinh nghiệm .NET Core của bạn. Chúng tôi muốn mời bạn tham gia buổi trao đổi..." 
              class="w-full bg-slate-900/90 border border-white/10 focus:border-cyan-400 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all leading-relaxed"></textarea>
          </div>

          <!-- Transmission Status Box (Hidden by default) -->
          <div id="dispatch-progress-box" class="hidden bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-4 space-y-2.5">
            <div class="flex items-center justify-between text-xs">
              <span id="dispatch-step-text" class="text-cyan-300 font-bold flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span>[1/3] Đang mã hóa gói tin với chuẩn AES-256...</span>
              </span>
              <span id="dispatch-percent" class="text-cyan-400 font-bold code-font">33%</span>
            </div>
            <div class="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-white/10">
              <div id="dispatch-progress-bar" class="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-300 w-1/3 transition-all duration-300"></div>
            </div>
          </div>

          <!-- Result Success Banner -->
          <div id="dispatch-success-banner" class="hidden bg-emerald-500/10 border border-emerald-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center flex-shrink-0">
                ${getIconSvg('check-circle', 'w-5 h-5 text-emerald-400')}
              </div>
              <div>
                <h4 class="text-xs sm:text-sm font-bold text-white">Tín Hiệu Đã Được Ghi Nhận Thành Công!</h4>
                <p class="text-[11px] text-slate-300 mt-0.5">
                  Mã vé theo dõi: <span id="disp-result-ticket" class="text-emerald-400 font-bold underline">TX-00000</span>. Đạt sẽ liên hệ lại sớm nhất!
                </p>
              </div>
            </div>
            <button type="button" id="btn-open-mailto" class="px-4 py-2 rounded-xl bg-slate-950 border border-emerald-500/40 text-emerald-300 hover:text-white hover:bg-emerald-500/20 text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0">
              ${getIconSvg('external-link', 'w-3.5 h-3.5')} <span>Mở Email Gửi Trực Tiếp</span>
            </button>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div class="flex items-center gap-2 text-[11px] text-slate-400">
              ${getIconSvg('shield-check', 'w-3.5 h-3.5 text-emerald-400')}
              <span>Tín hiệu truyền trực tiếp và bảo mật 100% không lưu cookie theo dõi</span>
            </div>

            <div class="flex items-center gap-3 w-full sm:w-auto">
              <button type="button" id="btn-toggle-outbox" class="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-400 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 flex-1 sm:flex-none justify-center">
                ${getIconSvg('archive', 'w-3.5 h-3.5 text-cyan-400')} <span>Hộp Thư Đi (${history.length})</span>
              </button>
              <button type="submit" id="btn-submit-dispatch" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:opacity-90 text-slate-950 font-black text-xs transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 flex-1 sm:flex-none justify-center hover:scale-105 active:scale-95">
                ${getIconSvg('send', 'w-4 h-4 text-slate-950')} <span>Phát Tín Hiệu // DISPATCH</span>
              </button>
            </div>
          </div>
        </form>

        <!-- Outbox Drawer -->
        <div id="disp-outbox-container" class="hidden mt-6 pt-5 border-t border-white/10">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              ${getIconSvg('inbox', 'w-3.5 h-3.5')} Lịch Sử Tín Hiệu Đã Phát (Outbox Log)
            </h4>
            <button id="btn-clear-outbox" class="text-[10px] text-rose-400 hover:underline">Xóa Lịch Sử</button>
          </div>

          <div id="disp-outbox-list" class="space-y-2.5 max-h-48 overflow-y-auto cyber-scroll pr-1">
            ${this.renderOutboxItems(history)}
          </div>
        </div>
      </div>
    `;
  }

  renderOutboxItems(history) {
    if (!history || history.length === 0) {
      return `
        <div class="p-4 rounded-xl bg-slate-900/60 border border-white/5 text-center text-xs text-slate-500">
          Chưa có tín hiệu nào được phát. Hãy gửi tin nhắn đầu tiên!
        </div>
      `;
    }

    return history.map(item => `
      <div class="p-3 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between gap-3 text-xs">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-emerald-400 font-bold">${item.ticket}</span>
            <span class="text-white font-bold">${item.sender}</span>
            <span class="px-1.5 py-0.5 rounded text-[9px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">${item.topic}</span>
          </div>
          <p class="text-[11px] text-slate-400 mt-1 line-clamp-1">${item.message}</p>
        </div>
        <div class="text-right flex-shrink-0 text-[10px] text-slate-500 code-font">
          ${item.timestamp}
        </div>
      </div>
    `).join('');
  }

  bindEvents() {
    const form = document.getElementById('cyber-dispatch-form');
    const outboxToggle = document.getElementById('btn-toggle-outbox');
    const outboxContainer = document.getElementById('disp-outbox-container');
    const clearOutboxBtn = document.getElementById('btn-clear-outbox');
    const mailtoBtn = document.getElementById('btn-open-mailto');

    outboxToggle?.addEventListener('click', () => {
      outboxContainer?.classList.toggle('hidden');
      if (this.sound && this.sound.playClick) this.sound.playClick(500);
    });

    clearOutboxBtn?.addEventListener('click', () => {
      localStorage.removeItem(this.storageKey);
      const listEl = document.getElementById('disp-outbox-list');
      if (listEl) listEl.innerHTML = this.renderOutboxItems([]);
      outboxToggle.innerHTML = `${getIconSvg('archive', 'w-3.5 h-3.5 text-cyan-400')} <span>Hộp Thư Đi (0)</span>`;
      if (this.sound && this.sound.playClick) this.sound.playClick(400);
    });

    mailtoBtn?.addEventListener('click', () => {
      const sender = document.getElementById('disp-sender')?.value || 'Nhà Tuyển Dụng';
      const topic = document.getElementById('disp-topic')?.value || 'Cơ Hội Hợp Tác';
      const message = document.getElementById('disp-message')?.value || '';
      
      const subject = encodeURIComponent(`[Nexus Matrix Contact] ${topic} - từ ${sender}`);
      const body = encodeURIComponent(`Chào Đạt,\n\nTôi là ${sender}.\n\nNội dung liên hệ:\n${message}\n\n---\nPhát qua Cyber Dispatcher`);
      window.open(`mailto:duongtiendat.dev@gmail.com?subject=${subject}&body=${body}`, '_blank');
    });

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.isTransmitting) return;

      const sender = document.getElementById('disp-sender').value.trim();
      const email = document.getElementById('disp-email').value.trim();
      const topic = document.getElementById('disp-topic').value;
      const priority = document.getElementById('disp-priority').value;
      const message = document.getElementById('disp-message').value.trim();

      if (!sender || !email || !message) return;

      this.startTransmission({ sender, email, topic, priority, message });
    });
  }

  startTransmission(data) {
    this.isTransmitting = true;
    const progressBox = document.getElementById('dispatch-progress-box');
    const progressBar = document.getElementById('dispatch-progress-bar');
    const stepText = document.getElementById('dispatch-step-text');
    const percentEl = document.getElementById('dispatch-percent');
    const successBanner = document.getElementById('dispatch-success-banner');
    const submitBtn = document.getElementById('btn-submit-dispatch');

    progressBox?.classList.remove('hidden');
    successBanner?.classList.add('hidden');
    if (submitBtn) submitBtn.disabled = true;

    if (this.sound && this.sound.playClick) this.sound.playClick(700);

    // Step 1: Encrypting
    setTimeout(() => {
      if (progressBar) progressBar.style.width = '35%';
      if (percentEl) percentEl.innerText = '35%';
      if (stepText) stepText.innerHTML = `<span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span> <span>[1/3] Đang mã hóa gói tin với thuật toán SHA-256...</span>`;
      if (this.sound && this.sound.playClick) this.sound.playClick(750);
    }, 400);

    // Step 2: Handshaking Gateway
    setTimeout(() => {
      if (progressBar) progressBar.style.width = '70%';
      if (percentEl) percentEl.innerText = '70%';
      if (stepText) stepText.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> <span>[2/3] Bắt tay bảo mật TLS 1.3 với Gateway Hanoi-Node-01...</span>`;
      if (this.sound && this.sound.playClick) this.sound.playClick(820);
    }, 1100);

    // Step 3: Complete & Dispatch
    setTimeout(() => {
      if (progressBar) progressBar.style.width = '100%';
      if (percentEl) percentEl.innerText = '100%';
      if (stepText) stepText.innerHTML = `<span class="w-2 h-2 rounded-full bg-teal-400"></span> <span>[3/3] Gói tin đã truyền thành công vào hàng đợi!</span>`;
      
      const ticketId = 'TX-' + Math.floor(10000 + Math.random() * 90000);
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} - ${now.getDate()}/${now.getMonth() + 1}`;

      const savedItem = {
        ticket: ticketId,
        sender: data.sender,
        email: data.email,
        topic: data.topic,
        priority: data.priority,
        message: data.message,
        timestamp: timeStr
      };

      this.saveMessage(savedItem);

      setTimeout(() => {
        progressBox?.classList.add('hidden');
        successBanner?.classList.remove('hidden');
        
        const ticketEl = document.getElementById('disp-result-ticket');
        if (ticketEl) ticketEl.innerText = ticketId;

        // Update outbox counter
        const outboxToggle = document.getElementById('btn-toggle-outbox');
        const count = this.getStoredMessages().length;
        if (outboxToggle) {
          outboxToggle.innerHTML = `${getIconSvg('archive', 'w-3.5 h-3.5 text-cyan-400')} <span>Hộp Thư Đi (${count})</span>`;
        }

        const outboxList = document.getElementById('disp-outbox-list');
        if (outboxList) {
          outboxList.innerHTML = this.renderOutboxItems(this.getStoredMessages());
        }

        if (this.sound && this.sound.playSuccess) this.sound.playSuccess();
        if (submitBtn) submitBtn.disabled = false;
        this.isTransmitting = false;

        // Unlock achievement
        if (this.achievements) {
          this.achievements.unlock(
            'first_transmission',
            'Signal Transmitted',
            `Đã phát thành công tín hiệu liên lạc mã hóa ${ticketId}!`,
            'radio'
          );
        }
      }, 500);
    }, 1800);
  }
}
