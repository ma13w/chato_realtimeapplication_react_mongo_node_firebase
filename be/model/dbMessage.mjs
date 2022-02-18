import mongoose from "mongoose";

const chateoSchema = mongoose.Schema({
    message: String,
    name: String,
    timestamp: String,
    recived: Boolean
});

export default mongoose.model("messageContent", chateoSchema)