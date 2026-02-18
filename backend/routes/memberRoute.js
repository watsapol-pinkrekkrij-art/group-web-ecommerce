import express from "express";
import * as memberC from "../controllers/memberController.js";
import { authenticateToken, checkRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes สำหรับทุกคน (ไม่ต้อง login)
router.post('/members', memberC.postMember); // สมัครสมาชิก
router.post('/members/login', memberC.loginMember); // login

// Routes สำหรับคนที่ login แล้ว (ทั้ง admin และ user)
router.get('/members/detail', authenticateToken, memberC.getMember);
router.get('/members/logout', authenticateToken, memberC.logoutMember);
router.post('/members/uploadimg', authenticateToken, memberC.uploadMember);

// Routes สำหรับ Admin เท่านั้น
router.get('/members/all', 
  authenticateToken, 
  checkRole('admin'), 
  memberC.getAllMembers
);

router.delete('/members/:email', 
  authenticateToken, 
  checkRole('admin'), 
  memberC.deleteMember
);

router.put('/members/:email/role', 
  authenticateToken, 
  checkRole('admin'), 
  memberC.updateMemberRole
);
// เพิ่มบรรทัดนี้ ⬇️⬇️⬇️
router.get('/members/:email/orders', 
  authenticateToken, 
  checkRole('admin'), 
  memberC.getMemberOrders
);

export default router;