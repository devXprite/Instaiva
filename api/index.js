const package = require("../package.json");
const express = require("express");
const Instagram = require("instagram-web-api");
const bodyParser = require("body-parser");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const FileCookieStore = require("tough-cookie-filestore2");
const request = require("request");
const NodeCache = require("node-cache");

require("dotenv").config();

const port = process.env.PORT || 3000;
const app_url = process.env.APP_URL || `localhost:${port}`;
const username = process.env.INSTAGRAM_USERNAME;
const password = process.env.INSTAGRAM_PASSWORD;

const app = express();
const cache = new NodeCache({ stdTTL: 60 * 60 * 1 });

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: true,
});

const cookieStore = new FileCookieStore(__dirname + "/cookies.json");
const client = new Instagram({ username, password, cookieStore });

app.use(cors());
app.use("/api/*", limiter);
app.set("json spaces", 2);
app.use(bodyParser.json());
app.use(helmet.hsts());
app.use(helmet.hidePoweredBy());
app.use(helmet.contentSecurityPolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.noSniff());
app.use(bodyParser.urlencoded({ extended: false }));

client.login();

const baseEncode = (string) => Buffer.from(string).toString("base64");
const baseDecode = (string) => Buffer.from(string, "base64").toString("ascii");

const api404 = async (req, res, next) => {
  res.status(404).json({
    message: "Not found :)",
    code: 404,
  });
};

const verifyCache = (req, res, next) => {
  try {
    let username = req.params.username;

    if (cache.has(username)) {
      return res.status(200).json(cache.get(username));
    }
    return next();
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error!", code: 500 });
  }
};

const profile = async (req, res, next) => {
  let username = req.params.username;
  if (/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/gim.test(username)) {
    try {
      const profileDataRaw = await client.getUserByUsername({
        username: username,
      });

      let keys = Object.keys(profileDataRaw);

      var profileData = {
        followers: profileDataRaw.edge_followed_by.count,
        following: profileDataRaw.edge_follow.count,
        posts: profileDataRaw.edge_owner_to_timeline_media.count,
      };

      keys.forEach((key) => {
        if (
          typeof profileDataRaw[key] != "object" &&
          !/(https:\/\/)(l|s|ins)/gi.test(profileDataRaw[key]) &&
          !/(profile_pic)/gi.test(key)
        ) {
          profileData[key] = profileDataRaw[key];
        }
      });

      profileData["profile_pic_url"] = `${app_url}/media/${baseEncode(
        profileDataRaw.profile_pic_url_hd
      )}`;

      profileData["profile_pic_url_instagram"] =
        profileDataRaw.profile_pic_url_hd;

      res.json(profileData);
      cache.set(username, profileData);
    } catch (error) {
      res.status(500).send({ error: "Internal Server Error!", code: 500 });
      console.log(error);
    }
  } else {
    res.status(400).send({ error: "Invalid Username!", code: 400 });
  }
};

const media = async (req, res, next) => {
  try {
    let mediaUrl = baseDecode(req.params.media);
    var requestSettings = {
      url: mediaUrl,
      method: "GET",
      encoding: null,
    };

    request(requestSettings, (error, response, body) => {
      if (error) {
        res.status(500).sendFile(__dirname + "/No-image-available.png");
      } else {
        res.set("Content-Type", "image/png");
        res.send(body);
      }
    });
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error!", code: 500 });
    console.log(error);
  }
};

app.get("/media/:media", media);

app.get("/api/profile/:username", verifyCache, profile);
app.get("/api/*", api404);
app.get("/", (req, res) => {
  res.json({
    alive: true,
    version: package.version,
  });
});

app.listen(port, () => console.log(`app listening on port ${port}!`));
