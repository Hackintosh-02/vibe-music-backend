import mongoose, { mongo } from "mongoose";

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI, {

        });
        console.log("MongoDB connected!");
    }
    catch(error){
        console.log("ERROR connecting to MongoDB", error.message);
    }
}

export default connectToMongoDB;