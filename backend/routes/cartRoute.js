import express from "express"
import * as cartC from "../controllers/cartController.js"


const router =express.Router()


router.post('/carts/chkcart',cartC.chkCart)
router.post('/carts/addcart',cartC.postCart)
router.post('/carts/addcartdtl',cartC.postCartDtl)
router.get('/carts/sumcart/:id',cartC.sumCart)
router.get('/carts/getcart/:id',cartC.getCart)
router.get('/carts/getcartdtl/:id',cartC.getCartDtl)
router.post('/carts/getcartbycus',cartC.getCartByCus)
router.post('/carts/delcartdtl', cartC.delCartDtl)
router.post('/carts/delcart', cartC.delCart)  
router.post('/carts/confirmcart', cartC.confirmCart)

export default router