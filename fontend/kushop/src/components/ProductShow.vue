<template>
    <div class="container py-5">
        <div v-for="(pd, pdId) in products" :key="pdId" class="product-section">
            <div class="row g-5">
                <!-- Product Image Section -->
                <div class="col-lg-5 col-md-6">
                    <div class="image-container">
                        
                        <div class="image-wrapper">
                            <img :src="`http://localhost:3000/img_pd/${pd.pdId}.jpg`" 
                                 alt="Product Image"
                                 class="product-image">
                            <div class="image-shine"></div>
                        </div>
                    </div>
                </div>

                <!-- Product Details Section -->
                <div class="col-lg-7 col-md-6">
                    <div class="product-details">
                        <!-- Product ID Badge -->
                        <div class="product-id-badge">
                            <i class="bi bi-tag-fill"></i>
                            <span>{{ pd.pdId }}</span>
                        </div>

                        <!-- Product Name -->
                        <h1 class="product-name">{{ pd.pdName }}</h1>

                        <!-- Brand -->
                        <div class="brand-section">
                            <div class="brand-icon">
                                <i class="bi bi-shield-check"></i>
                            </div>
                            <span>{{ pd.brand?.brandName || "ไม่ระบุยี่ห้อ" }}</span>
                        </div>

                        <!-- Price -->
                        <div class="price-section">
                            <div class="price-container">
                                <div class="price-label">ราคา</div>
                                <div class="price-value">
                                    <span class="currency">฿</span>
                                    <span class="amount">{{ pd.pdPrice.toLocaleString() }}</span>
                                </div>
                            </div>
                            <div class="price-decoration"></div>
                        </div>

                        <!-- Description -->
                        <div class="description-section">
                            <h5 class="section-title">
                                <div class="title-icon">
                                    <i class="bi bi-info-circle-fill"></i>
                                </div>
                                <span>รายละเอียดสินค้า</span>
                            </h5>
                            <p class="description-text">{{ pd.pdRemark || "ไม่มีรายละเอียด" }}</p>
                        </div>

                        <!-- Action Buttons -->
                        <div class="action-buttons">
                            <button class="btn-cart" @click="chkLogin()">
                                <span class="btn-content">
                                    <i class="bi bi-cart-plus"></i>
                                    <span>เพิ่มลงตะกร้า</span>
                                </span>
                                <div class="btn-glow"></div>
                            </button>
                            
                            <button v-if="isAdmin" class="btn-edit" @click="openEditModal(pd)">
                                <span class="btn-content">
                                    <i class="bi bi-pencil-square"></i>
                                    <span>แก้ไขสินค้า</span>
                                </span>
                            </button>

                            <button v-if="isAdmin" class="btn-delete" @click="confirmDelete(pd)">
                                <span class="btn-content">
                                    <i class="bi bi-trash3-fill"></i>
                                    <span>ลบสินค้า</span>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Edit Modal -->
        <Transition name="modal">
            <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
                <div class="modal-container">
                    <div class="modal-header">
                        <div class="modal-title">
                            <div class="modal-icon">
                                <i class="bi bi-pencil-square"></i>
                            </div>
                            <span>แก้ไขสินค้า</span>
                        </div>
                        <button class="btn-close-modal" @click="closeEditModal">
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>

                    <div class="modal-body">
                        <form @submit.prevent="updateProduct">
                            <div class="upload-section">
                                <div class="image-preview-container">
                                    <img :src="imagePreview || `http://localhost:3000/img_pd/${editProduct.pdId}.jpg`" 
                                         alt="Preview" 
                                         class="preview-image">
                                    <div class="image-overlay">
                                        <label for="file-upload" class="upload-label">
                                            <i class="bi bi-camera-fill"></i>
                                            <span>เปลี่ยนรูปภาพ</span>
                                        </label>
                                        <input id="file-upload" 
                                               type="file" 
                                               @change="handleFileChange" 
                                               accept="image/jpeg, image/png, image/jpg"
                                               class="file-input">
                                    </div>
                                </div>
                                <p class="upload-hint">
                                    <i class="bi bi-info-circle"></i> 
                                    รองรับไฟล์ JPG, PNG (ไม่เกิน 5MB)
                                </p>
                            </div>

                            <div class="form-grid">
                                <div class="form-group">
                                    <label class="form-label">
                                        <i class="bi bi-box"></i> 
                                        <span>ชื่อสินค้า</span>
                                    </label>
                                    <input v-model="editProduct.pdName" 
                                           type="text" 
                                           class="form-input" 
                                           placeholder="กรอกชื่อสินค้า"
                                           required>
                                </div>

                                <div class="form-group">
                                    <label class="form-label">
                                        <i class="bi bi-currency-dollar"></i>
                                        <span>ราคา</span>
                                    </label>
                                    <input v-model="editProduct.pdPrice" 
                                           type="number" 
                                           class="form-input" 
                                           placeholder="0.00"
                                           required>
                                </div>

                                <div class="form-group full-width">
                                    <label class="form-label">
                                        <i class="bi bi-card-text"></i>
                                        <span>รายละเอียด</span>
                                    </label>
                                    <textarea v-model="editProduct.pdRemark" 
                                              class="form-textarea" 
                                              rows="3"
                                              placeholder="รายละเอียดเพิ่มเติม..."></textarea>
                                </div>

                                <div class="form-group">
                                    <label class="form-label">
                                        <i class="bi bi-grid"></i>
                                        <span>ประเภทสินค้า</span>
                                    </label>
                                    <input v-model="editProduct.pdTypeId" 
                                           type="text" 
                                           class="form-input"
                                           placeholder="ID ประเภท">
                                </div>

                                <div class="form-group">
                                    <label class="form-label">
                                        <i class="bi bi-award"></i>
                                        <span>ยี่ห้อ</span>
                                    </label>
                                    <input v-model="editProduct.brandId" 
                                           type="text" 
                                           class="form-input"
                                           placeholder="ID ยี่ห้อ">
                                </div>
                            </div>

                            <Transition name="alert">
                                <div v-if="updateMessage" 
                                     class="alert-message" 
                                     :class="updateSuccess ? 'alert-success' : 'alert-error'">
                                    <i :class="updateSuccess ? 'bi bi-check-circle-fill' : 'bi bi-exclamation-triangle-fill'"></i>
                                    <span>{{ updateMessage }}</span>
                                </div>
                            </Transition>

                            <div class="modal-actions">
                                <button type="button" class="btn-cancel" @click="closeEditModal">
                                    <i class="bi bi-x-circle"></i>
                                    <span>ยกเลิก</span>
                                </button>
                                <button type="submit" class="btn-save" :disabled="isUpdating">
                                    <i class="bi bi-check-circle-fill"></i>
                                    <span v-if="!isUpdating">บันทึกการแก้ไข</span>
                                    <span v-else>กำลังบันทึก...</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- Delete Confirmation Modal -->
        <Transition name="modal">
            <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
                <div class="modal-container modal-small">
                    <div class="modal-header modal-header-danger">
                        <div class="modal-title">
                            <div class="modal-icon">
                                <i class="bi bi-exclamation-triangle-fill"></i>
                            </div>
                            <span>ยืนยันการลบสินค้า</span>
                        </div>
                        <button class="btn-close-modal" @click="closeDeleteModal">
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>

                    <div class="modal-body">
                        <div class="delete-warning">
                            <div class="warning-icon">
                                <i class="bi bi-exclamation-circle-fill"></i>
                            </div>
                            <p>คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?</p>
                        </div>
                        
                        <div class="delete-product-info">
                            <div class="info-item">
                                <span class="info-label">รหัสสินค้า:</span>
                                <span class="info-value">{{ deleteProductData?.pdId }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">ชื่อสินค้า:</span>
                                <span class="info-value">{{ deleteProductData?.pdName }}</span>
                            </div>
                        </div>

                        <p class="delete-note">
                            <i class="bi bi-info-circle"></i>
                            <span>การลบนี้ไม่สามารถย้อนกลับได้</span>
                        </p>

                        <Transition name="alert">
                            <div v-if="deleteMessage" 
                                 class="alert-message" 
                                 :class="deleteSuccess ? 'alert-success' : 'alert-error'">
                                <i :class="deleteSuccess ? 'bi bi-check-circle-fill' : 'bi bi-exclamation-triangle-fill'"></i>
                                <span>{{ deleteMessage }}</span>
                            </div>
                        </Transition>

                        <div class="modal-actions">
                            <button type="button" class="btn-cancel" @click="closeDeleteModal">
                                <i class="bi bi-x-circle"></i>
                                <span>ยกเลิก</span>
                            </button>
                            <button type="button" class="btn-delete-confirm" @click="deleteProduct" :disabled="isDeleting">
                                <i class="bi bi-trash3-fill"></i>
                                <span v-if="!isDeleting">ยืนยันการลบ</span>
                                <span v-else>กำลังลบ...</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore';
const cartStore = useCartStore()
import axios from 'axios';
axios.defaults.withCredentials = true

const route = useRoute()
const router = useRouter()
const products = ref([])
const id = ref(null)

const login = ref(false)
const memEmail = ref(null)
const isAdmin = ref(false)

const cartId = ref(null)
const backendMessage = ref(null)

const showEditModal = ref(false)
const editProduct = ref({})
const selectedFile = ref(null)
const imagePreview = ref(null)
const updateMessage = ref(null)
const updateSuccess = ref(false)
const isUpdating = ref(false)

const showDeleteModal = ref(false)
const deleteProductData = ref(null)
const deleteMessage = ref(null)
const deleteSuccess = ref(false)
const isDeleting = ref(false)


onMounted(async () => {
    id.value = route.params.pdId
    await loadProduct()
    await checkAdmin()
})

const loadProduct = async () => {
    try {
        const res = await axios.get(`http://localhost:3000/products/${id.value}`)
        products.value = res.data
    } catch (err) {
        console.log(err.message)
    }
}

const checkAdmin = async () => {
    try {
        const res = await axios.get(`http://localhost:3000/members/detail`)
        login.value = res.data.login
        memEmail.value = res.data.memEmail
        isAdmin.value = res.data.role === 'admin'
    } catch (err) {
        console.log(err.message)
    }
}

const openEditModal = (product) => {
    editProduct.value = { ...product }
    showEditModal.value = true
    updateMessage.value = null
    imagePreview.value = null
    selectedFile.value = null
}

const closeEditModal = () => {
    showEditModal.value = false
    editProduct.value = {}
    selectedFile.value = null
    imagePreview.value = null
    updateMessage.value = null
}

const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
        if (file.size > 5 * 1024 * 1024) {
            alert('ไฟล์ใหญ่เกิน 5MB')
            event.target.value = ''
            return
        }
        selectedFile.value = file
        const reader = new FileReader()
        reader.onload = (e) => {
            imagePreview.value = e.target.result
        }
        reader.readAsDataURL(file)
    }
}

