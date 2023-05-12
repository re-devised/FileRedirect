const axios = require('axios');
const axiosInstance = axios.create()
const FormData = require('form-data');


var progress = {
    getUrl: [],
    postUrl: []
}

async function getFileThenPost(options){
    progress.getUrl = []
    progress.postUrl = []

    try{
        if (!options.getUrl) throw("The 'getUrl' option must be of type Array. Received undefined. For usage view https://www.npmjs.com/package/get-file-then-post.")
        if (!options.postUrl) throw("The 'postUrl' option must be of type Array. Received undefined. For usage view https://www.npmjs.com/package/get-file-then-post.")
    
        var files = [];
        maxProgress = options.getUrl * options.postUrl
        
        for(var i = 0; i < options.getUrl.length; i++){
            if (typeof options.getUrl[i] !== 'string') throw("An element of the Array 'postUrl' must be of type String. Received undefined. For usage view https://www.npmjs.com/package/get-file-then-post.")
            
            var getUrl = options.prefix ? options.prefix + options.getUrl[i] : options.getUrl[i]

            await axiosInstance({
                url: getUrl, 
                method: 'GET',
                responseType: 'arraybuffer'
        
            }).then((response) => { 
                var url = response.headers['x-final-url'];
                var contentDisposition = response.headers['content-disposition'];


                let formats = require('./allowedFormats')
                if(!formats.includes(response.headers['content-type']) && contentDisposition == undefined){
                    progress.getUrl.push({
                        'url' : getUrl,
                        'status' : 400
                    })
                }else{
                    progress.getUrl.push({
                        'url' : getUrl,
                        'status' : response.status
                    })
                    files.push(response)
                }
            }).catch((err) => {
                progress.getUrl.push({
                    'url' : getUrl,
                    'status' : err.response.status
                })
                throw(err)
            })
        }
        
        
        for(var i = 0; i < options.postUrl.length; i++){
            if (typeof options.postUrl[i] !== 'string') throw("An element of the Array 'postUrl' must be of type String. Received undefined. For usage view https://www.npmjs.com/package/get-file-then-post.")
            
            var postUrl = options.prefix ? options.prefix + options.postUrl[i] : options.postUrl[i]
            progress.postUrl.push({'url' : postUrl, 'postRes' : []})

            for(var f = 0; f < files.length; f++){
                var contentDisposition = files[f].headers['content-disposition'];
                var url = files[f].headers['x-final-url'];
                var contentType = files[f].headers['content-type'].substring(files[f].headers['content-type'].lastIndexOf('/')+1)

                var fileName = contentDisposition ? contentDisposition.match(contentDisposition.match(/filename\*?=([^']*'')?([^;]*)/)[2]) : url.substring(url.lastIndexOf('/') + 1) + "." + contentType

                var formData = new FormData()
                formData.append('uploadFile', new Blob([files[f].data]), fileName) //<<<<==== MAKE THIS EDITABLE!!!
                ///////////////////////////////////////////////////
                ///////////////////////////////////
                
                await axiosInstance.post(postUrl, formData)
                    .then((response) => {
                        progress.postUrl[i].postRes.push({
                            'url' : files[f].config.url,
                            'status' : response.status
                        })
                    })
                    .catch((err) => {
                        progress.postUrl[i].postRes.push({
                            'url' : files[f].config.url,
                            'status' : err.response.status
                        })
                        throw(err)
                    })
            }
        }
    
        
    }
    catch(err){console.log(err)}
}

function getProgress(){
    return JSON.parse(JSON.stringify(progress))
}


module.exports.getFileThenPost = getFileThenPost
module.exports.getProgress = getProgress