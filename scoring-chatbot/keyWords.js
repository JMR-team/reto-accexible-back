function keyWords(sentence) {
    let keyWordsScore = 0

    const keyWordsArray = [
        { words: ["solitario", "solo", "soledad", "abandono", "abandonado", "abandonada"], score: 0.3 },
        { words: ["triste", "tristeza", "apenado", "abatido"], score: 0.3 },
        { words: ["miserable", "despreciable"], score: 0.2 },
        { words: ["desmotivado", "desilusionado"], score: 0.2 },
        { words: ["preocupado", "agobiado"], score: 0.2 },
        { words: ["deprimido", "depresion", "enfermo", "enferma", "bajon", "depresivo"], score: 0.4 },
        { words: ["morir", "matarme", "muerte", "suicidio", "suicidar"], score: 0.4 },
        { words: ["siempre", "constantemente"], score: 0.2 },
        { words: ["nunca", "jamás"], score: 0.2 },
        { words: ["enfadado", "cabreado", "odio", "irritado", "indignado"], score: 0.3 },
        { words: ["insomnio", "despierto", "sueño"], score: 0.2 },
        { words: ["culpa", "falta", "responsabilidad"], score: 0.2 },
        { words: ["solución", "remedio", "esperanza"], score: 0.3 },

    ]

    keyWordsArray.forEach(function (keyWord) {
        if (keyWord.words.some(word => sentence.includes(word))) {
            keyWordsScore = keyWordsScore + keyWord.score
        }


    })

    if (keyWordsScore > 3) {
        keyWordsScore = 3
    }

    return keyWordsScore
}

module.exports = keyWords