const updateProduct = async () => {
    try {
        isUpdating.value = true
        updateMessage.value = null
        
        const productData = {
            pdName: editProduct.value.pdName,
            pdPrice: editProduct.value.pdPrice,
            pdRemark: editProduct.value.pdRemark,
            pdTypeId: editProduct.value.pdTypeId,
            brandId: editProduct.value.brandId
        }
        
        await axios.put(
            `http://localhost:3000/products/${editProduct.value.pdId}`,
            productData
        )
        
        if (selectedFile.value) {
            const formData = new FormData()
            formData.append('pdId', editProduct.value.pdId)
            formData.append('file', selectedFile.value)
            
            await axios.post(
                `http://localhost:3000/products/uploadimg`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )
        }
        
        updateMessage.value = 'แก้ไขสินค้าสำเร็จ!'
        updateSuccess.value = true
        
        await loadProduct()
        
        setTimeout(() => {
            closeEditModal()
            isUpdating.value = false
        }, 1500)

        
    } catch (err) {
        console.error(err)
        updateMessage.value = err.response?.data?.message || 'เกิดข้อผิดพลาด'
        updateSuccess.value = false
        isUpdating.value = false
    }
}

const confirmDelete = (product) => {
    deleteProductData.value = { ...product }
    showDeleteModal.value = true
    deleteMessage.value = null
}

