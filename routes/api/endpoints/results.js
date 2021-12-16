// 3rd party packages
const path = require('path');
const mjml2html  = require('mjml');
const handlebars = require('handlebars');
const fs = require('fs');

// Router
const router = require('express').Router();

// Nodemailer transporter config
const smtpTransporter = require('../../../email-config/transporter');

// Functions for calculating the score of the chatbot
const rumination = require('../../../scoring-chatbot/rumination');
const responseTimeScore = require('../../../scoring-chatbot/responseTimeScore');
const personalPronouns = require('../../../scoring-chatbot/personalPronouns');
const keyWords = require('../../../scoring-chatbot/keyWords');


// POST method for sending the results to the user and if the user is logged save results in the database.
router.post('/', validateResults, async function (req,res) {
    
    // score of the test questions, chat conversation and total score
    let [testScore, chatScore, totalScore] = [req.body.testScore, 0, 0];

    // Add the closed test scoring to the total score
    totalScore += testScore;

    // Add the scoring from the chatbot to the total scoring
    let conversationString = req.body.chatBotAnswers.map(({text})=>text).join(' ').toLowerCase();
    chatScore += responseTimeScore( req.body.chatBotAnswers.map(({text,responseTime})=>({text,responseTime})) ) //response time
    chatScore += [rumination,personalPronouns,keyWords].map(scoringFunction=>scoringFunction(conversationString)).reduce((prev,next)=>prev+next);
    totalScore += chatScore;

    // Build the email for the results communication
    let message = {
        from: 'Accexible <no.reply@accexible.com>',
        to: `${req.body.firstName} <${req.body.email}>`,
        subject: `Resultados prueba accexible`,
    };
    
    // Html email: handlebars, MJML.
    
    // paths for the templates files
    const rootDir = path.join(__dirname,'../../../');
    const templatesDir = path.join(rootDir,'/templates/email')
    const templatePaths = [
        {threshold:5,templateSourcePath:path.join(templatesDir,'/result-email-good.handlebars')},
        {threshold:10,templateSourcePath:path.join(templatesDir,'/result-email-moderate.handlebars')},
        {threshold:15,templateSourcePath:path.join(templatesDir,'/result-email-bad.handlebars')}
    ]
    // Select the correct template according to the total scoring
    const {templateSourcePath} = templatePaths.find(item => (totalScore <= item.threshold) );
    
    // Load the template and compile it
    const templateSource = fs.readFileSync(templateSourcePath,'utf-8').toString();
    const template = handlebars.compile(templateSource);

    // Inject data in the template, then compile to html with mjml
    const htmlOutput = mjml2html( 
        template({
            firstName:req.body.firstName,
            totalScore
        }) 
    );

    message.html = htmlOutput.html;

    // Send the email
    smtpTransporter.sendMail(message, (err, info) => {
        if (err) {
            console.log('Error occurred. ' + err.message);
            return res.status(500).send(err)
        }
        // res.send({msg:`Email succesfully sent to ${info.accepted.join(', ')}`});
    });

    res.json({
        results:{
            totalScore:totalScore,
            testScore:testScore,
            chatScore:chatScore,
            date:(new Date()).toISOString(),
        }
    })
})

module.exports = router;


// Middleware functions

// Validate the data in the body related to the results of the test and the chatbot conversation
function validateResults(req,res,next){
    console.log(req.body);

    // Validate the score of the test
    req.body.testScore = parseFloat(req.body.testScore);
    if (isNaN(req.body.testScore) || req.body.testScore < 2.25 || req.body.testScore > 9){
        return res.status(400).json({err:'testScore must be a float between 2.25 and 9'})
    }

    // Validate the chatbot answers array


    next();
}