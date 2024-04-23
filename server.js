// Required imports
const express = require('express');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const passport = require('./passport');
const User = require('./user');
const bcrypt = require('bcrypt');
const handlebars = require('handlebars');

// App initialization
const app = express();
const PORT = process.env.PORT || 3000;
const dbName = 'animoLabsDB';
const uri = 'mongodb://localhost:27017/animoLabsDB';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(flash());

const sessionStore = MongoStore.create({
  mongoUrl: uri,
  dbName: dbName,
  ttl: 14 * 24 * 60 * 60, 
  autoRemove: 'native' 
});

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, 
    secure: false, 
    httpOnly: true, 
  }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/loggedin.js', express.static(path.join(__dirname, 'loggedin.js')));
app.use('/bookingslt.js', express.static(path.join(__dirname, 'bookingslt.js')));
app.use('/loggedout.js', express.static(path.join(__dirname, 'loggedout.js')));
app.use('/filter.js', express.static(path.join(__dirname, 'filter.js')));
app.use('/editprofile.js', express.static(path.join(__dirname, 'editprofile.js')));
app.use('/labtech.js', express.static(path.join(__dirname, 'labtech.js')));
app.use('/search.js', express.static(path.join(__dirname, 'search.js')));
app.use('/bookings.js', express.static(path.join(__dirname, 'bookings.js')));
app.use('/views', express.static(path.join(__dirname, 'views')));

app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: false }));
app.set('view engine', '.hbs');


mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    startServer();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

  function validateName(name) {
    const regex = /^[a-zA-Z\s]*$/; 
    return regex.test(name);
  }

