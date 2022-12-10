const express = require("express");
const cors = require("cors");

const app = express();

const userRouter = require("./routes/user");

app.use(express.json());
app.use(cors());

app.use("/users", userRouter);

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
