

import server from "./src/app.js"
import connectDB from "./src/config/db.js"




const port = process.env.PORT || 3000

try {
    await connectDB()
    server.listen(port,()=>{
        console.log(`server is running on ${port}`)
    })
} catch (error) {
    process.exitCode = 1
}