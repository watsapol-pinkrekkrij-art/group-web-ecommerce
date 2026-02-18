<template>
  <div class="cart-container">
    <!-- Background Decorations -->
    <div class="bg-decoration"></div>
    <div class="bg-decoration-2"></div>

    <div v-if="memEmail == cusId" class="content-wrapper">
      <!-- Modern Header with Glass Effect -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-icon">
            <i class="bi bi-bag-check-fill"></i>
          </div>
          <div>
            <h1 class="header-title">รายการสั่งซื้อ</h1>
            <p class="header-subtitle">จัดการและตรวจสอบคำสั่งซื้อของคุณ</p>
          </div>
        </div>
      </div>

      <!-- Cart Master Card with Glassmorphism -->
      <div v-for="(ct, index) in cart" :key="index" class="cart-master-card">
        <div class="card-glow"></div>
        
        <div class="card-header-modern">
          <div class="order-info">
            <div class="order-badge">
              <i class="bi bi-receipt"></i>
            </div>
            <div>
              <div class="order-number">คำสั่งซื้อ #{{ ct.cartId }}</div>
              <div class="order-date">
                <i class="bi bi-calendar3"></i>
                {{ formattedDate(ct.cartDate) }}
              </div>
            </div>
          </div>

          <div class="status-badge-wrapper">
            <div v-if="ct.cartCf" class="status-badge status-confirmed">
              <div class="status-icon">
                <i class="bi bi-check-circle-fill"></i>
              </div>
              <div class="status-text">
                <span class="status-label">สถานะ</span>
                <span class="status-value">ยืนยันแล้ว</span>
              </div>
            </div>
            <div v-else class="status-badge status-pending">
              <div class="status-icon">
                <i class="bi bi-hourglass-split"></i>
              </div>
              <div class="status-text">
                <span class="status-label">สถานะ</span>
                <span class="status-value">รอยืนยัน</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary Stats -->
        <div class="summary-stats">
          <div class="stat-card">
            <div class="stat-icon stat-icon-primary">
              <i class="bi bi-box2-heart"></i>
            </div>
            <div class="stat-content">
              <div class="stat-label">จำนวนสินค้า</div>
              <div class="stat-value">{{ ct.sqty }} <span class="stat-unit">ชิ้น</span></div>
            </div>
          </div>

          <div class="stat-divider"></div>

          <div class="stat-card">
            <div class="stat-icon stat-icon-success">
              <i class="bi bi-cash-stack"></i>
            </div>
            <div class="stat-content">
              <div class="stat-label">ยอดเงินรวม</div>
              <div class="stat-value stat-value-price">
                ฿{{ (ct.sprice ?? 0).toLocaleString() }}
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div v-if="!ct.cartCf" class="action-buttons">
          <button class="btn-modern btn-danger-outline" @click="delCart">
            <span class="btn-icon">
              <i class="bi bi-trash3"></i>
            </span>
            <span class="btn-text">ลบตะกร้า</span>
          </button>
          <button class="btn-modern btn-primary-gradient" @click="confirmCart">
            <span class="btn-icon">
              <i class="bi bi-check2-circle"></i>
            </span>
            <span class="btn-text">ยืนยันคำสั่งซื้อ</span>
            <span class="btn-shine"></span>
          </button>
        </div>

        <div v-else class="confirmed-message">
          <i class="bi bi-shield-check"></i>
          <span>คำสั่งซื้อนี้ได้รับการยืนยันแล้ว ไม่สามารถแก้ไขได้</span>
        </div>
      </div>

      <!-- Product Table with Modern Design -->
      <div class="products-section">
        <div class="section-header">
          <h2 class="section-title">
            <i class="bi bi-list-check"></i>
            รายละเอียดสินค้า
          </h2>
        </div>

        <div class="table-wrapper">
          <table class="products-table">
            <thead>
              <tr>
                <th class="col-number">#</th>
                <th class="col-id">รหัส</th>
                <th class="col-name">ชื่อสินค้า</th>
                <th class="col-price">ราคา/หน่วย</th>
                <th class="col-qty">จำนวน</th>
                <th class="col-total">รวม</th>
                <th class="col-action">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(ctd, index) in cartDtl" :key="index" class="product-row">
                <td class="col-number">
                  <div class="row-number">{{ ctd.row_number }}</div>
                </td>
                <td class="col-id">
                  <div class="product-id">{{ ctd.pdId }}</div>
                </td>
                <td class="col-name">
                  <div class="product-name">{{ ctd.pdName }}</div>
                </td>
                <td class="col-price">
                  <div class="price-tag">฿{{ ctd.price.toLocaleString() }}</div>
                </td>
                <td class="col-qty">
                  <div class="qty-badge">{{ ctd.qty }}</div>
                </td>
                <td class="col-total">
                  <div class="total-price">฿{{ (ctd.price * ctd.qty).toLocaleString() }}</div>
                </td>
                <td class="col-action">
                  <button
                    v-if="!isCartConfirmed"
                    class="delete-btn"
                    @click="delCartDtlItem(ctd.pdId, ctd.qty)"
                    title="ลบสินค้า"
                  >
                    <i class="bi bi-x-lg"></i>
                  </button>
                  <span v-else class="no-action">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- No Permission State -->
    <div v-else class="no-permission">
      <div class="error-icon">
        <i class="bi bi-shield-x"></i>
      </div>
      <h2 class="error-title">ไม่มีสิทธิ์เข้าถึง</h2>
      <p class="error-message">คุณไม่สามารถดูรายการสั่งซื้อนี้ได้</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

