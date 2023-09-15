import { config } from "dotenv";
config();

import express, { Request, Response, request, response } from "express";
import mongoose from "mongoose";

import User from "./models/User";

var email: String | undefined;
var currentLocation: String | undefined;
var weather: String | undefined;

const PORT = 5000;

const app = express();

app.use(express.json());

const url = require("url");

app.get("/UserData", async (req: Request, res: Response) => {
  const data = await User.find();

  email = data[0].email;
  currentLocation = data[0].location;
  weather = data[0].weather_data;
  //https://api.openweathermap.org/data/2.5/weather?q=colombo&appid=10622bdec1130793ca9ac0c63d3e8980

  const reqUrl = `https://api.openweathermap.org/data/2.5/weather?q=${currentLocation}&appid=10622bdec1130793ca9ac0c63d3e8980`;
  const urObject = url.parse(reqUrl, true);
  const currentWeather = urObject.query;
  res.send(urObject);
});

app.post("/User", async (req: Request, res: Response) => {
  const newUser = new User({
    email,
    currentLocation,
    weather_data: req.body.weather_data,
  });
  const createdUser = await newUser.save();
  res.json(createdUser);
});

//connection
mongoose.connect(process.env.MONGO_URL!).then(() => {
  console.log(`listening on port ${PORT}`);
  app.listen(PORT);
});
