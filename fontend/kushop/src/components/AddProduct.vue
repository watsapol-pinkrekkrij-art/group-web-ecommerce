<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow">
          <div class="card-header bg-danger text-white">
            <h4 class="mb-0">
              <i class="bi bi-plus-circle"></i> เพิ่มสินค้าใหม่
            </h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleSubmit">
              <!-- รหัสสินค้า -->
              <div class="mb-3">
                <label class="form-label fw-bold">
                  รหัสสินค้า <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.pdId"
                  placeholder="เช่น 001"
                  required
                />
                <small class="text-muted">รหัสสินค้าต้องไม่ซ้ำกับที่มีอยู่ในระบบ</small>
              </div>

              <!-- ชื่อสินค้า -->
              <div class="mb-3">
                <label class="form-label fw-bold">
                  ชื่อสินค้า <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.pdName"
                  placeholder="ระบุชื่อสินค้า"
                  required
                />
              </div>

              <!-- ราคา -->
              <div class="mb-3">
                <label class="form-label fw-bold">ราคา (บาท)<span class="text-danger">*</span></label>
                <input
                  type="number"
                  class="form-control"
                  v-model="formData.pdPrice"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <!-- ประเภทสินค้า -->
              <div class="mb-3">
                <label class="form-label fw-bold">ประเภทสินค้า (Product Type ID)<span class="text-danger">*</span></label>
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.pdTypeId"
                  placeholder="เช่น T01"
                  required
                />
                <small class="text-muted">ระบุ ID ของประเภทสินค้า</small>
              </div>

              <!-- แบรนด์ -->
              <div class="mb-3">
                <label class="form-label fw-bold">แบรนด์ (Brand ID)<span class="text-danger">*</span></label>
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.brandId"
                  placeholder="เช่น B01"
                  required
                />
                <small class="text-muted">ระบุ ID ของแบรนด์</small>
              </div>

              <!-- หมายเหตุ -->
              <div class="mb-3">
                <label class="form-label fw-bold">หมายเหตุ / รายละเอียด</label>
                <textarea
                  class="form-control"
                  v-model="formData.pdRemark"
                  rows="4"
                  placeholder="รายละเอียดเพิ่มเติมของสินค้า..."
                ></textarea>
              </div>

              <!-- อัพโหลดรูปภาพ -->
              <div class="mb-3">
                <label class="form-label fw-bold">รูปภาพสินค้า<span class="text-danger">*</span></label>
                <input
                  type="file"
                  class="form-control"
                  @change="handleFileChange"
                  accept="image/*"
                  :disabled="!formData.pdId"
                  required
                />
                <small class="text-muted">
                  รองรับไฟล์ภาพ ขนาดไม่เกิน 5MB 
                  <span class="text-danger">(กรุณากรอกรหัสสินค้าก่อนเลือกรูป)</span>
                </small>
              </div>

              <!-- Preview รูปภาพ -->
              <div v-if="imagePreview" class="mb-3">
                <label class="form-label fw-bold">ตัวอย่างรูปภาพ</label>
                <div class="text-center">
                  <img
                    :src="imagePreview"
                    alt="Preview"
                    class="img-thumbnail"
                    style="max-width: 300px; max-height: 300px"
                  />
                </div>
              </div>

              <!-- ปุ่ม -->
              <div class="d-flex gap-2 mt-4">
                <button type="submit" class="btn btn-success btn-lg" :disabled="isSubmitting">
                  <span v-if="!isSubmitting">
                    <i class="bi bi-check-circle"></i> บันทึกสินค้า
                  </span>
                  <span v-else>
                    <span class="spinner-border spinner-border-sm me-2"></span>
                    กำลังบันทึก...
                  </span>
                </button>
                <button type="button" class="btn btn-secondary btn-lg" @click="resetForm">
                  <i class="bi bi-x-circle"></i> ล้างข้อมูล
                </button>
                <router-link to="/" class="btn btn-outline-dark btn-lg">
                  <i class="bi bi-arrow-left"></i> กลับ
                </router-link>
              </div>
            </form>
          </div>
        </div>

        <!-- Alert แสดงผลลัพธ์ -->
        <div
          v-if="alertMessage"
          class="alert alert-dismissible fade show mt-3"
          :class="alertType === 'success' ? 'alert-success' : 'alert-danger'"
          role="alert"
        >
          <strong>{{ alertType === 'success' ? '✓' : '✗' }}</strong>
          {{ alertMessage }}
          <button
            type="button"
            class="btn-close"
            @click="alertMessage = ''"
          ></button>
        </div>

        <!-- ข้อมูลที่บันทึกล่าสุด -->
        <div v-if="lastCreated" class="card mt-3 border-success">
          <div class="card-header bg-success text-white">
            <h5 class="mb-0">
              <i class="bi bi-check-circle"></i> สินค้าที่เพิ่งเพิ่ม
            </h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <p><strong>รหัสสินค้า:</strong> {{ lastCreated.pdId }}</p>
                <p><strong>ชื่อสินค้า:</strong> {{ lastCreated.pdName }}</p>
                <p><strong>ราคา:</strong> {{ formatPrice(lastCreated.pdPrice) }}</p>
              </div>
              <div class="col-md-6">
                <p><strong>ประเภท:</strong> {{ lastCreated.pdTypeId || '-' }}</p>
                <p><strong>แบรนด์:</strong> {{ lastCreated.brandId || '-' }}</p>
                <p><strong>วันที่สร้าง:</strong> {{ formatDate(lastCreated.createdDate) }}</p>
              </div>
            </div>
            <router-link :to="`/ProductShow/${lastCreated.pdId}`" class="btn btn-sm btn-outline-success">
              <i class="bi bi-eye"></i> ดูสินค้านี้
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

