const mongoose = require("mongoose");

const connectDB = async () => {
   try {
    await mongoose.connect(process.env.MONGODB_URI,{
     useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsAllowInvalidCertificates: true, // <- TEMPORARY FIX
  tlsAllowInvalidHostnames: true     // <- TEMPORARY FIX

    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
