import dotenv from "dotenv";

import dns from "node:dns";
import mongoose from "mongoose";

dotenv.config();

const dnsServers = (process.env.MONGO_DNS_SERVERS || "1.1.1.1,8.8.8.8")
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean);

if (dnsServers.length) {
    dns.setServers(dnsServers);
}

const connectDb= async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    }
    catch(err){
        console.error("MongoDB connection failed:", err.message);
        throw err;
    }
}
export default connectDb;