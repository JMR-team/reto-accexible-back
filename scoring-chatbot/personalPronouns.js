const firstPersonalPronouns = ['yo', 'me', 'mí', 'mi', 'conmigo', 'mis', 'mío', 'mio', 'míos', 'mios', 'mía', 'mia', 'mías', 'mias'];
const otherPersonalPronouns = ['tú', 'tu', 'te', 'ti', 'contigo', 'usted', 'vos', 'tuyo', 'tuyos', 'tuya', 'tuyas', 'el', 'él', 'ella', 'ello', 'lo', 'la', 'los', 'las', 'le', 'les', 'se', 'si', 'consigo', 'suyo', 'suyos', 'suya', 'suyas'];
    
function personalPronouns(text) {
    let firstPersonalIteration = 0;
    let otherPersonalIteration = 0;
    firstPersonalPronouns.forEach(result => {
        let matches = text.match(new RegExp(`\\b${result}\\b`, 'ig'));
        firstPersonalIteration += matches ? matches.length : 0;
    });
    otherPersonalPronouns.forEach(result => {
        let matches = text.match(new RegExp(`\\b${result}\\b`, 'ig'));
        otherPersonalIteration += matches ? matches.length : 0; 
    });
    if (firstPersonalIteration > otherPersonalIteration) {
        return 1;
    } 
    return 0;
}

export default personalPronouns