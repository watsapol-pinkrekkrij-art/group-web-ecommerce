<template>
    <div class="container py-5">
        <!-- Header Section -->
        <div class="row mb-4">
            <div class="col-12">
                <div class="card shadow-sm border-0 bg-gradient-primary">
                    <div class="card-body p-4">
                        <div class="d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center">
                                <div class="icon-wrapper me-3">
                                    <i class="bi bi-cart-check-fill"></i>
                                </div>
                                <div>
                                    <h3 class="text-white mb-1 fw-bold">รายการตะกร้าสินค้า</h3>
                                    <p class="text-white-50 mb-0">
                                        <i class="bi bi-person-circle me-2"></i>{{ memEmail || 'กำลังโหลด...' }}
                                    </p>
                                </div>
                            </div>
                            <div class="text-end">
                                <div class="badge bg-white text-primary fs-5 px-3 py-2">
                                    <i class="bi bi-basket3 me-2"></i>
                                    <span class="fw-bold">{{ cart.length }}</span> รายการ
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Summary Cards -->
        <div class="row g-3 mb-4">
            <div class="col-md-4">
                <div class="card stat-card border-0 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex align-items-center">
                            <div class="stat-icon bg-primary bg-opacity-10 text-primary">
                                <i class="bi bi-receipt"></i>
                            </div>
                            <div class="ms-3">
                                <p class="text-muted mb-0 small">ทั้งหมด</p>
                                <h4 class="mb-0 fw-bold">{{ cart.length }}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card stat-card border-0 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex align-items-center">
                            <div class="stat-icon bg-success bg-opacity-10 text-success">
                                <i class="bi bi-check-circle-fill"></i>
                            </div>
                            <div class="ms-3">
                                <p class="text-muted mb-0 small">ยืนยันแล้ว</p>
                                <h4 class="mb-0 fw-bold">{{ confirmedCount }}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card stat-card border-0 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex align-items-center">
                            <div class="stat-icon bg-info bg-opacity-10 text-info">
                                <i class="bi bi-currency-dollar"></i>
                            </div>
                            <div class="ms-3">
                                <p class="text-muted mb-0 small">ยอดรวม</p>
                                <h4 class="mb-0 fw-bold">{{ totalAmount.toLocaleString() }} ฿</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3 text-muted">กำลังโหลดข้อมูล...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="cart.length === 0" class="empty-state text-center py-5">
            <div class="empty-icon mb-4">
                <i class="bi bi-cart-x"></i>
            </div>
            <h4 class="text-muted mb-3">ไม่มีรายการในตะกร้า</h4>
            <p class="text-muted">เริ่มเลือกสินค้าเพื่อเพิ่มลงในตะกร้าของคุณ</p>
            <router-link to="/">
                <button class="btn btn-primary mt-3">
                    <i class="bi bi-shop me-2"></i>เริ่มช้อปปิ้ง
                </button>
            </router-link>
            
        </div>

        <!-- Table Section -->
        <div v-else class="card shadow-sm border-0">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th class="px-4 py-3">#</th>
                                <th class="py-3">เลขที่</th>
                                <th class="py-3">วันที่</th>
                                <th class="text-center py-3">จำนวน</th>
                                <th class="text-end py-3">ยอดเงิน</th>
                                <th class="text-center py-3">สถานะ</th>
                                <th class="text-center py-3">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr 
                                v-for="ct in cart" 
                                :key="ct.cartId" 
                                class="cart-row"
                            >
                                <td class="px-4">
                                    <span class="badge bg-light text-dark">{{ ct.row_number }}</span>
                                </td>
                                <td>
                                    <router-link 
                                        :to="`/cartshow/${ct.cartId}`" 
                                        class="cart-link fw-semibold"
                                    >
                                        <i class="bi bi-file-text me-2"></i>{{ ct.cartId }}
                                    </router-link>
                                </td>
                                <td>
                                    <span class="text-muted">
                                        <i class="bi bi-calendar3 me-2"></i>{{ formattedDate(ct.cartDate) }}
                                    </span>
                                </td>
                                <td class="text-center">
                                    <span class="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                                        {{ (ct.sqty ?? 0) }} ชิ้น
                                    </span>
                                </td>
                                <td class="text-end">
                                    <span class="fw-bold text-success">
                                        {{ (ct.sprice ?? 0).toLocaleString() }} ฿
                                    </span>
                                </td>
                                <td class="text-center">
                                    <span 
                                        v-if="ct.cartCf" 
                                        class="badge bg-success"
                                        title="ยืนยันแล้ว"
                                    >
                                        <i class="bi bi-check-circle-fill me-1"></i>ยืนยัน
                                    </span>
                                    <span 
                                        v-else 
                                        class="badge bg-warning text-dark"
                                        title="รอการยืนยัน"
                                    >
                                        <i class="bi bi-clock-fill me-1"></i>รอยืนยัน
                                    </span>
                                </td>
                                <td class="text-center">
                                    <button 
                                        class="btn btn-sm btn-outline-danger"
                                        @click="delCart(ct.cartId)"
                                        title="ลบรายการ"
                                    >
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div v-if="cart.length > 0" class="d-flex justify-content-between align-items-center mt-4">
            <div class="text-muted">
                แสดง <span class="fw-bold">{{ cart.length }}</span> รายการ
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router'; // ✅ เพิ่ม import router
import axios from 'axios';
import { useCartStore } from "@/stores/cartStore";


