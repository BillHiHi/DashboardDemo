<template>
  <div class="sales-team-page">
    <!-- HEADER -->
    <div class="page-header">
      <div class="header-left">
        <h2>Đội ngũ Sale</h2>
        <p>Quản lý thông tin và trạng thái nhân sự</p>
      </div>
      <button class="btn-add" @click="openAddModal">
        <i class="bi bi-person-plus-fill"></i> Thêm nhân viên
      </button>
    </div>

    <!-- TEAM GRID/TABLE -->
    <div class="card">
      <div class="table-responsive">
        <table class="modern-table">
          <thead>
            <tr>
              <th>Nhân viên</th>
              <th>Vị trí</th>
              <th>Liên hệ</th>
              <th>Trạng thái</th>
              <th class="text-end">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in team" :key="member.id">
              <td>
                <div class="user-info">
                  <div class="avatar">{{ getInitials(member.name) }}</div>
                  <div class="info-text">
                    <span class="name">{{ member.name }}</span>
                    <span class="id-text">ID: #{{ member.id }}</span>
                  </div>
                </div>
              </td>
              <td>
                <span class="role-badge" :class="getRoleClass(member.role)">{{ member.role }}</span>
              </td>
              <td class="text-muted">
                <div class="contact-info">
                  <i class="bi bi-envelope"></i> {{ member.email }}
                </div>
                <div class="contact-info">
                  <i class="bi bi-telephone"></i> {{ member.phone }}
                </div>
              </td>
              <td>
                <span class="status-badge" :class="member.status === 'Active' ? 'active' : 'inactive'">
                  {{ member.status === 'Active' ? 'Đang hoạt động' : 'Đã nghỉ' }}
                </span>
              </td>
              <td class="text-end">
                <button class="btn-icon edit" @click="openEdit(member)" title="Sửa">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn-icon delete" @click="deleteMember(member.id)" title="Xóa">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
            <tr v-if="team.length === 0">
              <td colspan="5" class="empty-state">Chưa có nhân viên nào</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ isEdit ? 'Cập nhật thông tin' : 'Thêm nhân viên mới' }}</h3>
          <button class="close-btn" @click="closeModal"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Họ và tên</label>
            <input v-model="form.name" type="text" placeholder="Nhập tên nhân viên..." />
          </div>
          <div class="form-group">
            <label>Vị trí</label>
            <select v-model="form.role">
              <option value="Sale Manager">Sale Manager</option>
              <option value="Sale Leader">Sale Leader</option>
              <option value="Sale Member">Sale Member</option>
              <option value="Intern">Intern</option>
            </select>
          </div>
          <div class="form-row">
            <div class="form-group half">
              <label>Email</label>
              <input v-model="form.email" type="email" placeholder="example@email.com" />
            </div>
            <div class="form-group half">
               <label>Số điện thoại</label>
               <input v-model="form.phone" type="tel" placeholder="0123456789" />
            </div>
          </div>
          <div class="form-group">
            <label>Trạng thái</label>
             <select v-model="form.status">
              <option value="Active">Đang hoạt động</option>
              <option value="Inactive">Đã nghỉ</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeModal">Hủy bỏ</button>
          <button class="btn-save" @click="saveMember">{{ isEdit ? 'Cập nhật' : 'Thêm mới' }}</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// --- STATE ---
const team = ref([
  { id: 101, name: 'Nguyễn Văn A', role: 'Sale Leader', email: 'vana@example.com', phone: '0901234567', status: 'Active' },
  { id: 102, name: 'Trần Thị B', role: 'Sale Member', email: 'btran@example.com', phone: '0902345678', status: 'Active' },
  { id: 103, name: 'Lê Văn C', role: 'Intern', email: 'cle@example.com', phone: '0903456789', status: 'Inactive' },
])

const showModal = ref(false)
const isEdit = ref(false)
const editId = ref(null)

const form = reactive({
  name: '',
  role: 'Sale Member',
  email: '',
  phone: '',
  status: 'Active'
})

// --- ACTIONS ---
function openAddModal() {
  resetForm()
  isEdit.value = false
  showModal.value = true
}

function openEdit(member) {
  form.name = member.name
  form.role = member.role
  form.email = member.email
  form.phone = member.phone
  form.status = member.status
  
  editId.value = member.id
  isEdit.value = true
  showModal.value = true
}