const closeDeleteModal = () => {
    showDeleteModal.value = false
    deleteProductData.value = null
    deleteMessage.value = null
}

const deleteProduct = async () => {
    try {
        isDeleting.value = true
        deleteMessage.value = null
        
        await axios.delete(
            `http://localhost:3000/products/${deleteProductData.value.pdId}`
        )
        
        deleteMessage.value = 'ลบสินค้าสำเร็จ!'
        deleteSuccess.value = true
        
        setTimeout(() => {
            closeDeleteModal()
            router.push('/admin/products')
        }, 1500)
        
    } catch (err) {
        console.error(err)
        deleteMessage.value = err.response?.data?.message || 'เกิดข้อผิดพลาดในการลบสินค้า'
        deleteSuccess.value = false
        isDeleting.value = false
    }
}

const chkLogin = async () => {
    await axios.get(`http://localhost:3000/members/detail`)
        .then((res) => {
            login.value = res.data.login
            memEmail.value = res.data.memEmail
        })
        .catch(err => console.log(err.message))

    if (login.value) {
        await chkCart()
    } else {
        alert("ยังไม่ได้ Login ต้อง Login ก่อนซื้อสินค้า")
        return
    }
    if (!cartId.value) {
        await addCart()
    }
    await addCartDtl()
}

