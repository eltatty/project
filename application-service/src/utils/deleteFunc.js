const request = require('request')
const jwt = require('jsonwebtoken')

const deleteFunc = ( filenames, servers, callback ) => {
    const innerToken = jwt.sign('Application-Service', 'messithegoat')
    request.delete('http://localhost:300' + servers[0].server + '/delete/' + filenames[0].filename + innerToken, (error, response, body) => {
        if(error || response.statusCode == 500) {
            console.log(response)
            console.log(error)
            callback('Unable to delete image on server', undefined)
        }

        if(body){
            callback(undefined, body)
        }
    })

}

module.exports = deleteFunc