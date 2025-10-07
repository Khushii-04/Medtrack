import express from "express"
import cors from "cors"
import dotenv from 'dotenv'
import dbConnection from "./database/dbConnection.js";
import { errorMiddleware } from "./errorHandling/error.js";

import userRoutes from "./Routes/userRoutes.js"
import medicationRoutes from "./Routes/medicationRoutes.js"

app.use("./api/users", userRoutes);
app.use("/api/medications", medicationRoutes);

const app = express();
dotenv.config({path:"./config/config.env"})

app.use(cors({
    origin:[process.env.FRONTEND_URL],
    methods:["POST"],

    credentials:true,
}))
//we use json to convert string into json format
app.use(express.json());
//we use urlencoded tocheck ki data kis type ka hone wala h
app.use(express.urlencoded({extended:true}));


dbConnection();
app.use(errorMiddleware);
export default app;