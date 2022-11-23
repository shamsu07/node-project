//importing files
const routes = require("./routes/routes");

//importing the dependecies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { expressjwt: expjwt } = require("express-jwt");
const jwks = require("jwks-rsa");
const session = require("express-session");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

// configure reading from .env
require("dotenv/config");

// var webAuth = new auth0.WebAuth({
//   domain: "shamsu07.us.auth0.com",
//   clientID: "7cWs60QTUMzUUPxpn78tvvT1EGHa0PlZ",
// });

const { startDatabase } = require("./database/mongo");

// defining the Express app
const app = express();
app.set("view engine", "ejs");

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);

//defining an array to work as database
const ads = [{ title: "Hello World" }];
let DB = [];

//adding Helmet to enhance API security
app.use(helmet());

//using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());
bodyParser.json();

//enabling CORS for all requests
app.use(cors());

//adding morgan to log HTTP requests
app.use(morgan("combined"));

//starting the server
const port = process.env.PORT || 8080;
app.listen(3001, () => {
  console.log(`server started at ${3001}`);
});

app.get("/", (req, res) => {
  res.send("Hello world");
});

const jwtCheck = expjwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://shamsu07.us.auth0.com/.well-known/jwks.json",
  }),
  audience: "https://autocode-api",
  issuer: "https://shamsu07.us.auth0.com/",
  algorithms: ["RS256"],
});

app.use(jwtCheck);

//defining an endpoint to return all data
app.get("/get-code", (req, res) => {
  res.send(ads);
});

/* GOOGLE AUTH */

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    return { payload: ticket.getPayload() };
  } catch (error) {
    return { error: "Invalid user detected. Please try again" };
  }
}

app.post("/signup", async (req, res) => {
  try {
    console.log({ verified: verifyGoogleToken(req.body.credential) });
    if (req.body.credential) {
      const verificationResponse = await verifyGoogleToken(req.body.credential);

      if (verificationResponse.error) {
        return res.status(400).json({
          message: verificationResponse.error,
        });
      }

      const profile = verificationResponse?.payload;

      DB.push(profile);

      res.status(201).json({
        message: "signup was successful",
        user: {
          firstName: profile?.given_name,
          lastName: profile?.family_name,
          picture: profile?.picture,
          email: profile?.email,
          token: jwt.sign({ email: profile?.email }, "myScret", {
            expiresIn: "1d",
          }),
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "An error occurres. Registration failed.",
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    if (req.body.credential) {
      const verificationResponse = await verifyGoogleToken(req.body.credential);
      if (verificationResponse.error) {
        return res.status(400).json({
          message: verificationResponse.error,
        });
      }

      const profile = verificationResponse?.payload;

      const existsInDB = DB.find((person) => person?.email === profile?.email);

      if (!existsInDB) {
        return res.status(400).json({
          message: "You are not registered. Please sign up",
        });
      }

      res.status(201).json({
        message: "Login was successful",
        user: {
          firstName: profile?.given_name,
          lastName: profile?.family_name,
          picture: profile?.picture,
          email: profile?.email,
          token: jwt.sign({ email: profile?.email }, process.env.JWT_SECRET, {
            expiresIn: "1d",
          }),
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error?.message || error,
    });
  }
});
