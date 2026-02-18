<template>
  <!-- Hero Section -->
  <div class="hero-section">
    <div class="hero-content">
      <h1 class="hero-title">New Collection 2025</h1>
      <p class="hero-subtitle">
        Discover our latest shirts and elevate your style
      </p>
      <a href="#pd" button class="btn-shop-now">Shop Now</a>
    </div>
  </div>

  <section id="pd">
    <!-- Category Filter -->
    <div class="category-section">
      <div class="category-container">
        <button
          v-for="cat in categories"
          :key="cat.name"
          :class="['category-btn', { active: selectedCategory === cat.name }]"
          @click="filterByCategory(cat)"
        >
          {{ cat.name }}
        </button>
      </div>
    </div>

    <!-- Search Form -->
    <form @submit.prevent="searchProduct()" class="search-form">
      <div class="search-container">
        <input
          type="text"
          class="search-input"
          v-model="stext"
          placeholder="ค้นหาสินค้า..."
        />
        <button class="btn-search" type="submit">ค้นหา</button>
      </div>
    </form>

    <!-- Products Grid -->
    <div class="products-grid">
      <div v-if="isSearching && products.length === 0" class="no-products">
        ไม่พบสินค้า ❌
      </div>

      <div
        v-for="(pd, pdId) in products"
        v-else
        :key="pdId"
        class="product-card-wrapper"
      >
        <div class="product-card">
          <span v-if="pd.discount" class="discount-badge"
            >-{{ pd.discount }}%</span
          >
          <span v-if="pd.isNew" class="new-badge">New</span>

          <div class="product-image-container">
            <img
              :src="`http://localhost:3000/img_pd/${pd.pdId}.jpg`"
              class="product-image"
              :alt="pd.pdName"
              @error="handleImageError"
            />
          </div>

          <div class="product-info">
            <p class="product-category">
              {{ pd.pdt?.pdTypeName || "Men's T-Shirts" }}
            </p>
            <h3 class="product-name">{{ pd.pdName }}</h3>
            <p class="product-brand">
              {{ pd.brand?.brandName || "ไม่ระบุยี่ห้อ" }}
            </p>
            <p class="product-price">฿{{ pd.pdPrice }}</p>

            <router-link
              :to="{ name: 'ProductShow', params: { pdId: pd.pdId } }"
              class="btn-view-product"
            >
              View Product
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";

const products = ref([]);
const stext = ref("");
const selectedCategory = ref("All");
const isSearching = ref(false);

// กำหนด categories พร้อม API endpoint
const categories = ref([
  { name: "All", endpoint: "/products" },
  { name: "Accessory", endpoint: "/products/category/accessory" },
  { name: "Aggie Shirt", endpoint: "/products/category/aggie-shirt" },
  { name: "Ku Gen Shirt", endpoint: "/products/category/kugen-shirt" },
  { name: "Ku Nisit", endpoint: "/products/category/kunisit" },
  { name: "Ku Shoes", endpoint: "/products/category/kushoes" },
  { name: "T-shirt", endpoint: "/products/category/tshirt" },
]);

// Placeholder image แบบ SVG
const placeholderImage =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="500"%3E%3Crect width="400" height="500" fill="%23e0e0e0"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="20" fill="%23999" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';

// ฟังก์ชันกรองตามหมวดหมู่
const filterByCategory = async (category) => {
  selectedCategory.value = category.name;
  stext.value = ""; // Clear search text

  try {
    const res = await axios.get(`http://localhost:3000${category.endpoint}`);
    products.value = res.data;
  } catch (err) {
    console.error("Error fetching products:", err.message);
  }
};

// ฟังก์ชันค้นหา
const searchProduct = async () => {
  console.log(`searchProduct --> ${stext.value}`);
  selectedCategory.value = ""; // Clear category selection when searching
  isSearching.value = true; // กำลังค้นหา

  try {
    if (!stext.value || stext.value.trim() === "") {
      const res = await axios.get(`http://localhost:3000/products`);
      products.value = res.data;
      isSearching.value = false; // ถ้าไม่มีการค้นหา ให้ถือว่าไม่ได้ค้นหา
    } else {
      const res = await axios.get(
        `http://localhost:3000/products/search/${stext.value}`
      );
      products.value = res.data;
    }
  } catch (err) {
    console.error("Error searching products:", err.message);
  }
};

const handleImageError = (event) => {
  event.target.src = placeholderImage;
};

// โหลดสินค้าทั้งหมดตอนเริ่มต้น
onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:3000/products`);
    products.value = res.data;
  } catch (err) {
    console.error("Error loading products:", err.message);
  }
});
</script>

<style scoped>
/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #1e3a5f 0%, #2c5f7f 100%);
  padding: 120px 20px;
  text-align: center;
  color: white;
  margin-bottom: 40px;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  letter-spacing: -1px;
}

.hero-subtitle {
  font-size: 1.2rem;
  margin-bottom: 30px;
  opacity: 0.9;
}

.btn-shop-now {
  background: white;
  color: #1e3a5f;
  border: none;
  padding: 15px 40px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-shop-now:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

/* Category Section */
.category-section {
  padding: 20px;
  background: #f5f5f5;
  margin-bottom: 40px;
}

.category-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.category-btn {
  background: white;
  border: 2px solid #e0e0e0;
  padding: 12px 30px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.category-btn:hover {
  border-color: #1e3a5f;
  color: #1e3a5f;
}

.category-btn.active {
  background: #1e3a5f;
  color: white;
  border-color: #1e3a5f;
}

/* Search Form */
.search-form {
  max-width: 800px;
  margin: 0 auto 40px;
  padding: 0 20px;
}

.search-container {
  display: flex;
  gap: 10px;
}

.search-input {
  flex: 1;
  padding: 15px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #1e3a5f;
}

.btn-search {
  background: #1e3a5f;
  color: white;
  border: none;
  padding: 15px 35px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-search:hover {
  background: #2c5f7f;
}

/* Products Grid */
.products-grid {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px 60px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.product-card-wrapper {
  display: flex;
  justify-content: center;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  width: 100%;
  max-width: 350px;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

/* Badges */
.discount-badge,
.new-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  z-index: 10;
}

.discount-badge {
  background: #e74c3c;
  color: white;
}

.new-badge {
  background: #2c3e50;
  color: white;
}

/* Product Image */
.product-image-container {
  width: 330px;
  height: 400px;
  overflow: hidden;
  background: #f8f8f8;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

/* Product Info */
.product-info {
  padding: 20px;
}

.product-category {
  color: #888;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.product-name {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

.product-brand {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 12px;
}

.product-price {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1e3a5f;
  margin-bottom: 15px;
}

.btn-view-product {
  display: block;
  width: 100%;
  padding: 12px;
  background: #1e3a5f;
  color: white;
  text-align: center;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-view-product:hover {
  background: #2c5f7f;
}

/* No Products Message */
.no-products {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  font-size: 1.5rem;
  color: #888;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }

  .search-container {
    flex-direction: column;
  }

  .btn-search {
    width: 100%;
  }
}
</style>