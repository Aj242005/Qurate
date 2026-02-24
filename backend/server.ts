import express from "express";
import { config } from "dotenv"; config();
import { connectDB } from "./database/connectDB.js";

const port = process.env.PORT;

const app = express();
app.use(express.json());

app.get("/", async (req,res) => {
    res.status(200).json({
        message : "Hi there",
        status : 200
    })
})

app.listen(port, async () => {
    console.log(`Server Listening on the port : ${port}`);
    const res = await connectDB(String(process.env.MONGO_URI));
    console.log(res);
})