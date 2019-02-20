const axios = require('axios');
const keys = require('../config/keys');
const jwt = require('jsonwebtoken');

function userSignUp(userDetails) {
    return new Promise((resolve, reject) => {

        const url = 'https://api.mlab.com/api/1/databases/tripo/collections/users?apiKey=' + keys.mlabAPIKey;
        axios.post(url, userDetails)
            .then((res) => {
                //console.log(res.data);
                if (res.data) {
                    console.log("success sign up");
                    const user = { userId: res.data.userId, userOId: res.data._id.$oid };
                    const token = jwt.sign(user, keys.jwtKey, { algorithm: 'HS256', expiresIn: 60 * 60 });
                    const userClient = { token, userId: user.userId, userName: res.data.userName };
                    resolve(userClient);
                } else {
                    reject("Invalid registration details!");
                }
            })
            .catch((err) => {
                reject("Internal error. Please try again!");
            });
    });
}

function userSignIn(userDetails) {
    return new Promise((resolve, reject) => {
        const userEmail = JSON.stringify(userDetails.userEmail);
        const url = 'https://api.mlab.com/api/1/databases/tripo/collections/users?apiKey=' + keys.mlabAPIKey + '&q={"userEmail":' + userEmail + '}';
        axios.get(url)
            .then((res) => {
                if (res.data.length) {
                    const userFullDetails = res.data[0];
                    if (userFullDetails.userPassword === userDetails.userPassword) {
                        console.log("success");
                        const user = { userId: userFullDetails.userId, userOId: userFullDetails._id.$oid };
                        const token = jwt.sign(user, keys.jwtKey, { algorithm: 'HS256', expiresIn: 60 * 60 });
                        //console.log(token);
                        const userClient = { token, userId: user.userId, userName: userFullDetails.userName };
                        resolve(userClient);
                    } else {
                        reject("Incorrect password. Please try again!");
                    };
                } else {
                    reject("Please check email and try again!");
                };
            })
            .catch((err) => {
                reject("Internal error. Please try again!");
            });
    });
}

function userDetails(userDetails) {
    return new Promise((resolve, reject) => {
        const userOId = userDetails.userOId;
        const url = 'https://api.mlab.com/api/1/databases/tripo/collections/users/' + userOId + '?apiKey=' + keys.mlabAPIKey;
        axios.get(url)
            .then((res) => {
                //console.log(res.data);
                const userFullDetails = res.data;
                if (userFullDetails.length !== 0) {
                    console.log("success user details");
                    const user = { userName: userFullDetails.userName, userEmail: userFullDetails.userEmail };
                    resolve(user);
                } else {
                    reject("Invalid User. Please try again!");
                };
            })
            .catch((err) => {
                reject("Internal error. Please try again!");
            });
    });
}

function userNewTrip(newTrip, user) {
    return new Promise((resolve, reject) => {
        const userOId = user.userOId;
        const userId = user.userId;
        const url = 'https://api.mlab.com/api/1/databases/tripo/collections/users?apiKey=' + keys.mlabAPIKey + '&q={"userId":' + userId + '}&f={"userTrips":1}';
        axios.get(url)
            .then((res) => {
                //console.log(res.data[0]);
                //console.log(newTrip);
                const userOldTrips = res.data[0].userTrips;
                const newUserTrips = [...userOldTrips, newTrip];
                const urlNew = 'https://api.mlab.com/api/1/databases/tripo/collections/users/' + userOId + '?apiKey=' + keys.mlabAPIKey;
                axios.put(urlNew, { "$set": { "userTrips": newUserTrips } })
                    .then((res) => {
                        //console.log(res.data);
                        resolve(res.data);
                    })
            })
            .catch((err) => {
                reject("Internal error. Please try again!");
            });
    });
}

function userNewResponse(newResponse, user) {
    return new Promise((resolve, reject) => {
        const userOId = user.userOId;
        const userId = user.userId;
        const url = 'https://api.mlab.com/api/1/databases/tripo/collections/users?apiKey=' + keys.mlabAPIKey + '&q={"userId":' + userId + '}&f={"userResponses":1}';
        axios.get(url)
            .then((res) => {
                //console.log(res.data);
                const userOldResponses = res.data[0].userResponses;
                console.log(userOldResponses);
                let newUserResponses = [];
                userOldResponses.forEach((o) => { if (o.tripId !== newResponse.tripId) { newUserResponses.push(o) } });
                newUserResponses.push(newResponse);
                console.log(newUserResponses);
                const urlNew = 'https://api.mlab.com/api/1/databases/tripo/collections/users/' + userOId + '?apiKey=' + keys.mlabAPIKey;
                axios.put(urlNew, { "$set": { "userResponses": newUserResponses } })
                    .then((res) => {
                        //console.log(res.data);
                        resolve(res.data);
                    })
            })
            .catch((err) => {
                reject("Internal error. Please try again!");
            });
    });
}

function userTrips(user) {
    return new Promise((resolve, reject) => {
        const userId = user.userId;
        console.log(userId);
        const url = 'https://api.mlab.com/api/1/databases/tripo/collections/users?apiKey=' + keys.mlabAPIKey + '&q={"userId":' + userId + '}&f={"userTrips":1}';
        axios.get(url)
            .then((res) => {
                //console.log(res.data[0]);
                const userTrips = res.data[0].userTrips;
                if (userTrips.length !== 0) {
                    console.log("success user trips");
                    resolve(userTrips);
                } else {
                    reject("No planned Trips Yet! Try a new one.");
                };
            })
            .catch((err) => {
                reject("Internal error. Please try again!");
            });
    });
}

function userResponses(user) {
    return new Promise((resolve, reject) => {
        const userId = user.userId;
        const url = 'https://api.mlab.com/api/1/databases/tripo/collections/users?apiKey=' + keys.mlabAPIKey + '&q={"userId":' + userId + '}&f={"userResponses":1}';
        axios.get(url)
            .then((res) => {
                //console.log(res.data[0]);
                const userResponses = res.data[0].userResponses;
                if (userResponses.length !== 0) {
                    console.log("success user responses");
                    resolve(userResponses);
                } else {
                    reject("You have no Trips to respond or check!");
                };
            })
            .catch((err) => {
                reject("Internal error. Please try again!");
            });
    });
}

module.exports = { userSignUp, userSignIn, userDetails, userNewTrip, userNewResponse, userTrips, userResponses };





/* let userSIgnUpDetails = { userId: 2345, password: 'gbhnjnjjn7', userName: 'hello', userEmail: 'cfvghb@fgh.com' };
let userSIgnInDetails = { userEmail: "cfvghb@fgh.com", password: 'gbhnjnjjn7' };
userSignUp(userSIgnUpDetails).then((e) => console.log(e));
userSignIn(userSIgnInDetails).then((e) => console.log(e));

function getJwtToken(user) {
    return new Promise((resolve, reject) => {
        jwt.sign(user, keys.jwtKey, { algorithm: 'HS256', expiresIn: 60 * 60 }, function (err, token) {
            resolve(token);
        });
    });
};

function verifyJwtToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, keys.jwtKey, { algorithm: 'HS256' }, function (err, user) {
            resolve(user);
        });
    });
}; */