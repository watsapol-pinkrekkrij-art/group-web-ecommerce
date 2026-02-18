import database from "../services/database.js";
import multer from "multer";
import fs from "fs/promises";
import path from "path";

// ตั้งค่า multer สำหรับอัพโหลดรูปสินค้า
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "img_pd"); // โฟลเดอร์เก็บรูปสินค้า
  },
  filename: function (req, file, cb) {
    // ใช้ pdId เป็นชื่อไฟล์
    const filename = `${req.body.pdId}.jpg`;
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // จำกัดขนาด 5MB
  fileFilter: function (req, file, cb) {
    // รับเฉพาะไฟล์รูปภาพ
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("อัพโหลดได้เฉพาะไฟล์รูปภาพเท่านั้น"));
    }
  },
}).single("file");

// ฟังก์ชันอัพโหลดรูปสินค้า
export async function uploadProductImage(req, res) {
  console.log("Upload Product Image");
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        message: err.message,
        success: false,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "ไม่พบไฟล์รูปภาพ",
        success: false,
      });
    }

    res.status(200).json({
      message: "อัพโหลดรูปสินค้าสำเร็จ!",
      filename: req.file.filename,
      success: true,
    });
  });
}

export async function getSerchProduct(req, res) {
  console.log(`GET /searchProduct id=${req.params.id}is Requseted!!`);
  try {
    const result = await database.query({
      text: `SELECT p.* ,
                            (
                                SELECT row_to_json(brand_obj)
                                FROM (	SELECT "brandId","brandName"
                                        FROM brands
                                        WHERE "brandId" = p."brandId")brand_obj
                            ) AS brand,
                            (
                                SELECT row_to_json(pdt_obj)
                                FROM (	SELECT "pdTypeId","pdTypeName"
                                        FROM "pdTypes"
                                        WHERE "pdTypeId" = p."pdTypeId")pdt_obj		
                            )AS pdt
                            From products p
                            WHERE (
                                p."pdId" ILIKE $1
                            OR  p."pdName" ILIKE $1
                            OR  p."pdRemark" ILIKE $1
                            )`,
      values: [`%${req.params.id}%`],
    });
    console.log(result.rows);
    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
}

//accesory T01
export async function getAccessoryProduct(req, res) {
  console.log(`GET /Three Products Requseted!!`);
  try {
    const strQry = `SELECT p.* ,
                            (
                                SELECT row_to_json(brand_obj)
                                FROM (	SELECT "brandId","brandName"
                                        FROM brands
                                        WHERE "brandId" = p."brandId")brand_obj
                            ) AS brand,
                            (
                                SELECT row_to_json(pdt_obj)
                                FROM (	SELECT "pdTypeId","pdTypeName"
                                        FROM "pdTypes"
                                        WHERE "pdTypeId" = p."pdTypeId")pdt_obj		
                            )AS pdt
                            From products p 
                            WHERE p."pdTypeId" = 'T01'
                            ORDER BY "pdId"`;
    const result = await database.query(strQry);
    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
}

// T02 - Aggie Shirt
export async function getAggieShirtProduct(req, res) {
  console.log(`GET /Aggie Shirt Products Requested!!`);
  try {
    const strQry = `SELECT p.* ,
                        (
                            SELECT row_to_json(brand_obj)
                            FROM (	SELECT "brandId","brandName"
                                    FROM brands
                                    WHERE "brandId" = p."brandId")brand_obj
                        ) AS brand,
                        (
                            SELECT row_to_json(pdt_obj)
                            FROM (	SELECT "pdTypeId","pdTypeName"
                                    FROM "pdTypes"
                                    WHERE "pdTypeId" = p."pdTypeId")pdt_obj		
                        )AS pdt
                        FROM products p 
                        WHERE p."pdTypeId" = 'T02'
                        ORDER BY "pdId"`;
    const result = await database.query(strQry);
    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
}

// T03 - KuGen Shirt
export async function getKuGenShirtProduct(req, res) {
  console.log(`GET /KuGen Shirt Products Requested!!`);
  try {
    const strQry = `SELECT p.* ,
                        (
                            SELECT row_to_json(brand_obj)
                            FROM (	SELECT "brandId","brandName"
                                    FROM brands
                                    WHERE "brandId" = p."brandId")brand_obj
                        ) AS brand,
                        (
                            SELECT row_to_json(pdt_obj)
                            FROM (	SELECT "pdTypeId","pdTypeName"
                                    FROM "pdTypes"
                                    WHERE "pdTypeId" = p."pdTypeId")pdt_obj		
                        )AS pdt
                        FROM products p 
                        WHERE p."pdTypeId" = 'T03'
                        ORDER BY "pdId"`;
    const result = await database.query(strQry);
    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
}

// T04 - KuNisit
export async function getKuNisitProduct(req, res) {
  console.log(`GET /KuNisit Products Requested!!`);
  try {
    const strQry = `SELECT p.* ,
                        (
                            SELECT row_to_json(brand_obj)
                            FROM (	SELECT "brandId","brandName"
                                    FROM brands
                                    WHERE "brandId" = p."brandId")brand_obj
                        ) AS brand,
                        (
                            SELECT row_to_json(pdt_obj)
                            FROM (	SELECT "pdTypeId","pdTypeName"
                                    FROM "pdTypes"
                                    WHERE "pdTypeId" = p."pdTypeId")pdt_obj		
                        )AS pdt
                        FROM products p 
                        WHERE p."pdTypeId" = 'T04'
                        ORDER BY "pdId"`;
    const result = await database.query(strQry);
    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
}

// T05 - KU Shoes
export async function getKUshoesProduct(req, res) {
  console.log(`GET /KU Shoes Products Requested!!`);
  try {
    const strQry = `SELECT p.* ,
                        (
                            SELECT row_to_json(brand_obj)
                            FROM (	SELECT "brandId","brandName"
                                    FROM brands
                                    WHERE "brandId" = p."brandId")brand_obj
                        ) AS brand,
                        (
                            SELECT row_to_json(pdt_obj)
                            FROM (	SELECT "pdTypeId","pdTypeName"
                                    FROM "pdTypes"
                                    WHERE "pdTypeId" = p."pdTypeId")pdt_obj		
                        )AS pdt
                        FROM products p 
                        WHERE p."pdTypeId" = 'T05'
                        ORDER BY "pdId"`;
    const result = await database.query(strQry);
    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
}

// T06 - T-Shirt
export async function getTShirtProduct(req, res) {
  console.log(`GET /T-Shirt Products Requested!!`);
  try {
    const strQry = `SELECT p.* ,
                        (
                            SELECT row_to_json(brand_obj)
                            FROM (	SELECT "brandId","brandName"
                                    FROM brands
                                    WHERE "brandId" = p."brandId")brand_obj
                        ) AS brand,
                        (
                            SELECT row_to_json(pdt_obj)
                            FROM (	SELECT "pdTypeId","pdTypeName"
                                    FROM "pdTypes"
                                    WHERE "pdTypeId" = p."pdTypeId")pdt_obj		
                        )AS pdt
                        FROM products p 
                        WHERE p."pdTypeId" = 'T06'
                        ORDER BY "pdId"`;
    const result = await database.query(strQry);
    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
}

export async function getProductByBrandId(req, res) {
  console.log(`GET / products/brands/id is Requseted!!`);
  try {
    const result = await database.query({
      text: `SELECT p.* ,
                            (
                                SELECT row_to_json(pdt_obj)
                                FROM (	SELECT "pdTypeId","pdTypeName"
                                        FROM "pdTypes"
                                        WHERE "pdTypeId" = p."pdTypeId")pdt_obj		
                            )AS pdt
                            From products p
                            WHERE p."brandId" ILIKE $1`,
      values: [req.params.id],
    });
    console.log(result.rows);
    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
}

export async function deleteProduct(req, res) {
  console.log(`DELETE /product/id ${req.params.id} is requested`);
  try {
    // ตรวจสอบว่ามีสินค้าอยู่จริงหรือไม่
    const checkResult = await database.query({
      text: `SELECT "pdId" FROM "products" WHERE "pdId" = $1`,
      values: [req.params.id],
    });

    if (checkResult.rowCount === 0) {
      return res
        .status(404)
        .json({ message: `ERROR id ${req.params.id} not found` });
    }

    // ลบรูปภาพ (ชื่อไฟล์: pdId.jpg ตาม multer config)
    const imagePath = path.join(
      process.cwd(),
      "img_pd",
      `${req.params.id}.jpg`
      
    );
    try {
      await fs.unlink(imagePath);
      console.log(`Image deleted: ${imagePath}`);
      
    } catch (fileErr) {
      // ไม่ error ถ้าไฟล์ไม่มี (อาจยังไม่ได้อัพโหลดรูป)
      console.log(`Image not found or already deleted: ${imagePath}`);
    }

    // ลบข้อมูลในฐานข้อมูล
    await database.query({
      text: `DELETE FROM "products" WHERE "pdId" = $1`,
      values: [req.params.id],
    });

    return res.status(204).end();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function putProduct(req, res) {
  console.log(`PUT /product is requested`);
  try {
    const bodyData = req.body;
    const result = await database.query({
      text: `    UPDATE "products"
                        SET "pdName" =$1,
                            "pdPrice" =$2,
                            "pdRemark" =$3,
                            "pdTypeId" =$4,
                            "brandId" =$5
                        WHERE "pdId" = $6
                        `,
      values: [
        bodyData.pdName,
        bodyData.pdPrice,
        bodyData.pdRemark,
        bodyData.pdTypeId,
        bodyData.brandId,
        req.params.id,
      ],
    });
    if (result.rowCount == 0)
      return res
        .status(404)
        .json({ message: `ERROR id ${req.params.id} not found` });
    const datetime = new Date();
    bodyData.updateDate = datetime;
    bodyData.message = "ok";
    return res.status(201).json(bodyData);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function getProductById(req, res) {
  console.log(`GET / products/id ${req.params.id}is Requseted!!`);
  try {
    const result = await database.query({
      text: `SELECT p.* ,
                            (
                                SELECT row_to_json(brand_obj)
                                FROM (	SELECT "brandId","brandName"
                                        FROM brands
                                        WHERE "brandId" = p."brandId")brand_obj
                            ) AS brand,
                            (
                                SELECT row_to_json(pdt_obj)
                                FROM (	SELECT "pdTypeId","pdTypeName"
                                        FROM "pdTypes"
                                        WHERE "pdTypeId" = p."pdTypeId")pdt_obj		
                            )AS pdt
                            From products p
                            WHERE p."pdId" = $1`,
      values: [req.params.id],
    });
    console.log(result.rows);
    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
}

export async function getAllProduct(req, res) {
  console.log(`GET /products requested`);
  try {
    const strQry = 'SELECT * FROM products ORDER BY "pdId"';
    const result = await database.query(strQry);
    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
}

export async function postProduct(req,res){
        console.log(`POST /products is requested.`)
        const bodyData = req.body
        try{
            if(!bodyData.pdId || !bodyData.pdName){
                return res.status(422).json({message:`ERROR pdId and pdName is required`})
            }
    
            const chkRow = await database.query({
                text: ` SELECT * FROM products WHERE "pdId"=$1`,
                values:[bodyData.pdId]
            })
            if(chkRow.rowCount !=0){
                return res.status(409).json({message: `ERROR pdId ${bodyData.pdId} is exists`})
            }
            const result = await database.query({
                text:`INSERT INTO "products" ("pdId","pdName","pdPrice","pdTypeId","brandId") 
                VALUES($1,$2,$3,$4,$5)
                `,
                values:[
                    req.body.pdId,
                    req.body.pdName,
                    req.body.pdPrice,
                    req.body.pdTypeId,
                    req.body.brandId
                ]
    
            })
    
            bodyData.createdDate = new Date()
            bodyData.message = "ok"
            res.status(201).json(bodyData)
        }
        catch(err){
            return res.status(500).json({message:err.message})
        }
     
}

