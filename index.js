
import express from "express";
import mongoose from "mongoose";
import UserRoutes from "./routes/UserRoutes.js";
import session from "express-session";

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: '12345678harsh',         
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

const uri =
  "mongodb://root:h1yoVQDdUbz2D57M@ac-1vayapq-shard-00-00.yhftboa.mongodb.net:27017,ac-1vayapq-shard-00-01.yhftboa.mongodb.net:27017,ac-1vayapq-shard-00-02.yhftboa.mongodb.net:27017/?replicaSet=atlas-11jud3-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=test101";

mongoose
  .connect(uri, {dbName: "support-system" , useNewUrlParser: true , useUnifiedTopology: true})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});


app.get("/", (req, res) => {
  res.redirect("/users/register");
});

app.use("/users", UserRoutes);

