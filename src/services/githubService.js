const axios = require("axios");
const qs = require("querystring");

async function getAccessToken(code) {
  const response = await axios.post(
    "https://github.com/login/oauth/access_token",
    qs.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: code,
    }),
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