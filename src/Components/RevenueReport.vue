<template>
  <div class="revenue-report">
    <!-- HEADER -->
    <div class="page-header">
      <div class="header-left">
        <h2>Báo cáo doanh thu (Sell Out)</h2>
        <p>Theo dõi hiệu suất kinh doanh của team</p>
      </div>
      <button class="btn-add" @click="openAddModal">
        <i class="bi bi-plus-lg"></i> Nhập doanh số
      </button>
    </div>

    <!-- SUMMARY CARDS -->
    <div class="kpi-grid">
      <div class="kpi-card bg-purple">
        <div class="kpi-info">
          <small>TỔNG DOANH THU</small>
          <h2>{{ formatCurrency(totalRevenue) }}</h2>
        </div>
        <i class="bi bi-currency-dollar kpi-icon"></i>
      </div>
      <div class="kpi-card bg-blue">
        <div class="kpi-info">
          <small>ĐƠN HÀNG</small>
          <h2>{{ totalOrders }}</h2>
        </div>
        <i class="bi bi-bag-check-fill kpi-icon"></i>
      </div>
      <div class="kpi-card bg-gold">
        <div class="kpi-info">
          <small>TOP SALES</small>
          <h2>{{ topSeller?.name || '---' }}</h2>
        </div>
        <i class="bi bi-trophy-fill kpi-icon"></i>
      </div>
    </div>

    <div class="content-grid">
      <!-- LEADERBOARD -->
      <div class="card leaderboard">
        <div class="card-header">
          <h3>🏆 Bảng xếp hạng doanh thu</h3>
        </div>
        <div class="ranking-list">
          <div 
            v-for="(member, index) in ranking" 
            :key="member.name"
            class="ranking-item"
            :class="{ 'top-1': index === 0, 'top-2': index === 1, 'top-3': index === 2 }"
          >
            <div class="rank-info">
              <div class="rank-badge">{{ index + 1 }}</div>
              <div class="avatar">{{ getInitials(member.name) }}</div>
            </div>
            <div class="member-content">
              <div class="member-top-row">
                <span class="name">{{ member.name }}</span>
                <div class="stats-text">
                  <small>{{ member.orders }} đơn</small>
                  <strong>{{ formatCurrency(member.revenue) }}</strong>
                </div>
              </div>
              <div class="progress-bar-wrapper">
                 <div class="progress-bar">
                    <div class="fill" :style="{ width: (member.revenue / maxRevenue * 100) + '%' }"></div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RECENT HISTORY -->
      <div class="card history">
        <div class="card-header">
          <h3>Lịch sử nhập liệu</h3>
        </div>
        <div class="table-responsive">
          <table class="modern-table">
            <thead>
              <tr>
                <th>Nhân viên</th>
                <th>Sản phẩm/Dịch vụ</th>
                <th class="text-center">Đơn giá</th>
                <th class="text-center">SL</th>
                <th class="text-end min-w-100">Thành tiền</th>
                <th class="text-end">Ngày</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sale in sortedSales" :key="sale.id">
                <td>{{ sale.staffName }}</td>
                <td><span class="product-tag">{{ sale.product }}</span></td>
                <td class="text-center text-muted">{{ formatCurrency(sale.unitPrice) }}</td>
                <td class="text-center">{{ sale.quantity }}</td>
                <td class="text-end font-bold text-green">{{ formatCurrency(sale.revenue) }}</td>
                <td class="text-end text-muted">{{ formatDate(sale.date) }}</td>
              </tr>
              <tr v-if="sales.length === 0">
                <td colspan="5" class="text-center text-muted p-4">Chưa có dữ liệu nào</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ADD MODAL -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Nhập doanh số bán hàng</h3>
          <button class="close-btn" @click="closeModal"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Nhân viên</label>
            <select v-model="form.staffName">
              <option value="" disabled>Chọn nhân viên...</option>
              <option value="Nguyễn Văn A">Nguyễn Văn A</option>
              <option value="Trần Thị B">Trần Thị B</option>
              <option value="Lê Văn C">Lê Văn C</option>
              <option value="Phạm Văn D">Phạm Văn D</option>
              <option value="New Manager">New Manager</option>
            </select>
          </div>
          <div class="form-group">
            <label>Sản phẩm / Dịch vụ</label>
            <input v-model="form.product" type="text" placeholder="Ví dụ: Áo thun, Dưa hấu, Dịch vụ..." list="products" />
            <datalist id="products">
              <option value="Áo thun"></option>
              <option value="Dưa hấu"></option>
              <option value="Dịch vụ Marketing"></option>
              <option value="Combo Quà Tết"></option>
            </datalist>
          </div>
          <div class="form-row">
            <div class="form-group half">
              <label>Đơn giá (VNĐ)</label>
              <input v-model.number="form.unitPrice" type="number" min="0" placeholder="0" />
            </div>
            <div class="form-group half">
              <label>Số lượng</label>
              <input v-model.number="form.quantity" type="number" min="1" />
            </div>
          </div>
          
          <div class="form-group total-preview">
            <label>Thành tiền:</label>
            <div class="price-display">{{ formatCurrency(computedTotal) }}</div>
          </div>
          <div class="form-group">
             <label>Ngày ghi nhận</label>
             <input v-model="form.date" type="date" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeModal">Hủy bỏ</button>
          <button class="btn-save" @click="saveSale">Lưu báo cáo</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

