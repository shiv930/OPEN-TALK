import {Server} from 'socket.io'
import ApiError from '../utils/ApiError.js';
import { socketAuthMiddleware } from '../middleware/socket.middleware.js';
import channelModel from '../models/channel.model.js';
import serverModel from '../models/server.model.js';
import serverMemberModel from '../models/serverMember.model.js';
import mongoose from 'mongoose';


let io;  // socket.io ka instance store kar raha hu 
export const initSocket = (server)=>{    //ye function tumhare HTTP server ko socket.io ke saath bind kar raha hai.
     io= new Server(server,{   //socket.io ko HTTP server ke upar mount karta hai.
        // cors:{
        //     origin:"http://localhost:5173",
        //     methods:['GET', 'POST']
        // }
    });

    io.use(socketAuthMiddleware)
// io.on = menas server per hone wale events ko suno 👍
    io.on('connection', (socket)=>{
        console.log("⚡ New client connected:", socket.id);


        //join particular channel ye fir room 
        socket.on("joinChannel", async (channelId)=>{
            try {
                if (!mongoose.Types.ObjectId.isValid(channelId)) {
                    throw new ApiError(400, "Invalid channel");
                }

                const channel = await channelModel.findById(channelId);
                if (!channel) throw new ApiError(404, "Channel not found");

                const server = await serverModel.findById(channel.serverId).select("isPublic");
                const member = await serverMemberModel.findOne({
                    server: channel.serverId,
                    user: socket.user._id,
                });
                const isPrivateChannel =
                    channel.type === "private" ||
                    channel.isPrivate === true ||
                    channel.isPrivate === "true";

                if ((!server?.isPublic && !member) || (isPrivateChannel && !member)) {
                    throw new ApiError(403, "You cannot join this channel");
                }

                socket.join(channelId);
                console.log(`🙋‍♂️ ${socket.id} joined channel: ${channelId}`);
            } catch (error) {
                socket.emit("channelJoinError", {
                    channelId,
                    message: error.message || "Unable to join channel",
                });
            }
        })
        //leave karne ke liye okk 
        socket.on("leaveChannel",(channelId)=>{
            socket.leave(channelId)
            console.log(`👋 ${socket.id} left channel: ${channelId}`);
        })
        socket.on("disconnect", ()=>{
           console.log("❌ Client disconnected:", socket.id);
         })
        
    })
    return io;
}



export const getIo =()=>{
    if(!io){
        throw new ApiError("socket.io not initialized")
    }
    return io;
}