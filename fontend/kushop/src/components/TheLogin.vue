<template>
  <div class="login-container">
    <!-- Background Decoration -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <div class="login-wrapper">
      <!-- Logo Section -->
      <div class="logo-section">
        <div class="logo-box">
          <img src="../components/assets/Ihaveku_logo.png" alt="Logo" class="logo-image w-100">
          <div class="logo-glow "></div>
        </div>
        <h2 class="welcome-text">ยินดีต้อนรับกลับมา</h2>
        <p class="welcome-subtitle">เข้าสู่ระบบเพื่อดำเนินการต่อ</p>
      </div>

      <!-- Login Form Section -->
      <div class="form-section">
        <div class="card-glass">
          <div class="card-header-custom">
            <h3 class="form-title">เข้าสู่ระบบ</h3>
            <div class="title-underline"></div>
          </div>

          <form @submit.prevent="handleSubmit()">
            <!-- Email Input -->
            <div class="input-group-custom">
              <div class="input-icon">
                <i class="bi bi-envelope-fill"></i>
              </div>
              <div class="form-floating">
                <input 
                  class="form-control form-control-custom" 
                  type="email" 
                  id="loginName" 
                  v-model="loginName"
                  autocomplete="off" 
                  required 
                  autofocus 
                  placeholder="อีเมล">
                <label for="loginName">อีเมล</label>
              </div>
            </div>

            <!-- Password Input -->
            <div class="input-group-custom">
              <div class="input-icon">
                <i class="bi bi-lock-fill"></i>
              </div>
              <div class="form-floating">
                <input 
                  class="form-control form-control-custom" 
                  type="password" 
                  id="password" 
                  v-model="password"
                  required 
                  placeholder="รหัสผ่าน">
                <label for="password">รหัสผ่าน</label>
              </div>
            </div>

            <!-- Buttons -->
            <div class="button-group">
              <button class="btn btn-primary-custom" type="submit">
                <i class="bi bi-box-arrow-in-right"></i>
                <span>เข้าสู่ระบบ</span>
              </button>
              
              <router-link to="/register" class="btn btn-register-custom">
                <i class="bi bi-person-plus-fill"></i>
                <span>สมัครสมาชิก</span>
              </router-link>
            </div>
          </form>

          <!-- Status Message -->
          <transition name="fade">
            <div v-if="message" class="alert-container">
              <div v-if="login" class="alert-custom alert-success-custom">
                <i class="bi bi-check-circle-fill"></i>
                <span>{{ message }}</span>
              </div>
              <div v-else class="alert-custom alert-danger-custom">
                <i class="bi bi-exclamation-circle-fill"></i>
                <span>{{ message }}</span>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import axios from "axios";

axios.defaults.withCredentials = true;

const authStore = useAuthStore();
const router = useRouter();
const loginName = ref(null);
const password = ref(null);
const login = ref(null);
const message = ref(null);

onMounted(async () => {
  const isLoggedIn = await checkLogin();
  if (isLoggedIn) {
    router.push("/pagemember");
  }
});

const checkLogin = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/members/detail`);
    if (response.data.login) {
      login.value = true;
      return true;
    }
    return false;
  } catch (err) {
    // ไม่แสดง error เพราะเป็นเรื่องปกติที่ยังไม่ได้ login
    if (err.response?.status === 401) {
      // Unauthorized - ยังไม่ได้ login (ปกติ)
      login.value = false;
      return false;
    }
    // Error อื่นๆ ให้แสดง
    console.error("Error checking login:", err.message);
    login.value = false;
    return false;
  }
};

const handleSubmit = async () => {
  let members = {
    loginName: loginName.value,
    password: password.value,
  };
  
  try {
    const response = await axios.post(
      `http://localhost:3000/members/login`,
      members
    );
    
    console.log(response.data);
    login.value = response.data.login;
    message.value = response.data.message;
    
    if (login.value) {
      authStore.login();
      
      if (response.data.role === 'admin') {
        router.push("/");
      } else {
        router.push("/");
      }
    }
  } catch (err) {
    console.error("Login error:", err);
    message.value = "เกิดข้อผิดพลาดในการเข้าสู่ระบบ";
    login.value = false;
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #ffffff 0%, #007219 100%);
  position: relative;
  overflow: hidden;
  padding: 2rem 1rem;
}

/* Background Decoration */
.bg-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 20s infinite ease-in-out;
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.circle-2 {
  width: 200px;
  height: 200px;
  bottom: -50px;
  right: 10%;
  animation-delay: 5s;
}

.circle-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  right: -75px;
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* Main Wrapper */
.login-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  max-width: 1100px;
  width: 100%;
  position: relative;
  z-index: 1;
}

/* Logo Section */
.logo-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
  margin-top:-6rem;
}

.logo-box {
  position: relative;
  margin-bottom: 2rem;


}

.logo-image {
  width: 80%;
  max-width: 500px;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
  animation: logoFloat 3s ease-in-out infinite;
}

@keyframes logoFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.logo-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 120%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

.welcome-text {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-top: -10rem;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.welcome-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 300;
}

/* Form Section */
.form-section {
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-glass {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 450px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.card-header-custom {
  text-align: center;
  margin-bottom: 2rem;
}

.form-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.title-underline {
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  margin: 0 auto;
  border-radius: 2px;
}

/* Input Groups */
.input-group-custom {
  position: relative;
  margin-bottom: 1.5rem;
}

.input-icon {
  position: absolute;
  left: 0;
  top: 0;
  width: 50px;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  font-size: 1.2rem;
  z-index: 10;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border-radius: 10px 0 0 10px;
}

.form-control-custom {
  padding-left: 60px;
  height: 58px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-control-custom:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
  background: white;
}

.form-floating > label {
  padding-left: 60px;
  color: #666;
}

/* Buttons */
.button-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-primary-custom {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  padding: 1rem;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary-custom:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
  background: linear-gradient(135deg, #7b92f0 0%, #8a5db8 100%);
}

.btn-register-custom {
  background: white;
  border: 2px solid #667eea;
  color: #667eea;
  padding: 1rem;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-register-custom:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

/* Alert Messages */
.alert-container {
  margin-top: 1.5rem;
}

.alert-custom {
  padding: 1rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.alert-success-custom {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  color: #155724;
  border: 1px solid #c3e6cb;
}

.alert-danger-custom {
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.alert-custom i {
  font-size: 1.3rem;
}

/* Fade Transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Responsive Design */
@media (max-width: 992px) {
  .login-wrapper {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .logo-section {
    display: none;
  }

  .card-glass {
    max-width: 500px;
  }
}

@media (max-width: 576px) {
  .card-glass {
    padding: 2rem 1.5rem;
  }

  .welcome-text {
    font-size: 2rem;
  }

  .form-title {
    font-size: 1.5rem;
  }

  .input-icon {
    width: 45px;
  }

  .form-control-custom {
    padding-left: 55px;
  }

  .form-floating > label {
    padding-left: 55px;
  }
}
</style>