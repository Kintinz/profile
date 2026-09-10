import { getIconSvg } from '../utils/icons.js';
import confetti from 'canvas-confetti';

export class DevQuizArena {
  constructor(container, soundManager, onQuizComplete) {
    this.container = container;
    this.sound = soundManager;
    this.onQuizComplete = onQuizComplete;

    this.currentCategory = 'ALL';

    // NGÂN HÀNG 60+ CÂU HỎI CHUYÊN SÂU TOÀN DIỆN (.NET, GIT, SQL, FRONTEND, DEVOPS, PYTHON/GO/ALGO)
    this.questionsBank = [
      // ==========================================
      // 1. C# & .NET CORE ARCHITECTURE (15 CÂU)
      // ==========================================
      {
        category: 'DOTNET',
        tag: '.NET DI LIFETIME',
        q: 'Trong ASP.NET Core, DbContext của Entity Framework Core nên được đăng ký với Service Lifetime nào?',
        code: 'builder.Services.AddDbContext<AppDbContext>(...);',
        options: ['Transient (Mỗi lần inject tạo mới)', 'Scoped (Duy nhất 1 instance trong suốt 1 HTTP Request)', 'Singleton (Duy nhất 1 instance toàn app)', 'Static Context'],
        correct: 1,
        explain: 'DbContext được thiết kế hoạt động chuẩn xác nhất ở Scoped lifetime để đảm bảo mỗi HTTP request có 1 DbContext riêng biệt, tránh race condition đa luồng.'
      },
      {
        category: 'DOTNET',
        tag: 'EF CORE ASNOTRACKING',
        q: 'Khi thực hiện câu lệnh truy vấn chỉ đọc (read-only) trong Entity Framework Core, phương thức nào giúp tắt change tracking để tối ưu RAM và CPU?',
        code: 'context.Employees.________________.Where(e => e.IsActive);',
        options: ['.AsNoTracking()', '.ReadOnly()', '.DisableCache()', '.ToDetachedList()'],
        correct: 0,
        explain: '.AsNoTracking() ngăn EF Core tạo snapshot theo dõi sự thay đổi của entity trong bộ nhớ, giúp tăng tốc độ truy vấn từ 30-50%.'
      },
      {
        category: 'DOTNET',
        tag: 'LINQ IQUERYABLE VS IENUMERABLE',
        q: 'Sự khác biệt cơ bản giữa IQueryable<T> và IEnumerable<T> trong C# LINQ là gì?',
        options: [
          'IQueryable dịch Expression Tree thành câu SQL chạy ở Database Server, còn IEnumerable tải toàn bộ dữ liệu về RAM rồi mới lọc',
          'IEnumerable hỗ trợ Async còn IQueryable thì không',
          'IQueryable chỉ dùng cho mảng Array',
          'Không có sự khác biệt'
        ],
        correct: 0,
        explain: 'IQueryable cho phép xây dựng câu lệnh SQL tối ưu và lọc tại DB, trong khi IEnumerable thực thi lọc in-memory tại Client.'
      },
      {
        category: 'DOTNET',
        tag: 'ASP.NET CORE MIDDLEWARE',
        q: 'Middleware trong ASP.NET Core được thực thi theo mô hình nào?',
        options: [
          'Mô hình đường ống hai chiều (Russian Doll - Búp bê Nga)',
          'Mô hình FIFO tuyến tính một chiều',
          'Mô hình vòng lặp vô hạn',
          'Mô hình phân tán ngẫu nhiên'
        ],
        correct: 0,
        explain: 'Request đi qua lần lượt từng middleware, sau khi chạm Endpoint sẽ quay ngược lại qua từng middleware theo chiều đối nghịch trước khi trả Response cho Client.'
      },
      {
        category: 'DOTNET',
        tag: 'C# RECORD IMMUTABILITY',
        q: 'Tính năng record (C# 9+) khác biệt nhất với class thông thường ở điểm nào?',
        options: [
          'So sánh bình đẳng dựa trên giá trị (Value-based equality) và hỗ trợ cú pháp with (Immutability)',
          'Không thể chứa thuộc tính',
          'Luôn chạy trên background thread',
          'Bắt buộc phải là static'
        ],
        correct: 0,
        explain: 'Hai instance record có cùng giá trị các trường sẽ bằng nhau (==), trong khi class mặc định so sánh địa chỉ con trỏ ô nhớ (Reference equality).'
      },
      {
        category: 'DOTNET',
        tag: 'C# ASYNC VOID TRAP',
        q: 'Tại sao nên tránh dùng async void trong C# (ngoại trừ Event Handler)?',
        options: [
          'Vì exception văng ra không thể bắt được bằng try-catch bên ngoài và có thể làm crash toàn bộ tiến trình',
          'Vì async void chạy chậm hơn async Task',
          'Vì compiler không cho phép biên dịch',
          'Vì async void chiếm gấp đôi RAM'
        ],
        correct: 0,
        explain: 'Với async void, Caller không có đối tượng Task để await hay theo dõi lỗi, bất kỳ Unhandled Exception nào cũng sẽ bắn thẳng vào SynchronizationContext và làm sập ứng dụng.'
      },
      {
        category: 'DOTNET',
        tag: 'C# YIELD RETURN',
        q: 'Từ khóa yield return trong C# hoạt động như thế nào?',
        code: 'public IEnumerable<int> GetNumbers() { yield return 1; yield return 2; }',
        options: [
          'Tạo ra một Custom State Machine Iterator, sinh phần tử theo cơ chế Lazy / Deferred Execution khi Caller duyệt đến',
          'Tạo một mảng mới trong RAM và trả về ngay',
          'Tạo một Thread mới',
          'Giải phóng bộ nhớ ngay lập tức'
        ],
        correct: 0,
        explain: 'yield return xây dựng một máy trạng thái (state machine), chỉ tính toán và sinh giá trị tiếp theo khi Caller gọi hàm MoveNext().'
      },
      {
        category: 'DOTNET',
        tag: 'C# VALUETASK VS TASK',
        q: 'Khi nào nên sử dụng ValueTask<T> thay cho Task<T> trong C#?',
        options: [
          'Khi kết quả của hàm phần lớn đã có sẵn trong Cache (Synchronously available) để tránh cấp phát ô nhớ trên Heap',
          'Khi hàm mất hơn 10 giây để chạy',
          'Khi làm việc với Database NoSQL',
          'ValueTask luôn thay thế hoàn toàn Task'
        ],
        correct: 0,
        explain: 'ValueTask là struct (Value Type). Nếu phương thức hoàn thành đồng bộ (cache hit), nó không cần cấp phát object trên Managed Heap, giúp giảm áp lực Garbage Collector.'
      },
      {
        category: 'DOTNET',
        tag: 'C# GARBAGE COLLECTION',
        q: 'Các đối tượng có kích thước lớn hơn 85,000 bytes (như mảng byte lớn) trong .NET được quản lý ở phân vùng nhớ nào?',
        options: ['LOH (Large Object Heap)', 'Gen 0', 'Gen 1', 'Stack Memory'],
        correct: 0,
        explain: 'Đối tượng >= 85,000 bytes được cấp phát thẳng vào LOH để tránh chi phí sao chép dịch chuyển bộ nhớ khi GC thu gom.'
      },
      {
        category: 'DOTNET',
        tag: 'C# SPAN<T> & MEMORY<T>',
        q: 'Span<T> trong C# mang lại lợi ích gì vượt trội khi xử lý chuỗi và mảng?',
        options: [
          'Cho phép cắt lát (slice) mảng/bộ nhớ liên tục mà không sinh thêm bất kỳ allocation nào trên Heap',
          'Tự động mã hóa chuỗi theo chuẩn AES',
          'Chuyển code C# sang WebAssembly',
          'Tự động tăng tốc GPU'
        ],
        correct: 0,
        explain: 'Span<T> là ref struct đại diện cho một vùng nhớ liền kề (Stack, Heap, Native), cho phép thao tác con trỏ an toàn với Zero Allocation.'
      },

      // ==========================================
      // 2. GIT CLI & WORKFLOW (12 CÂU)
      // ==========================================
      {
        category: 'GIT',
        tag: 'GIT CHERRY-PICK',
        q: 'Lệnh Git nào cho phép trích xuất một commit cụ thể từ một branch khác và áp dụng vào branch hiện tại?',
        code: 'git ____________ <commit-hash>',
        options: ['git rebase', 'git cherry-pick', 'git merge', 'git pull --single'],
        correct: 1,
        explain: 'git cherry-pick <commit> được dùng để bốc tách 1 commit cụ thể từ nhánh khác và ghép vào nhánh đang làm việc hiện tại mà không cần merge cả nhánh.'
      },
      {
        category: 'GIT',
        tag: 'GIT REFLOG RECOVERY',
        q: 'Bạn vô tình chạy git reset --hard và làm mất commit quan trọng. Lệnh nào giúp xem lại toàn bộ lịch sử di chuyển của con trỏ HEAD để khôi phục?',
        code: 'git ____________',
        options: ['git log -p', 'git reflog', 'git fsck --lost', 'git status -v'],
        correct: 1,
        explain: 'git reflog ghi lại mọi thay đổi của HEAD (kể cả khi reset, rebase hay xóa branch), giúp bạn lấy lại hash commit đã mất dễ dàng.'
      },
      {
        category: 'GIT',
        tag: 'GIT RESET SOFT VS HARD',
        q: 'Sự khác biệt cốt lõi giữa git reset --soft và git reset --hard là gì?',
        options: [
          '--soft giữ nguyên các file thay đổi trong Staging Area, còn --hard xóa sạch mọi thay đổi',
          '--soft xóa commit trên remote, còn --hard chỉ xóa trên local',
          '--soft tạo commit mới, còn --hard phục hồi commit cũ',
          'Không có sự khác biệt'
        ],
        correct: 0,
        explain: 'git reset --soft <commit> quay ngược lại commit nhưng giữ toàn bộ code thay đổi ở trạng thái Staged (sẵn sàng commit lại), còn --hard sẽ xóa sạch vĩnh viễn trong working tree.'
      },
      {
        category: 'GIT',
        tag: 'GIT REBASE SQUASH',
        q: 'Muốn gộp nhiều commit vụn vặt thành 1 commit duy nhất (Squash commit) trước khi tạo Pull Request, bạn dùng lệnh gì?',
        code: 'git rebase -i HEAD~<N>',
        options: ['git merge --squash', 'git rebase -i (Interactive Rebase)', 'git commit --amend', 'Cả A và B đều đúng'],
        correct: 3,
        explain: 'Cả git rebase -i (chọn pick/squash) và git merge --squash đều là các phương thức phổ biến để gộp sạch lịch sử commit.'
      },
      {
        category: 'GIT',
        tag: 'GIT BISECT DEBUG',
        q: 'Lệnh Git nào dùng thuật toán tìm kiếm nhị phân (Binary Search) để dò tìm chính xác commit gây ra lỗi hồi quy (bug)?',
        code: 'git ____________ start',
        options: ['git bisect', 'git blame', 'git diff-tree', 'git trace'],
        correct: 0,
        explain: 'git bisect cho phép đánh dấu commit "good" và "bad", sau đó tự động binary search để tìm ra commit đầu tiên sinh ra lỗi.'
      },
      {
        category: 'GIT',
        tag: 'GIT STASH POP',
        q: 'Khi đang code dở cần switch nhánh gấp, bạn dùng git stash. Lệnh nào lấy lại code dở VÀ đồng thời xóa nó khỏi danh sách stash?',
        code: 'git stash ____________',
        options: ['git stash apply', 'git stash pop', 'git stash drop', 'git stash restore'],
        correct: 1,
        explain: 'git stash pop áp dụng các thay đổi gần nhất và xóa luôn bản ghi đó khỏi stash stack (khác với apply là giữ lại).'
      },
      {
        category: 'GIT',
        tag: 'GIT REVERT VS RESET',
        q: 'Khi cần hủy bỏ một commit đã đẩy lên nhánh main trên remote mà không làm sai lệch lịch sử của các thành viên khác, cách an toàn nhất là gì?',
        options: ['git revert <commit-hash>', 'git reset --hard HEAD~1', 'git push --force', 'Xóa branch tạo lại'],
        correct: 0,
        explain: 'git revert tạo một commit mới đảo ngược lại toàn bộ thay đổi của commit cũ, giữ nguyên lịch sử tuyến tính và tuyệt đối an toàn cho team.'
      },

      // ==========================================
      // 3. SQL SERVER & DATABASE (12 CÂU)
      // ==========================================
      {
        category: 'SQL',
        tag: 'SQL CLUSTERED INDEX',
        q: 'Tại sao một bảng trong SQL Server chỉ có thể có DUY NHẤT 1 Clustered Index?',
        options: [
          'Vì dữ liệu vật lý trên ổ đĩa được sắp xếp trực tiếp theo thứ tự của Clustered Index',
          'Do giới hạn phiên bản SQL Express',
          'Vì Clustered Index chiếm hết RAM của server',
          'Do câu lệnh CREATE TABLE quy định'
        ],
        correct: 0,
        explain: 'Dữ liệu các dòng trong bảng vật lý (data pages) chỉ có thể được sắp xếp theo một trật tự vật lý duy nhất, đó chính là Clustered Key.'
      },
      {
        category: 'SQL',
        tag: 'SQL COVERING INDEX',
        q: 'Mệnh đề INCLUDE trong câu lệnh CREATE NONCLUSTERED INDEX mang lại lợi ích gì?',
        code: 'CREATE INDEX IX_Orders ON Orders(CustomerPhone) INCLUDE(TotalAmount, Status);',
        options: [
          'Tạo Covering Index, giúp query lấy được các cột cần thiết mà không phải tốn chi phí Key Lookup về bảng Clustered',
          'Tự động mã hóa cột được include',
          'Bắt buộc cột include không được null',
          'Tự động nén bảng'
        ],
        correct: 0,
        explain: 'INCLUDE lưu trữ các cột bổ sung ở tầng lá (leaf level) của Index cây B-Tree, giúp câu truy vấn trở thành Covering Query với số lần đọc đĩa tối thiểu.'
      },
      {
        category: 'SQL',
        tag: 'SQL WINDOW FUNCTIONS',
        q: 'Hàm nào giúp đánh số thứ tự phân trang trong SQL Server và không bị trùng số thứ tự khi các dòng có giá trị bằng nhau?',
        options: ['ROW_NUMBER()', 'RANK()', 'DENSE_RANK()', 'NTILE()'],
        correct: 0,
        explain: 'ROW_NUMBER() luôn trả về số nguyên liên tục 1, 2, 3... cho từng dòng bất kể giá trị trùng lặp (khác với RANK() sẽ bị nhảy cóc số thứ tự).'
      },
      {
        category: 'SQL',
        tag: 'SQL CTE RECURSIVE',
        q: 'Cấu trúc nào trong SQL Server hỗ trợ truy vấn đệ quy cây phân cấp danh mục / cây sơ đồ tổ chức phòng ban?',
        options: ['Common Table Expression (WITH CTE)', 'CROSS JOIN', 'PIVOT', 'CURSOR'],
        correct: 0,
        explain: 'Recursive CTE cho phép gọi lại chính nó thông qua UNION ALL để duyệt toàn bộ cấu trúc cha-con (Tree hierarchy).'
      },
      {
        category: 'SQL',
        tag: 'SQL ACID CONSISTENCY',
        q: 'Chữ C trong nguyên tắc ACID của giao dịch cơ sở dữ liệu (Transaction) đại diện cho từ nào?',
        options: ['Consistency (Tính nhất quán)', 'Concurrency (Tính đồng thời)', 'Caching (Bộ nhớ đệm)', 'Commit (Xác nhận)'],
        correct: 0,
        explain: 'ACID: Atomicity (Nguyên tử), Consistency (Nhất quán dữ liệu theo ràng buộc/rules), Isolation (Cô lập), Durability (Bền vững).'
      },
      {
        category: 'SQL',
        tag: 'SQL ISOLATION LEVELS',
        q: 'Mức cô lập giao dịch (Isolation Level) nào ngăn chặn hoàn toàn hiện tượng Dirty Read, Non-Repeatable Read và Phantom Read?',
        options: ['SERIALIZABLE', 'READ COMMITTED', 'READ UNCOMMITTED', 'REPEATABLE READ'],
        correct: 0,
        explain: 'SERIALIZABLE khóa phạm vi Range Lock, cô lập tuyệt đối và ngăn chặn triệt để cả 3 hiện tượng xung đột dữ liệu.'
      },

      // ==========================================
      // 4. FRONTEND & TYPESCRIPT (10 CÂU)
      // ==========================================
      {
        category: 'FRONTEND',
        tag: 'ANGULAR ONPUSH',
        q: 'Chiến lược phát hiện thay đổi ChangeDetectionStrategy.OnPush trong Angular kích hoạt render lại khi nào?',
        options: [
          'Khi @Input() thay đổi tham chiếu (reference) hoặc có DOM Event kích hoạt từ chính component',
          'Bất cứ khi nào có biến thay đổi trong app',
          'Mỗi 500ms',
          'Khi scroll màn hình'
        ],
        correct: 0,
        explain: 'OnPush bỏ qua việc duyệt lại component tree nếu @Input references không đổi, tăng vọt hiệu năng ứng dụng.'
      },
      {
        category: 'FRONTEND',
        tag: 'RXJS SWITCHMAP',
        q: 'Khi xây dựng ô tìm kiếm gợi ý (Autocomplete Search), toán tử RxJS nào tự động hủy request API cũ nếu có ký tự mới được gõ?',
        options: ['switchMap', 'mergeMap', 'concatMap', 'exhaustMap'],
        correct: 0,
        explain: 'switchMap tự động unsubscribe (hủy bỏ) Observable bên trong trước đó ngay khi nhận được giá trị mới, tránh race condition kết quả tìm kiếm.'
      },
      {
        category: 'FRONTEND',
        tag: 'JS EVENT LOOP',
        q: 'Trong JavaScript Event Loop, Promise.then() được xếp vào hàng đợi nào?',
        options: ['Microtask Queue (Ưu tiên chạy trước Macrotask)', 'Macrotask Queue', 'Render Queue', 'Call Stack trực tiếp'],
        correct: 0,
        explain: 'Microtask Queue (gồm Promise callback, queueMicrotask) luôn được Event Loop giải phóng toàn bộ trước khi chuyển sang Macrotask (setTimeout, setInterval).'
      },
      {
        category: 'FRONTEND',
        tag: 'TYPESCRIPT UTILITY TYPES',
        q: 'Trong TypeScript, Utility Type nào tạo ra một kiểu mới bằng cách chọn ra một tập hợp các thuộc tính cụ thể từ kiểu gốc T?',
        code: 'type UserPreview = ___________<User, "id" | "name">;',
        options: ['Pick<T, K>', 'Omit<T, K>', 'Partial<T>', 'Record<K, T>'],
        correct: 0,
        explain: 'Pick<T, K> trích xuất chính xác các thuộc tính K từ T. Ngược lại, Omit<T, K> loại bỏ các thuộc tính K.'
      },
      {
        category: 'FRONTEND',
        tag: 'SIGNALR PROTOCOLS',
        q: 'SignalR trong .NET tự động lựa chọn giao thức truyền tải dữ liệu thời gian thực theo thứ tự ưu tiên nào?',
        options: [
          'WebSockets -> Server-Sent Events (SSE) -> Long Polling',
          'Long Polling -> WebSockets -> HTTP Post',
          'Server-Sent Events -> WebSockets -> UDP',
          'Chỉ hỗ trợ duy nhất WebSockets'
        ],
        correct: 0,
        explain: 'SignalR luôn ưu tiên WebSockets (song công toàn phần). Nếu client hoặc proxy không hỗ trợ, nó sẽ tự động fallback xuống SSE và cuối cùng là Long Polling.'
      },

      // ==========================================
      // 5. DEVOPS, DOCKER & LINUX (8 CÂU)
      // ==========================================
      {
        category: 'DEVOPS',
        tag: 'DOCKER MULTI-STAGE',
        q: 'Tại sao nên áp dụng Multi-stage build trong Dockerfile cho ứng dụng ASP.NET Core?',
        options: [
          'Giảm kích thước Image từ ~800MB (.NET SDK) xuống chỉ còn ~100MB (.NET Runtime) và bảo mật mã nguồn',
          'Tăng tốc độ mạng Internet của container',
          'Tự động sao lưu database',
          'Bắt buộc bởi Docker Desktop'
        ],
        correct: 0,
        explain: 'Multi-stage build dùng SDK image để build/publish, sau đó chỉ sao chép file dll vào Runtime image gọn nhẹ, loại bỏ toàn bộ file rác và source code thừa.'
      },
      {
        category: 'DEVOPS',
        tag: 'LINUX PERMISSIONS CHMOD',
        q: 'Lệnh Linux nào cấp quyền Đọc (Read), Ghi (Write) và Thực thi (Execute) cho chủ sở hữu, chỉ Đọc và Thực thi cho nhóm và người khác?',
        options: ['chmod 755 <file>', 'chmod 777 <file>', 'chmod 644 <file>', 'chown root <file>'],
        correct: 0,
        explain: '7 = rwx (4+2+1), 5 = r-x (4+0+1). Do đó 755 là chuẩn phân quyền phổ biến cho các file script/thư mục trên server.'
      },
      {
        category: 'DEVOPS',
        tag: 'LINUX GREP SEARCH',
        q: 'Lệnh Linux nào giúp tìm kiếm chuỗi "Exception" đệ quy trong toàn bộ các file thuộc thư mục hiện tại?',
        code: 'grep -___________ "Exception" .',
        options: ['-rnw', '-abc', '-kill', '-find'],
        correct: 0,
        explain: 'grep -rnw: -r (recursive đệ quy), -n (line number hiển thị dòng), -w (match exact whole word).'
      },

      // ==========================================
      // 6. PYTHON, GO & ALGORITHMS (6 CÂU)
      // ==========================================
      {
        category: 'OTHER',
        tag: 'ALGORITHMS TIME COMPLEXITY',
        q: 'Độ phức tạp thời gian trung bình (Average Time Complexity) của thuật toán sắp xếp nhanh QuickSort là bao nhiêu?',
        options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'],
        correct: 0,
        explain: 'QuickSort đạt O(n log n) trong trường hợp trung bình, chỉ rơi vào O(n²) khi chọn pivot tệ nhất (mảng đã sắp xếp).'
      },
      {
        category: 'OTHER',
        tag: 'PYTHON MUTABLE DEFAULT ARG',
        q: 'Trong Python, điều gì xảy ra nếu bạn truyền một list rỗng làm default argument: def add(val, lst=[])?',
        options: [
          'List này chỉ khởi tạo một lần duy nhất khi hàm được định nghĩa, các lần gọi tiếp theo sẽ tích lũy dữ liệu cũ',
          'Mỗi lần gọi hàm một list mới được tạo ra',
          'Báo lỗi SyntaxError',
          'Python tự động xóa sau mỗi lần gọi'
        ],
        correct: 0,
        explain: 'Default arguments trong Python được evaluate một lần duy nhất lúc hàm được biên dịch, dẫn đến việc list mutable được chia sẻ giữa mọi lần gọi.'
      },
      {
        category: 'OTHER',
        tag: 'GOLANG GOROUTINES',
        q: 'Trong ngôn ngữ Go (Golang), từ khóa nào dùng để khởi chạy một tác vụ bất đồng bộ cực nhẹ (Goroutine)?',
        code: '___________ processOrder(order);',
        options: ['go', 'async', 'spawn', 'thread'],
        correct: 0,
        explain: 'Từ khóa go khởi tạo một Goroutine chạy trên Go runtime scheduler, chỉ tiêu tốn khoảng 2KB bộ nhớ stack ban đầu.'
      }
    ];

    this.currentQuestions = [];
    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.timer = 15;
    this.timerInterval = null;
    this.isAnswered = false;
    this.isPaused = false;
    this.difficulty = 'normal';
    this.timePerQuestion = 15;
    this.scoreMultiplier = 1.5;

    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="w-full code-font select-none">
        
        <!-- Category Filter Bar -->
        <div class="flex flex-wrap items-center justify-between gap-2.5 pb-4 mb-4 border-b border-amber-500/20 text-xs">
          <span class="text-[10px] font-black text-amber-400/80 uppercase tracking-widest flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            CHỌN CHUYÊN MÔN
          </span>
          <div class="flex flex-wrap gap-2 text-xs" id="quiz-cat-buttons">
            <button data-cat="ALL" class="cat-btn px-3 py-1.5 rounded-xl font-bold bg-amber-500/20 text-amber-300 border border-amber-500/50 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              Tất Cả (60+)
            </button>
            <button data-cat="DOTNET" class="cat-btn px-3 py-1.5 rounded-xl font-bold bg-slate-950/80 text-slate-300 border border-white/10 hover:border-purple-400/50 hover:text-white transition-all">
              .NET & C#
            </button>
            <button data-cat="GIT" class="cat-btn px-3 py-1.5 rounded-xl font-bold bg-slate-950/80 text-slate-300 border border-white/10 hover:border-orange-400/50 hover:text-white transition-all">
              Git CLI
            </button>
            <button data-cat="SQL" class="cat-btn px-3 py-1.5 rounded-xl font-bold bg-slate-950/80 text-slate-300 border border-white/10 hover:border-emerald-400/50 hover:text-white transition-all">
              SQL Server
            </button>
            <button data-cat="FRONTEND" class="cat-btn px-3 py-1.5 rounded-xl font-bold bg-slate-950/80 text-slate-300 border border-white/10 hover:border-cyan-400/50 hover:text-white transition-all">
              Frontend / TS
            </button>
            <button data-cat="DEVOPS" class="cat-btn px-3 py-1.5 rounded-xl font-bold bg-slate-950/80 text-slate-300 border border-white/10 hover:border-blue-400/50 hover:text-white transition-all">
              Docker / Linux
            </button>
            <button data-cat="OTHER" class="cat-btn px-3 py-1.5 rounded-xl font-bold bg-slate-950/80 text-slate-300 border border-white/10 hover:border-yellow-400/50 hover:text-white transition-all">
              Python / Go
            </button>
          </div>
        </div>

        <!-- Header status HUD with Digital LCDs -->
        <div class="flex flex-wrap items-center justify-between pb-4 mb-5 border-b border-amber-500/20 text-xs gap-3">
          <div class="flex items-center gap-2.5">
            <span class="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-300 font-bold border border-amber-500/30 text-xs tracking-wider" id="quiz-cat">GIT WORKFLOW</span>
            <span class="text-slate-400 font-bold text-xs bg-slate-950/80 border border-white/10 px-2.5 py-1 rounded-xl" id="quiz-counter">Câu 1 / 5</span>
          </div>

          <div class="flex items-center gap-2.5 sm:gap-3">
            <select id="quiz-diff-select" class="cyber-select px-3 py-1.5 rounded-xl bg-slate-950 border border-amber-500/40 text-amber-300 font-bold text-xs focus:outline-none focus:border-amber-400 transition-all cursor-pointer shadow-sm">
              <option value="easy">25s (Thực Tập)</option>
              <option value="normal" selected>15s (Senior)</option>
              <option value="hard">8s (Hackathon Rush)</option>
            </select>

            <div class="bg-slate-950/90 border border-amber-500/40 px-3 py-1.5 rounded-2xl text-center shadow-[0_0_15px_rgba(245,158,11,0.15)] min-w-[58px]">
              <span class="text-[9px] text-amber-400/80 uppercase font-bold block">COMBO</span>
              <span id="quiz-streak" class="digital-lcd text-base font-black text-amber-300 tracking-wider">0x</span>
            </div>

            <div class="bg-slate-950/90 border border-emerald-500/40 px-3.5 py-1.5 rounded-2xl text-center shadow-[0_0_15px_rgba(16,185,129,0.15)] min-w-[64px]">
              <span class="text-[9px] text-emerald-400/80 uppercase font-bold block">ĐIỂM</span>
              <span id="quiz-score" class="digital-lcd text-base font-black text-emerald-300 tracking-wider">0</span>
            </div>

            <div class="flex items-center gap-1.5">
              <button id="btn-quiz-pause" class="px-3 py-1.5 rounded-xl bg-slate-950 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-bold transition-all flex items-center gap-1 active:scale-95">
                ${getIconSvg('pause', 'w-3.5 h-3.5')} <span>Tạm Dừng</span>
              </button>
              <button id="btn-quiz-reset" class="px-3 py-1.5 rounded-xl bg-slate-950 border border-white/15 text-slate-300 hover:text-white hover:border-amber-400 text-xs font-bold transition-all flex items-center gap-1 active:scale-95">
                ${getIconSvg('rotate-ccw', 'w-3.5 h-3.5')} <span>Làm Mới</span>
              </button>
            </div>

            <!-- Glowing Circular Countdown Timer -->
            <div class="w-11 h-11 rounded-2xl bg-slate-950 border-2 border-cyan-400 flex items-center justify-center font-black text-cyan-300 digital-lcd text-base shadow-[0_0_15px_rgba(6,182,212,0.3)] shrink-0" id="quiz-timer">
              15
            </div>
          </div>
        </div>

        <!-- Question View with Cyber HUD Frame -->
        <div class="relative p-4 sm:p-6 bg-slate-950/80 rounded-2xl border border-amber-500/30 overflow-hidden shadow-2xl" id="quiz-question-area">
          <div class="corner-bracket-tl border-amber-400"></div>
          <div class="corner-bracket-tr border-amber-400"></div>
          <div class="corner-bracket-bl border-amber-400"></div>
          <div class="corner-bracket-br border-amber-400"></div>
          <div class="cyber-scanlines absolute inset-0 z-10 opacity-15 pointer-events-none"></div>

          <h3 class="relative z-20 text-sm sm:text-base font-black text-white mb-3.5 leading-relaxed" id="quiz-question-text"></h3>

          <!-- Code Snippet Box (IDE Terminal Window) -->
          <div id="quiz-code-box" class="hidden relative z-20 bg-black/90 p-4 rounded-2xl border border-emerald-500/30 text-xs text-emerald-300 font-mono overflow-x-auto mb-4 shadow-inner">
            <div class="flex items-center gap-1.5 pb-2 mb-2 border-b border-white/10 text-[10px] text-slate-500">
              <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span class="ml-2 text-slate-400 font-bold uppercase tracking-wider">SOURCE CODE SNIPPET</span>
            </div>
          </div>

          <!-- Options Grid -->
          <div id="quiz-options-list" class="relative z-20 space-y-2.5 pt-1"></div>

          <!-- Explanation box -->
          <div id="quiz-explain-box" class="relative z-20 hidden p-4 sm:p-5 rounded-2xl bg-slate-950 border border-cyan-500/50 text-xs text-slate-300 space-y-2.5 shadow-2xl mt-4">
            <div class="flex items-center gap-2 font-bold text-sm" id="quiz-explain-title"></div>
            <p id="quiz-explain-text" class="leading-relaxed text-slate-300 text-xs sm:text-sm"></p>
            <button id="btn-next-question" class="mt-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-black text-xs hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2 hover:scale-105 active:scale-95">
              <span>Câu Tiếp Theo</span> ${getIconSvg('arrow-right', 'w-3.5 h-3.5')}
            </button>
          </div>
        </div>

        <!-- Result View (Hidden initially) -->
        <div id="quiz-result-area" class="hidden text-center py-6 space-y-4">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-yellow-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 mx-auto mb-2 shadow-xl shadow-amber-500/30 animate-bounce" id="result-icon">
            ${getIconSvg('trophy', 'w-9 h-9', 36)}
          </div>
          <h4 class="text-xl font-black text-white" id="result-rank">SENIOR FULLSTACK WARRIOR</h4>
          <p class="text-xs text-slate-300 max-w-md mx-auto" id="result-desc"></p>
          <div class="bg-slate-950/80 border border-white/10 rounded-2xl p-4 max-w-sm mx-auto flex justify-around text-xs">
            <div><span class="text-slate-500 block text-[10px]">TỔNG ĐIỂM</span><span id="final-score" class="digital-lcd text-emerald-300 font-bold text-xl">0</span></div>
            <div><span class="text-slate-500 block text-[10px]">CHÍNH XÁC</span><span id="final-accuracy" class="digital-lcd text-cyan-300 font-bold text-xl">0%</span></div>
          </div>
          <button id="btn-restart-quiz" class="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-400 text-slate-950 font-black text-xs shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 mx-auto active:scale-95">
            ${getIconSvg('swords', 'w-4 h-4')} <span>Thách Đấu Lại Đợt Mới</span>
          </button>
        </div>
      </div>
    `;

    this.catEl = this.container.querySelector('#quiz-cat');
    this.counterEl = this.container.querySelector('#quiz-counter');
    this.streakEl = this.container.querySelector('#quiz-streak');
    this.scoreEl = this.container.querySelector('#quiz-score');
    this.timerEl = this.container.querySelector('#quiz-timer');
    this.questionTextEl = this.container.querySelector('#quiz-question-text');
    this.codeBoxEl = this.container.querySelector('#quiz-code-box');
    this.optionsListEl = this.container.querySelector('#quiz-options-list');
    this.explainBoxEl = this.container.querySelector('#quiz-explain-box');
    this.explainTitleEl = this.container.querySelector('#quiz-explain-title');
    this.explainTextEl = this.container.querySelector('#quiz-explain-text');
    this.nextBtnEl = this.container.querySelector('#btn-next-question');

    this.questionAreaEl = this.container.querySelector('#quiz-question-area');
    this.resultAreaEl = this.container.querySelector('#quiz-result-area');
    this.restartBtnEl = this.container.querySelector('#btn-restart-quiz');
    const pauseBtn = this.container.querySelector('#btn-quiz-pause');
    const resetBtn = this.container.querySelector('#btn-quiz-reset');

    // Category button handlers
    const catButtons = this.container.querySelectorAll('.cat-btn');
    catButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.sound.playClick(500);
        this.currentCategory = btn.dataset.cat;
        catButtons.forEach(b => {
          b.className = 'cat-btn px-2.5 py-1 rounded-xl font-bold bg-slate-950 text-slate-300 border border-white/10 hover:text-white transition-all';
        });
        btn.className = 'cat-btn px-2.5 py-1 rounded-xl font-bold bg-cyan-500 text-slate-950 shadow-md transition-all';
        this.start();
      });
    });

    const diffSelectEl = this.container.querySelector('#quiz-diff-select');
    if (diffSelectEl) {
      diffSelectEl.value = this.difficulty;
      diffSelectEl.addEventListener('change', (e) => {
        this.setDifficulty(e.target.value);
        this.start();
      });
    }

    if (pauseBtn) pauseBtn.addEventListener('click', () => {
      this.sound.playClick(500);
      this.togglePause();
      pauseBtn.innerHTML = this.isPaused ? `<span class="flex items-center gap-1">${getIconSvg('play', 'w-3 h-3 fill-current')} <span>Tiếp Tục</span></span>` : `<span class="flex items-center gap-1">${getIconSvg('pause', 'w-3 h-3')} <span>Tạm Dừng</span></span>`;
    });

    if (resetBtn) resetBtn.addEventListener('click', () => {
      this.sound.playClick(600);
      this.reset();
    });

    this.nextBtnEl.addEventListener('click', () => this.nextQuestion());
    this.restartBtnEl.addEventListener('click', () => this.start());

    this.start();
  }

  setDifficulty(level) {
    this.difficulty = level || 'normal';
    if (this.difficulty === 'easy') {
      this.timePerQuestion = 25;
      this.scoreMultiplier = 1.0;
    } else if (this.difficulty === 'hard') {
      this.timePerQuestion = 8;
      this.scoreMultiplier = 2.5;
    } else { // normal
      this.timePerQuestion = 15;
      this.scoreMultiplier = 1.5;
    }
  }

  start() {
    this.score = 0;
    this.streak = 0;
    this.currentIndex = 0;
    this.isPaused = false;
    this.setDifficulty(this.difficulty);
    this.scoreEl.textContent = '0';
    this.streakEl.innerHTML = `<span class="flex items-center gap-1 text-amber-400">${getIconSvg('flame', 'w-3 h-3 text-amber-400')} <span>0x</span></span>`;

    // Filter by selected category
    let pool = this.questionsBank;
    if (this.currentCategory !== 'ALL') {
      pool = this.questionsBank.filter(q => q.category === this.currentCategory);
      if (pool.length === 0) pool = this.questionsBank;
    }

    // Randomize 5 questions from selected pool
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    this.currentQuestions = shuffled.slice(0, 5);

    this.questionAreaEl.classList.remove('hidden');
    this.resultAreaEl.classList.add('hidden');
    this.loadQuestion();
  }

  loadQuestion() {
    if (this.currentIndex >= this.currentQuestions.length) {
      this.showResult();
      return;
    }

    this.isAnswered = false;
    this.explainBoxEl.classList.add('hidden');
    const q = this.currentQuestions[this.currentIndex];

    this.catEl.textContent = q.tag || q.category;
    this.counterEl.textContent = `Câu ${this.currentIndex + 1} / ${this.currentQuestions.length}`;
    this.questionTextEl.textContent = q.q;

    if (q.code) {
      this.codeBoxEl.textContent = q.code;
      this.codeBoxEl.classList.remove('hidden');
    } else {
      this.codeBoxEl.classList.add('hidden');
    }

    this.optionsListEl.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];

    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'w-full text-left p-3 sm:p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 hover:border-cyan-400/60 hover:bg-cyan-500/5 transition-all flex items-start gap-3 group';
      btn.innerHTML = `
        <span class="w-6 h-6 rounded-lg bg-slate-900 border border-white/20 flex items-center justify-center font-bold text-xs text-slate-400 group-hover:text-cyan-300 group-hover:border-cyan-400/40 shrink-0">
          ${letters[idx]}
        </span>
        <span class="text-xs sm:text-sm text-slate-200 leading-snug pt-0.5">${opt}</span>
      `;
      btn.addEventListener('click', () => this.handleAnswer(idx, btn));
      this.optionsListEl.appendChild(btn);
    });

    this.startTimer();
  }

  startTimer() {
    clearInterval(this.timerInterval);
    this.timer = this.timePerQuestion || 15;
    this.timerEl.textContent = this.timer.toString();
    this.timerEl.className = 'w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-cyan-400 flex items-center justify-center font-bold text-cyan-300 text-xs shrink-0';

    this.timerInterval = setInterval(() => {
      if (this.isPaused) return;
      this.timer--;
      this.timerEl.textContent = this.timer.toString();

      if (this.timer <= 3) {
        this.timerEl.className = 'w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-red-500 flex items-center justify-center font-bold text-red-400 text-xs animate-pulse shrink-0';
      }

      if (this.timer <= 0) {
        clearInterval(this.timerInterval);
        this.handleTimeout();
      }
    }, 1000);
  }

  handleAnswer(selectedIdx, btnEl) {
    if (this.isAnswered) return;
    this.isAnswered = true;
    clearInterval(this.timerInterval);

    const q = this.currentQuestions[this.currentIndex];
    const isCorrect = selectedIdx === q.correct;
    const allBtns = this.optionsListEl.querySelectorAll('button');

    allBtns.forEach((b, idx) => {
      b.disabled = true;
      if (idx === q.correct) {
        b.className = 'w-full text-left p-3 sm:p-3.5 rounded-2xl bg-emerald-500/10 border-2 border-emerald-400 text-white flex items-start gap-3 shadow-lg shadow-emerald-500/20';
      }
    });

    if (isCorrect) {
      this.sound.playSuccess();
      this.streak++;
      const bonus = this.streak * 20;
      const basePts = (100 + bonus + this.timer * 5);
      const pts = Math.round(basePts * (this.scoreMultiplier || 1.5));
      this.score += pts;
      this.scoreEl.textContent = this.score.toString();
      this.streakEl.innerHTML = `<span class="flex items-center gap-1 text-amber-400">${getIconSvg('flame', 'w-3 h-3 text-amber-400')} <span>${this.streak}x</span></span>`;

      this.explainTitleEl.innerHTML = `<span class="text-emerald-400 flex items-center gap-1.5">${getIconSvg('check-circle-2', 'w-4 h-4')} <span>CHÍNH XÁC! +${pts} PTS</span></span>`;
      this.explainBoxEl.className = 'p-4 rounded-2xl bg-slate-950/95 border border-emerald-500/40 text-xs text-slate-300 space-y-2 animate-fade-in mt-4';
    } else {
      this.sound.playExplosion();
      this.streak = 0;
      this.streakEl.innerHTML = `<span class="flex items-center gap-1 text-slate-500">${getIconSvg('flame', 'w-3 h-3 text-slate-500')} <span>0x</span></span>`;
      btnEl.className = 'w-full text-left p-3 sm:p-3.5 rounded-2xl bg-rose-500/10 border-2 border-rose-500 text-white flex items-start gap-3 shadow-lg shadow-rose-500/20';

      this.explainTitleEl.innerHTML = `<span class="text-rose-400 flex items-center gap-1.5">${getIconSvg('alert-circle', 'w-4 h-4')} <span>CHƯA CHÍNH XÁC!</span></span>`;
      this.explainBoxEl.className = 'p-4 rounded-2xl bg-slate-950/95 border border-rose-500/40 text-xs text-slate-300 space-y-2 animate-fade-in mt-4';
    }

    this.explainTextEl.textContent = q.explain;
    this.explainBoxEl.classList.remove('hidden');
  }

  handleTimeout() {
    this.isAnswered = true;
    this.sound.playClick(200);
    this.streak = 0;
    this.streakEl.innerHTML = `<span class="flex items-center gap-1 text-slate-500">${getIconSvg('flame', 'w-3 h-3 text-slate-500')} <span>0x</span></span>`;

    const q = this.currentQuestions[this.currentIndex];
    const allBtns = this.optionsListEl.querySelectorAll('button');
    allBtns.forEach((b, idx) => {
      b.disabled = true;
      if (idx === q.correct) {
        b.className = 'w-full text-left p-3 sm:p-3.5 rounded-2xl bg-emerald-500/10 border-2 border-emerald-400 text-white flex items-start gap-3 shadow-lg shadow-emerald-500/20';
      }
    });

    this.explainTitleEl.innerHTML = `<span class="text-amber-400 flex items-center gap-1.5">${getIconSvg('alert-circle', 'w-4 h-4')} <span>HẾT THỜI GIAN SUY NGHĨ!</span></span>`;
    this.explainTextEl.textContent = q.explain;
    this.explainBoxEl.className = 'p-4 rounded-2xl bg-slate-950/95 border border-amber-500/40 text-xs text-slate-300 space-y-2 animate-fade-in mt-4';
    this.explainBoxEl.classList.remove('hidden');
  }

  nextQuestion() {
    this.sound.playClick(600);
    this.currentIndex++;
    this.loadQuestion();
  }

  showResult() {
    clearInterval(this.timerInterval);
    this.questionAreaEl.classList.add('hidden');
    this.resultAreaEl.classList.remove('hidden');

    const finalScoreEl = this.container.querySelector('#final-score');
    const finalAccEl = this.container.querySelector('#final-accuracy');
    const rankEl = this.container.querySelector('#result-rank');
    const descEl = this.container.querySelector('#result-desc');

    finalScoreEl.textContent = this.score.toString();
    const correctCount = Math.round(this.score / 150);
    const acc = Math.min(100, Math.round((correctCount / 5) * 100));
    finalAccEl.textContent = acc + '%';

    if (this.score >= 600) {
      rankEl.textContent = 'SENIOR ARCHITECT // EXPERT';
      descEl.textContent = 'Bạn đã thể hiện trình độ đỉnh cao về tư duy thiết kế hệ thống, tối ưu SQL, làm chủ Git và C# .NET Core!';
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    } else if (this.score >= 350) {
      rankEl.textContent = 'MID-LEVEL FULLSTACK WARRIOR';
      descEl.textContent = 'Kiến thức kỹ thuật rất vững chắc! Hãy tiếp tục rèn luyện để vươn tới cấp độ Principal / Tech Lead.';
    } else {
      rankEl.textContent = 'JUNIOR DEVELOPER APPRENTICE';
      descEl.textContent = 'Cơ hội tuyệt vời để học hỏi và tích lũy kinh nghiệm thực chiến từ các giải thích chi tiết!';
    }

    if (this.onQuizComplete) this.onQuizComplete(this.score);
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    return this.isPaused;
  }

  resume() {
    this.isPaused = false;
  }

  reset() {
    clearInterval(this.timerInterval);
    this.start();
  }
}