axios.defaults.withCredentials = true;
import { useCartStore } from "@/stores/cartStore";

const cartStore = useCartStore();
const route = useRoute();
const router = useRouter();

const cart = ref([]);
const cartDtl = ref([]);
const cartId = ref(null);
const cusId = ref(null);
const memEmail = ref(null);

const isCartConfirmed = computed(() => {
  return cart.value.length > 0 && cart.value[0].cartCf === true;
});

const formattedDate = (dateStr) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}/${month}/${year}`;
};

onMounted(async () => {
  await getMember();
  cartId.value = route.params.cartId;
  console.log("CartShow:" + cartId.value);
  await getCart();
  await getCartDtl();
});

const getCart = async () => {
  console.log("Get Cart:" + cartId.value);
  try {
    const res = await axios.get(
      `http://localhost:3000/carts/getcart/${cartId.value}`
    );
    cart.value = res.data;
    if (cart.value.length > 0) {
      cusId.value = cart.value[0].cusId;
    }
  } catch (err) {
    console.error(err);
    alert("ไม่สามารถโหลดข้อมูลตะกร้าได้");
  }
};

const getCartDtl = async () => {
  console.log("Get Cart Detail:" + cartId.value);
  try {
    const res = await axios.get(
      `http://localhost:3000/carts/getcartdtl/${cartId.value}`
    );
    cartDtl.value = res.data;
  } catch (err) {
    console.error(err);
    alert("ไม่สามารถโหลดรายละเอียดตะกร้าได้");
  }
};

const getMember = async () => {
  try {
    const res = await axios.get(`http://localhost:3000/members/detail`);
    memEmail.value = res.data.memEmail;
  } catch (err) {
    console.log(err.message);
    alert("กรุณา Login ก่อนเข้าใช้งาน");
    router.push("/login");
  }
};

const delCartDtlItem = async (pdId, qty) => {
  if (!confirm(`ยืนยันลบสินค้า ${pdId} ออกจากตะกร้าใช่ไหม?`)) return;

  try {
    const res = await axios.post(`http://localhost:3000/carts/delcartdtl`, {
      cartId: cartId.value,
      pdId: pdId,
    });

    if (res.data.cartDtlOK) {
      alert(res.data.messageDelCartDtl);
      await getCartDtl();
      await getCart();
      cartStore.updateQty();
    } else {
      alert(`เกิดข้อผิดพลาด: ${res.data.messageDelCartDtl}`);
    }
  } catch (err) {
    console.error(err);
    alert("ไม่สามารถลบสินค้าได้");
  }
};