function saveMember() {
  if (!form.name || !form.email) {
    alert('Vui lòng nhập tên và email!')
    return
  }

  if (isEdit.value) {
    const index = team.value.findIndex(m => m.id === editId.value)
    if (index !== -1) {
      team.value[index] = { id: editId.value, ...form }
    }
  } else {
    team.value.push({
      id: Math.floor(Math.random() * 1000) + 100, // Simple ID gen
      ...form
    })
  }
  closeModal()
}

function deleteMember(id) {
  if (confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
    team.value = team.value.filter(m => m.id !== id)
  }
}

function closeModal() {
  showModal.value = false
}

function resetForm() {
  form.name = ''
  form.role = 'Sale Member'
  form.email = ''
  form.phone = ''
  form.status = 'Active'
}

// --- UTILS ---
function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function getRoleClass(role) {
  if (role === 'Sale Manager') return 'role-manager'
  if (role === 'Sale Leader') return 'role-leader'
  if (role === 'Sale Member') return 'role-member'
  return 'role-intern'
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.sales-team-page {
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #1e293b;
  min-height: 100vh;
  width: 100%;
}

.page-header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;
  gap: 20px;
}
.page-header h2 { font-size: 24px; font-weight: 800; margin: 0 0 4px 0; }
.page-header p { color: #64748b; margin: 0; font-size: 14px; }

.btn-add {
  background: #3b82f6; color: white; border: none; padding: 10px 20px;
  border-radius: 10px; font-weight: 600; display: flex; align-items: center; gap: 8px;
  cursor: pointer; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2); transition: all 0.2s;
  white-space: nowrap;
}
.btn-add:hover { background: #2563eb; transform: translateY(-1px); }

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .btn-add {
    width: 100%;
    justify-content: center;
  }
}

/* TABLE CARD */
.card {
  background: white; border-radius: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden;
}
.table-responsive {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.modern-table { width: 100%; border-collapse: collapse; min-width: 700px; }
.modern-table th {
  text-align: left; background: #f8fafc; padding: 16px;
  font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;
}
.modern-table td { padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 14px; vertical-align: middle; }
.modern-table tr:hover { background: #f8fafc; }

.user-info { display: flex; align-items: center; gap: 12px; }
.user-info .avatar {
  width: 40px; height: 40px; background: #eff6ff; color: #3b82f6;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 14px;
}
.info-text { display: flex; flex-direction: column; }
.info-text .name { font-weight: 600; color: #1e293b; }
.info-text .id-text { font-size: 11px; color: #94a3b8; }

.role-badge { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
.role-manager { background: #7e22ce; color: white; }
.role-leader { background: #dbeafe; color: #1e40af; }
.role-member { background: #f1f5f9; color: #475569; }
.role-intern { background: #fff7ed; color: #9a3412; }

.contact-info { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #64748b; margin-bottom: 2px; }

.status-badge { padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; }
.status-badge.active { background: #dcfce7; color: #166534; }
.status-badge.active::before { content: ''; width: 6px; height: 6px; background: currentColor; border-radius: 50%; }
.status-badge.inactive { background: #f1f5f9; color: #94a3b8; }
.status-badge.inactive::before { content: ''; width: 6px; height: 6px; background: currentColor; border-radius: 50%; }

.btn-icon {
  width: 32px; height: 32px; border-radius: 8px; border: none; cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center; transition: all 0.2s; margin-left: 6px;
}
.edit { background: #eff6ff; color: #3b82f6; } .edit:hover { background: #3b82f6; color: white; }
.delete { background: #fee2e2; color: #ef4444; } .delete:hover { background: #ef4444; color: white; }

.text-end { text-align: right; }
.empty-state { text-align: center; color: #94a3b8; padding: 40px; }

/* MODAL */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 2000;
}
.modal-content {
  background: white; width: 95%; max-width: 500px; border-radius: 20px; padding: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-height: 90vh;
  overflow-y: auto;
}
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
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
  width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 14px; background: #f8fafc;
  box-sizing: border-box;
}
.form-group input:focus, .form-group select:focus {
  outline: none; border-color: #3b82f6; background: white;
}
.modal-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
.btn-cancel { background: #f1f5f9; color: #64748b; padding: 10px 20px; border-radius: 10px; border: none; font-weight: 600; cursor: pointer; }
.btn-save { background: #3b82f6; color: white; padding: 10px 20px; border-radius: 10px; border: none; font-weight: 600; cursor: pointer; }
</style>