// --- STATE ---
// --- STATE ---
const sales = ref([
  { id: 1, staffName: 'Nguyễn Văn A', product: 'Áo thun', unitPrice: 250000, quantity: 10, revenue: 2500000, date: '2026-01-26' },
  { id: 2, staffName: 'Trần Thị B', product: 'Dưa hấu', unitPrice: 30000, quantity: 50, revenue: 1500000, date: '2026-01-27' },
  { id: 3, staffName: 'Nguyễn Văn A', product: 'Dịch vụ Marketing', unitPrice: 5000000, quantity: 1, revenue: 5000000, date: '2026-01-28' },
  { id: 4, staffName: 'Lê Văn C', product: 'Áo thun', unitPrice: 250000, quantity: 5, revenue: 1250000, date: '2026-01-28' },
])

const showModal = ref(false)
const form = reactive({
  staffName: '',
  product: '',
  quantity: 1,
  unitPrice: 0,
  date: new Date().toISOString().slice(0, 10)
})

const computedTotal = computed(() => {
  return (form.unitPrice || 0) * (form.quantity || 0)
})

// --- COMPUTED ---
const sortedSales = computed(() => {
  return [...sales.value].sort((a, b) => new Date(b.date) - new Date(a.date))
})

const totalRevenue = computed(() => sales.value.reduce((sum, s) => sum + s.revenue, 0))
const totalOrders = computed(() => sales.value.length)

const ranking = computed(() => {
  const map = {}
  sales.value.forEach(s => {
    if (!map[s.staffName]) map[s.staffName] = { name: s.staffName, orders: 0, revenue: 0 }
    map[s.staffName].orders += 1
    map[s.staffName].revenue += s.revenue
  })
  return Object.values(map).sort((a, b) => b.revenue - a.revenue)
})

const maxRevenue = computed(() => {
  if (ranking.value.length === 0) return 1
  return ranking.value[0].revenue
})

const topSeller = computed(() => ranking.value[0])

