var fcUtils = require('../fivecard-utils');

function onLaunch (launchRequest, session, response) {
    newSession = {
        playing: false,
        deck: [],
        playerHand: [],
        dealerHand: [],
        toDiscard: [],
        state: fcUtils.states.NEW_GAME,
    }

    var output = '';
    var reprompt = '';

    output += 'Welcome to Five Card Draw. Would you like to play a round?';
    reprompt += 'Would you like to play a round of Five Card Draw?';
    response._session = newSession;

    response.ask(output, reprompt);
};

module.exports = {
    onLaunch: onLaunch,
};
