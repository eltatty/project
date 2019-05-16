const request = require('request')

const uploadFunc = async (file, num, callback) => {
    await request({
        url: 'http://localhost:300' + num + '/upload',
        method: 'POST',
        multipart: [
            {
                source: 'Application-Server',
                'content-type': 'multipart/form-data',
                originalname: file.originalname,
                body: file.buffer,
            },
        ]
    }, (error, response, body) => {
        if(error || response.statusCode != 200) {
            console.log('Error: ' + error)
            // console.log('StatusCode: ' + response.statusCode)
            callback('Unable to upload to server', undefined)
        }
        if(body){
            const obj = JSON.parse(body)
            callback(undefined, { 
                server: obj.server,
                fileName: obj.fileName
            })
        }
    })
}


module.exports = uploadFunc