const express = require("express");
const exphbs = require("express-handlebars");
const axios = require("axios");
const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const readline = require("readline");
const path = require("path");
const app = express();

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

let link = "#";

app.get("/", (req, res) => {
  res.render("home", { link });
});
app.post("/download", async (req, res) => {
  const { videoid } = req.body;

  const options = {
    method: "GET",
    url: "https://youtube-mp36.p.rapidapi.com/dl",
    params: { id: `${videoid}` },
    headers: {
      "X-RapidAPI-Key": "0e1228f4f0msh60304bbaf648ea9p1f695ajsn368815775067",
      "X-RapidAPI-Host": "youtube-mp36.p.rapidapi.com",
    },
  };

  await axios
    .request(options)
    .then(function (response) {
      link = response.data.link;
      // console.log(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });

  res.redirect("/");
});

app.post("/downloadVideo", (req, res) => {
  var { url } = req.body;
  res.header("Content-Disposition", 'attachment; filename="video.mp4"');
  ytdl(url, {
    format: "mp4",
    filter: "audioandvideo",
  }).pipe(res);
});

app.listen(3000, () => {
  console.log("App funcionando!");
});
