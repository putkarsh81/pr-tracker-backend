const { encrypt } = require("../services/encryptionService");
const { generateToken } = require("../services/tokenService");
const { getAccessToken, getGithubUser } = require("../services/githubService");
const axios = require("axios");

// All calls go through the service-router gateway
const PROXY = process.env.PROXY_URL || "http://localhost:5003";

const dbClient = axios.create({
  baseURL: PROXY,
  headers: { "Content-Type": "application/json" },
});

// redirect to github
exports.githubLogin = (req, res) => {
  const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user repo`;
  res.redirect(url);
};

// callback
exports.githubCallback = async (req, res) => {
  try {
    const code = req.query.code;

    // get token from github
    const accessToken = await getAccessToken(code);

    // get user info
    const githubUser = await getGithubUser(accessToken);

    const encryptedToken = encrypt(accessToken);

    // check if user exists via gateway → mongodb service
    let user = null;
    try {
      const { data } = await dbClient.get(`/api/db/users/github/${githubUser.id}`);
      user = data.data;
    } catch (e) {
      if (e.response?.status !== 404) throw e;
    }

    if (!user) {
      const { data } = await dbClient.post("/api/db/users", {
        githubId: githubUser.id,
        username: githubUser.login,
        email: githubUser.email,
        avatarUrl: githubUser.avatar_url,
        accessTokenEncrypted: encryptedToken,
      });
      user = data.data;
    } else {
      const { data } = await dbClient.put(`/api/db/users/github/${githubUser.id}`, {
        accessTokenEncrypted: encryptedToken,
      });
      user = data.data;
    }

    // create jwt
    const jwtToken = generateToken(user);

    // set httpOnly cookie
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

// redirect frontend (NO token in URL)
  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
    
      res.redirect(`${clientUrl}/dashboard`);
  } catch (error) {
    console.log(error?.response?.data || error);
    res.send("Login failed");
  }
};