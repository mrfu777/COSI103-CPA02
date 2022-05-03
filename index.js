const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");
const MongoDBStore = require('connect-mongodb-session')(session);
const MONGO_URL = `mongodb+srv://qwer1234:qwer1234@cluster0.xa6fp.mongodb.net/cs103a-cpa02?retryWrites=true&w=majority`;
const TodoModel = require("./models/todo");
const {raw} = require("express");

mongoose.connect(MONGO_URL);

const app = express();
const PORT = process.env.PORT || 4000;

const store = new MongoDBStore({
  uri: MONGO_URL,
  collection: 'sessions'
});
app.use(session({
  secret: 'my secret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30 // 1 month duration
  },
  store: store,
  resave: false,
  saveUninitialized: true
}));

app.set("views", path.resolve(__dirname, './views'));
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get("/", async function (req, res) {
  if (!req.session.user) {
    req.session.user = "user" + Date.now();
  }
  const todos = await TodoModel.find({ user: req.session.user });

  res.render("index", {todos});
});

app.post("/done", async (req, res) => {
  const { todoID } = req.body;
  console.log(req.body)
  const user = req.session.user;
  if (!user) {
    return res.status(403).send("Forbidden");
  }
  await TodoModel.findByIdAndUpdate(todoID, { done: true });
  res.status(200).send();
});

app.post("/todos", async function (req, res) {
  const { todo } = req.body;
  if (!todo) {
    return res.status(400).send("Bad Request!");
  }

  const user = req.session.user;
  if (!user) {
    return res.status(403).send("Forbidden!");
  }
  await TodoModel.create({
    todo,
    user
  });
  res.redirect("/");
});



app.listen(PORT, function () {
  console.log("This server set up at port " + PORT);
});




