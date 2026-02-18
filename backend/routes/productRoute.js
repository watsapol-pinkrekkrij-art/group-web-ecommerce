import express from "express"
import * as productC from "../controllers/productController.js"
import { authenticateToken, checkRole } from "../middleware/authMiddleware.js"

const router = express.Router()

// Routes สำหรับทุกคน (ดูสินค้าได้)
router.get('/products', productC.getAllProduct)
router.get('/products/category/accessory', productC.getAccessoryProduct)// T01
router.get('/products/category/aggie-shirt', productC.getAggieShirtProduct)  // T02
router.get('/products/category/kugen-shirt', productC.getKuGenShirtProduct)  // T03
router.get('/products/category/kunisit', productC.getKuNisitProduct)         // T04
router.get('/products/category/kushoes', productC.getKUshoesProduct)         // T05
router.get('/products/category/tshirt', productC.getTShirtProduct)           // T06
router.get('/products/search/:id', productC.getSerchProduct)
router.get('/products/brand/:id', productC.getProductByBrandId)
router.get('/products/:id', productC.getProductById)

// Routes สำหรับ Admin เท่านั้น (จัดการสินค้า)
router.post('/products', 
  authenticateToken, 
  checkRole('admin'), 
  productC.postProduct
)

router.put('/products/:id', 
  authenticateToken, 
  checkRole('admin'), 
  productC.putProduct
)

router.delete('/products/:id', 
  authenticateToken, 
  checkRole('admin'), 
  productC.deleteProduct
)

router.post('/products/uploadimg', 
  authenticateToken, 
  checkRole('admin'), 
  productC.uploadProductImage
)

export default router