import express from "express";
import "./db/mongoose.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ success: true, message: "API working" });
});

/////////////USER ROUTER///////////////////
import userRouter from "./router/user/userRouter.js";
app.use(userRouter);

app.listen(process.env.PORT, () => {
  console.log("Listening at ", process.env.PORT);
});
