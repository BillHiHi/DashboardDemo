<template>
  <div class="dashboard-container">
    <!-- MOBILE HEADER -->
    <header class="mobile-header">
      <div class="brand-logo">
        <i class="bi bi-rocket-takeoff-fill"></i>
        <span>MKT TEAM</span>
      </div>
      <button class="menu-toggle" @click="isMobileMenuOpen = !isMobileMenuOpen">
        <i class="bi" :class="isMobileMenuOpen ? 'bi-x-lg' : 'bi-list'"></i>
      </button>
    </header>

    <!-- SIDEBAR -->
    <aside class="sidebar-fixed" :class="{ 'mobile-open': isMobileMenuOpen }">
      <div class="sidebar-header desktop-only">
        <div class="brand-logo">
          <i class="bi bi-rocket-takeoff-fill"></i>
          <span>MKT TEAM</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/" class="nav-item" @click="isMobileMenuOpen = false">
          <i class="bi bi-speedometer2"></i> <span>Dashboard</span>
        </router-link>
        <router-link to="/posts" class="nav-item" @click="isMobileMenuOpen = false">
          <i class="bi bi-postcard-heart"></i> <span>Quản lý bài đăng</span>
        </router-link>
        <router-link to="/team" class="nav-item" @click="isMobileMenuOpen = false">
          <i class="bi bi-people-fill"></i> <span>Đội ngũ Sale</span>
        </router-link>
        <router-link to="/revenue" class="nav-item" @click="isMobileMenuOpen = false">
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

    <!-- OVERLAY FOR MOBILE -->
    <div v-if="isMobileMenuOpen" class="sidebar-overlay" @click="isMobileMenuOpen = false"></div>

    <!-- NỘI DUNG -->
    <main class="main-wrapper">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isMobileMenuOpen = ref(false)
</script>

<style scoped>
.dashboard-container {
  display: flex;
  background-color: #f8fafc;
  min-height: 100vh;
}

/* SIDEBAR STYLES */
.sidebar-fixed {
  width: 280px;
  background-color: #0f172a;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  transition: transform 0.3s ease;
}

.sidebar-header {
  padding: 32px 24px;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  font-size: 20px;
  font-weight: 800;
}

.brand-logo i {
  color: #3b82f6;
  font-size: 24px;
}

.sidebar-nav {
  flex: 1;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  color: #94a3b8;
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.2s;
  border-radius: 12px;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.nav-item i {
  font-size: 18px;
}

.router-link-active {
  background: #3b82f6 !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.sidebar-footer {
  padding: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.admin-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  background: #3b82f6;
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.info .name {
  color: white;
  font-size: 14px;
  font-weight: 700;
  margin: 0;
}

.info .role {
  color: #64748b;
  font-size: 12px;
  margin: 0;
}

/* MAIN CONTENT */
.main-wrapper {
  margin-left: 280px;
  flex: 1;
  padding: 40px;
  width: 100%;
  box-sizing: border-box;
}

/* MOBILE HEADER & ADAPTATIONS */
.mobile-header {
  display: none;
}

@media (max-width: 1024px) {
  .sidebar-fixed {
    transform: translateX(-100%);
  }
  
  .sidebar-fixed.mobile-open {
    transform: translateX(0);
  }

  .main-wrapper {
    margin-left: 0;
    padding: 24px;
    padding-top: 100px; /* Space for fixed mobile header */
  }

  .mobile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background: #0f172a;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 900;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .menu-toggle {
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    padding: 8px;
  }

  .desktop-only {
    display: none;
  }

  .sidebar-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 950;
  }
}

@media (max-width: 640px) {
  .main-wrapper {
    padding: 16px;
    padding-top: 90px;
  }
}
</style>
