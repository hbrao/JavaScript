'use strict';
 
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const request = require('request');
 
request.debug = true;
const PORT = 9999;
 
const corsOptions = {
    credentials: true,
    exposedHeaders: ['location'],
    origin: (origin, callback) => {
        callback(null, true);
    },
};
 
function constructHeaders(req) {
    // user-agent header required for some external rest services.
    const headers = {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML,like Gecko) Chrome/67.0.3396.87 Safari/537.36',
    };

    const passThroughHeaders = ['content-type', 'authorization', 'accept', 'user-agent', 'preference'];
    
    const reqHeaders = req.headers;
    // passing only these headers in request. If want to add more then add those in the passThroughHeaders array
    passThroughHeaders.forEach((header) => {
        if (reqHeaders[header]) {
            headers[header] = reqHeaders[header];
        }
    });

    return headers;
}
 
function computeURL(req) {

    const path = req.protocol + '://' + req.get('host') + req.originalUrl; 

    let url;
    const proxiedUrl = req.get('proxiedUrl');
    if ( (proxiedUrl) ) {
        url = `${proxiedUrl}${path}`;
    } else {
        let targetURIIndex = path.indexOf('/http/');
        if (targetURIIndex < 0) {
            targetURIIndex = path.indexOf('/https/');
        }
    
        url = path.substr(targetURIIndex + 1);
        const authorityIndex = url.indexOf('/');
        url = `${url.substring(0, authorityIndex)}:/${url.substring(authorityIndex)}`;
    }

    return url;
}
 
const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb',extended: true }));
app.use(bodyParser.json());
 
app.get('*', (req, res) => {
    const url = computeURL(req);
    
    //console.log(`PROXY GET: ${url}`);
    
    // for some reason, 'request' gets a '502' calling a nodeJS 'express' app, so use 'http'
    if (url.indexOf('localhost') > 0 && url.indexOf('http:') === 0) {
            http.get(url, (resp) => {
                let data = '';
            
                // add chunk...
                resp.on('data', (chunk) => {
                    data += chunk;
                });
            
                // send the whole thing
                resp.on('end', () => {
                    res.status(200).json(JSON.parse(data));
                });
            }).on('error', (err) => {
                res.status(500).send(err.message);
            });

            return;
    }
    
    const requ = {
        url, 
        json: true, 
        headers: constructHeaders(req), 
        qs: req.query 
    };

    request(requ, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                res.status(response.statusCode)/*.set(response.headers)*/.json(body);
            } else if (response) {
                res.status(response.statusCode).send('error');
            } else {
                res.status(500).send(error);
            }
    });
});
 
app.patch('*', (req, res) => {
    const url = computeURL(req);
    const body = req.body;
    
    // console.log(`PROXY PATCH: ${url}`);
    
    request({ url, method: 'PATCH', json: true, headers: constructHeaders(req), body }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                res.status(response.statusCode).json(body);
            } else if (response) {
                res.status(response.statusCode).send(body);
            } else {
                res.status(500).send(error);
            }
    });
});
 
app.post('*', (req, res) => {
    const url = computeURL(req);
    
    //console.log(`PROXY POST: ${url}`);

    const params = {
        url,
        method: 'POST',
        json: true,
        headers: constructHeaders(req),
    };
    
    params.body = req.body;
    
    request(params, (error, response, reqBody) => {
        if (!error && response.statusCode === 200) {
            res.status(response.statusCode).json(reqBody);
        } else if (response) {
            res.status(response.statusCode).send(reqBody);
        } else {
            res.status(500).set(response.headers).send(error);
        }
    });
});
 
app.put('*', (req, res) => {
    const url = computeURL(req);
    
    // console.log(`PROXY PUT: ${url}`);

    const params = {
        url,
        method: 'PUT',
        json: true,
        headers: constructHeaders(req),
    };
    
    params.body = req.body;
    
    request(params, (error, response, reqBody) => {
        if (!error && response.statusCode === 200) {
        res.status(response.statusCode).json(reqBody);
        } else if (response) {
        res.status(response.statusCode).send(reqBody);
        } else {
        res.status(500).send(error);
        }
    });
});
 
app.delete('*', (req, res) => {
    const url = computeURL(req);
    const body = req.body;
    
    // console.log(`PROXY DELETE: ${url}`);
    
    request({ url, method: 'DELETE', json: true, headers: constructHeaders(req), body }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            res.status(response.statusCode).json(body);
        } else if (response) {
            res.status(response.statusCode).send(body);
        } else {
            res.status(500).send(error);
        }
    });
});
 
app.listen(PORT, () => {
    console.log('STARTED proxy server', PORT);
});