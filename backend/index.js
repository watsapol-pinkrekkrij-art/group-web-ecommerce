import express from "express"
import dotenv from 'dotenv'
import bodyParser from "body-parser"
import cors from "cors"
import memberRoute from "./routes/memberRoute.js"
import productRoute from "./routes/productRoute.js"
import cookieParser from "cookie-parser"
import cartRoute from "./routes/cartRoute.js"
// import ส่วนที่ติดตั้งเข้ามา
import swaggerUI from "swagger-ui-express"
import yaml from "yaml"
// ใช้ File
import fs from "fs"
dotenv.config()



const app =express()
const port = process.env.PORT
// swagger
const swaggerfile = fs.readFileSync('services/swagger.yaml','utf-8')
const swaggerDoc = yaml.parse(swaggerfile)
app.use(cors({
    origin:['http://localhost', 'http://127.0.0.1',
            'http://localhost:5173','http://127.0.0.1:5173',
            'http://localhost:4173','http://127.0.0.1:4173'], //Domain ของ Frontend
    methods:['GET','POST','PUT','DELETE'], //Method ที่อนุญาต
    credentials:true  //ให้ส่งข้อมูล Header+Cookie ได้
}))

app.use(bodyParser.json())
app.use(cookieParser());
app.use("/img_pd",express.static("img_pd"))
app.use("/img_mem",express.static("img_mem"))

app.use(productRoute)
app.use(memberRoute)
app.use(cartRoute)
// กำหนด path ที่จะให้เรียกหน้า Document ขึ้นมา
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDoc))
app.get('/',(req,res)=>{
    console.log(`GET / is Requestd.`)
    res.status(200).json({
        message:"ok"
    })
})

app.listen(port,()=>{
    console.log(`Server is listen on Port ${port}`)
})