<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <!-- Profile Card -->
        <div class="card shadow-lg border-0 overflow-hidden">
          <!-- Header Background -->
          <div class="profile-header bg-gradient-primary"></div>
          
          <div class="card-body p-0">
            <div class="row g-0">
              <!-- Profile Image Section -->
              <div class="col-md-4 text-center p-4 position-relative">
                <div class="profile-image-wrapper">
                  <div class="profile-image-container">
                    <img 
                      v-if="imgOK"
                      :src="`http://localhost:3000/img_mem/${memEmail}.jpg?timestamp=${imageTimestamp}`" 
                      :alt="memEmail"
                      class="profile-image"
                    >
                    <img 
                      v-else
                      :src="`http://localhost:3000/img_mem/default.jpg`" 
                      :alt="memEmail"
                      class="profile-image"
                    >
                    <div class="image-overlay">
                      <i class="bi bi-camera-fill"></i>
                    </div>
                  </div>
                </div>

                <!-- Upload Form -->
                <form @submit.prevent="uploadFile" class="mt-4">
                  <div class="upload-section">
                    <label for="formFile" class="btn btn-outline-primary w-100 mb-2">
                      <i class="bi bi-cloud-upload me-2"></i>เลือกรูปภาพ
                    </label>
                    <input 
                      class="d-none" 
                      type="file" 
                      id="formFile" 
                      @change="onFileChange" 
                      accept="image/*"
                      required 
                    />
                    
                    <!-- Show selected file name -->
                    <div v-if="file" class="selected-file mb-2">
                      <small class="text-muted">
                        <i class="bi bi-file-image me-1"></i>{{ file.name }}
                      </small>
                    </div>

                    <button 
                      class="btn btn-primary w-100" 
                      type="submit"
                      :disabled="!file || uploading"
                    >
                      <span v-if="!uploading">
                        <i class="bi bi-upload me-2"></i>อัปโหลด
                      </span>
                      <span v-else>
                        <span class="spinner-border spinner-border-sm me-2"></span>
                        กำลังอัปโหลด...
                      </span>
                    </button>
                  </div>

                  <!-- Upload Message -->
                  <transition name="fade">
                    <div v-if="fileMessage" class="mt-3">
                      <div 
                        :class="['alert', fileMessage === 'Upload ไม่สำเร็จ' ? 'alert-danger' : 'alert-success']" 
                        role="alert"
                      >
                        <i :class="['bi', fileMessage === 'Upload ไม่สำเร็จ' ? 'bi-x-circle' : 'bi-check-circle', 'me-2']"></i>
                        {{ fileMessage }}
                      </div>
                    </div>
                  </transition>
                </form>
              </div>

              <!-- Profile Info Section -->
              <div class="col-md-8 p-5">
                <div class="profile-info">
                  <div class="mb-4">
                    <h2 class="fw-bold text-primary mb-1">
                      <i class="bi bi-person-circle me-2"></i>{{ memName || 'ไม่ระบุชื่อ' }}
                    </h2>
                    <p class="text-muted mb-0">ข้อมูลสมาชิก</p>
                  </div>

                  <!-- Info Cards -->
                  <div class="row g-3">
                    <!-- Email Card -->
                    <div class="col-12">
                      <div class="info-card">
                        <div class="info-icon bg-primary">
                          <i class="bi bi-envelope-fill"></i>
                        </div>
                        <div class="info-content">
                          <label class="info-label">อีเมล</label>
                          <p class="info-value">{{ memEmail || 'ไม่ระบุ' }}</p>
                        </div>
                      </div>
                    </div>

                    <!-- Role Card -->
                    <div class="col-12">
                      <div class="info-card">
                        <div class="info-icon bg-success">
                          <i class="bi bi-shield-check"></i>
                        </div>
                        <div class="info-content">
                          <label class="info-label">บทบาท</label>
                          <p class="info-value">
                            <span class="badge bg-success">{{ role || 'ไม่ระบุ' }}</span>
                          </p>
                        </div>
                      </div>
                    </div>



                    <!-- Login Status -->
                    <div class="col-12">
                      <div class="info-card">
                        <div :class="['info-icon', login ? 'bg-success' : 'bg-secondary']">
                          <i :class="['bi', login ? 'bi-check-circle-fill' : 'bi-x-circle-fill']"></i>
                        </div>
                        <div class="info-content">
                          <label class="info-label">สถานะ</label>
                          <p class="info-value">
                            <span :class="['badge', login ? 'bg-success' : 'bg-secondary']">
                              {{ login ? 'เข้าสู่ระบบแล้ว' : 'ออกจากระบบ' }}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="mt-4 pt-3 border-top">
                    <div class="d-flex gap-2">
                      
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";

