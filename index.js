var AlexaSkill = require('./AlexaSkill');
var APP_ID = "amzn1.echo-sdk-ams.app.1b7713b0-bfd0-4831-8506-447384607766";

//Custom Intents
var handleNewGameIntent = require('./intents/newGameIntent');
var handleDiscardCardIntent = require('./intents/discardIntent');

// Amazon Intent Overrides
var handleYesIntent = require('./intents/yesIntent');
var handleNoIntent = require('./intents/noIntent');
var handleStopIntent = require('./intents/stopIntent');
var handleCancelIntent = require('./intents/cancelIntent');
var handleRepeatIntent = require('./intents/repeatIntent');
var handleHelpIntent = require('./intents/helpIntent');
var handleStartOverIntent = require('./intents/startOverIntent');

//Custom Events
var events = require('./events');

var FiveCard = function() {
    AlexaSkill.call(this, APP_ID);
};

FiveCard.prototype = Object.create(AlexaSkill.prototype);
FiveCard.prototype.constructor = FiveCard;

FiveCard.prototype.eventHandlers.onLaunch = events.onLaunch;

FiveCard.prototype.intentHandlers = {
    NewGame: handleNewGameIntent,
    DiscardCard: handleDiscardCardIntent,
    "AMAZON.YesIntent": handleYesIntent,
    "AMAZON.NoIntent": handleNoIntent,
    "AMAZON.StopIntent": handleStopIntent,
    "AMAZON.CancelIntent": handleCancelIntent,
    "AMAZON.RepeatIntent": handleRepeatIntent,
    "AMAZON.HelpIntent": handleHelpIntent,
    "AMAZON.StartOverIntent": handleStartOverIntent,
};


exports.handler = function (event, context) {
    var skill = new FiveCard();
    skill.execute(event, context); 
}
