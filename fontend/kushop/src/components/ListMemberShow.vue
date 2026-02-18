<template>
  <div class="container mt-4">
    <div class="card shadow">
      <div class="card-header bg-danger text-white">
        <h4 class="mb-0">
          <i class="bi bi-people-fill"></i> จัดการสมาชิก (Admin Only)
        </h4>
      </div>
      <div class="card-body">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-danger" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3">กำลังโหลดข้อมูล...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="alert alert-danger" role="alert">
          <i class="bi bi-exclamation-triangle-fill"></i> {{ error }}
        </div>

        <!-- Members Table -->
        <div v-else>
          <div class="mb-3">
            <p class="text-muted">
              พบสมาชิกทั้งหมด: <strong>{{ members.length }}</strong> คน
            </p>
          </div>

          <div class="table-responsive">
            <table class="table table-hover table-striped">
              <thead class="table-dark">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Email</th>
                  <th scope="col">ชื่อ</th>
                  <th scope="col">Role</th>
                  <th scope="col" class="text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(member, index) in members" :key="member.memEmail">
                  <th scope="row">{{ index + 1 }}</th>
                  <td>
                    <i class="bi bi-envelope"></i> {{ member.memEmail }}
                  </td>
                  <td>{{ member.memName }}</td>

                  <td>
                    <span
                      :class="
                        member.role === 'admin'
                          ? 'badge bg-danger'
                          : 'badge bg-primary'
                      "
                    >
                      {{ member.role || "user" }}
                    </span>
                  </td>
                  <td class="text-center">
                    <!-- ปุ่มดูประวัติการซื้อ -->
                    <button
                      class="btn btn-sm btn-info me-2 text-white"
                      @click="viewOrders(member)"
                    >
                      <i class="bi bi-cart-check"></i> ประวัติ
                    </button>

                    <!-- ปุ่มเปลี่ยน Role -->
                    <button
                      class="btn btn-sm btn-warning me-2"
                      @click="openRoleModal(member)"
                      :disabled="member.memEmail === currentUserEmail"
                    >
                      <i class="bi bi-pencil-square"></i> Role
                    </button>

                    <!-- ปุ่มลบ -->
                    <button
                      class="btn btn-sm btn-danger"
                      @click="confirmDelete(member.memEmail)"
                      :disabled="member.memEmail === currentUserEmail"
                    >
                      <i class="bi bi-trash"></i> ลบ
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div
            v-if="members.length === 0"
            class="text-center py-5 text-muted"
          >
            <i class="bi bi-inbox" style="font-size: 3rem"></i>
            <p class="mt-3">ไม่พบข้อมูลสมาชิก</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal เปลี่ยน Role -->
    <div
      class="modal fade"
      id="roleModal"
      tabindex="-1"
      aria-labelledby="roleModalLabel"
      aria-hidden="true"
      ref="roleModalRef"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-warning">
            <h5 class="modal-title" id="roleModalLabel">
              <i class="bi bi-shield-lock"></i> เปลี่ยน Role
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>
              <strong>Email:</strong> {{ selectedMember?.memEmail }}
            </p>
            <p>
              <strong>ชื่อ:</strong> {{ selectedMember?.memName }}
            </p>
            <hr />
            <div class="mb-3">
              <label for="roleSelect" class="form-label">เลือก Role:</label>
              <select class="form-select" id="roleSelect" v-model="newRole">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              class="btn btn-warning"
              @click="updateRole"
              :disabled="updating"
            >
              <span
                v-if="updating"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal ประวัติการซื้อ -->
    <div
      class="modal fade"
      id="ordersModal"
      tabindex="-1"
      aria-labelledby="ordersModalLabel"
      aria-hidden="true"
      ref="ordersModalRef"
    >
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">
          <div class="modal-header bg-info text-white">
            <h5 class="modal-title" id="ordersModalLabel">
              <i class="bi bi-cart-check-fill"></i> ประวัติการซื้อ -
              {{ selectedMember?.memName }}
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <!-- Loading Orders -->
            <div v-if="loadingOrders" class="text-center py-4">
              <div class="spinner-border text-info" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-3">กำลังโหลดประวัติการซื้อ...</p>
            </div>

            <!-- Orders List -->
            <div v-else-if="orders.length > 0">
              <p class="text-muted mb-3">
                พบคำสั่งซื้อทั้งหมด: <strong>{{ orders.length }}</strong> รายการ
              </p>

              <div class="table-responsive">
                <table class="table table-hover">
                  <thead class="table-info">
                    <tr>
                      <th>#</th>
                      <th>Order ID</th>
                      <th>วันที่สั่งซื้อ</th>
                      <th>สินค้า</th>
                      <th>จำนวน</th>
                      <th class="text-end">ราคารวม</th>
                      <th class="text-center">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(order, index) in orders" :key="order.orderId">
                      <td>{{ index + 1 }}</td>
                      <td>
                        <code>{{ order.orderId }}</code>
                      </td>
                      <td>
                        <small>{{
                          formatDate(order.orderDate)
                        }}</small>
                      </td>
                      <td>{{ order.productName || "N/A" }}</td>
                      <td>
                        <span class="badge bg-secondary">{{
                          order.quantity
                        }}</span>
                      </td>
                      <td class="text-end">
                        <strong>{{ formatPrice(order.totalPrice) }}</strong>
                      </td>
                      <td class="text-center">
                        <span
                          :class="getStatusClass(order.status)"
                          class="badge"
                        >
                          {{ order.status || "รอดำเนินการ" }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="table-active">
                      <td colspan="5" class="text-end">
                        <strong>ยอดรวมทั้งหมด:</strong>
                      </td>
                      <td class="text-end">
                        <strong class="text-danger">{{
                          formatPrice(totalOrderAmount)
                        }}</strong>
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <!-- Empty Orders -->
            <div v-else class="text-center py-5 text-muted">
              <i class="bi bi-cart-x" style="font-size: 3rem"></i>
              <p class="mt-3">ไม่พบประวัติการซื้อ</p>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

axios.defaults.withCredentials = true;

// ตัวแปร
const members = ref([]);
const loading = ref(true);
const error = ref(null);
const selectedMember = ref(null);
const newRole = ref("user");
const roleModalRef = ref(null);
const ordersModalRef = ref(null);
let roleModal = null;
let ordersModal = null;
const updating = ref(false);
const currentUserEmail = ref(null);

// ตัวแปรสำหรับประวัติการซื้อ
const orders = ref([]);
const loadingOrders = ref(false);

// คำนวณยอดรวม
const totalOrderAmount = computed(() => {
  return orders.value.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
});

// โหลดข้อมูลสมาชิกทั้งหมด
const loadMembers = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get("http://localhost:3000/members/all");
    console.log("Load members response:", response.data);

    if (response.data.members) {
      members.value = response.data.members;
    } else {
      error.value = response.data.message || "ไม่สามารถโหลดข้อมูลได้";
    }
  } catch (err) {
    console.error("Error loading members:", err);
    if (err.response?.status === 403) {
      error.value = "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้";
    } else {
      error.value = "เกิดข้อผิดพลาดในการโหลดข้อมูล";
    }
  } finally {
    loading.value = false;
  }
};

