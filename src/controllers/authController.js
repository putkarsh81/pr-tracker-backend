const { encrypt } = require("../services/encryptionService");
const User = require("../model/user")
const { generateToken } = require("../services/tokenService");
const { getAccessToken, getGithubUser } = require("../services/githubService");

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

    // check if user exists
    let user = await User.findOne({ githubId: githubUser.id });

    if (!user) {
      user = await User.create({
        githubId: githubUser.id,
        username: githubUser.login,
        email: githubUser.email,
        avatarUrl: githubUser.avatar_url,
        accessTokenEncrypted: encryptedToken,
      });
    } else {
      user.accessTokenEncrypted = encryptedToken;
      await user.save();
    }

    // create jwt
    const jwtToken = generateToken(user);

    // redirect frontend
    res.redirect(`http://localhost:3000/dashboard?token=${jwtToken}`);
    
    
    //It is working fine so to redirect to frontend i have added that line above and if you guys want to test it without frontend you can uncomment the below code and comment the above line and then you can see the token in response and you can use that token to test the protected routes in postman by adding it in Authorization header as Bearer <token>

    
    //     res.send(`
//   <h2>✅ GitHub OAuth Login Successful</h2>
//   <p>User saved in database</p>
//   <p>JWT Token:</p>
//   <textarea rows="5" cols="80">${jwtToken}</textarea>
// `);
  } catch (error) {
    console.log(error);
    res.send("Login failed");
  }
};