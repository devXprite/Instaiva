var express = require('express');
var router = express.Router();

const Instagram = require('instagram-web-api')
const FileCookieStore = require('tough-cookie-filestore2')
const NodeCache = require("node-cache");
const dotenv = require("dotenv");
const username = process.env.INSTAGRAM_USERNAME;
const password = process.env.INSTAGRAM_PASSWORD;

const cache = new NodeCache({ stdTTL: 60 * 60 * 1 });

dotenv.config()
const cookieStore = new FileCookieStore(__dirname + "/cookies.json");
const client = new Instagram({ username, password, cookieStore });

const verifyCache = (req, res, next) => {
  try {
    let username = req.params.username;

    if (cache.has(username)) {
      console.log(`[+] cache found for ${username}`);
      return res.status(200).json(cache.get(username));
    }
    return next();
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error!", code: 500 });
  }
};

/* GET Username */
router.use('/:username', verifyCache, async (req, res, next) => {
  await client.login()

  let username = req.params.username;
  if (/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/gim.test(username)) {
    try {
      const profileDataRaw = await client.getUserByUsername({
        username: username,
      });
      console.log(profileDataRaw);

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
});

module.exports = router;
