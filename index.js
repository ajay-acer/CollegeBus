const bodyParser = require("body-parser"),
  express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local");
require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//MONGODB ATLAS CONNECTION

const connectionParams = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
mongoose
  .connect(process.env.DB_URL2, connectionParams)
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log("NOT CONNECTED!!");
    console.log(err);
  });
//MONGODB CONNECTION COMPLETED

const Admin = require("./models/admin");
app.use(
  require("express-session")({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

const passengerRouter = require("./routes/passenger");
const busRouter = require("./routes/bus");
const boardingpointRouter = require("./routes/boardingpoint");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
app.use(passengerRouter);
app.use(busRouter);
app.use(boardingpointRouter);
app.use(adminRoutes);
app.use(authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server Started!!");
});
