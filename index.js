const express = require("express");
const cors = require("cors");

const app = express();

const userRouter = require("./routes/user");

app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
  res.status(200).send({
    response: 'PMGlobalTechnology test'
  });
});

app.use((req, res, next) => {
  if (!req.get('Authorization')) {
    return res.status(401).send('Unauthorized');
  } else {
    var credentials = Buffer.from(
      req.get('Authorization').split(' ')[1],
      'base64'
    )
      .toString()
      .split(':');

    var username = credentials[0];
    var password = credentials[1];

    if (!(username === 'test' && password === 'pass1234')) {
      res.status(401).send('Unauthorized');
      return;
    }
    next();
  }
});

app.enable('trust proxy');

app.options('*', cors());

app.use('/users', userRouter);

app.all("*", function (req, res) {
  res.redirect("/");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
