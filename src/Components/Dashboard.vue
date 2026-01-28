<template>
  <div class="dashboard-container">
    <main class="main-wrapper">
      <div class="main-content">
        
        <header class="main-header">
          <div class="header-text">
            <h1>Thống kê Social Media</h1>
            <p>Chào ngày mới! Đây là hiệu suất team của bạn.</p>
          </div>
          <button class="btn-add-post" @click="showAddPostModal = true">
            <i class="bi bi-plus-lg"></i> Thêm Post mới
          </button>
        </header>

        <section class="kpi-grid">
          <div class="kpi-card bg-blue">
            <div class="kpi-info">
              <small>TỔNG BÀI ĐĂNG</small>
              <h2>{{ posts.length }}</h2>
            </div>
            <i class="bi bi-send-fill kpi-icon"></i>
          </div>
          <div class="kpi-card bg-green">
            <div class="kpi-info">
              <small>TỶ LỆ HOÀN THÀNH</small>
              <h2>92%</h2>
            </div>
            <i class="bi bi-patch-check-fill kpi-icon"></i>
          </div>
          <div class="kpi-card bg-orange">
            <div class="kpi-info">
              <small>SOCIAL HOT NHẤT</small>
              <h2>TIKTOK</h2>
            </div>
            <i class="bi bi-fire kpi-icon"></i>
          </div>
        </section>

        <div class="content-grid">
          <div class="data-card chart-box">
            <h3>Tần suất đăng bài theo tuần</h3>
            <div class="chart-visual">
              <div
                v-for="(stat, i) in weeklyStats"
                :key="i"
                class="bar-col"
                :style="{ height: stat.percent + '%' }"
              >
                <span class="bar-tooltip">{{ stat.count }}</span>
              </div>
            </div>
            <div class="chart-labels">
              <span>T2</span><span>T3</span><span>T4</span>
              <span>T5</span><span>T6</span><span>T7</span><span>CN</span>
            </div>
          </div>

          <div class="data-card table-box">
            <div class="table-header">
              <h3>Lịch sử bài đăng</h3>
              <span class="badge-status">Mới cập nhật</span>
            </div>
            <div class="table-responsive">
              <table class="modern-table">
                <thead>
                  <tr>
                    <th>Nhân viên</th>
                    <th>Nền tảng</th>
                    <th>Thời gian</th>
                    <th class="text-end">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="post in reversedPosts" :key="post.id">
                    <td class="user-cell">{{ post.userName }}</td>
                    <td><span class="platform-tag">{{ post.platform }}</span></td>
                    <td class="time-cell text-muted">{{ formatDate(post.date) }}</td>
                    <td class="text-end">
                      <span class="status-done">● Hoàn thành</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>

  <!-- ADD POST MODAL -->
  <div v-if="showAddPostModal" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Thêm Bài Đăng Mới</h3>
        <button class="close-btn" @click="closeModal"><i class="bi bi-x-lg"></i></button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>Nhân viên</label>
          <input v-model="newPost.userName" type="text" placeholder="Nhập tên nhân viên..." />
        </div>
        <div class="form-group">
          <label>Nền tảng</label>
          <select v-model="newPost.platform">
            <option value="TikTok">TikTok</option>
            <option value="Facebook">Facebook</option>
            <option value="Instagram">Instagram</option>
            <option value="Youtube">Youtube</option>
          </select>
        </div>
        <div class="form-group">
          <label>Ngày đăng</label>
          <input v-model="newPost.date" type="date" />
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-cancel" @click="closeModal">Hủy bỏ</button>
        <button class="btn-save" @click="savePost">Lưu bài đăng</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

const showAddPostModal = ref(false)

const newPost = reactive({
  userName: '',
  platform: 'TikTok',
  date: new Date().toISOString().slice(0, 10)
})

const posts = ref([
  { id: 1, userName: 'Nguyễn Văn A', platform: 'TikTok', date: '2026-01-26' },
  { id: 2, userName: 'Trần Thị B', platform: 'Facebook', date: '2026-01-27' },
  { id: 3, userName: 'Lê Văn C', platform: 'Instagram', date: '2026-01-27' },
  { id: 4, userName: 'Nguyễn Văn A', platform: 'TikTok', date: '2026-01-28' },
  { id: 5, userName: 'Phạm Văn D', platform: 'Facebook', date: '2026-01-28' },
])

const reversedPosts = computed(() => {
  return [...posts.value].reverse()
})