const chkCart = async () => {
    let members = { memEmail: memEmail.value }
    try {
        const response = await axios.post(`http://localhost:3000/carts/chkcart`, members)
        cartId.value = response.data.cartId
    } catch (err) {
        console.log(err)
    }
}

const addCart = async () => {
    let customer = { cusId: memEmail.value }
    try {
        const response = await axios.post(`http://localhost:3000/carts/addcart`, customer)
        backendMessage.value = response.data.messageAddCart
        cartId.value = response.data.messageAddCart
    } catch (err) {
        console.log(err)
    }
}

const addCartDtl = async () => {
    let cartdtl = {
        cartId: cartId.value,
        pdId: id.value,
        pdPrice: products.value[0].pdPrice
    }
    try {
        const response = await axios.post(`http://localhost:3000/carts/addcartdtl`, cartdtl)
        cartStore.updateQty()
        cartStore.setId(cartId.value)
        backendMessage.value = response.data.messageAddCartDtl
    } catch (err) {
        console.log(err)
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap');

* {
    font-family: 'Kanit', sans-serif;
}

.container {
    max-width: 1400px;
}

/* Product Section */
.product-section {
    background: #ffffff;
    border-radius: 32px;
    padding: 40px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
    position: relative;
    overflow: hidden;
}

.product-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.03) 0%, rgba(236, 72, 153, 0.03) 100%);
    pointer-events: none;
}

/* Image Container */
.image-container {
    position: relative;
    border-radius: 24px;
    overflow: hidden;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 4px;
    box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
}

.image-wrapper {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    background: #ffffff;
}

.product-image {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.image-container:hover .product-image {
    transform: scale(1.08);
}

.image-shine {
    position: absolute;
    top: -100%;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: all 0.6s ease;
}

@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
}

/* Product Details */
.product-details {
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
}

.product-id-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%);
    color: #667eea;
    padding: 10px 20px;
    border-radius: 16px;
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 20px;
    width: fit-content;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.product-name {
    font-size: 42px;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 20px;
    line-height: 1.2;
    letter-spacing: -0.5px;
}