axios.defaults.withCredentials = true;
const cartStore = useCartStore();
const router = useRouter(); // ✅ เพิ่มการใช้ router
const cart = ref([]);
const memEmail = ref(null);
const loading = ref(true);

// Computed Properties
const confirmedCount = computed(() => {
    return cart.value.filter(item => item.cartCf).length;
});

const totalAmount = computed(() => {
    return cart.value.reduce((sum, item) => sum + (item.sprice ?? 0), 0);
});

const formattedDate = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
};

const getMember = async () => {
    try {
        const res = await axios.get(`http://localhost:3000/members/detail`);
        memEmail.value = res.data.memEmail;
    } catch (err) {
        console.log(err.message);
    }
};

const getCartList = async () => {
    try {
        let customer = { id: memEmail.value };
        const res = await axios.post(`http://localhost:3000/carts/getcartbycus`, customer);
        cart.value = res.data;
    } catch (err) {
        console.error(err);
    } finally {
        loading.value = false;
    }
};

// ✅ แก้ไขฟังก์ชัน delCart ให้รับ parameter cartId
const delCart = async (cartId) => {
  if (!confirm(`ยืนยันลบตะกร้าเลขที่ ${cartId} ใช่ไหม?`)) return;

  try {
    console.log("cartId ส่งไป backend:", cartId);
    
    // ✅ ส่ง cartId ที่รับมาจาก parameter
    const res = await axios.post(`http://localhost:3000/carts/delcart`, {
      cartId: cartId, // ส่ง cartId ที่ได้รับจากปุ่มที่กด
    });

    if (res.data.cartOK) {
      alert(res.data.messageDelCart);
      
      // ✅ โหลดรายการตะกร้าใหม่แทนการ redirect
      await getCartList();
      
      cartStore.updateQty();
    } else {
      alert(`เกิดข้อผิดพลาด: ${res.data.messageDelCart}`);
    }
  } catch (err) {
    console.error(err);
    alert("ไม่สามารถลบตะกร้าที่ยืนยันแล้วได้: " + err.message);
  }
};

onMounted(async () => {
    await getMember();
    await getCartList();
});
</script>

<style scoped>
.bg-gradient-primary {
    background: linear-gradient(38deg, #01a031 0%, #5da856 50%,#82c295 100%) !important;
}

.icon-wrapper {
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    color: white;
}

.stat-card {
    transition: all 0.3s ease;
    border-radius: 12px;
}

.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
}

.stat-icon {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
}

.table {
    font-size: 0.95rem;
}

.table thead th {
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 0.5px;
    border-bottom: 2px solid #dee2e6;
}

.cart-row {
    transition: all 0.2s ease;
}

.cart-row:hover {
    background-color: #f8f9fa;
    transform: scale(1.01);
}

.cart-link {
    color: #667eea;
    text-decoration: none;
    transition: all 0.2s ease;
}

.cart-link:hover {
    color: #764ba2;
    text-decoration: underline;
}

.badge {
    font-weight: 600;
    padding: 0.4rem 0.8rem;
}

.btn-outline-danger {
    border-radius: 8px;
    transition: all 0.3s ease;
}

.btn-outline-danger:hover {
    transform: scale(1.1);
}

.empty-state .empty-icon {
    font-size: 5rem;
    color: #dee2e6;
}

.card {
    border-radius: 12px;
    overflow: hidden;
}



@media (max-width: 768px) {
    .icon-wrapper {
        width: 50px;
        height: 50px;
        font-size: 1.5rem;
    }

    .stat-icon {
        width: 40px;
        height: 40px;
        font-size: 1.2rem;
    }

    .table {
        font-size: 0.85rem;
    }

    .badge {
        font-size: 0.75rem;
        padding: 0.3rem 0.6rem;
    }
}
</style>