const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(5000, function () {
    console.log("Listening here");
})

// mlab save a new user
app.post('/newUser', function (req, res) {
    console.log(req.body.userData);
    const userDetails = req.body.userData;
    newUser(userDetails, (data) => {
        res.send(data);
    })
})

function newUser(userDetails, callback) {
    const url = 'https://api.mlab.com/api/1/databases/tripo/collections/users?apiKey=n4-BYGvNjWwu5oSsLuEWMx9NO19MvmZJ';
    axios.post(url, userDetails
    ).then((res) => {
        //console.log(res.data);
        return callback(res.data);
    }).catch((error) => {
        console.log(error);
    });
}

// mlab get user trips
app.get('/userTrips', function (req, res) {
    console.log(req.query.userId);
    const userId = req.body.userId;
    userTrips(userId, (data) => {
        res.send(data);
    })
})

function userTrips(userId, callback) {
    const url = 'https://api.mlab.com/api/1/databases/tripo/collections/users?apiKey=n4-BYGvNjWwu5oSsLuEWMx9NO19MvmZJ&q={"userId":' + userId + '}';
    axios.get(url
    ).then((res) => {
        //console.log(res.data);
        return callback(res.data);
    }).catch((error) => {
        console.log(error);
    });
}

// mlab save a new trip
app.post('/newTrip', function (req, res) {
    //console.log(req.body.data);
    const tripDetails = req.body.data;
    saveNewTrip(tripDetails, (data) => {
        res.send(data);
    })
})

function saveNewTrip(tripDetails, callback) {
    const url = 'https://api.mlab.com/api/1/databases/tripo/collections/trips?apiKey=n4-BYGvNjWwu5oSsLuEWMx9NO19MvmZJ';
    axios.post(url, tripDetails
    ).then((res) => {
        //console.log(res.data);
        return callback(res.data);
    }).catch((error) => {
        console.log(error);
    });
}

// mlab fetch trip
app.get('/trip', function (req, res) {
    console.log(req.query.tripId);
    const tripId = req.query.tripId;
    trip(tripId, (data) => {
        res.send(data);
    })
})

function trip(tripId, callback) {
    const url = 'https://api.mlab.com/api/1/databases/tripo/collections/trips?apiKey=n4-BYGvNjWwu5oSsLuEWMx9NO19MvmZJ&q={"tripId":' + tripId + '}';
    axios.get(url
    ).then((res) => {
        //console.log(res.data);
        return callback(res.data);
    }).catch((error) => {
        console.log(error);
    });
}

// mlab save trip options
app.post('/tripOptions', function (req, res) {
    console.log(req.body.options);
    console.log(req.body.tripId);
    const tripId = req.body.tripId;
    const options = req.body.options;
    tripOptionsSave(tripId, options, (data) => {
        res.send(data);
    })
})

function tripOptionsSave(tripId, options, callback) {
    const url = 'https://api.mlab.com/api/1/databases/tripo/collections/trips/' + tripId + '?apiKey=n4-BYGvNjWwu5oSsLuEWMx9NO19MvmZJ';
    axios.put(url, { "$set": { "options": options } }
    ).then((res) => {
        //console.log(res.data);
        return callback(res.data);
    }).catch((error) => {
        console.log(error);
    });
}

// mlab finalize trip options
app.post('/tripFinal', function (req, res) {
    console.log(req.body.options);
    console.log(req.body.tripId);
    const tripId = req.body.tripId;
    const options = req.body.options;
    tripFinal(tripId, options, (data) => {
        res.send(data);
    })
})

function tripFinal(tripId, options, callback) {
    const url = 'https://api.mlab.com/api/1/databases/tripo/collections/trips/' + tripId + '?apiKey=n4-BYGvNjWwu5oSsLuEWMx9NO19MvmZJ';
    axios.put(url, { "$set": { "finalTrip": options } }
    ).then((res) => {
        //console.log(res.data);
        return callback(res.data);
    }).catch((error) => {
        console.log(error);
    });
}

// google places
app.get('/places', function (req, res) {
    console.log(req.query.dest);
    const dest = req.query.dest.split(', ').join('+');
    console.log(dest);
    places(dest, (data) => {
        res.send(data);
    })
})

function places(dest, callback) {
    const url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' + dest + '+tourist+attractions&language=en&key=AIzaSyDiFYXE3HoT8ux5MqVFaeYLDLQcZvhAqqs';
    axios.get(url,
        {}).then((res) => {
            //console.log(res.data);
            return callback(res.data);
        }).catch((error) => {
            console.log(error);
        });
}

// google place suggestions
app.get('/placeSuggestions', function (req, res) {
    console.log(req.query.dest);
    const dest = req.query.dest;
    console.log(dest);
    placeSuggestions(dest, (data) => {
        res.send(data);
    })
})

function placeSuggestions(dest, callback) {
    const url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + dest + '&types=geocode&key=AIzaSyDiFYXE3HoT8ux5MqVFaeYLDLQcZvhAqqs';
    axios.get(url,
        {}).then((res) => {
            const pr = res.data.predictions;
            const des = pr.map((e) => e.description);
            return callback(des);
        }).catch((error) => {
            console.log(error);
        });
}


// airbnb listings
app.get('/listings', function (req, res) {
    console.log(req.query.dest);
    const dest = req.query.dest;
    console.log(dest);
    getL(dest)
        .then((data) => {
            console.log("res");
            res.send(data);
        })
        .catch((e) => { console.log("error"); console.log(e) })
})


var request = require('request');
function getL(place) {
    const headers = {
        'cache-control': 'no-cache',
        'user-agent': 'Airbnb/17.50 iPad/11.2.1 Type/Tablet',
        'content-type': 'application/json',
        'accept': 'application/json',
        'accept-language': 'en-us',
        'x-airbnb-api-key': '915pw2pnf4h1aiguhph5gc5b2',
        'x-airbnb-locale': 'en',
        'x-airbnb-currency': 'USD',
    }

    var options = {
        method: 'GET',
        url: 'https://api.airbnb.com/v2/search_results/',
        headers: headers,
        qs: {
            '_limit': 10,
            '_offset': 0,
            'locale': 'en-US',
            'location': place,
        }
    };
    return new Promise(function (resolve, reject) {
        request(options, function (error, res) {
            if (error) {
                reject(error);
            } else {
                const x = JSON.parse(res.body);
                resolve(x);
            }
        });
    });
}


function airbnbPlaces(location, callback) {
    const headers = {
        'cache-control': 'no-cache',
        'user-agent': 'Airbnb/17.50 iPad/11.2.1 Type/Tablet',
        'content-type': 'application/json',
        'accept': 'application/json',
        'accept-language': 'en-us',
        'x-airbnb-api-key': '915pw2pnf4h1aiguhph5gc5b2',
        'x-airbnb-locale': 'en',
        'x-airbnb-currency': 'USD',
    };
    const options = {
        method: 'GET',
        url: 'https://api.airbnb.com/v2/search_results/',
        headers: headers,
        qs: {
            '_limit': 10,
            '_offset': 0,
            'locale': 'en-US',
            'location': 'Corvallis, Oregon',
        }
    };

    axios(options).then((res) => {
        console.log(res);
        return callback(res.data);

    }).catch((error) => {
        console.log(error);
    });
}