.brand-section {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 18px;
    margin-bottom: 30px;
    padding: 16px 0;
    border-bottom: 3px solid #f1f5f9;
}

.brand-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
    box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

.brand-section span {
    font-weight: 600;
    color: #1e293b;
}

.price-section {
    position: relative;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 32px;
    border-radius: 24px;
    margin-bottom: 32px;
    overflow: hidden;
    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.4);
}

.price-decoration {
    position: absolute;
    top: -50px;
    right: -50px;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
    border-radius: 50%;
}

.price-container {
    position: relative;
    z-index: 1;
}

.price-label {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 8px;
    font-weight: 500;
    letter-spacing: 0.5px;
}

.price-value {
    display: flex;
    align-items: baseline;
    gap: 4px;
}

.currency {
    font-size: 32px;
    font-weight: 600;
    color: white;
}

.amount {
    font-size: 52px;
    font-weight: 700;
    color: white;
    letter-spacing: -1px;
}

.description-section {
    margin-bottom: 32px;
    flex-grow: 1;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 20px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 16px;
}

.title-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 20px;
}

.description-text {
    color: #64748b;
    font-size: 16px;
    line-height: 1.8;
    margin: 0;
}

/* Action Buttons */
.action-buttons {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
}

.btn-cart, .btn-edit, .btn-delete {
    flex: 1;
    min-width: 180px;
    position: relative;
    padding: 20px 32px;
    border: none;
    border-radius: 16px;
    font-size: 17px;
    font-weight: 600;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.btn-content {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
}

.btn-cart {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.btn-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transition: width 0.6s ease, height 0.6s ease;
}

.btn-cart:hover .btn-glow {
    width: 300px;
    height: 300px;
}

.btn-cart:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.6);
}

.btn-edit {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
    box-shadow: 0 8px 24px rgba(245, 87, 108, 0.4);
}

.btn-edit:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(245, 87, 108, 0.6);
}

.btn-delete {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
    color: white;
    box-shadow: 0 8px 24px rgba(255, 107, 107, 0.4);
}

.btn-delete:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(255, 107, 107, 0.6);
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 20px;
}

.modal-container {
    background: white;
    border-radius: 32px;
    width: 100%;
    max-width: 700px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.3);
    animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalSlideIn {
    from {
        opacity: 0;
        transform: scale(0.9) translateY(40px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

.modal-small {
    max-width: 500px;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 32px 36px;
    border-bottom: none;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 32px 32px 0 0;
    position: relative;
    overflow: hidden;
}

.modal-header::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
    border-radius: 50%;
}

.modal-header-danger {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
}

.modal-title {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 26px;
    font-weight: 700;
    color: white;
    position: relative;
    z-index: 1;
}

.modal-icon {
    width: 56px;
    height: 56px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    backdrop-filter: blur(10px);
}

.btn-close-modal {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    cursor: pointer;
    color: white;
    font-size: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
    backdrop-filter: blur(10px);
}

.btn-close-modal:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg) scale(1.1);
}

.modal-body {
    padding: 36px;
}

/* Upload Section */
.upload-section {
    margin-bottom: 32px;
}

.image-preview-container {
    position: relative;
    width: 100%;
    max-width: 320px;
    margin: 0 auto;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 4px;
}

.preview-image {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 20px;
}

.image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.4s ease;
    backdrop-filter: blur(4px);
}

.image-preview-container:hover .image-overlay {
    opacity: 1;
}

.upload-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    color: white;
    cursor: pointer;
    font-size: 17px;
    font-weight: 600;
    transition: transform 0.3s ease;
}

.upload-label:hover {
    transform: scale(1.05);
}

.upload-label i {
    font-size: 48px;
    animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}

.file-input {
    display: none;
}

.upload-hint {
    text-align: center;
    color: #64748b;
    font-size: 15px;
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

/* Form Grid */
.form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin-bottom: 24px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group.full-width {
    grid-column: 1 / -1;
}

.form-label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 15px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 10px;
}

