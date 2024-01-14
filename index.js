const express = require("express");



const { connection } = require("./config/db");

const { userRouter } = require("./routes/user.route");
const { auth } = require("./middlewares/auth.middleware");

const { postRouter } = require("./routes/post.route"); 
require("dotenv").config();

const app = express();

app.use(express.json());


app.use("/users", userRouter);
 app.use("/posts", auth, postRouter);
 const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {

try{

await connection;
console.log("Db connected");

console.log("Server running ");
console.log(`Server is running on port ${PORT}`);
}catch (error){ 
    console.log(error.message);
}

});
