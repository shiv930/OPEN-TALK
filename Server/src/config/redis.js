import dotenv from 'dotenv'
dotenv.config()
import  { Redis } from 'ioredis'

const redis = new Redis(process.env.REDIS_HOST)

redis.on("connect",()=>{
   try {
     console.log("redis connected")
   } catch (error) {
    console.log(error)
   }
})


export default redis;