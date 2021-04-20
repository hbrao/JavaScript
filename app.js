//Loads the express module
const express = require('express')
const path = require('path')
const fetch = require('node-fetch')

//Creates our express server
const app = express();
const port = 3000;

//Serves static files 
app.use(express.static('.'))

//Sets a basic route
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './index.html')))

//Get token using client credentials. 
app.get('/v1/token/client_credentials', (req, res) => {
    var auth = Buffer.from('client_id:client_secret').toString('base64');

    fetch('https://dev-85033724.okta.com/oauth2/default/v1/token', {
        method : 'POST',
        headers: {
            'Authorization': 'Basic ' + auth,
            'Content-Type' : 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials&scope=custom_01'
    }).then( ( resp ) => {
        return resp.json()
    }).then ( (data) => {
        res.status(200).json(data)
    }).catch( (err) => {
        console.log(err)
        res.status(500).json(err)
    })
})

//Makes the app listen to port 3000
app.listen(port, () => console.log(`App listening to port ${port}`))