<template>
  <div class="post-manager">
    <!-- HEADER -->
    <div class="manager-header">
      <div class="header-left">
        <h2>Quản lý bài đăng</h2>
        <p>Theo dõi và cập nhật trạng thái các bài đăng</p>
      </div>
      <button class="btn-add" @click="openAdd">
        <i class="bi bi-plus-lg"></i> Thêm bài đăng
      </button>
    </div>

    <!-- TOOLBAR -->
    <div class="toolbar">
      <div class="search-box">
        <i class="bi bi-search"></i>
        <input v-model="searchQuery" type="text" placeholder="Tìm kiếm theo nhân viên..." />
      </div>
      <div class="filters">
        <select v-model="filterPlatform">
          <option value="">Tất cả nền tảng</option>
          <option value="TikTok">TikTok</option>
          <option value="Facebook">Facebook</option>
          <option value="Instagram">Instagram</option>
          <option value="Youtube">Youtube</option>
        </select>
        <select v-model="filterStatus">
          <option value="">Tất cả trạng thái</option>
          <option value="Published">Đã đăng</option>
          <option value="Draft">Bản nháp</option>
          <option value="Scheduled">Đã lên lịch</option>
        </select>
      </div>
    </div>

    <!-- TABLE / CARD LIST -->
    <div class="content-view">
      <!-- Desktop Table -->
      <div class="table-container desktop-only">
        <table class="modern-table">
          <thead>
            <tr>
              <th>Nhân viên</th>
              <th>Nền tảng</th>
              <th>Ngày đăng</th>
              <th>Trạng thái</th>
              <th class="text-end">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in filteredPosts" :key="post.id">
              <td>
                <div class="user-info">
                  <div class="avatar">{{ getInitials(post.userName) }}</div>
                  <span class="username">{{ post.userName }}</span>
                </div>
              </td>
              <td>
                <span class="platform-badge" :class="post.platform.toLowerCase()">
                  {{ post.platform }}
                </span>
              </td>
              <td class="text-muted">{{ formatDate(post.date) }}</td>
              <td>
                <span class="status-badge" :class="post.status.toLowerCase()">
                  {{ post.status === 'Published' ? 'Đã đăng' : post.status === 'Draft' ? 'Bản nháp' : 'Đã lên lịch' }}
                </span>
              </td>
              <td class="text-end">
                <button class="btn-icon edit" @click="openEdit(post)" title="Sửa">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn-icon delete" @click="deletePost(post.id)" title="Xóa">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Card List -->
      <div class="mobile-card-list mobile-only">
        <div v-for="post in filteredPosts" :key="post.id" class="post-card">
          <div class="card-header">
            <div class="user-info">
              <div class="avatar">{{ getInitials(post.userName) }}</div>
              <div class="info-text">
                <span class="username">{{ post.userName }}</span>
                <span class="date text-muted">{{ formatDate(post.date) }}</span>
              </div>
            </div>
            <div class="actions">
              <button class="btn-icon edit" @click="openEdit(post)"><i class="bi bi-pencil-square"></i></button>
              <button class="btn-icon delete" @click="deletePost(post.id)"><i class="bi bi-trash"></i></button>
            </div>
          </div>
          <div class="card-body">
            <span class="platform-badge" :class="post.platform.toLowerCase()">{{ post.platform }}</span>
            <span class="status-badge" :class="post.status.toLowerCase()">
              {{ post.status === 'Published' ? 'Đã đăng' : post.status === 'Draft' ? 'Bản nháp' : 'Đã lên lịch' }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="filteredPosts.length === 0" class="empty-state">
        Không tìm thấy bài đăng nào phù hợp
      </div>
    </div>

    <!-- MODAL -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ isEdit ? 'Cập nhật bài đăng' : 'Thêm bài đăng mới' }}</h3>
          <button class="close-btn" @click="closeModal"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Nhân viên</label>
            <input v-model="form.userName" type="text" placeholder="Nhập tên nhân viên..." />
          </div>
          <div class="form-row">
            <div class="form-group half">
              <label>Nền tảng</label>
              <select v-model="form.platform">
                <option value="TikTok">TikTok</option>
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="Youtube">Youtube</option>
              </select>
            </div>
             <div class="form-group half">
              <label>Trạng thái</label>
              <select v-model="form.status">
                <option value="Published">Đã đăng</option>
                <option value="Draft">Bản nháp</option>
                <option value="Scheduled">Đã lên lịch</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Ngày đăng</label>
            <input v-model="form.date" type="date" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeModal">Hủy bỏ</button>
          <button class="btn-save" @click="savePost">{{ isEdit ? 'Cập nhật' : 'Lưu bài đăng' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

// --- STATE ---
const posts = ref([
  { id: 1, userName: 'Nguyễn Văn A', platform: 'TikTok', date: '2026-01-26', status: 'Published' },
  { id: 2, userName: 'Trần Thị B', platform: 'Facebook', date: '2026-01-27', status: 'Draft' },
  { id: 3, userName: 'Lê Văn C', platform: 'Instagram', date: '2026-01-28', status: 'Scheduled' },
  { id: 4, userName: 'Phạm Văn D', platform: 'Youtube', date: '2026-01-25', status: 'Published' },
  { id: 5, userName: 'Nguyễn Văn A', platform: 'Facebook', date: '2026-01-28', status: 'Published' },
])

const searchQuery = ref('')
const filterPlatform = ref('')
const filterStatus = ref('')

const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(null)

const form = reactive({
  userName: '',
  platform: 'TikTok',
  status: 'Published',
  date: new Date().toISOString().slice(0, 10)
})

// --- COMPUTED ---
const filteredPosts = computed(() => {
  return posts.value.filter(post => {
    const matchSearch = post.userName.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchPlatform = filterPlatform.value ? post.platform === filterPlatform.value : true
    const matchStatus = filterStatus.value ? post.status === filterStatus.value : true
    return matchSearch && matchPlatform && matchStatus
  }).sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort newest first
})

// --- ACTIONS ---
function openAdd() {
  resetForm()
  isEdit.value = false
  showModal.value = true
}

function openEdit(post) {
  form.userName = post.userName
  form.platform = post.platform
  form.status = post.status
  form.date = post.date
  
  editId.value = post.id
  isEdit.value = true
  showModal.value = true
}

function savePost() {
  if (!form.userName) {
    alert('Vui lòng nhập tên nhân viên')
    return
  }

  if (isEdit.value) {
    const index = posts.value.findIndex(p => p.id === editId.value)
    if (index !== -1) {
      posts.value[index] = { 
        id: editId.value, 
        ...form 
      }
    }
  } else {
    posts.value.push({
      id: Date.now(),
      ...form
    })
  }
  closeModal()
}

function deletePost(id) {
  if (confirm('Bạn có chắc chắn muốn xóa bài đăng này không?')) {
    posts.value = posts.value.filter(p => p.id !== id)
  }
}

function closeModal() {
  showModal.value = false
}

function resetForm() {
  form.userName = ''
  form.platform = 'TikTok'
  form.status = 'Published'
  form.date = new Date().toISOString().slice(0, 10)
}

// --- UTILS ---
function formatDate(dateStr) {
  if (!dateStr) return '-'
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

.post-manager {
  background: white;
  min-height: 100vh;
  padding: 32px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #1e293b;
  width: 100%;
}

/* HEADER */
.manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  gap: 20px;
}
.header-left h2 {
  font-size: 24px;
  font-weight: 800;
  margin: 0 0 4px 0;
}
.header-left p {
  color: #64748b;
  margin: 0;
  font-size: 14px;
}
.btn-add {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  transition: all 0.2s;
  white-space: nowrap;
}
.btn-add:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

/* TOOLBAR */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}
.search-box {
  position: relative;
  flex: 1;
  max-width: 300px;
  min-width: 200px;
}
.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}
.search-box input {
  width: 100%;
  padding: 10px 10px 10px 36px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  background: #f8fafc;
  box-sizing: border-box;
}
.filters {
  display: flex;
  gap: 12px;
}
.filters select {
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  background: white;
  color: #334155;
  cursor: pointer;
}

