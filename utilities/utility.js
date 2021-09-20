/////////////////////////////////////////////////////////////
//
// utility.js
//
// By Edward H. Trager
// init: 2021.03.16
//
/////////////////////////////////////////////////////////////
const fs = require('fs');

//
// readJSONFILE
//
// NB: Provide a callback to handle the
// asynchronous file reading.
//
function readJSONFile(filename,callback){
    fs.readFile(filename,'utf8',function(error,rawData){
        if(error){
            callback({error:`Sorry, the requested resource or asset is not available.`});
        }else{
            // Get here if successful:
            callback( JSON.parse(rawData) );
        }
    });
}

exports.readJSONFile=readJSONFile;

