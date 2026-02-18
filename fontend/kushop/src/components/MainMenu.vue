<template>
  <nav class="navbar navbar-expand-lg navbar-modern sticky-top">
    <div class="container-fluid px-4">
      <!-- Logo/Brand -->
      <router-link to="/" class="navbar-brand brand-modern">
        <span class="brand-icon">🛍️</span>
        <span class="brand-text">I HAVE KU</span>
      </router-link>

      <!-- Mobile Toggle -->
      <button
        class="navbar-toggler border-0"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-2">
          
          <!-- Product Link -->
          <li class="nav-item">
            <router-link to="/" class="nav-link nav-link-modern">
              <i class="bi bi-shop me-1"></i>
              <span>สินค้า</span>
            </router-link>
          </li>

          <!-- Admin Panel Dropdown -->
          <li class="nav-item dropdown" v-if="login && role === 'admin'">
            <a
              class="nav-link dropdown-toggle nav-link-admin"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-shield-lock-fill me-1"></i>
              <span>Admin Panel</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-modern shadow-lg">
              <li>
                <router-link to="/admin/members" class="dropdown-item dropdown-item-modern">
                  <i class="bi bi-people"></i>
                  <span>จัดการสมาชิก</span>
                </router-link>
              </li>
              <li>
                <router-link to="/admin/addproducts" class="dropdown-item dropdown-item-modern">
                  <i class="bi bi-box-seam"></i>
                  <span>เพิ่มสินค้า</span>
                </router-link>
              </li>

            </ul>
          </li>

          <!-- User Profile -->
          <li class="nav-item" v-if="login">
            <router-link to="/pagemember" class="nav-link nav-link-user">
              <i class="bi bi-person-circle me-1"></i>
              <span>{{ memName }}</span>
              <span v-if="role === 'admin'" class="badge badge-admin ms-2">
                <i class="bi bi-star-fill"></i> Admin
              </span>
            </router-link>
          </li>

          <!-- Cart Info -->
          <li class="nav-item" v-if="login">
            <CartInfo />
          </li>

          <!-- Cart Button -->
          <li class="nav-item" v-if="login">
            <router-link to="/cartlist" class="nav-link nav-link-cart">
              <i class="bi bi-cart3 me-1"></i>
              <span>ตะกร้า</span>
            </router-link>
          </li>

          <!-- Logout Button -->
          <li class="nav-item" v-if="login">
            <a href="#" @click.prevent="memLogout()" class="btn btn-logout">
              <i class="bi bi-box-arrow-right me-1"></i>
              <span>ออกจากระบบ</span>
            </a>
          </li>

          <!-- Login Button -->
          <li class="nav-item" v-if="!login">
            <router-link to="/login" class="btn btn-login">
              <i class="bi bi-box-arrow-in-right me-1"></i>
              <span>เข้าสู่ระบบ</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";
import CartInfo from "./CartInfo.vue";

axios.defaults.withCredentials = true;

const authStore = useAuthStore();
const router = useRouter();
const member = ref(null);
const memEmail = ref(null);
const memName = ref(null);
const dutyId = ref(null);
const role = ref(null);
const login = ref(false);

watch(
  () => authStore.isLogin,
  (newValue, oldValue) => {
    console.log("Auth state changed");
    getMember();
  }
);

onMounted(async () => {
  await getMember();
});

const getMember = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/members/detail`);
    
    if (response.data.login) {
      member.value = response.data;
      memEmail.value = response.data.memEmail;
      memName.value = response.data.memName;
      dutyId.value = response.data.dutyId;
      role.value = response.data.role;
      login.value = true;
    } else {
      clearMemberData();
    }
  } catch (err) {
    // จัดการ Error 401 แบบ Silent (ไม่แสดงใน Console)
    if (err.response?.status === 401) {
      // Unauthorized - ยังไม่ได้ login (ปกติ)
      clearMemberData();
    } else {
      // Error อื่นๆ ให้แสดง
      console.error("Error getting member:", err.message);
      clearMemberData();
    }
  }
};

const clearMemberData = () => {
  login.value = false;
  memEmail.value = null;
  memName.value = null;
  dutyId.value = null;
  role.value = null;
  member.value = null;
};

const memLogout = async () => {
  const cf = window.confirm("ต้องการออกจากระบบ?");
  if (cf) {
    try {
      await axios.get(`http://localhost:3000/members/logout`);
      clearMemberData();
      authStore.logout();
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
      clearMemberData();
      authStore.logout();
      router.push("/");
    }
  }
};
</script>

