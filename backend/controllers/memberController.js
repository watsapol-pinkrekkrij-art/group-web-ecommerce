import database from "../services/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from 'fs';
import path from 'path';

export async function logoutMember(req, res) {
  console.log(`GET /logoutMember is requested.`);
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });
    res.json({ message: `Logout Success`, login: false });
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
}

export async function getMember(req, res) {
  console.log(`GET /getMember is requested`);

  const token = req.cookies.token;
  if (!token) return res.json({ message: `No member`, login: false });
  try {
    const secret_key = process.env.SECRET_KEY;
    const member = jwt.verify(token, secret_key);
    console.log(member);
    return res.json({
      memEmail: member.memEmail,
      memName: member.memName,
      dutyId: member.dutyId,
      role: member.role, // เพิ่ม role
      login: true,
    });
  } catch (err) {
    console.log(err.message);
    return res.json({
      message: `The information was falsified.`,
      login: false,
    });
  }
}

export async function postMember(req, res) {
  console.log(`POST /members is requested.`);
  const bodyData = req.body;
  try {
    if (!bodyData.memEmail || !bodyData.memName) {
      return res.json({
        message: `ERROR memEmail and memName is required`,
        regist: false,
      });
    }

    const chkRow = await database.query({
      text: ` SELECT * FROM members WHERE "memEmail"=$1`,
      values: [req.body.memEmail],
    });
    if (chkRow.rowCount != 0) {
      return res.json({
        message: `ERROR memEmail ${req.body.memEmail} is exists`,
        regist: false,
      });
    }
    const pwd = req.body.password;
    const saltround = 11;
    const pwdHash = await bcrypt.hash(pwd, saltround);
    
    // กำหนด role เริ่มต้นเป็น 'user'
    const role = req.body.role || 'user';
    
    const result = await database.query({
      text: `INSERT INTO "members" ("memEmail","memName","memHash","role")
                    VALUES ($1,$2,$3,$4)`,
      values: [
        req.body.memEmail,
        req.body.memName,
        pwdHash,
        role,
      ],
    });

    bodyData.createdDate = new Date();
    bodyData.message = "Regist Success";
    bodyData.regist = true;
    res.json(bodyData);
  } catch (err) {
    return res.json({
      message: err.message,
      regist: false,
    });
  }
}

