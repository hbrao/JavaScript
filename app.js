//Loads the express module
const express = require('express');
const path = require('path')

//Creates our express server
const app = express();
const port = 3000;

//Serves static files 
app.use(express.static('.'))

//Sets a basic route
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './index.html')));

//Makes the app listen to port 3000
app.listen(port, () => console.log(`App listening to port ${port}`));