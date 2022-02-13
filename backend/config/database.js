const mongoose = require("mongoose");

const connectDatabase=()=>{
  mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((data) =>
    console.log("MONGO DB CONNECTED WITH SERVER ", data.connection.host)
  )
  .catch((e) => console.log(e.message));
}

module.exports=connectDatabase;