axios.defaults.withCredentials = true;
const router = useRouter();

const formData = ref({
  pdId: '',
  pdName: '',
  pdPrice: null,
  pdRemark: '',
  pdTypeId: '',
  brandId: ''
});

const selectedFile = ref(null);
const imagePreview = ref(null);
const alertMessage = ref('');
const alertType = ref('success');
const isSubmitting = ref(false);
const lastCreated = ref(null);

// จัดการการเลือกไฟล์
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    // ตรวจสอบขนาดไฟล์
    if (file.size > 5 * 1024 * 1024) {
      showAlert('ไฟล์มีขนาดใหญ่เกิน 5MB', 'danger');
      event.target.value = '';
      return;
    }

    selectedFile.value = file;
    
    // สร้าง preview
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// บันทึกสินค้า
const handleSubmit = async () => {
  isSubmitting.value = true;
  
  try {
    // 1. บันทึกข้อมูลสินค้าก่อน
    const response = await axios.post(
      'http://localhost:3000/products',
      formData.value
    );

    console.log('Product created:', response.data);
    lastCreated.value = response.data;

    // 2. ถ้ามีรูปภาพ ให้อัพโหลด
    if (selectedFile.value) {
      await uploadImage();
    }

    showAlert('เพิ่มสินค้าสำเร็จ!', 'success');
    resetForm();
    
    // เลื่อนขึ้นด้านบน
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
  } catch (error) {
    console.error('Error:', error);
    
    if (error.response?.status === 409) {
      showAlert('รหัสสินค้านี้มีอยู่ในระบบแล้ว กรุณาใช้รหัสอื่น', 'danger');
    } else if (error.response?.status === 422) {
      showAlert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน', 'danger');
    } else {
      showAlert(
        error.response?.data?.message || 'เกิดข้อผิดพลาดในการเพิ่มสินค้า',
        'danger'
      );
    }
  } finally {
    isSubmitting.value = false;
  }
};

// อัพโหลดรูปภาพ
const uploadImage = async () => {
  try {
    const formDataImg = new FormData();

    formDataImg.append('pdId', formData.value.pdId);
    formDataImg.append('file', selectedFile.value);
    

    const response = await axios.post(
      'http://localhost:3000/products/uploadimg',
      formDataImg,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    console.log('Image uploaded:', response.data);
  } catch (error) {
    console.error('Upload error:', error);
    showAlert('อัพโหลดรูปภาพไม่สำเร็จ แต่ข้อมูลสินค้าบันทึกแล้ว', 'danger');
  }
};

// รีเซ็ตฟอร์ม
const resetForm = () => {
  formData.value = {
    pdId: '',
    pdName: '',
    pdPrice: null,
    pdRemark: '',
    pdTypeId: '',
    brandId: ''
  };
  selectedFile.value = null;
  imagePreview.value = null;
  
  // เคลียร์ input file
  const fileInput = document.querySelector('input[type="file"]');
  if (fileInput) fileInput.value = '';
};

// แสดง Alert
const showAlert = (message, type) => {
  alertMessage.value = message;
  alertType.value = type;
  setTimeout(() => {
    alertMessage.value = '';
  }, 5000);
};

// ฟอร์แมตราคา
const formatPrice = (price) => {
  return price ? `${parseFloat(price).toFixed(2)} บาท` : '-';
};

// ฟอร์แมตวันที่
const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleString('th-TH');
};
</script>

<style scoped>
.card {
  border: none;
  border-radius: 12px;
}

.card-header {
  border-radius: 12px 12px 0 0 !important;
  padding: 1.25rem;
}

.form-label {
  margin-bottom: 0.5rem;
  color: #333;
}

.form-control:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.alert {
  border-radius: 8px;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.img-thumbnail {
  border: 3px solid #dee2e6;
  border-radius: 8px;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
  border-width: 0.15em;
}
</style>