const path = require('path'); // for file paths 
const express = require('express'); // for server 
const session = require('express-session'); // for sessions 
const exphbs = require('express-handlebars'); // for handlebars 
const methodOverride = require('method-override'); // for handling PUT requests "method-override"
// Initializes Sequelize with session store 
const SequelizeStore = require('connect-session-sequelize')(session.Store); // for storing sessions in db store "sequelize" instead of memory store (cookies) 

const app = express(); // initializes express 
const PORT = process.env.PORT || 3001; // sets port to 3001 

const routes = require('./controllers'); // routes for server and client side files 
const sequelize = require('./config/connection');  // for connecting to db with sequelize 

app.use(methodOverride('_method')); // for handling PUT requests 

// Sets up session and connect to our Sequelize db store "sequelize"
const sess = { // session settings for server and client side files 
  secret: 'Super secret secret', // secret key for session cookie 
  cookie: { // session cookie settings for server and client side files 
    maxAge: 30 * 60 * 1000, // 30 minutes (default is 10 minutes)
    httpOnly: true, // default is true 
    secure: false, // default is true 
    sameSite: 'strict', 
  }, // session cookie settings for server and client side files (default is ./controllers/index.js)
  resave: false, // session cookie settings for server and client side files (default is ./controllers/index.js)
  saveUninitialized: true, // session cookie settings for server and client side files (default is ./controllers/index.js)
  expires: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes (30 * 60 * 1000) = 30 minutes (default is 10 minutes)
  // Sets up session store for server and client side files (default is ./controllers/index.js)
  store: new SequelizeStore({ // session store settings for server and client side files (default is ./controllers/index.js)
    db: sequelize, // for connecting to db with sequelize (default is ./config/connection.js)
  }),
};

app.use(session(sess)); // session settings for server and client side files 

const hbs = exphbs.create(); // initializes handlebars to handlebars 

app.engine('handlebars', hbs.engine); // engine for handlebars (default is ./controllers/index.js)
app.set('view engine', 'handlebars'); // view engine for handlebars (default is ./controllers/index.js)

app.use(express.json()); // for parsing json data 
app.use(express.urlencoded({ extended: false })); // for parsing url encoded data 
app.use(express.static(path.join(__dirname, 'public'))); // for serving static files 

app.use(routes); // routes for server and client side files (default is ./controllers/index.js) 

app.use((req, res, next) => { // middleware for checking if user is logged in or authenticated via session store
  // List of paths that do not require authentication
  const authFreePaths = ['/login', '/signup', '/logout', '/css/', '/js/', /img/, /public/]; // paths that do not require authentication 
  if (!req.session.userId && !authFreePaths.some(path => req.path.startsWith(path))) { // if user is not logged in and path is not in authFreePaths list then redirect to login
    return res.redirect('/login'); // redirect to login page 
  }
  next(); // next middleware 
});


// middleware for checking if session has expired and if so then destroy session and redirect to login page 
app.use((req, res, next) => { // middleware for checking if session has expired 
  if (req.session.expires && Date.now() > req.session.expires) { // if session has expired then destroy session and redirect to login page 
    req.session.destroy(() => { // destroy session and redirect to login page 
      res.redirect('/login'); // redirect to login page 
    });
  } else { // if session has not expired then next middleware 
    next();
  }
});

// refreshes expiration time so site doesn't log out active users 
app.use((req, res, next) => { // middleware for checking if session has expired 
  if (req.session.expires) {
    const extendedExpirationTime = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes (30 * 60 * 1000) = 30 minutes (default is 10 minutes)
    req.session.expires = extendedExpirationTime; // refreshes expiration time so site doesn't log out active users 
  }
  next(); // next middleware 
});

// middleware for checking if user is logged in or authenticated via session store 
sequelize.sync({ force: false }).then(() => {   // syncs sequelize with db 
  app.listen(PORT, () =>    // listens on port 3001 (default is 3001) 
    console.log(
      `\nServer running on port ${PORT}. Visit http://localhost:${PORT} and create an account!` // logs server running on port 3001 (default is 3001) 
    )
  );
});