const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require('./routes/authRouter.js');
const medicationRoutes = require('./routes/medicationRoutes.js'); // <-- NEW
const doseRoutes = require('./routes/doseRoutes.js');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRouter"));
app.use('/api/medications', medicationRoutes); // <-- NEW: Tells Express to use these routes for this path
app.use('/api/doses', doseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
//mongoose.connect(process.env.MONGODB_URI)
//    .then(() => {
//        app.listen(PORT, () => console.log(`🚀Server running on port ${PORT}`));
//    })
//    .catch(err => console.error(err));