const delCart = async () => {
  if (!confirm(`ยืนยันลบตะกร้าทั้งหมดใช่ไหม?`)) return;

  try {
    const res = await axios.post(`http://localhost:3000/carts/delcart`, {
      cartId: cartId.value,
    });

    if (res.data.cartOK) {
      alert(res.data.messageDelCart);
      
      if (cartStore.clearCart) {
        cartStore.clearCart();
      } else {
        cartStore.updateQty();
      }
      
      router.push("/");
    } else {
      alert(`เกิดข้อผิดพลาด: ${res.data.messageDelCart}`);
    }
  } catch (err) {
    console.error(err);
    alert("ไม่สามารถลบตะกร้าได้: " + err.message);
  }
};

const confirmCart = async () => {
  if (!confirm("ยืนยันสั่งสินค้าใช่ไหม?")) return;

  try {
    const res = await axios.post(`http://localhost:3000/carts/confirmcart`, {
      cartId: cartId.value,
    });

    if (res.data.cartOK) {
      alert(res.data.messageConfirmCart);
      await getCart();
    } else {
      alert(`เกิดข้อผิดพลาด: ${res.data.messageConfirmCart}`);
    }
    if (cartStore.clearCart) {
        cartStore.clearCart();
      } else {
        cartStore.updateQty();
      }
    router.push("/");
  } catch (err) {
    console.error(err);
    alert("ไม่สามารถยืนยันคำสั่งซื้อได้");
  }
};
</script>