// --- ACTIONS ---
function openAddModal() {
  resetForm()
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function saveSale() {
  if (!form.staffName || !form.product || form.unitPrice <= 0 || form.quantity <= 0) {
    alert('Vui lòng nhập đầy đủ thông tin hợp lệ!')
    return
  }
  
  sales.value.push({
    id: Date.now(),
    staffName: form.staffName,
    product: form.product,
    quantity: form.quantity,
    unitPrice: form.unitPrice,
    revenue: form.unitPrice * form.quantity,
    date: form.date
  })
  
  closeModal()
}

function resetForm() {
  form.staffName = ''
  form.product = ''
  form.quantity = 1
  form.unitPrice = 0
  form.date = new Date().toISOString().slice(0, 10)
}

// --- UTILS ---
function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

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
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.revenue-report {
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #1e293b;
  width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}
.page-header h2 { font-size: 24px; font-weight: 800; margin: 0 0 4px 0; }
.page-header p { color: #64748b; margin: 0; font-size: 14px; }

.btn-add {
  background: #3b82f6; color: white; border: none; padding: 10px 20px;
  border-radius: 10px; font-weight: 600; display: flex; align-items: center; gap: 8px;
  cursor: pointer; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2); transition: all 0.2s;
}
.btn-add:hover { background: #2563eb; transform: translateY(-1px); }

/* KPI CARDS */
.kpi-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 32px;
}
.kpi-card {
  padding: 24px; border-radius: 20px; color: white; display: flex;
  justify-content: space-between; align-items: center; overflow: hidden;
}
.kpi-info small { opacity: 0.9; font-weight: 700; font-size: 11px; margin-bottom: 8px; display: block; }
.kpi-info h2 { font-size: 24px; font-weight: 800; margin: 0; }
.kpi-icon { font-size: 40px; opacity: 0.2; }

.bg-purple { background: linear-gradient(135deg, #8b5cf6, #6d28d9); }
.bg-blue { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
.bg-gold { background: linear-gradient(135deg, #f59e0b, #b45309); }

/* GRID LAYOUT */
.content-grid {
  display: grid; grid-template-columns: 1fr 1.5fr; gap: 24px;
}
@media (max-width: 1024px) {
  .content-grid { grid-template-columns: 1fr; }
}

.card {
  background: white; border-radius: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden;
}
.card-header { padding: 20px; border-bottom: 1px solid #f1f5f9; }
.card-header h3 { margin: 0; font-size: 16px; font-weight: 700; color: #1e293b; }

/* LEADERBOARD */
.ranking-list { padding: 10px 0; }
.ranking-item {
  display: flex; flex-direction: row; align-items: flex-start; padding: 20px; gap: 16px;
  border-bottom: 1px solid #f8fafc; transition: background 0.2s;
}
.ranking-item:hover { background: #f8fafc; }

.rank-info { display: flex; align-items: center; gap: 12px; }
.rank-badge {
  width: 24px; height: 24px; background: #e2e8f0; color: #64748b;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 11px; flex-shrink: 0;
}
.top-1 .rank-badge { background: #fef3c7; color: #b45309; }
.top-2 .rank-badge { background: #e0f2fe; color: #0369a1; }
.top-3 .rank-badge { background: #f3e8ff; color: #7e22ce; }

.member-content { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.member-top-row { display: flex; justify-content: space-between; align-items: flex-start; }

.avatar {
  width: 32px; height: 32px; background: #f1f5f9; color: #64748b;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 11px;
}
.name { font-weight: 700; font-size: 14px; color: #1e293b; }

.stats-text { text-align: right; display: flex; flex-direction: column; }
.stats-text small { font-size: 11px; color: #64748b; }
.stats-text strong { font-size: 14px; color: #1e293b; }

.progress-bar-wrapper { width: 100%; }
.progress-bar { width: 100%; height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden; }
.progress-bar .fill { height: 100%; background: #3b82f6; border-radius: 4px; transition: width 0.3s ease; }
.top-1 .fill { background: #f59e0b; }
.top-2 .fill { background: #3b82f6; }
.top-3 .fill { background: #8b5cf6; }

/* HISTORY TABLE */
.modern-table { width: 100%; border-collapse: collapse; }
.min-w-100 { min-width: 100px; }
.modern-table th {
  text-align: left; background: #f8fafc; padding: 12px 16px;
  font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;
}
.modern-table td { padding: 14px 16px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
.product-tag { background: #f0fdf4; color: #166534; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; }
.text-end { text-align: right; }
.font-bold { font-weight: 600; }
.text-green { color: #10b981; }
.text-muted { color: #94a3b8; }

/* MODAL & FORM */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.modal-content {
  background: white; width: 90%; max-width: 500px; border-radius: 20px; padding: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.modal-header h3 { margin: 0; font-size: 18px; font-weight: 700; }
.close-btn { background: none; border: none; font-size: 20px; cursor: pointer; color: #64748b; }

.form-group { margin-bottom: 16px; }
.form-row { display: flex; gap: 16px; }
.form-group.half { flex: 1; }
.form-group label { display: block; margin-bottom: 8px; font-weight: 600; font-size: 13px; color: #334155; }
.form-group input, .form-group select {
  width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 14px; background: #f8fafc;
}
.form-group input:focus, .form-group select:focus {
  outline: none; border-color: #3b82f6; background: white;
}
.modal-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
.btn-cancel { background: #f1f5f9; color: #64748b; padding: 10px 20px; border-radius: 10px; border: none; font-weight: 600; cursor: pointer; }
.total-preview {
  background: #f0fdf4;
  padding: 12px;
  border-radius: 10px;
  border: 1px dashed #10b981;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.total-preview label {
  margin: 0;
  color: #10b981;
}
.price-display {
  font-size: 18px;
  font-weight: 800;
  color: #15803d;
}
.text-center { text-align: center; }
.btn-save { background: #3b82f6; color: white; padding: 10px 20px; border-radius: 10px; border: none; font-weight: 600; cursor: pointer; }

</style>
