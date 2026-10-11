import mongoose, { mongo } from 'mongoose'

const roleSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    serverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"server",
        required:true
    },
    color:{
        type:String,
        default:"#000000"
    },
    permission:{
        type:[String],
        default:[]
    },
    position:{
        type:Number,
        default:0
    }
},{
    timestamps:true
})

const roleModel= mongoose.model("role", roleSchema)
export default roleModel