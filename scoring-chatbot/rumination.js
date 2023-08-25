const maxNumberIteration = 3;
const keywordsGroup01 = ["solitario", "solo", "soledad", "abandono", "abandonado", "abandonada"];
const keywordsGroup02 = ["triste", "tristeza", "apenado", "abatido"];
const keywordsGroup03 = ["miserable", "despreciable"];
const keywordsGroup04 = ["desmotivado", "desilusionado"];
const keywordsGroup05 = ["preocupado", "agobiado"];
const keywordsGroup06 = ["deprimido", "depresion", "enfermo", "enferma", "bajon", "depresivo"];
const keywordsGroup07 = ["morir", "matarme", "muerte", "suicidio", "suicidar"];
const keywordsGroup08 = ["siempre", "constantemente"];
const keywordsGroup09 = ["nunca", "jamás"];
const keywordsGroup10 = ["enfadado", "cabreado", "odio", "irritado", "indignado"];
const keywordsGroup11 = ["insomnio", "despierto", "sueño"];
const keywordsGroup12 = ["culpa", "falta", "responsabilidad"];
const keywordsGroup13 = ["solución", "remedio", "esperanza"];
const keywordsGroup = [keywordsGroup01, keywordsGroup02, keywordsGroup03, keywordsGroup04, keywordsGroup05, keywordsGroup06, keywordsGroup07, keywordsGroup08, keywordsGroup09, keywordsGroup10, keywordsGroup11, keywordsGroup12, keywordsGroup13];

function rumination(text) {
    let keywordsIteration = 0;
    let returnValue = 0;
    keywordsGroup.forEach(keywords => {
        keywords.forEach(result => {
            let matches = text.match(new RegExp(`\\b${result}\\b`, 'ig'));
            keywordsIteration += matches ? matches.length : 0;
            if (keywordsIteration > maxNumberIteration) {
                returnValue = 1;
            }
        });
    });
    return returnValue;
}

module.exports = rumination;