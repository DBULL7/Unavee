const token = require('./twitterKey.js')
const request = require('request')
const watsonKeys = require('./watsonKeys.js')
const toneAnalyzerKeys = require('./toneAnalyzerKeys.js')
const sendgridKey = require('./sendgridAPIKey.js')
var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3')
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');


function email(req, res, next) {
  console.log(req.body);
  request({
    url: `https://api.fullcontact.com/v2/person.json?email=${req.body.email}`,
    headers: {"X-FullContact-APIKey":"7bf3d484dff1e414"}
  },
    function (error, response, body) {

    if(!error && response.statusCode === 200) {
      res.send(body)
    } else {
      res.status(500).send({
        error: 'unknown issue'
      })
    }
  })

}


function tweets(req, res, next) {
  console.log(req.body);
 request({
   url: `https://api.twitter.com/1.1/statuses/user_timeline.json?user_id=${req.body.id}&count=100&include_rts=false`,
   headers: {
     "Authorization": `Bearer ${token.token}`
   }
 },
 function( error, response, body) {
   if(!error && response.statusCode === 200) {
     res.send(body)
   } else {
     console.log(error);
   }
 }
  )
}

function watson(req, res, next) {
  // console.log(req.body)
    var personality_insights = new PersonalityInsightsV3({
      username: watsonKeys.username,
      password: watsonKeys.password,
      version_date: '2017-05-20'
    })

    var params = {
    // Get the content items from the JSON file.
    content_items: req.body.text.contentItems,
    consumption_preferences: true,
    raw_scores: true,
    headers: {
      'accept-language': 'en',
      'accept': 'application/json'
    }
  };

  personality_insights.profile(params, function(error, response) {
    if (error)
      console.log('Error:', error);
    else
      // console.log(JSON.stringify(response, null, 2));
      res.send(response, null, 2)
    }
  );
}

function sendgrid(req, res, next) {

  var helper = require('sendgrid').mail;
  var fromEmail = new helper.Email(req.body.from);
  var toEmail = new helper.Email(req.body.email);
  var subject = req.body.subject;
  var content = new helper.Content('text/plain', req.body.content);
  var mail = new helper.Mail(fromEmail, subject, toEmail, content);

  var sg = require('sendgrid')(sendgridKey.apiKey);
  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });

  sg.API(request, function (error, response) {
    if (error) {
      console.log('Error response received');
    }
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
    res.send(response)
  });
}

function emailAnalysis(req, res, next) {
  console.log('this is the friggin request', req.body.text)
  var tone_analyzer = new ToneAnalyzerV3({
    username: toneAnalyzerKeys.username,
    password: toneAnalyzerKeys.password,
    version_date: '2017-05-20'
  });

  // Parameters for the call are defined in the tone.json file.
  var params = {text: req.body.text}

  tone_analyzer.tone(params, function(error, response) {
    if (error)
      console.log('error:', error);
    else
      // console.log(JSON.stringify(response, null, 2));
      res.send(response, null, 2)
    }
  );
}


module.exports = {
  email: email,
  tweets: tweets,
  watson: watson,
  sendgrid: sendgrid,
  emailAnalysis: emailAnalysis
}

// request({
//   url: `https://api.fullcontact.com/v2/address/locationNormalizer.json?place=denver`,
//   headers: {"X-FullContact-APIKey":"7bf3d484dff1e414"},
// },
//   function (error, response, body) {
//     console.log(response);
//     if (!error && response.statusCode == 200) {
//       console.log(body);
//       return (res)
//       // res.send(body)
//     } else {
//       console.log(error);
//     }
// })
