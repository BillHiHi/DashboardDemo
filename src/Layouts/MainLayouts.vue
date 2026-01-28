<template>
  <div class="dashboard-container">
    <!-- SIDEBAR -->
    <aside class="sidebar-fixed">
      <div class="sidebar-header">
        <div class="brand-logo">
          <i class="bi bi-rocket-takeoff-fill"></i>
          <span>MKT TEAM</span>
        </div>
      </div>

      <nav class="sidebar-nav">
      <router-link to="/" class="nav-item active">Dashboard</router-link>
        <router-link to="/posts" class="nav-item">
          <i class="bi bi-postcard-heart"></i> <span>Quản lý bài đăng</span>
        </router-link>
        <router-link to="/team" class="nav-item">
          <i class="bi bi-people-fill"></i> <span>Đội ngũ Sale</span>
        </router-link>
        <router-link to="/revenue" class="nav-item">
          <i class="bi bi-pie-chart-fill"></i> <span>Báo cáo doanh thu</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="admin-profile">
          <div class="avatar">AD</div>
          <div class="info">
            <p class="name">Admin</p>
            <p class="role">Intern Student</p>
          </div>
        </div>
      </div>
    </aside>


    <!-- NỘI DUNG -->
    <main class="main-wrapper">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.dashboard-container {
  display: flex;
  background-color: #f8fafc;
  min-height: 100vh;
}
.sidebar-fixed {
  width: 280px;
  background-color: #0f172a;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
}
.main-wrapper {
  margin-left: 280px;
  flex: 1;
  padding: 40px;
}
.nav-item {
  display: flex;
  gap: 12px;
  padding: 14px 20px;
  color: #94a3b8;
  text-decoration: none;
}
.nav-item.active {
  background: #3b82f6;
  color: white;
  border-radius: 10px;
}
</style>
