const wordsByMinuteThreshold = 22;

function calculateWordsByMinute(text,responseTime){
    // console.log('ppa',60 * text.split(' ').length / responseTime);
    return 60 * text.split(' ').length / responseTime;
}

function responseTimeScore(conversationString) {
    // calcular score
    return conversationString.map(
        ({text,responseTime}) => calculateWordsByMinute(text,responseTime)
    ).every(
        wordsByMinute => wordsByMinute < wordsByMinuteThreshold
    ) ? 1 : 0;
}

module.exports = responseTimeScore;