<style scoped>
/* Modern Navbar Base */
.navbar-modern {
  background: linear-gradient(38deg, #aeeeb7 0%, #5da856 50%,#01a031 100%) !important;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  padding: 0.75rem 0;
  transition: all 0.3s ease;
}

/* Sticky Effect */
.sticky-top {
  position: sticky;
  top: 0;
  z-index: 1020;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Brand Styling */
.brand-modern {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: white !important;
  text-decoration: none;
  transition: transform 0.3s ease;
}

.brand-modern:hover {
  transform: scale(1.05);
}

.brand-icon {
  font-size: 1.8rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.brand-text {
  letter-spacing: 0.5px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

/* Navigation Links */
.nav-link-modern {
  color: rgba(255, 255, 255, 0.9) !important;
  font-weight: 500;
  padding: 0.5rem 1rem !important;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.nav-link-modern:hover {
  background: rgba(255, 255, 255, 0.15);
  color: white !important;
  transform: translateY(-2px);
}

.nav-link-modern.router-link-active {
  background: rgba(255, 255, 255, 0.2);
  color: white !important;
}

/* Admin Panel Link */
.nav-link-admin {
  color: #ffd700 !important;
  font-weight: 600;
  padding: 0.5rem 1rem !important;
  border-radius: 8px;
  background: rgba(255, 215, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.nav-link-admin:hover {
  background: rgba(255, 215, 0, 0.2);
  transform: translateY(-2px);
}

/* User Profile Link */
.nav-link-user {
  color: white !important;
  font-weight: 500;
  padding: 0.5rem 1rem !important;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.nav-link-user:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* Cart Link */
.nav-link-cart {
  color: white !important;
  font-weight: 500;
  padding: 0.5rem 1rem !important;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.nav-link-cart:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* Admin Badge */
.badge-admin {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #333;
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
  }
  50% {
    box-shadow: 0 2px 12px rgba(255, 215, 0, 0.5);
  }
}

/* Dropdown Menu */
.dropdown-menu-modern {
  background: white;
  border: none;
  border-radius: 12px;
  padding: 0.5rem;
  margin-top: 0.5rem;
  min-width: 220px;
}

.dropdown-item-modern {
  color: #333;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.dropdown-item-modern:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateX(5px);
}

.dropdown-item-modern i {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
}

/* Buttons */
.btn-logout, .btn-login {
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  display: flex;
  align-items: center;
  text-decoration: none;
}

.btn-logout {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.btn-logout:hover {
  background: rgba(255, 59, 48, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 59, 48, 0.3);
}

.btn-login {
  background: rgba(255, 255, 255, 0.95);
  color: #667eea;
}

.btn-login:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
}

/* Mobile Responsive */
@media (max-width: 991px) {
  .navbar-nav {
    padding: 1rem 0;
    gap: 0.5rem !important;
  }

  .nav-link-modern,
  .nav-link-admin,
  .nav-link-user,
  .nav-link-cart {
    margin: 0.25rem 0;
  }

  .btn-logout,
  .btn-login {
    width: 100%;
    justify-content: center;
    margin: 0.5rem 0;
  }
}

/* Navbar Toggler */
.navbar-toggler {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.5rem;
}

.navbar-toggler:focus {
  box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.3);
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(255, 255, 255, 1)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}

/* Smooth Scrolling Effect */
@media (prefers-reduced-motion: no-preference) {
  .navbar-modern {
    transition: box-shadow 0.3s ease, transform 0.3s ease;
  }
}
</style>