const express = require('express');
const morgan = require('morgan');
const mongoose = require("mongoose");

const blogRoutes = require('./routes/blogRoutes');

//express app
const app = express();

//register view engine
app.set('view engine', 'ejs');

//middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// connect to MongoDB and only start the server after a successful connection
const dbURI = 'mongodb+srv://mahim:<password-here>@cluster0.biibrlz.mongodb.net/node-tuts?appName=Cluster0';

mongoose.connect(dbURI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
    })
    .catch((err) => {
        console.error('❌ Failed to connect to MongoDB. The server will not start.');
        console.error('Connection error:', err && err.message ? err.message : err);
        console.error('Please check the connection string (MONGODB_URI) and your network/Atlas IP whitelist.');
        // Exit with non-zero so process managers / nodemon indicate failure
        process.exit(1);
    });

// routes (after middleware so body is parsed for POST requests)
app.get('/', (req, res) => {
    res.redirect('/blogs');
});

app.use('/blogs', blogRoutes);

// 404 handler (must be last)
app.use((req, res) => {
    res.status(404).render('404', {title: '404'});
});