import mongoose from "mongoose";

const chatoSchema = mongoose.Schema({
    message: String,
    name: String,
    timestamp: String,
    recived: Boolean
});

export default mongoose.model("messageContent", chatoSchema)