.form-label i {
    color: #667eea;
    font-size: 18px;
}

.form-input, .form-textarea {
    width: 100%;
    padding: 16px 20px;
    border: 2px solid #e2e8f0;
    border-radius: 14px;
    font-size: 16px;
    transition: all 0.3s ease;
    font-family: inherit;
    background: #f8fafc;
}

.form-input:focus, .form-textarea:focus {
    outline: none;
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    transform: translateY(-2px);
}

.form-textarea {
    resize: vertical;
    min-height: 100px;
}

/* Alert Message */
.alert-message {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 18px 24px;
    border-radius: 16px;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 24px;
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

.alert-success {
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    color: #065f46;
    border: 2px solid #10b981;
}

.alert-error {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    color: #991b1b;
    border: 2px solid #ef4444;
}

.alert-message i {
    font-size: 24px;
}

/* Modal Actions */
.modal-actions {
    display: flex;
    gap: 16px;
}

.btn-cancel, .btn-save, .btn-delete-confirm {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 18px 28px;
    border: none;
    border-radius: 14px;
    font-size: 17px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-cancel {
    background: #f1f5f9;
    color: #64748b;
}

.btn-cancel:hover {
    background: #e2e8f0;
    transform: translateY(-2px);
}

.btn-save {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.btn-save:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(16, 185, 129, 0.6);
}

.btn-save:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-delete-confirm {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
    color: white;
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

.btn-delete-confirm:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(255, 107, 107, 0.6);
}

.btn-delete-confirm:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Delete Modal Specific */
.delete-warning {
    text-align: center;
    margin-bottom: 24px;
}

.warning-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
    animation: shake 0.5s ease;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
}

.warning-icon i {
    font-size: 40px;
    color: #ef4444;
}

.delete-warning p {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
}

.delete-product-info {
    background: #f8fafc;
    padding: 20px;
    border-radius: 16px;
    margin-bottom: 20px;
    border: 2px solid #e2e8f0;
}

.info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
}

.info-item:not(:last-child) {
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 8px;
}

.info-label {
    font-weight: 600;
    color: #64748b;
}

.info-value {
    font-weight: 600;
    color: #1e293b;
}

.delete-note {
    text-align: center;
    color: #64748b;
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 24px;
}

/* Transitions */
.modal-enter-active {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-leave-active {
    transition: all 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
    opacity: 0;
}

.modal-enter-from .modal-container {
    transform: scale(0.9) translateY(40px);
}

.modal-leave-to .modal-container {
    transform: scale(0.95) translateY(20px);
}

.alert-enter-active, .alert-leave-active {
    transition: all 0.3s ease;
}

.alert-enter-from, .alert-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

/* Scrollbar Styling */
.modal-container::-webkit-scrollbar {
    width: 8px;
}

.modal-container::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
}

.modal-container::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 10px;
}

.modal-container::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #5568d3 0%, #653a8d 100%);
}

/* Responsive */
@media (max-width: 768px) {
    .product-section {
        padding: 24px;
        border-radius: 24px;
    }
    
    .product-name {
        font-size: 32px;
    }
    
    .amount {
        font-size: 40px;
    }
    
    .action-buttons {
        flex-direction: column;
    }
    
    .btn-cart, .btn-edit, .btn-delete {
        min-width: 100%;
    }
    
    .form-grid {
        grid-template-columns: 1fr;
    }
    
    .modal-actions {
        flex-direction: column-reverse;
    }
    
    .modal-header {
        padding: 24px;
    }
    
    .modal-body {
        padding: 24px;
    }
    
    .modal-title {
        font-size: 20px;
    }
    
    .modal-icon {
        width: 48px;
        height: 48px;
        font-size: 24px;
    }
}

@media (max-width: 480px) {
    .product-name {
        font-size: 26px;
    }
    
    .amount {
        font-size: 36px;
    }
    
    .currency {
        font-size: 24px;
    }
}
</style>