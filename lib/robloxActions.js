const https = require('https');
const config =  require('../config/config.json');
const Roblox  = require('roblox-js');

Roblox.login(config.robloxuser, config.robloxpass)
    .then(function () {
        console.log('Logged in to roblox account')
    }).catch(function (err) {
    console.error(err.stack);
});

module.exports = {
    getRobloxIdFromDiscordID: function(discordId, callback) {
        https.get(`https://verify.eryn.io/api/user/${discordId}`, (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received.
            resp.on('end', () => {
                if ("robloxId" in JSON.parse(data)) {
                    callback(JSON.parse(data).robloxId);
                } else {
                    callback(false);
                }
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    },
    changeRank: function (robloxId, roleName) {
        Roblox.setRank({group: 3052496, target: robloxId, name: roleName});
    }
}