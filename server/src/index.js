import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { app, server, io } from "./lib/socket.js"; 
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cors from "cors"
import path from "path"

dotenv.config();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve()


app.use(express.json({ limit: "15mb" }));
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname, "../client/dist")))

    app.get("*",(req,res) =>{
        res.sendFile(path.join(__dirname,"../client/dist/index.html"))
    })
}


server.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await connectDB();
});