/* SHARED STYLES */
.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}
.avatar {
  width: 36px;
  height: 36px;
  background: #eff6ff;
  color: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
}
.username {
  font-weight: 700;
  color: #0f172a;
}

.platform-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 11px;
  text-transform: uppercase;
}
.platform-badge.tiktok { background: #000; color: #fff; }
.platform-badge.facebook { background: #eff6ff; color: #1877f2; }
.platform-badge.instagram { background: #fdf2f8; color: #db2777; }
.platform-badge.youtube { background: #fef2f2; color: #dc2626; }

.status-badge {
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
}
.published { background: #dcfce7; color: #15803d; }
.draft { background: #f1f5f9; color: #475569; }
.scheduled { background: #fef3c7; color: #b45309; }

.btn-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.btn-icon.edit { background: #eff6ff; color: #3b82f6; }
.btn-icon.delete { background: #fef2f2; color: #ef4444; }

.empty-state {
  text-align: center;
  color: #64748b;
  padding: 60px 20px;
  background: #f8fafc;
  border-radius: 20px;
  margin-top: 20px;
}

.text-muted { color: #94a3b8; }
.text-end { text-align: right; }

/* TABLE */
.desktop-only { display: block; }
.mobile-only { display: none; }

.table-container {
  background: white;
  border-radius: 20px;
  border: 1px solid #f1f5f9;
  overflow: hidden;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
}

.modern-table th {
  background: #f8fafc;
  padding: 16px 20px;
  text-align: left;
  font-size: 12px;
  font-weight: 800;
  color: #64748b;
  text-transform: uppercase;
}

.modern-table td {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
}

/* MOBILE CARD LIST */
.mobile-card-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.post-card {
  background: white;
  border-radius: 20px;
  padding: 16px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.post-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.post-card .info-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.post-card .username { font-size: 14px; }
.post-card .date { font-size: 12px; }

.post-card .card-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .post-manager { padding: 16px; padding-bottom: 40px; }
  .manager-header { 
    flex-direction: column; 
    align-items: stretch; 
    gap: 16px;
    margin-bottom: 24px;
    text-align: center;
  }
  .btn-add { 
    width: 100%; 
    justify-content: center; 
    height: 50px;
    font-size: 15px;
    border-radius: 14px;
  }
  .toolbar { 
    flex-direction: column; 
    align-items: stretch; 
    gap: 12px;
    margin-bottom: 24px;
  }
  .search-box { max-width: none; }
  .search-box input { height: 48px; border-radius: 12px; }
  .filters { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .filters select { width: 100%; height: 48px; border-radius: 12px; }

  .desktop-only { display: none; }
  .mobile-only { display: block; }

  .modal-content {
    width: 100%;
    height: auto;
    border-radius: 24px 24px 0 0;
    position: fixed;
    bottom: 0;
    margin: 0;
    padding: 24px;
    padding-bottom: calc(24px + env(safe-area-inset-bottom));
  }
  .modal-overlay { align-items: flex-end; }
}

/* MODAL & FORM STYLES */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.modal-content {
  background: white;
  width: 95%;
  max-width: 500px;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-height: 90vh;
  overflow-y: auto;
}
.modal-header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;
}
.modal-header h3 { margin: 0; font-size: 18px; font-weight: 700; }
.close-btn { background: none; border: none; font-size: 20px; cursor: pointer; color: #64748b; }

.form-group { margin-bottom: 16px; }
.form-row { display: flex; gap: 16px; }

@media (max-width: 480px) {
  .form-row { flex-direction: column; gap: 0; }
}

.form-group.half { flex: 1; }
.form-group label { display: block; margin-bottom: 8px; font-weight: 600; font-size: 13px; color: #334155; }
.form-group input, .form-group select {
  width: 100%; padding: 10px;
  border: 1px solid #e2e8f0; border-radius: 10px;
  font-size: 14px; background: #f8fafc;
  box-sizing: border-box;
}
.form-group input:focus, .form-group select:focus {
  outline: none; border-color: #3b82f6; background: white;
}
.modal-footer {
  display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;
}
.btn-cancel, .btn-save {
  padding: 10px 20px; border-radius: 10px; border: none; font-weight: 600; cursor: pointer;
}
.btn-cancel { background: #f1f5f9; color: #64748b; }
.btn-save { background: #3b82f6; color: white; }
</style>