// ดึงข้อมูล User ปัจจุบัน
const getCurrentUser = async () => {
  try {
    const response = await axios.get("http://localhost:3000/members/detail");
    console.log("Current user:", response.data);
    if (response.data.login) {
      currentUserEmail.value = response.data.memEmail;
    }
  } catch (err) {
    console.error("Error getting current user:", err);
  }
};

// ดูประวัติการซื้อ
const viewOrders = async (member) => {
  console.log("Viewing orders for:", member.memEmail);
  selectedMember.value = member;
  orders.value = [];
  loadingOrders.value = true;

  // สร้าง Modal ถ้ายังไม่มี
  if (!ordersModal && ordersModalRef.value) {
    console.log("Creating Orders Modal...");
    if (window.bootstrap && window.bootstrap.Modal) {
      ordersModal = new window.bootstrap.Modal(ordersModalRef.value);
    }
  }

  // แสดง Modal
  if (ordersModal) {
    ordersModal.show();
  }

  // โหลดข้อมูลคำสั่งซื้อ
  try {
    const response = await axios.get(
      `http://localhost:3000/members/${encodeURIComponent(
        member.memEmail
      )}/orders`
    );
    console.log("Orders response:", response.data);

    if (response.data.orders) {
      orders.value = response.data.orders;
    }
  } catch (err) {
    console.error("Error loading orders:", err);
    alert(`เกิดข้อผิดพลาด: ${err.response?.data?.message || err.message}`);
  } finally {
    loadingOrders.value = false;
  }
};

