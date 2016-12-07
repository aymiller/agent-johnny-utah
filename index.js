/**
 * A Bot for Slack!
 */


/**
 * Define a function for initiating a conversation on installation
 * With custom integrations, we don't have a way to find out who installed us, so we can't message them :(
 */

function onInstallation(bot, installer) {
    if (installer) {
        bot.startPrivateConversation({user: installer}, function (err, convo) {
            if (err) {
                console.log(err);
            } else {
                //convo.say('I am a bot that has just joined your team');
                //convo.say('You must now /invite me to a channel so that I can be of use!');
            }
        });
    }
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Configure the persistence options
 */

var config = {};
if (process.env.MONGOLAB_URI) {
    var BotkitStorage = require('botkit-storage-mongo');
    config = {
        storage: BotkitStorage({mongoUri: process.env.MONGOLAB_URI}),
    };
} else {
    config = {
        json_file_store: ('./db_slack_bot_ci/'),
    };
}

//Treat this as a custom integration
var customIntegration = require('./lib/custom_integrations');
var token = 'xoxb-112799256176-LtdUE8hKdK33gIMtgdOG3FDK';
var controller = customIntegration.configure(token, config, onInstallation);

/**
 * A demonstration for how to handle websocket events. In this case, just log when we have and have not
 * been disconnected from the websocket. In the future, it would be super awesome to be able to specify
 * a reconnect policy, and do reconnections automatically. In the meantime, we aren't going to attempt reconnects,
 * WHICH IS A B0RKED WAY TO HANDLE BEING DISCONNECTED. So we need to fix this.
 *
 * TODO: fixed b0rked reconnect behavior
 */
// Handle events related to the websocket connection to Slack
controller.on('rtm_open', function (bot) {
    console.log('** The RTM api just connected!');
});

controller.on('rtm_close', function (bot) {
    console.log('** The RTM api just closed');
    // you may want to attempt to re-open
});


/**
 * Core bot logic goes here!
 */
// BEGIN EDITING HERE!

controller.on('bot_channel_join', function (bot, message) {
    console.log('** Joined channel: ' + message)
});


controller.hears('hello', 'direct_message', function (bot, message) {
    bot.reply(message, 'sup brah.');
});

// I AM AN FBI AGENT
controller.hears(['agent','fbi','fed','feds','federal','g-man'], 'ambient', function (bot, message) {
    bot.reply(message,{
        text: 'This is your wake up call. I AM AN FBI AGENT!',
        icon_emoji: ':gun:'
    });
});

// who are you?
controller.hears('who are you', 'direct_message,mention,direct_mention', function (bot, message) {
    bot.reply(message,'Special Agent Johnny Utah, sir.');
});

// viz mentions
controller.hears(['viz','gui','fireball','fire ball'], 'ambient', function (bot, message) {
    replies = [
        '@brian.proctor HollyWOOD always up to no good.',
        '@brian.proctor Commands, what are they? Where are my icons and buttons?',
        '@brian.proctor FIREBALL SHOTS!',
        'You\'re about to jump out of a perfectly good plane, @brian.proctor, how does that make you feel?'
    ];

    reply = replies[getRandomInt(0,3)]
    bot.reply(message, reply);
});



// all direct mentions get vaya con dios
controller.on('direct_message,mention,direct_mention', function (bot, message) {
    bot.reply(message, 'Vaya con DIOS.');  
});
