import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/connection.js";
const localPort = 8080;

dotenv.config({
    path: "./.env"
})

connectDB()
    .then(() => {
        app.listen(process.env.PORT || localPort, () => {
            console.log(`Server is Running at PORT: ${process.env.PORT}`)
        })
    }).catch((err) => {
        console.log(err.message);
    })