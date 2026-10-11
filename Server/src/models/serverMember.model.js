import mongoose from 'mongoose'

const serverMemberSchema= new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    server:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"server"
    },
    role:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"role"
    }
})

const serverMemberModel =  mongoose.model("serverMember", serverMemberSchema)
export default serverMemberModel