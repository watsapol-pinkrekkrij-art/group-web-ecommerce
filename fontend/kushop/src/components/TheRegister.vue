<template>
    <div class="row d-flex justify-content-center py-5">
        <div class="col-lg-5 col-md-7 col-sm-10">
            <!-- แสดงสถานะการลงทะเบียน -->
            <transition name="fade">
                <div v-if="message" class="mb-4">
                    <div :class="['alert', regist ? 'alert-success' : 'alert-danger', 'd-flex', 'align-items-center']" role="alert">
                        <i :class="['bi', regist ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill', 'me-2']" style="font-size: 1.5rem;"></i>
                        <div>
                            <strong>{{ regist ? 'สำเร็จ!' : 'ผิดพลาด!' }}</strong>
                            <p class="mb-0">{{ message }}</p>
                        </div>
                    </div>
                </div>
            </transition>

            <form @submit.prevent="handleSubmit">
                <div class="card shadow-lg border-0">
                    <div class="card-body p-5">
                        <!-- Header -->
                        <div class="text-center mb-4">
                            <div class="mb-3">
                                <i class="bi bi-person-circle text-primary" style="font-size: 4rem;"></i>
                            </div>
                            <h2 class="card-title fw-bold text-primary mb-2">ลงทะเบียนสมาชิกใหม่</h2>
                            <p class="text-muted">กรุณากรอกข้อมูลเพื่อสร้างบัญชีของคุณ</p>
                        </div>

                        <!-- Email Input -->
                        <div class="mb-4">
                            <div class="form-floating">
                                <input 
                                    type="email" 
                                    class="form-control border-2" 
                                    id="memEmail"
                                    autocomplete="off" 
                                    required 
                                    placeholder="Email" 
                                    v-model.trim="memEmail"
                                    :disabled="loading"
                                >
                                <label for="memEmail">
                                    <i class="bi bi-envelope me-2"></i>อีเมล
                                </label>
                            </div>
                        </div>

                        <!-- Name Input -->
                        <div class="mb-4">
                            <div class="form-floating">
                                <input 
                                    type="text" 
                                    class="form-control border-2" 
                                    id="memName"  
                                    autocomplete="off" 
                                    required 
                                    placeholder="ชื่อ" 
                                    v-model.trim="memName"
                                    :disabled="loading"
                                >
                                <label for="memName">
                                    <i class="bi bi-person me-2"></i>ชื่อ-นามสกุล
                                </label>
                            </div>
                        </div>

                        <!-- Password Input -->
                        <div class="mb-4">
                            <div class="form-floating position-relative">
                                <input 
                                    :type="showPassword ? 'text' : 'password'" 
                                    class="form-control border-2" 
                                    id="password"  
                                    autocomplete="off" 
                                    required 
                                    placeholder="Password"
                                    v-model="password"
                                    :disabled="loading"
                                >
                                <label for="password">
                                    <i class="bi bi-lock me-2"></i>รหัสผ่าน
                                </label>
                                <button 
                                    type="button" 
                                    class="btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted"
                                    @click="showPassword = !showPassword"
                                    style="z-index: 10;"
                                    :disabled="loading"
                                >
                                    <i :class="['bi', showPassword ? 'bi-eye-slash' : 'bi-eye']"></i>
                                </button>
                            </div>

                        </div>

                        <!-- Submit Button -->
                        <div class="d-grid gap-2 mt-4">
                            <button 
                                class="btn btn-primary btn-lg py-3" 
                                type="submit"
                                :disabled="loading"
                            >
                                <span v-if="!loading">
                                    <i class="bi bi-check-circle me-2"></i>ลงทะเบียน
                                </span>
                                <span v-else>
                                    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    กำลังดำเนินการ...
                                </span>
                            </button>
                        </div>

                        <!-- Footer -->
                        <div class="text-center mt-4">
                            
                            <p class="text-muted mb-0">
                                มีบัญชีอยู่แล้ว? 
                                <router-link to ="/login"><a href="#" class="text-primary text-decoration-none fw-bold">เข้าสู่ระบบ</a></router-link>
                                    
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const memEmail = ref(null);
const memName = ref(null);
const password = ref(null);
const regist = ref(null);
const message = ref(null);
const loading = ref(false);
const showPassword = ref(false);

const handleSubmit = async () => {
    loading.value = true;
    message.value = null;
    
    let members = {
        memEmail: memEmail.value,
        memName: memName.value,
        password: password.value
    };
    
    try {
        const response = await axios.post(`http://localhost:3000/members`, members);
        console.log(response.data);
        regist.value = response.data.regist;
        message.value = response.data.message;
        
        // ถ้าลงทะเบียนสำเร็จ ล้างฟอร์ม
        if (response.data.regist) {
            memEmail.value = null;
            memName.value = null;
            password.value = null;
        }
    } catch (err) {
        console.log(err);
        regist.value = false;
        message.value = err.response?.data?.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ';
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.card {
    border-radius: 1rem;
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
}

.form-control {
    border-radius: 0.5rem;
    padding: 1rem 1rem 1rem 3rem;
}

.form-control:focus {
    border-color: #0d6efd;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
}

.form-floating > label {
    padding-left: 1rem;
}

.btn-primary {
    border-radius: 0.5rem;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(13, 110, 253, 0.3);
}

.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
}

.alert {
    border-radius: 0.75rem;
    border: none;
}
</style>