<style scoped>
/* Base Container */
.cart-container {
  min-height: 100vh;
  background: white;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

/* Background Decorations */
.bg-decoration {
  position: absolute;
  top: -10%;
  right: -5%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.bg-decoration-2 {
  position: absolute;
  bottom: -15%;
  left: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

/* Content Wrapper */
.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* Modern Page Header */
.page-header {
  background: rgb(255, 255, 255);
  border-radius: 24px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(94, 22, 22, 0.1);
  animation: slideDown 0.6s ease;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.header-icon {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

.header-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: rgb(0, 0, 0);
  margin: 0;
  letter-spacing: -0.5px;
}

.header-subtitle {
  color: rgba(0, 0, 0, 0.9);
  margin: 0.5rem 0 0 0;
  font-size: 1.1rem;
  font-weight: 300;
}

/* Cart Master Card - Glassmorphism */
.cart-master-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 28px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
  animation: slideUp 0.6s ease;
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #667eea);
  background-size: 200% 100%;
  animation: gradientMove 3s ease infinite;
}

/* Card Header */
.card-header-modern {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.order-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.order-badge {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.8rem;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.order-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.order-date {
  color: #718096;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Status Badge */
.status-badge-wrapper {
  animation: fadeIn 0.8s ease;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.status-confirmed {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.status-pending {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.status-icon {
  font-size: 1.5rem;
}

.status-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.status-label {
  font-size: 0.75rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-value {
  font-size: 1.1rem;
  font-weight: 700;
}

/* Summary Stats */
.summary-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-radius: 20px;
  flex-wrap: wrap;
}

.stat-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  min-width: 250px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.stat-icon-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-icon-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: #718096;
  margin-bottom: 0.5rem;
  display: block;
  font-weight: 500;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: #2d3748;
}

.stat-unit {
  font-size: 1.2rem;
  font-weight: 600;
  color: #718096;
}

.stat-value-price {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-divider {
  width: 1px;
  background: linear-gradient(to bottom, transparent, #cbd5e0, transparent);
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-modern {
  flex: 1;
  min-width: 200px;
  padding: 1rem 2rem;
  border-radius: 14px;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-danger-outline {
  background: white;
  color: #ef4444;
  border: 2px solid #ef4444;
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.2);
}

.btn-danger-outline:hover {
  background: #ef4444;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
}

.btn-primary-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.btn-primary-gradient:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.5);
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s ease;
}

.btn-primary-gradient:hover .btn-shine {
  left: 100%;
}

.btn-icon {
  font-size: 1.3rem;
}

/* Confirmed Message */
.confirmed-message {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  padding: 1.5rem;
  border-radius: 14px;
  color: #1e40af;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: 600;
  border: 2px solid #93c5fd;
}

.confirmed-message i {
  font-size: 1.5rem;
}

/* Products Section */
.products-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 28px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.8s ease;
}

.section-header {
  padding: 2rem 2.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.section-title {
  color: white;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Modern Table */
.table-wrapper {
  overflow-x: auto;
}

.products-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.products-table thead tr {
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
}

.products-table th {
  padding: 1.5rem 1.5rem;
  text-align: left;
  font-weight: 700;
  font-size: 0.9rem;
  color: #4a5568;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e2e8f0;
}

.products-table tbody tr {
  transition: all 0.3s ease;
  border-bottom: 1px solid #e2e8f0;
}

.products-table tbody tr:hover {
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  transform: scale(1.01);
}

.products-table tbody tr:last-child {
  border-bottom: none;
}

.products-table td {
  padding: 1.5rem 1.5rem;
  vertical-align: middle;
}

.row-number {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
}

.product-id {
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  color: #4a5568;
  display: inline-block;
}

.product-name {
  font-weight: 600;
  color: #2d3748;
  font-size: 1.05rem;
}

.price-tag {
  color: #718096;
  font-weight: 600;
  font-size: 1.05rem;
}

.qty-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  font-weight: 700;
  display: inline-block;
  min-width: 60px;
  text-align: center;
}

.total-price {
  font-size: 1.2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.delete-btn {
  width: 40px;
  height: 40px;
  background: white;
  border: 2px solid #ef4444;
  color: #ef4444;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.delete-btn:hover {
  background: #ef4444;
  color: white;
  transform: rotate(90deg) scale(1.1);
}

.no-action {
  color: #cbd5e0;
  font-size: 1.2rem;
}

.col-number, .col-qty, .col-action {
  text-align: left;
}

.col-price, .col-total {
  text-align: left;
}

/* No Permission State */
.no-permission {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  animation: fadeIn 0.6s ease;
}

.error-icon {
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: white;
  margin-bottom: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.error-title {
  color: white;
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.error-message {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  font-weight: 300;
}

/* Animations */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes gradientMove {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .cart-container {
    padding: 1.5rem;
  }

  .page-header {
    padding: 2rem;
  }

  .header-title {
    font-size: 2rem;
  }

  .cart-master-card {
    padding: 2rem;
  }
}

@media (max-width: 768px) {
  .cart-container {
    padding: 1rem;
  }

  .page-header {
    padding: 1.5rem;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .header-title {
    font-size: 1.8rem;
  }

  .header-subtitle {
    font-size: 1rem;
  }

  .card-header-modern {
    flex-direction: column;
    align-items: flex-start;
  }

  .order-info {
    width: 100%;
  }

  .status-badge-wrapper {
    width: 100%;
  }

  .status-badge {
    width: 100%;
    justify-content: center;
  }

  .summary-stats {
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .stat-card {
    min-width: 100%;
  }

  .stat-divider {
    display: none;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn-modern {
    width: 100%;
  }

  .section-header {
    padding: 1.5rem;
  }

  .section-title {
    font-size: 1.4rem;
  }

  .products-table th,
  .products-table td {
    padding: 1rem 0.75rem;
    font-size: 0.9rem;
  }

  .order-number {
    font-size: 1.4rem;
  }

  .stat-value {
    font-size: 1.6rem;
  }

  .row-number {
    width: 35px;
    height: 35px;
    font-size: 0.95rem;
  }

  .qty-badge {
    padding: 0.4rem 1rem;
    font-size: 0.9rem;
  }

  .total-price {
    font-size: 1.05rem;
  }

  .delete-btn {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .header-icon {
    width: 60px;
    height: 60px;
    font-size: 1.6rem;
  }

  .header-title {
    font-size: 1.5rem;
  }

  .order-badge {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }

  .order-number {
    font-size: 1.2rem;
  }

  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }

  .stat-value {
    font-size: 1.4rem;
  }

  .error-icon {
    width: 100px;
    height: 100px;
    font-size: 3rem;
  }

  .error-title {
    font-size: 2rem;
  }

  .error-message {
    font-size: 1rem;
  }

  /* Compact table for very small screens */
  .products-table {
    font-size: 0.85rem;
  }

  .products-table th,
  .products-table td {
    padding: 0.75rem 0.5rem;
  }

  .product-id {
    padding: 0.4rem 0.75rem;
    font-size: 0.85rem;
  }

  .product-name {
    font-size: 0.95rem;
  }
}
</style>