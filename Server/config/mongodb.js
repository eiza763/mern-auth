
// import mongoose from "mongoose";

// async function connectDB() {
//   mongoose.connection.on("connected", () => console.log("Database connected!"));
//   await mongoose.connect(`${process.env.MONGODB_URL}/mern-auth`);
// }
// export default connectDB;
 //Fixed Database Connection File (db.js or config/database.js)
import mongoose from "mongoose";

async function connectDB() {
  try {
    mongoose.connection.on("connected", () => console.log("Database connected!"));
    mongoose.connection.on("error", (err) => console.log("Database connection error:", err));
    
    // Fixed: Removed the extra /mern-auth since it's already in the URL
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

export default connectDB;