// เปิด Modal เปลี่ยน Role
const openRoleModal = (member) => {
  console.log("Opening modal for member:", member);
  selectedMember.value = member;
  newRole.value = member.role || "user";

  // สร้าง Modal ถ้ายังไม่มี
  if (!roleModal && roleModalRef.value) {
    console.log("Creating Bootstrap Modal...");
    if (window.bootstrap && window.bootstrap.Modal) {
      roleModal = new window.bootstrap.Modal(roleModalRef.value);
      console.log("Modal created successfully");
    } else {
      console.error("Bootstrap Modal not found!");
      alert(
        "ไม่สามารถเปิด Modal ได้ กรุณาตรวจสอบว่าได้ import Bootstrap แล้ว"
      );
      return;
    }
  }

  if (roleModal) {
    roleModal.show();
    console.log("Modal shown");
  }
};

// อัพเดท Role
const updateRole = async () => {
  if (!selectedMember.value) {
    console.error("No member selected");
    return;
  }

  console.log(
    `Updating role for ${selectedMember.value.memEmail} to ${newRole.value}`
  );

  updating.value = true;
  try {
    const url = `http://localhost:3000/members/${encodeURIComponent(
      selectedMember.value.memEmail
    )}/role`;
    console.log("PUT request to:", url);

    const response = await axios.put(url, {
      role: newRole.value,
    });

    console.log("Update response:", response.data);

    if (response.data.success) {
      alert("เปลี่ยน Role สำเร็จ!");
      if (roleModal) {
        roleModal.hide();
      }
      await loadMembers();
    } else {
      alert(`ข้อผิดพลาด: ${response.data.message}`);
    }
  } catch (err) {
    console.error("Error updating role:", err);
    console.error("Error response:", err.response?.data);
    alert(
      `เกิดข้อผิดพลาด: ${err.response?.data?.message || err.message}`
    );
  } finally {
    updating.value = false;
  }
};

// ยืนยันการลบ
const confirmDelete = async (email) => {
  const confirmed = window.confirm(
    `คุณต้องการลบสมาชิก ${email} ใช่หรือไม่?`
  );

  if (!confirmed) return;

  console.log(`Deleting member: ${email}`);

  try {
    const response = await axios.delete(
      `http://localhost:3000/members/${encodeURIComponent(email)}`
    );

    console.log("Delete response:", response.data);

    if (response.data.success) {
      alert("ลบสมาชิกสำเร็จ!");
      await loadMembers();
    } else {
      alert(`ข้อผิดพลาด: ${response.data.message}`);
    }
  } catch (err) {
    console.error("Error deleting member:", err);
    alert(`เกิดข้อผิดพลาด: ${err.response?.data?.message || err.message}`);
  }
};

// Format วันที่
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Format ราคา
const formatPrice = (price) => {
  if (!price) return "฿0.00";
  return `฿${price.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// สีของสถานะ
const getStatusClass = (status) => {
  const statusMap = {
    รอดำเนินการ: "bg-warning",
    กำลังจัดส่ง: "bg-info",
    จัดส่งแล้ว: "bg-success",
    ยกเลิก: "bg-danger",
  };
  return statusMap[status] || "bg-secondary";
};

// เมื่อ Component โหลด
onMounted(async () => {
  console.log("Component mounted");
  await getCurrentUser();
  await loadMembers();

  if (window.bootstrap && window.bootstrap.Modal) {
    console.log("Bootstrap Modal is available");
  } else {
    console.error("Bootstrap Modal is NOT available!");
  }
});
</script>

<style scoped>
.card {
  border: none;
  border-radius: 10px;
}

.card-header {
  border-radius: 10px 10px 0 0 !important;
  padding: 1rem 1.5rem;
}

.table {
  margin-bottom: 0;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.badge {
  font-size: 0.85rem;
  padding: 0.35rem 0.65rem;
}

.modal-header.bg-warning {
  background-color: #ffc107 !important;
  color: #000;
}

.modal-header.bg-info {
  background-color: #0dcaf0 !important;
}

tr:hover {
  background-color: #f8f9fa;
}

.modal-xl {
  max-width: 1200px;
}

code {
  background-color: #f8f9fa;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-size: 0.875rem;
}
</style>