axios.defaults.withCredentials = true;

const member = ref(null);
const memEmail = ref(null);
const memName = ref(null);
const role = ref(null);
const dutyId = ref(null);
const login = ref(false);
const imgOK = ref(false);
const imageTimestamp = ref(Date.now());
const fileMessage = ref(null);
const file = ref(null);
const uploading = ref(false);

const getMember = async () => {
  try {
    const res = await axios.get(`http://localhost:3000/members/detail`);
    member.value = res.data;
    memEmail.value = member.value.memEmail;
    memName.value = member.value.memName;
    role.value = member.value.role;
    dutyId.value = member.value.dutyId;
    login.value = member.value.login;
  } catch (err) {
    console.log(err.message);
  }
};

const chkImage = async () => {
  const image = new Image();
  image.src = `http://localhost:3000/img_mem/${memEmail.value}.jpg?timestamp=${Date.now()}`;
  
  return new Promise((resolve) => {
    image.onload = () => {
      imgOK.value = true;
      resolve();
    };
    image.onerror = () => {
      imgOK.value = false;
      resolve();
    };
  });
};

const onFileChange = async (e) => {
  const selectedFile = e.target.files[0];
  if (selectedFile) {
    // ตรวจสอบประเภทไฟล์
    if (!selectedFile.type.startsWith('image/')) {
      fileMessage.value = 'กรุณาเลือกไฟล์รูปภาพเท่านั้น';
      file.value = null;
      return;
    }
    // ตรวจสอบขนาดไฟล์ (ไม่เกิน 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      fileMessage.value = 'ขนาดไฟล์ต้องไม่เกิน 5MB';
      file.value = null;
      return;
    }
    file.value = selectedFile;
    fileMessage.value = null;
  }
};

const uploadFile = async () => {
  if (!file.value) {
    fileMessage.value = "เลือก File เพื่อ Upload";
    return;
  }

  uploading.value = true;
  fileMessage.value = null;

  const formData = new FormData();
  formData.append("memEmail", memEmail.value);
  formData.append("file", file.value);

  try {
    const response = await axios.post(
      "http://localhost:3000/members/uploadImg",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    fileMessage.value = response.data.message;
    
    // รอสักครู่แล้วค่อยอัปเดตรูป
    setTimeout(async () => {
      imageTimestamp.value = Date.now();
      await chkImage();
      file.value = null;
      // Reset input file
      const fileInput = document.getElementById('formFile');
      if (fileInput) fileInput.value = '';
    }, 500);
  } catch (err) {
    fileMessage.value = "Upload ไม่สำเร็จ";
  } finally {
    uploading.value = false;
  }
};

onMounted(async () => {
  await getMember();
  await chkImage();
  imageTimestamp.value = Date.now();
});
</script>

<style scoped>
.bg-gradient-primary {
  background: linear-gradient(38deg, #aeeeb7 0%, #5da856 50%,#01a031 100%) !important;
  height: 120px;
}

.profile-header {
  position: relative;
}

.profile-image-wrapper {
  margin-top: -60px;
  position: relative;
  z-index: 10;
}

.profile-image-container {
  position: relative;
  width: 180px;
  height: 180px;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  border: 5px solid white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.profile-image-container:hover {
  transform: scale(1.05);
}

.profile-image-container:hover .image-overlay {
  opacity: 1;

}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-overlay i {
  font-size: 2rem;
  color: white;
}

.upload-section {
  margin-top: 1rem;
}

.selected-file {
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
  word-break: break-all;
}

.info-card {
  display: flex;
  align-items: center;
  padding: 1.25rem;
  background: #f8f9fa;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.info-card:hover {
  background: white;
  border-color: #e9ecef;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.info-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
}

.info-icon i {
  font-size: 1.5rem;
  color: white;
}

.info-content {
  flex: 1;
}

.info-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #6c757d;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #212529;
  margin: 0;
}

.badge {
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  font-weight: 600;
}

.btn {
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.alert {
  border-radius: 0.75rem;
  border: none;
  font-weight: 500;
}

.card {
  border-radius: 1rem;
  transition: transform 0.3s ease;
}

@media (max-width: 768px) {
  .profile-image-container {
    width: 150px;
    height: 150px;
  }

  .info-card {
    padding: 1rem;
  }

  .info-icon {
    width: 40px;
    height: 40px;
  }

  .info-icon i {
    font-size: 1.2rem;
  }
}
</style>