function startServer() {
 //////////////////////////////////

 handlebars.registerHelper('isEqual', function(value1, value2, options) {
  return value1 === value2;
});

handlebars.registerHelper('addHalfHour', function(timeSlot) {
  // Assuming timeSlot is in HH:mm format
  const [hours, minutes] = timeSlot.split(':').map(Number);
  let newHours = hours;
  let newMinutes = minutes + 30;

  if (newMinutes >= 60) {
      newMinutes -= 60;
      newHours += 1;
  }

  // Ensure leading zeros if necessary
  const formattedHours = String(newHours).padStart(2, '0');
  const formattedMinutes = String(newMinutes).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}`;
});

// Define routes
app.get('/api/users', (req, res) => {
  // Handle GET request for fetching user data
});

app.get('/api/laboratory', (req, res) => {
  // Handle GET request for fetching laboratory data
});



  app.get('/api/bookings', async (req, res) => {
    try {
      const db = client.db(dbName);
      const collection = db.collection('bookings');
      const bookings = await collection.find({}).toArray();
      res.json(bookings);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

 app.post('/api/bookings', async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection('bookings');
    const newBooking = req.body; // Assuming the request body contains the new booking data
    await collection.insertOne(newBooking);
    res.json({ message: 'Booking inserted successfully' }); // Send a success message
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



  /////////////////////////////////

  app.get('/', (req, res) => {
    res.render('index'); // Assuming your Handlebars file is named index.hbs
  });


  app.get('/index', (req, res) => {
    res.render('index'); // Assuming your Handlebars file is named index.hbs
  });
  /////////////////////////////////

  app.get('/about_loggedout', (req, res) => {
    res.render('about_loggedout');
  });

  app.get('/about', (req, res) => {
    try {
      const user = req.user.toObject();
      res.render('about', { user }); 
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  app.get('/bookings', async (req, res) => {
    try {
      const user = req.user.toObject();
      const lab = req.query.labNum;
      const db = client.db(dbName);
      const collection = db.collection('bookings'); // Assuming your collection name is 'laboratory'
      const bookings = await collection.find({selectedLab: lab}).toArray(); // Fetch all labs from the database
      res.render('bookings', { bookings, user }); // Pass the fetched labs data to the 'lab.hbs' template
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  app.get('/bookingslabtech', async (req, res) => {
    try {
      const user = req.user.toObject(); //bookingid
      const db = client.db(dbName);
      const collection = db.collection('laboratory');
      const labs = await collection.distinct("labName"); 
      res.render('bookingslabtech', { labs, user }); 
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  /////////////////////////////////

  app.get('/contact_loggedout', (req, res) => {
    res.render('contact_loggedout');
  });

  app.get('/contact', (req, res) => {
    try {
      const user = req.user.toObject();
      res.render('contact', { user }); // Pass the fetched labs data to the 'lab.hbs' template
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  app.get('/createreservationlabtech', (req, res) => {
    try {
      const user = req.user.toObject();
      res.render('createreservationlabtech', { user }); // Pass the fetched labs data to the 'lab.hbs' template
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  app.get('/deletelabtech', async (req, res) => {
    try {
        const user = req.user.toObject();

        const db = client.db(dbName);
        const reservations = await db.collection('bookings').find({
            status: "Ongoing"
        }).toArray();

        res.render('deletelabtech', { user, reservations }); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
  }); 

  /////////////////////////////////

  app.get('/editprofile', (req, res) => {
    try {
      const user = req.user.toObject();
      res.render('editprofile', { user }); // Pass the fetched labs data to the 'lab.hbs' template
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }); 

  app.get('/editprofilelabtech', (req, res) => {
    try {
      const user = req.user.toObject();
      res.render('editprofilelabtech', { user }); // Pass the fetched labs data to the 'lab.hbs' template
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  app.get('/editreservation', async (req, res) => {
    try {
      const user = req.user.toObject();

      const db = client.db(dbName);
      const reservations = await db.collection('bookings').find({
          status: "Ongoing"
      }).toArray();

      res.render('editreservation', { user, reservations }); 
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  /////////////////////////////////

  app.get('/lab_loggedout', (req, res) => {
    res.render('lab_loggedout');
  });

  app.get('/lab', async (req, res) => {
    try {
      const db = client.db(dbName);
      const collection = db.collection('laboratory'); // Assuming your collection name is 'laboratory'
      const labs = await collection.find({}).toArray(); // Fetch all labs from the database
      const user = req.user.toObject();
      res.render('lab', { labs, user }); // Pass the fetched labs data to the 'lab.hbs' template
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

app.get('/labtech', (req, res) => {
  try {
    const user = req.user.toObject();
    res.render('labtech', { user }); // Pass the fetched labs data to the 'lab.hbs' template
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
  ////////////////////////////////


app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', [
  // Validate email and password
  body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.render('login', { errorMessage: errors.array()[0].msg });
  }

  const { email, password, remember } = req.body; 
  const rememberToken = remember === 'on';

  console.log('Email:', email);
  console.log('Password:', password);
  try {
      const user = await User.findOne({ email });

      console.log('Found email:', await User.findOne({ email }));
      console.log('Password comparison result:', await bcrypt.compare(password, user.password));

      if (!user || !(await bcrypt.compare(password, user.password))) {
          console.log('Invalid email or password');
          req.flash('error', 'Invalid email or password');
          return res.render('login', { errorMessage: 'Invalid email or password' });
      }
      req.session.userId = user._id;

      let rememberDb = user.rememberMe;

      if (rememberToken !== rememberDb) {
          await User.updateOne(
              { _id: user._id },
              { $set: { rememberMe: rememberToken } }
          );
      }

      if (rememberToken) {
          req.session.cookie.maxAge = 3 * 7 * 24 * 60 * 60 * 1000; // Extend session to 3 weeks
      }

      console.log('Remember me token', rememberToken);
      console.log('Remember me db', rememberDb);
      console.log('Session after logging in:', req.session);

      req.logIn(user, (err) => {
          if (err) {
              console.error('Error logging in:', err);
              return next(err); 
          }
          console.log('User logged in:', user);
          return res.redirect('/loggedin');
      });
  } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).send('Internal Server Error');
  }
});



app.get('/loggedin', (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user.toObject();

    console.log("User Object:", user); 
    console.log("User First Name:", user.firstName); 
    console.log("User Last Name:", user.lastName); 

    if (user.isLabTechnician) {
      res.redirect('/labtech'); // Redirect to labtech view
    } else {
      res.render('loggedin', { user: user }); // Render loggedin view for regular users
    }
  } else {
    res.redirect('/login');
  }
});


app.get('/logout', async (req, res) => {
  console.log('Session before destroying:', req.session);
  try {
    if (req.session.userId) {
      const userId = req.session.userId;
      const user = await User.findOne({ _id: userId });
      if (user && user.rememberMe) {
        await User.updateOne({ _id: userId }, { $set: { rememberMe: false } });
      }
    }
    req.session.cookie.maxAge = 24 * 60 * 60 * 1000;

    await req.session.destroy();

    console.log('Session after destroying:', req.session);

    res.redirect('/index');
  } catch (err) {
    console.error('Error destroying session:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


  /////////////////////////////////

app.get('/profile', async (req, res) => {
  try {
      const { firstName, lastName } = req.query;

      if (firstName && lastName) {
          const db = client.db(dbName);
          const searchedUser = await db.collection('users').findOne({ firstName, lastName });

          if (!searchedUser) {
              return res.status(404).send('Searched user not found');
          }

          const ObjectId = require('mongodb').ObjectId;

          const currentUserId = req.session.passport.user;
          const currentUser = await db.collection('users').findOne({ _id: new ObjectId(currentUserId) });

          if (!currentUser) {
              return res.status(404).send('Current user not found');
          }
          console.log(searchedUser, currentUser)

          const reservations = await db.collection('bookings').find({
            reservedUser: searchedUser.firstName + ' ' + searchedUser.lastName
          }).toArray();

          return res.render('profile', { searchedUser, currentUser, reservations, isSearchedUser: true });
      } else {
          const currentUserId = req.session.passport.user;
          const db = client.db(dbName);
          const ObjectId = require('mongodb').ObjectId;
          const currentUser = await db.collection('users').findOne({ _id: new ObjectId(currentUserId) });

          if (!currentUser) {
              return res.status(404).send('Current user not found');
          }

          const reservations = await db.collection('bookings').find({
            reservedUser: currentUser.firstName + ' ' + currentUser.lastName
          }).toArray();

          console.log(reservations);

          return res.render('profile', { currentUser, reservations});
      }
  } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).send('Error fetching user data');
  }
});

app.post('/editprofile', async (req, res) => {
  try {
      const userId = req.session.passport.user;
      const { firstName, lastName, description } = req.body;
      const user = req.user.toObject();

      if (!validateName(firstName)) {
        return res.render('editprofile', { user, errorMessage: 'Please enter a valid first name without special characters or numbers.' });
      } 
      
      if (!validateName(lastName)) {
        return res.render('editprofile', { user, errorMessage: 'Please enter a valid last name without special characters or numbers.' });
      } 

      const ObjectId = require('mongodb').ObjectId;
      const userIdObj = new ObjectId(userId);

      const db = client.db(dbName);
      const updateQuery = {};
      if (firstName && validateName(firstName)) {
          updateQuery.firstName = firstName;
      }
      if (lastName && validateName(lastName)) {
          updateQuery.lastName = lastName;
      }
      if (description) {
          updateQuery.description = description;
      }

      await db.collection('users').updateOne(
          { _id: userIdObj },
          { $set: updateQuery }
      );

      res.redirect('/profile'); 
  } catch (error) {
      console.error('Error updating user data:', error);
      res.status(500).send('Error updating user data');
  }
});



app.post('/editprofilelabtech', async (req, res) => {
  try {
      const userId = req.session.passport.user;
      const { firstName, lastName, description } = req.body;
      const user = req.user.toObject();

      if (!validateName(firstName)) {
        return res.render('editprofilelabtech', { user, errorMessage: 'Please enter a valid first name without special characters or numbers.' });
      } 
      
      if (!validateName(lastName)) {
        return res.render('editprofilelabtech', { user, errorMessage: 'Please enter a valid last name without special characters or numbers.' });
      } 

      const ObjectId = require('mongodb').ObjectId;
      const userIdObj = new ObjectId(userId);

      const db = client.db(dbName);
      const updateQuery = {};
      if (firstName && validateName(firstName)) {
          updateQuery.firstName = firstName;
      }
      if (lastName && validateName(lastName)) {
          updateQuery.lastName = lastName;
      }
      if (description) {
          updateQuery.description = description;
      }

      await db.collection('users').updateOne(
          { _id: userIdObj },
          { $set: updateQuery }
      );

      res.redirect('/profilelabtech'); 
  } catch (error) {
      console.error('Error updating user data:', error);
      res.status(500).send('Error updating user data');
  }
});


  app.get('/profilelabtech', (req, res) => {
    try {
      const user = req.user.toObject();
      res.render('profilelabtech', { user }); // Pass the fetched labs data to the 'lab.hbs' template
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  app.get('/profilelabtechlist', async (req, res) => {
    try {
      const technicians = await User.find({ isLabTechnician: true }).exec();
      const user = req.user.toObject();
      res.render('profilelabtechlist', { technicians, user });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  app.get('/register', (req, res) => {
    res.render('register'); 
});

app.post('/register', [
  // Validate first name, last name, email, and password
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  })
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If there are validation errors, render the registration page with error messages
    return res.render('register', { errorMessage: errors.array()[0].msg }); // Render the first error message
  }

  // Determine if the user is a lab technician based on email
  const { firstName, lastName, email, password } = req.body;
  const isLabTechnician = email.toLowerCase().startsWith('lt_');

  try {
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds set to 10

    // Set default values for additional fields
    const rememberMe = false;
    const description = '';
    let imagePath = 'default.jpg';
    if (isLabTechnician) {
      imagePath = '../public/images/labtech-profile.jpg';
    } else {
      imagePath = '../public/images/student-profile.jpg';
    }

    // Create a new user with the hashed password and additional fields
    const newUser = new User({ 
      firstName, 
      lastName, 
      email, 
      password: hashedPassword, 
      isLabTechnician,
      rememberMe,
      description,
      imagePath
    });
    
    // Save the new user to the database
    await newUser.save();

    console.log('User registered successfully');

    // Log in the new user after registration
    req.login(newUser, err => {
      if (err) {
        console.error('Error logging in after registration:', err);
        req.flash('error', 'Registration successful, but login failed. Please try logging in.');
        res.redirect('/login');
      } else {
        // Redirect to appropriate view based on user type
        if (isLabTechnician) {
          res.redirect('/labtech'); // Redirect to labtech view
        } else {
          res.redirect('/loggedin'); // Redirect to loggedin view
        }
      }
    });
  } catch (err) {
    console.error('Error registering user:', err);

    // Handle registration errors
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      // Duplicate key error, email already exists
      req.flash('error', 'Email address is already registered.');
    } else {
      // Other errors
      req.flash('error', 'Registration failed, please check your password and try again.');
    }
    res.render('register', { errorMessage: req.flash('error') });
  }
});


  /////////////////////////////////

  app.get('/users', async (req, res) => {
    try {
      const db = client.db(dbName);
      const collection = db.collection('student'); // Assuming your collection name is 'laboratory'
      const students = await collection.find({}).toArray(); // Fetch all labs from the database
      const user = req.user.toObject();
      res.render('users', { students, user }); // Pass the fetched labs data to the 'lab.hbs' template
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  app.get('/userreservations', async (req, res) => {
    try {
      const user = req.user.toObject();
  
      const db = client.db(dbName);
      const reservations = await db.collection('bookings').find({
        reservedUser: user.firstName + ' ' + user.lastName
      }).toArray();
      console.log('Reservations:', reservations);
  
      res.render('userreservations', { user, reservations });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

  app.get('/viewreservationlabtech', async (req, res) => {
    try {
        const user = req.user.toObject();
        const db = client.db(dbName);
        const collection = db.collection('laboratory');
        const labs = await collection.distinct("labName");
        const bookingsCursor = db.collection('bookings').find({});
        const bookings = await bookingsCursor.toArray();
        console.log(bookings);
        res.render('viewreservationlabtech', { user, labs, bookings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  /////////////////////////////////////////////////////
  app.post('/deleteaccount', async (req, res) => {
    try {
        const userId = req.session.passport.user;
        const { confirmPassword } = req.body;

        const ObjectId = require('mongodb').ObjectId;
        const userIdObj = new ObjectId(userId); 

        const db = client.db(dbName);
        const user = await db.collection('users').findOne({ _id: userIdObj });

        if (!user) {
            return res.status(404).send('User not found');
        }
        const passwordMatch = await bcrypt.compare(confirmPassword, user.password);
        if (!passwordMatch) {
            return res.status(400).send('Incorrect password');
        }

        await db.collection('users').deleteOne({ _id: userIdObj }); 

        req.logout(() => {
          req.session.destroy(err => {
              if (err) {
                  console.error('Error destroying session:', err);
                  res.status(500).json({ message: 'Internal Server Error' });
              } else {
                  console.log('Session after destroying:', req.session);
                  res.redirect('/index');
              }
          });
      });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).send('Error deleting account');
    }
});


app.post('/cancelBooking', async (req, res) => {
  try {
      // Extract reservation IDs from the request body
      const { reservationIds } = req.body;
      const ObjectId = require('mongodb').ObjectId;

      const reservationObjectIds = reservationIds.map(id => new ObjectId(id));
      const db = client.db(dbName);

      const result = await db.collection('bookings').updateMany(
          { _id: { $in: reservationObjectIds } },
          { $set: { status: 'Cancelled' } }
      );

      if (result.modifiedCount === 0) {
          return res.status(404).send('No bookings found for cancellation');
      } else {
        return res.redirect('/deletelabtech');
      }
  } catch (error) {
      console.error('Error cancelling bookings:', error);
      res.status(500).send('Error cancelling bookings');
  }
});


/////////////////////////////////////////

app.post('/search', async (req, res) => {
  try {
      const searchQuery = req.body.searchInput.toLowerCase().trim(); 
      
      let results = await User.find({
          $or: [
              { firstName: { $regex: searchQuery, $options: 'i' } },
              { lastName: { $regex: searchQuery, $options: 'i' } }
          ]
      });

      results = results.map(result => result.toObject());
      
      res.json(results); 
  } catch (error) {
      console.error('Error searching users:', error);
      res.status(500).json({ error: 'Error searching users' });
  }
});

app.post('/filter', async (req, res) => {
  try {
      // Extract filter criteria from the request body
      const { searchQuery, labValue, dateValue, timeSlotValue, statusValue } = req.body;

      // Construct the filter query based on the received criteria
      let filterQuery = {};

      // Add searchQuery filter
      if (searchQuery) {
          filterQuery.$or = [
              { reservedUser: { $regex: searchQuery, $options: 'i' } }
          ];
      }

      // Add labValue filter
      if (labValue) {
          filterQuery.selectedLab = labValue;
      }

      // Add dateValue filter
      if (dateValue) {
          filterQuery.selectedDate = dateValue;
      }

      // Add timeSlotValue filter
      if (timeSlotValue) {
          filterQuery.selectedTimeSlot = timeSlotValue;
      }

      // Add statusValue filter
      if (statusValue) {
          filterQuery.status = statusValue;
      }
      const db = client.db(dbName);
      // Fetch filtered results from the database
      const filteredBookings = await db.collection('bookings').find(filterQuery).toArray();

      // Return the filtered results as JSON response
      res.json(filteredBookings);
  } catch (error) {
      console.error('Error filtering bookings:', error);
      res.status(500).json({ error: 'Error filtering bookings' });
  }
});


app.post('/seatStatus', async (req, res) => {
  try {
      const { labName, dateInput, timeInput } = req.body;
      console.log('labName:', labName);
      console.log('dateInput:', dateInput);
      console.log('timeInput:', timeInput);

      const db = client.db(dbName);

      let reservations = await db.collection('bookings').find({
          
          selectedLab: labName,
          selectedDate: dateInput,
          selectedTimeSlot: timeInput
      }).toArray();
      console.log('Reservations:', reservations);
      res.json(reservations);
  } catch (error) {
      console.error('Error fetching reservations:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


  
}