// Tính toán tần suất đăng bài theo tuần (T2-CN)
const weeklyStats = computed(() => {
  // 0 = CN, 1 = T2, ..., 6 = T7
  // Muốn map: T2 (1), T3 (2), ..., T7 (6), CN (0) -> index 0..6
  const counts = [0, 0, 0, 0, 0, 0, 0] // 0: T2, 1: T3 ... 6: CN
  
  posts.value.forEach(p => {
    const d = new Date(p.date)
    let day = d.getDay() // 0(CN)..6(T7)
    // Convert to T2=0, CN=6
    let index = day === 0 ? 6 : day - 1
    if (index >= 0 && index <= 6) {
      counts[index]++
    }
  })

  const max = Math.max(...counts, 1) // Avoid divide by zero
  
  return counts.map(count => ({
    count,
    percent: (count / max) * 100
  }))
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

function closeModal() {
  showAddPostModal.value = false
  // Reset form partial if desired, or keep sticky
}

function savePost() {
  if (!newPost.userName) {
    alert('Vui lòng nhập tên nhân viên')
    return
  }
  posts.value.push({
    id: Date.now(),
    userName: newPost.userName,
    platform: newPost.platform,
    date: newPost.date
  })
  closeModal()
  // Reset fields
  newPost.userName = ''
  newPost.platform = 'TikTok'
  newPost.date = new Date().toISOString().slice(0, 10)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

.dashboard-container {
  display: flex;
  background-color: #f8fafc;
  font-family: 'Plus Jakarta Sans', sans-serif;
  min-height: 100vh;
  margin-left: -200px;
}

/* MAIN CONTENT WRAPPER */
.main-wrapper {
  /* margin-left nên khớp với độ rộng sidebar của bạn */
  margin-left: 260px; 
  flex: 1;
  padding: 32px;
  display: flex;
  flex-direction: column;
}

/* CONTAINER NỘI DUNG CHÍNH */
.main-content {
  width: 100%;
  max-width: 1400px; /* Tăng nhẹ để không gian thoáng hơn */
  margin: 0; /* Bỏ margin auto để nội dung bám trái */
}

/* HEADER */
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}
.header-text h1 {
  font-size: 24px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 4px 0;
}
.header-text p {
  color: #64748b;
  margin: 0;
  font-size: 14px;
}

.btn-add-post {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}
.btn-add-post:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

/* KPI CARDS */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}
.kpi-card {
  padding: 24px;
  border-radius: 20px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s;
}
.kpi-card:hover {
  transform: translateY(-5px);
}
.kpi-info small {
  display: block;
  opacity: 0.9;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}
.kpi-info h2 {
  font-size: 32px;
  font-weight: 800;
  margin: 0;
}
.kpi-icon {
  font-size: 48px;
  opacity: 0.2;
}

.bg-blue { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
.bg-green { background: linear-gradient(135deg, #10b981, #047857); }
.bg-orange { background: linear-gradient(135deg, #f59e0b, #b45309); }

/* CONTENT GRID */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 24px;
}
.data-card {
  background: white;
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.data-card h3 {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 20px 0;
}

/* CHART BOX */
.chart-visual {
  height: 200px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}
.bar-col {
  width: 12%;
  background: #3b82f6;
  border-radius: 6px 6px 4px 4px;
  position: relative;
  transition: background 0.2s;
}
.bar-col:hover {
  background: #2563eb;
}
.bar-tooltip {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  font-weight: 700;
  color: #1e293b;
  opacity: 0;
  transition: opacity 0.2s;
}
.bar-col:hover .bar-tooltip {
  opacity: 1;
}
.chart-labels {
  display: flex;
  justify-content: space-between;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 600;
  padding: 0 16px;
}

/* TABLE BOX */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.badge-status {
  background: #f1f5f9;
  color: #64748b;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
}
.modern-table {
  width: 100%;
  border-collapse: collapse;
}
.modern-table th {
  text-align: left;
  color: #94a3b8;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 12px;
  border-bottom: 1px solid #f1f5f9;
}
.modern-table td {
  padding: 14px 12px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
}
.user-cell {
  font-weight: 600;
  color: #334155;
}
.platform-tag {
  background: #eff6ff;
  color: #3b82f6;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
}
.status-done {
  color: #10b981;
  font-weight: 600;
  font-size: 13px;
}
.text-end { text-align: right; }

/* RESPONSIVE */
@media (max-width: 1024px) {
  .main-wrapper { margin-left: 0; }
  .content-grid { grid-template-columns: 1fr; }
}

/* MODAL STYLES */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
}
.modal-content {
  background: white;
  width: 90%;
  max-width: 500px;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
}
.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
  transition: all 0.2s;
}
.close-btn:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 14px;
  color: #334155;
}
.form-group input,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s;
  background: #f8fafc;
}
.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
}
.btn-cancel {
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  background: #f1f5f9;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-save {
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  background: #3b82f6;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-cancel:hover { background: #e2e8f0; color: #0f172a; }
.btn-save:hover { background: #2563eb; transform: translateY(-1px); }

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
</style>