const request = require('request')
// const API_KEY = // API KEY GOES HERE
const BASE_URL = `https://api.fullcontact.com/v2/address/locationNormalizer.json?place=denver`

function email(req, res, next) {
  request({
    url: BASE_URL,
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

module.exports = {
  email: email
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
