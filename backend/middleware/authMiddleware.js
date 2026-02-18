import jwt from "jsonwebtoken";

// Middleware ตรวจสอบว่า login แล้วหรือยัง
export function authenticateToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ 
      message: "กรุณา login ก่อน", 
      login: false 
    });
  }

  try {
    const secret_key = process.env.SECRET_KEY;
    const member = jwt.verify(token, secret_key);
    req.user = member; // เก็บข้อมูล user ไว้ใน request
    next();
  } catch (err) {
    return res.status(403).json({
      message: "Token ไม่ถูกต้องหรือหมดอายุ",
      login: false,
    });
  }
}

// Middleware ตรวจสอบ Role
export function checkRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "กรุณา login ก่อน",
        login: false,
      });
    }

    // ตรวจสอบว่า role ของ user อยู่ใน allowedRoles หรือไม่
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "คุณไม่มีสิทธิ์เข้าถึงส่วนนี้",
        yourRole: req.user.role,
        requiredRole: allowedRoles,
      });
    }

    next();
  };
}