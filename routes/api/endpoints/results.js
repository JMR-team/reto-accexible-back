// 3rd party packages
const path = require('path');
const mjml2html  = require('mjml');
const handlebars = require('handlebars');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const ObjectID = require('mongodb').ObjectId;
const emailValidator = require('email-validator');
const { hashSync, compareSync } = require("bcrypt");

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
router.post(
    '/',
    authenticateUser,
    validateResults,
    async function (req,res) {
    
    // CALCULATION OF THE TOTAL SCORE

    // score of the test questions, chat conversation and total score
    let [testScore, chatScore, totalScore] = [req.body.testScore, 0, 0];

    // Add the closed test scoring to the total score
    totalScore += testScore;

    // Add the scoring from the chatbot to the total scoring
    let conversationString = req.body.chatBotAnswers.map(({text})=>text).join(' ').toLowerCase();
    chatScore += responseTimeScore( req.body.chatBotAnswers.map(({text,responseTime})=>({text,responseTime})) ) //response time
    chatScore += [rumination,personalPronouns,keyWords].map(scoringFunction=>scoringFunction(conversationString)).reduce((prev,next)=>prev+next);
    totalScore += chatScore;


    // SAVE THE SCORE IN THE DATABASE

    let dateTimeOfRequest = (new Date()).toISOString()

    // If the user has presented credentials, i.e., userID is in req, save the results in the database with the userID encrypted
    if (req.userID != undefined) {
        let db = req.app.locals.db;
        db.collection("testResults").insertOne({
            user: hashSync(req.userID.toString(),10),
            totalScore: totalScore,
            testScore: testScore,
            chatScore: chatScore,
            dateTime: dateTimeOfRequest,
        });
    }

    // COMUNICATE THE RESULTS WITH AN EMAIL

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

    // SEND HTTP RESPONSE TO THE CLIENT CONTAINIG THE SCORING

    res.json({
        results:{
            totalScore:totalScore,
            testScore:testScore,
            chatScore:chatScore,
            dateTime: dateTimeOfRequest,
        }
    })
})

// GET method for requesting the results of a logged user.
router.get('/',(req,res,next)=>{
    let db = req.app.locals.db;
    let results = [];
    db.collection('testResults').find(
        {},
        {projection : {_id:0}}
    ).forEach(doc=>{
        if ( compareSync(req.userID, doc.user) ) {
            results.push( 
                (({totalScore,testScore,chatScore,dateTime})=>
                ({totalScore,testScore,chatScore,dateTime}))(doc) 
            );
        }
    }).then(data=>{
        res.json(results);
    })
})


module.exports = router;


// Middleware functions


// Read the jwt token to authenticate registered users and forbid unlogged users to send tests
// with the email of a registered user
function authenticateUser(req,res,next) {
    // Read the jwt token from the request
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Logic to implement for requests that contain a token in the authorization header
    if (token != undefined){
        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
          // token is invalid. Stop the request and response with forbidden error code
          if (err != undefined) return res.status(403).send(err);
          // In case the token is valid, find the user by its ID in the database
          let userID = decodedToken.id;
          let db = req.app.locals.db;
          db.collection("users")
            .findOne({ _id: new ObjectID(userID) })
            .then((user) => {
                // The token is valid but there is no user associated to it
                if (user == undefined) return res.status(403).send({err:'user does not exist'});
                // The user exists ===>>> push user data to the request body and continue with the middleware chain
                req.body.email = user.email;
                req.body.firstName = user.firstName;
                req.userID = user._id;
                next()
            });
        });
    } else { // Logic to implement if the request does not contain a token
        // Check validity of email format, reject requests with invalid email address
        if (!emailValidator.validate(req.body.email)){
            return res.status(400).json({err:'invalid email address format'})
        }
    
        // Even if the email is valid, check if the email belongs to a registered user. If so, reject the request
        let db = req.app.locals.db;
        db.collection("users")
          .findOne({ email: req.body.email })
          .then((user) => {
            if (user!=undefined) return res.status(403).json({err:'Forbidden, email belongs to a registered user'});
            next();
          });
    }
    
}

// Validate the data in the body related to the results of the test and the chatbot conversation
function validateResults(req,res,next){
    // Validate the score of the test
    req.body.testScore = parseFloat(req.body.testScore);
    if (isNaN(req.body.testScore) || req.body.testScore < 2.25 || req.body.testScore > 9){
        return res.status(400).json({err:'testScore must be a float between 2.25 and 9'})
    }

    // Validate the chatbot answers array


    next();
}