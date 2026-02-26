const axios = require("axios");
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const SERVER_URL = process.env.PROXY_URL;

async function getAccessToken(code) {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code: code,
    redirect_uri: `${SERVER_URL}/api/auth/github/callback`,
  });

  const response = await axios.post(
    "https://github.com/login/oauth/access_token",
    params.toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    }
  );

  return response.data.access_token;
}

async function getGithubUser(accessToken) {
  const response = await axios.get("https://api.github.com/user", {
    headers: {
      Authorization: `token ${accessToken}`,
    },
  });

  return response.data;
}

module.exports = { getAccessToken, getGithubUser };