export async function loginMember(req, res) {
  console.log(`POST /loginMembers is requested.`);
  const bodyData = req.body;
  try {
    if (!bodyData.loginName || !bodyData.password) {
      return res.json({ 
        message: `ERROR memEmail and password is required`,
        login: false 
      });
    }

    const result = await database.query({
      text: ` SELECT * FROM members WHERE "memEmail"=$1`,
      values: [req.body.loginName],
    });
    
    if (result.rowCount == 0) {
      return res.json({ message: `Login Fail`, login: false });
    }

    const loginOK = await bcrypt.compare(
      req.body.password,
      result.rows[0].memHash
    );
    
    if (loginOK) {
      // สร้าง Token พร้อม role
      const theuser = {
        memEmail: result.rows[0].memEmail,
        memName: result.rows[0].memName,
        dutyId: result.rows[0].dutyId,
        role: result.rows[0].role || 'user', // เพิ่ม role
      };
      const secret_key = process.env.SECRET_KEY;
      const token = jwt.sign(theuser, secret_key, { expiresIn: "1h" });
      
      res.cookie("token", token, {
        maxAge: 3600000,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      
      return res.json({ 
        message: `Login Success`, 
        login: true,
        role: theuser.role 
      });
    } else {
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      return res.json({ message: `Login Fail`, login: false });
    }
  } catch (err) {
    return res.json({
      message: err.message,
      login: false,
    });
  }
}

// ฟังก์ชันสำหรับ Admin เท่านั้น
export async function getAllMembers(req, res) {
  console.log(`GET /members/all is requested by Admin`);
  try {
    const result = await database.query({
      text: `SELECT "memEmail", "memName", "dutyId", "role" FROM members ORDER BY "memEmail"`,
    });
    
    res.json({
      message: "Success",
      members: result.rows,
      count: result.rowCount,
    });
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
}

export async function deleteMember(req, res) {
  console.log(`DELETE /members/:email is requested by Admin`);
  try {
    const email = req.params.email;
    
    // ✅ 1. ตรวจสอบว่า member มีอยู่จริงหรือไม่
    const checkMember = await database.query({
      text: `SELECT "memEmail" FROM members WHERE "memEmail"=$1`,
      values: [email],
    });
    
    if (checkMember.rows.length === 0) {
      return res.json({
        message: `Member ${email} not found`,
        success: false,
      });
    }
    
    console.log(`🔍 Found member: ${email}`);
    
    // ✅ 2. ดึง cartId ทั้งหมดของ member คนนี้
    const cartResult = await database.query({
      text: `SELECT "cartId" FROM carts WHERE "cusId"=$1`,
      values: [email],
    }); 
    
    const cartIds = cartResult.rows.map(row => row.cartId);
    console.log(`📦 Found ${cartIds.length} carts for ${email}`);
    
    // ✅ 3. ลบ cartDtl ทั้งหมดที่เกี่ยวข้อง (ถ้ามี cart)
    if (cartIds.length > 0) {
      const deleteCartDtlResult = await database.query({
        text: `DELETE FROM "cartDtl" WHERE "cartId" = ANY($1::text[])`,
        values: [cartIds],
      });
      console.log(`🗑️ Deleted ${deleteCartDtlResult.rowCount} cart detail records`);
    }
    
    // ✅ 4. ลบ carts ทั้งหมดของ member
    const deleteCartsResult = await database.query({
      text: `DELETE FROM carts WHERE "cusId"=$1`,
      values: [email],
    });
    console.log(`🗑️ Deleted ${deleteCartsResult.rowCount} cart records`);
    
    // ✅ 5. ลบข้อมูล member
    const deleteMemberResult = await database.query({
      text: `DELETE FROM members WHERE "memEmail"=$1`,
      values: [email],
    });
    
    if (deleteMemberResult.rowCount === 0) {
      return res.json({
        message: `Failed to delete member ${email}`,
        success: false,
      });
    }
    
    console.log(`✅ Member ${email} deleted from database`);
    
    // ✅ 6. ลบไฟล์รูปภาพ
    const extensions = ['.jpg', '.jpeg', '.png', '.gif'];
    let imageDeleted = false;
    
    for (const ext of extensions) {
      const imagePath = path.join(process.cwd(), 'img_mem', `${email}${ext}`);
      
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
          console.log(`✅ Image deleted: ${imagePath}`);
          imageDeleted = true;
          break;
        } catch (delErr) {
          console.error(`❌ Error deleting ${imagePath}:`, delErr.message);
        }
      }
    }
    
    if (!imageDeleted) {
      console.log(`⚠️ No image found for ${email} in img_mem folder`);
    }
    
    // ✅ 7. ส่งผลลัพธ์กลับ
    res.json({
      message: `Member ${email} and all related data deleted successfully`,
      success: true,
      deleted: {
        member: email,
        carts: deleteCartsResult.rowCount,
        cartDetails: cartIds.length > 0 ? 'deleted' : 'none',
        image: imageDeleted ? 'deleted' : 'not found',
      }
    });
  } catch (err) {
    console.error('❌ Error deleting member:', err);
    return res.json({
      message: err.message,
      success: false,
    });
  }
}

export async function updateMemberRole(req, res) {
  console.log(`PUT /members/:email/role is requested by Admin`);
  try {
    const email = req.params.email;
    const { role } = req.body;
    
    if (!['admin', 'user'].includes(role)) {
      return res.json({
        message: `Invalid role. Must be 'admin' or 'user'`,
        success: false,
      });
    }
    
    const result = await database.query({
      text: `UPDATE members SET role=$1 WHERE "memEmail"=$2`,
      values: [role, email],
    });
    
    if (result.rowCount === 0) {
      return res.json({
        message: `Member ${email} not found`,
        success: false,
      });
    }
    
    res.json({
      message: `Role updated successfully`,
      success: true,
    });
  } catch (err) {
    return res.json({
      message: err.message,
      success: false,
    });
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "img_mem");
  },
  filename: function (req, file, cb) {
    const filename = `${req.body.memEmail}.jpg`;
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
}).single("file");

export async function uploadMember(req, res) {
  console.log("Upload Member Image");
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    res.status(200).json({ message: "File uploaded successfully!" });
  });
}

export async function getMemberOrders(req, res) {
  console.log(`GET /members/:email/orders is requested by Admin`);
  try {
    const email = req.params.email;
    console.log('Getting orders for email:', email);
    
    // JOIN กับตาราง products เพื่อดึงชื่อสินค้าด้วย
    const result = await database.query({
      text: `SELECT 
               cd."cartId" as "orderId",
               cd."pdId" as "productId",
               p."pdName" as "productName",
               cd."qty" as "quantity",
               cd."price",
               (cd."qty" * cd."price") as "totalPrice",
               c."cusId" as "memEmail",
               c."cartDate" as "orderDate",
               CASE 
                 WHEN c."cartCf" = true THEN 'ยืนยันแล้ว'
                 ELSE 'รอดำเนินการ'
               END as "status"
             FROM "cartDtl" cd
             INNER JOIN carts c ON cd."cartId" = c."cartId"
             LEFT JOIN products p ON cd."pdId" = p."pdId"
             WHERE c."cusId"=$1 
             ORDER BY cd."cartId" DESC`,
      values: [email],
    });
    
    console.log('Found orders:', result.rowCount);
    console.log('Orders data:', result.rows);
    
    res.json({
      message: "Success",
      orders: result.rows,
      count: result.rowCount,
    });
  } catch (err) {
    console.error('Error getting orders:', err);
    return res.json({
      message: err.message,
      orders: [],
      count: 0,
    });
  }
}