import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    description:{
        type:String,
    },
    serverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"server",
        required:true
    },
    type:{
        type:String,
        default:"text",
    },
    position:{
        type:Number
    },
    isPrivate:{
        type:String,
        default:false
    }
},{
    timestamps:true
})

const channelModel = mongoose.model("channel", channelSchema)
export default channelModel;