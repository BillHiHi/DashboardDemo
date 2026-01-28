<template>
  <div class="dashboard-container">
    <!-- MOBILE HEADER -->
    <header class="mobile-header">
      <div class="brand-logo">
        <i class="bi bi-rocket-takeoff-fill"></i>
        <span>MKT TEAM</span>
      </div>
      <div class="header-actions">
        <button class="profile-btn" @click="isMobileMenuOpen = !isMobileMenuOpen">
          <div class="mini-avatar">AD</div>
        </button>
      </div>
    </header>

    <!-- SIDEBAR (Mobile Profile / Extra Settings) -->
    <aside class="sidebar-fixed" :class="{ 'mobile-open': isMobileMenuOpen }">
      <div class="sidebar-header desktop-only">
        <div class="brand-logo">
          <i class="bi bi-rocket-takeoff-fill"></i>
          <span>MKT TEAM</span>
        </div>
      </div>

      <nav class="sidebar-nav desktop-only">
        <router-link to="/" class="nav-item">
          <i class="bi bi-speedometer2"></i> <span>Dashboard</span>
        </router-link>
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
        <button class="btn-logout desktop-only">
          <i class="bi bi-box-arrow-right"></i> <span>Đăng xuất</span>
        </button>
      </div>
    </aside>

    <!-- BOTTOM NAVIGATION (MOBILE ONLY) -->
    <nav class="bottom-nav">
      <router-link to="/" class="bottom-nav-item">
        <i class="bi bi-speedometer2"></i>
        <span>Home</span>
      </router-link>
      <router-link to="/posts" class="bottom-nav-item">
        <i class="bi bi-postcard-heart"></i>
        <span>Posts</span>
      </router-link>
      <router-link to="/team" class="bottom-nav-item">
        <i class="bi bi-people-fill"></i>
        <span>Team</span>
      </router-link>
      <router-link to="/revenue" class="bottom-nav-item">
        <i class="bi bi-pie-chart-fill"></i>
        <span>Sales</span>
      </router-link>
    </nav>

    <!-- OVERLAY FOR MOBILE SIDEBAR -->
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
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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

.router-link-active {
  background: #3b82f6 !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.sidebar-footer {
  padding: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.btn-logout {
  background: rgba(244, 63, 94, 0.1);
  color: #fb7185;
  border: none;
  padding: 12px;
  border-radius: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover {
  background: #f43f5e;
  color: white;
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

.info .name { color: white; font-size: 14px; font-weight: 700; margin: 0; }
.info .role { color: #64748b; font-size: 12px; margin: 0; }

/* MAIN CONTENT */
.main-wrapper {
  margin-left: 280px;
  flex: 1;
  padding: 40px;
  width: 100%;
  box-sizing: border-box;
}

/* BOTTOM NAVIGATION */
.bottom-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: calc(70px + env(safe-area-inset-bottom, 0px));
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
  z-index: 1000;
  justify-content: space-around;
  align-items: flex-start; /* Align to top to give space for status bar/bottom bar */
  padding: 10px 10px calc(env(safe-area-inset-bottom, 0px));
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8; /* Lighter color for inactive */
  text-decoration: none;
  font-size: 10px;
  font-weight: 700;
  gap: 4px;
  flex: 1;
  height: 50px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.bottom-nav-item i {
  font-size: 22px;
}

.bottom-nav-item.router-link-active {
  color: #3b82f6;
  background: none !important;
  box-shadow: none !important;
  transform: translateY(-2px);
}

.bottom-nav-item.router-link-active span {
  font-weight: 800;
}

/* MOBILE HEADER & ADAPTATIONS */
.mobile-header { display: none; }

@media (max-width: 1024px) {
  .sidebar-fixed {
    transform: translateX(-100%);
    width: 280px;
  }
  
  .sidebar-fixed.mobile-open {
    transform: translateX(0);
  }

  .main-wrapper {
    margin-left: 0;
    padding: 16px; /* Reduced side padding for more screen space */
    padding-top: 70px; /* Reduced top padding */
    padding-bottom: calc(85px + env(safe-area-inset-bottom, 0px));
  }

  .mobile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 60px;
    background: #ffffff;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 900;
    border-bottom: 1px solid #f1f5f9;
  }

  .brand-logo { 
    color: #0f172a; 
    font-size: 18px; 
    font-weight: 900;
  }

  .bottom-nav { display: flex; }

  .desktop-only { display: none; }

  .mini-avatar {
    width: 32px;
    height: 32px;
    background: #eff6ff;
    color: #3b82f6;
    border: 2px solid #3b82f6;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 800;
  }

  .profile-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  .sidebar-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.4);
    backdrop-filter: blur(4px);
    z-index: 950;
  }
}
</style>
