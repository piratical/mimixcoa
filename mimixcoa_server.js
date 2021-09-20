/////////////////////////////////////////////////
//
// server.js
//
// This file is part of the Mimixcoa project
//
// by Edward H. Trager <ed.trager@gmail.com>
//
// init: 2021.03.16.et
// last update: 2021.09.20.et
//
//////////////////////////////////////////////////

// Custom logo:
const custom_logo='logo.svg';

const fs            = require('fs');
const http          = require('http');
const https         = require('https');
const url           = require('url');
const express       = require('express');
const bodyParser    = require('body-parser');
const showdown      = require('showdown');
const showdownKatex = require('showdown-katex');
//const bcrypt        = require('bcrypt');

/////////////////////////////////////////////
//
// Showdown markdown converter:
//
// Note options ...
//
/////////////////////////////////////////////
const mdConverter = new showdown.Converter({
  tables: true,
  parseImgDimensions:true,
  simplifiedAutoLink:true,
  excludeTrailingPunctuationFromURLs:true,
  ghCodeBlocks:true,
  tasklists:true,
  extensions:[
    showdownKatex({
      displayMode: true,
      throwOnError: false, // false: allows katex to fail silently
      errorColor: '#ff0000',
      delimiters: [
        { left: "$", right: "$", display: false },
        { left: '~', right: '~', display: false, asciimath: true },
      ],
    })

  ]
});

// >>> CHOOSE ONE: >>>
// PG OR PG-NATIVE
// PG-NATIVE MAY BE MORE PERFORMANT FOR PRODUCTION:
const {Pool,Client} = require('pg');
//const {Pool,Client} = require('pg').native;

/////////////////////////////////////////////
//
// ElasticSearch testing:
//
/////////////////////////////////////////////
//const elasticSearch = require('elasticsearch');

// Instantiate elasticSearch client:
//const elasticSearchClient = new elasticSearch.Client({
//hosts: [ 'http://localhost:9200']
//});

// Try pinging the client:
//elasticSearchClient.ping({ requestTimeout: 30000 } , function(error){
//  if(error){
//    console.error('Sorry, cannot connect to Elasticsearch.');
//  }else{
//    console.log('Connection to Elasticsearch was successful!');
//  }
//});

///////////////////////////////////////
//
// SSL STUFF NEEDED FOR HTTPS:
// IN HOUSE SERVER:
//
///////////////////////////////////////
const sslCertDir  = './test_certs/public/';
const sslPrivDir  = './test_certs/private/';
const privKeyFile = sslPrivDir+'test.key';
const publKeyFile = sslCertDir+'test.crt';
const domainName  = 'localhost';

//const privateKey    = fs.readFileSync( privKeyFile , 'utf8');
//const certificate   = fs.readFileSync( publKeyFile , 'utf8');
//const credentials   = {key: privateKey, cert: certificate, maxSockets:25 };

//////////////////////////////////////////////////////////////
//
// Express server configuration:
//
//////////////////////////////////////////////////////////////

// Postgres pool:
const pool = new Pool();

// Express server app:
var app = express();

// trust proxy:
app.set('trust proxy',true);

//
// Test bodyParser too:
//
app.use(bodyParser.json());

///////////////////////////////////////
//
// checkSyntax
//
///////////////////////////////////////
function checkSyntax(req,res,next){
  const sql = req.body.data;
  //console.log('Calling checkSyntax...');
  //console.log(sql);
  const pre  = 'DO $SYNTAX_CHECK$ BEGIN RETURN;';
  const post = 'END; $SYNTAX_CHECK$;';

  const test = `${pre}${sql}${post}`;

  pool.query( test , (pgError,pgResponse)=>{
    console.log(pgError);
    if(pgError){
      const result = {};
      result.result  = 'ERROR';
      // We handle a few different types of errors (probably not exhaustively, btw):
      const matched1 = pgError.stack.match(/error: (syntax error at or near "(.*)")/);
      const matched2 = pgError.stack.match(/error: (syntax error at end of input)/);
      const matched3 = pgError.stack.match(/Error: getaddrinfo ENOTFOUND/);
      if(matched1){
        result.message = matched1[1];
        result.near    = matched1[2];
        result.position= pgError.position-pre.length;
      }else if(matched2){
        result.message = matched2[1];
        result.near    = "";
        result.position= pgError.position-pre.length;
      }else if(matched3){
        result.message = 'Error: Unable to reach database server. Please check VPN or network connection.';
        result.near    = "";
        result.position=0;
      }else{
        // This is a "catch all" section for unclassified cases:
        result.message = pgError.stack;
        result.near="";
        result.position=0;
      }
      res.send(JSON.stringify(result));

    }else{
      // DEBUG: 
      if(pgResponse.command==='DO' && pgResponse.rowCount===null){
        res.send('{"result":"OK"}');
      }else{
        res.send('{"result":"?"}'); // <= Should not get here ever
      }
    }
  });
}

///////////////////////////////////////////
//
// calculateUnnesting()
//
// => Used to resolve relative path
//    specs for things like CSS
//    and Javascript includes
//
///////////////////////////////////////////
function calculateUnnesting(fullPath){
  // N.B.: Since the default document server
  // path is baked in as '/docs/' which has
  // two forward-slashes, we start depth
  // off at minus 2:
  let unnesting='';
  for(let i=0,depth=-2;i<fullPath.length;i++){
    if(fullPath[i]==='/'){
      depth++;
      if(depth>0){
	unnesting+='../';
      }
    }
  }
  return unnesting;
}

////////////////////////////////////////////
//
// makeHtmlHeader
//
////////////////////////////////////////////
function makeHtmlHeader(title,lastUpdated,unnesting=''){
 // Code section:
 
 // homeLink is on every page except the base page index page:
 let homeLink = unnesting ? '<div><a href="/docs/"><div class="hbh"></div>Home</a></div>' : '';
 // Fix for sentinel unnesting:
 if(unnesting==='.'){
   unnesting='';
 }
 
 return `<!DOCTYPE html>
<html lang="en">
<head>
  <title>${title}</title>
  <!-- Unicode UTF-8 -->
  <meta charset="utf-8">
  <!-- FAVICON -->
  <link rel="icon" href='${unnesting}images/amx_icon.svg' sizes='any' type='image/svg+xml' />
  <!-- CSS -->
  <link rel="stylesheet" title='Default' href='${unnesting}css/main.css' type='text/css' />
  <!-- <link rel="stylesheet" title='Print' href='${unnesting}css/print.css' type='text/css' media='print' /> -->
  <link rel='stylesheet' href='${unnesting}css/prism.css'>
  <link rel='stylesheet' href='${unnesting}css/prism_line_numbers.css'>
  <link rel='stylesheet' href='${unnesting}css/accessbee.css'>
  <!-- JAVASCRIPT (NB: SOME JS FILES ARE IN FOOTER) -->
  <!-- <script src = "https://d3js.org/d3.v4.min.js" defer></script> -->
  <script src="https://fred-wang.github.io/mathjax.js/mpadded-min.js"></script>
  <!-- FONTS -->
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link href="https://fonts.googleapis.com/css?family=Gentium+Basic:400,400i,700,700i&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet"> 
  <link href="https://fonts.googleapis.com/css2?family=Julius+Sans+One&family=Raleway:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
 <!-- ACCESS BEE ACCESSIBILITY WIDGET -->
 <div id='access_bee'></div>
 <!-- CONTENT -->
 <div id='content'>
  ${homeLink}
  <em class='small'>Last updated on ${lastUpdated}</em>
  <!-- STT USER-DEFINED CONTENT -->
`;
}

////////////////////////////////////////////
//
// makeHtmlFooter
//
////////////////////////////////////////////
function makeHtmlFooter(unnesting=''){
  // Fix for sentinel unnesting:
  if(unnesting==='.'){
    unnesting='';
  }

  return `
      <!-- END USER-DEFINED CONTENT -->
      <a href='#'>
       <div class='hb' style='margin-left:auto;margin-right:auto;'></div>
      </a>
    </div>
    <!-- END OF CONTENT DIV -->
    <!-- JAVASCIPT -->
    <script src='${unnesting}js/prism.js'></script>
    <script src='${unnesting}js/invert.js'></script>
    <script src='${unnesting}js/speech.js'></script>
    <script src='${unnesting}js/keyboard_navigation.js'></script>
    <script src='${unnesting}js/accessbee.js'></script>
    <script src='${unnesting}js/prism_line_numbers.js'></script>
    <script>
      // Create AccessBee widget:
      const accessBee = new AccessBeeWidget();
      // Check for dark theme state when page is loaded:
      restoreSavedDarkLightMode();
    </script>
  </body>
</html>`;

}

/////////////////////////////////////////
//
// p0: pad number <10 with prefixed zero
//
/////////////////////////////////////////
function p0(n) {
  if (n < 10) {
    return '0' + n;
  }
  return n;
}

/////////////////////////////////////////
//
// titleize
//
// =>Capitalizes first letters of words
//
/////////////////////////////////////////
function titleize(s){
  // Words that don't get capitalized in English:
  const excludedWords = 'a an and at but by for for from nor of on or so the to with yet'; 
  // Additional words that should not be capitalized according to the
  // Chicago Manual of Style:
  // 'after along around without'
  // (But we leave these ones off the list for now)
  // 
  let wordArray = s.split(' ');
  let title=''
  for(let i=0;i<wordArray.length;i++){
    let word = wordArray[i];
    if( i===0 
        ||
        ! ( excludedWords.includes(word) )
    ){
      title += word[0].toUpperCase() + word.substring(1);
    }else{
      title += word;
    }
    if(i<wordArray.length-1){
      title += ' ';
    }
  }
  return title;
}

////////////////////////////////////////
//
// pathToBreadCrumbs
//
////////////////////////////////////////
function pathToBreadCrumbs(path){
  let list = '';
  const dirs = path.split('/')
  // N.B.:
  //   * Skip './', so start at i=1:
  //   * Don't include file name, so end at length-1:
  for(let i=1;i<dirs.length-1;i++){
    list += titleize(dirs[i]);
    if(i<dirs.length-2){
      list += ' <span class="bc_grayed">&gt;</span> ';
    }
  }
  return list;
}

////////////////////////////////////////
//
// getAllFiles
//
////////////////////////////////////////
const getAllFiles = function(dirPath, arrayOfFiles){
  files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()){
      // Push directory entries as well:
      // arrayOfFiles.push( { isDirectory:true, path:dirPath + '/' + file , name:file } );
      // Recursive call on directory:
      arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles);
    } else {
      // Push file into array:
      //arrayOfFiles.push(path.join(__dirname, dirPath, "/", file));
      arrayOfFiles.push( { isDirectory:false, path:dirPath + '/' + file , name:file } );
    }
  })

  return arrayOfFiles;
}
// END getAllFiles

////////////////////////////////////////
//
// getDirectoryListing
//
////////////////////////////////////////
const getDirectoryListing = function(dirPath){
  
  const arrayOfFiles = [];

  files = fs.readdirSync(dirPath);

  files.forEach(function(file) {
    const isDirectory = fs.statSync(dirPath + "/" + file).isDirectory();
    arrayOfFiles.push( { isDirectory:isDirectory, path:dirPath + '/' + file , name:file } );
  })

  // Sort array alphabetically:
  arrayOfFiles.sort( (a,b)=>{
    if(a.name<b.name){
      return -1;
    }
    if(a.name>b.name){
      return +1;
    }
    // Get here if equal:
    return 0;
  });

  return arrayOfFiles;

}
// END OF getDirectoryListing

/////////////////////////////////////////
//
// FUNCTION displayFileListing
//
/////////////////////////////////////////
const displayFileListing = function(arrayOfFiles){
  
  let contents='';
  let header='';
  
  arrayOfFiles.forEach(file=>{
    // Don't show files what are basically 'system' files
    // such as CSS, javascript, or image files:
    if(file.name.match(/^\..*|^.*\.(css|js|jpeg|jpg|png|svg|mp3|mp4)$/)){
      return;
    }
    // Also don't show 'system' directories such as 
    // 'css', 'images', or 'js' directories:
    if(file.isDirectory && file.name.match(/^(css|fonts|images|javascript|js|sounds)$/)){
      return;
    }
    // Check if we need to print a new subheader:
    firstLetter = file.name[0];
    firstLetter = firstLetter.toUpperCase();
    if(header!=firstLetter){
      header=firstLetter;
      contents += `# ${firstLetter}\n`;
    }
      
    // Strip the 'docs' prefix, since that is already
    // baked into the document server base path.
    // Also remove any reduplicated '//'s:
    let relPath = file.path.replace(/docs\//,'');
    relPath = relPath.replace(/\/\//,'/');

    // Print file names as bulleted lists:
    // Make titles from file names:
    let relName = file.name.replace(/.(md|html|pdf)$/,'');
    relName = relName.replace(/_/g,' ');
    relName = titleize(relName);
    // When displaying the file listing of a subdirectory,
    // we only show the name (that is, without bread crumbs
    // as is done on the index page). However, we do want
    // to highlight when a file is actually a directory:
    if(file.isDirectory){
      contents += `* 📂 [${relName}](${file.name}/)\n`;
    }else{
      contents += `* [${relName}](./${file.name})\n`;
    }
  });
  const html = mdConverter.makeHtml(contents);
  return html;

}
// END OF displayFileListing
// --- +++ ---

///////////////////////////////////////////
//
// getCurrentDate
//
///////////////////////////////////////////
function getCurrentDate(){
  const lu = new Date();
  const lastUpdated = lu.getUTCFullYear() +
    '-' + p0(lu.getUTCMonth() + 1) +
    '-' + p0(lu.getUTCDate());
  return lastUpdated;
}
// END getCurrentDate

///////////////////////////////////////////
//
// index()
// => Creates the index page:
//
///////////////////////////////////////////
function index(req,res,next){
  
  const lastUpdated = getCurrentDate();
  const head = makeHtmlHeader('Document Server Index',lastUpdated);
  const tail = makeHtmlFooter();

  // File listing:
  const fullPath = '.' + req.baseUrl + req.path;
  const allFiles = getAllFiles(fullPath);

  // Sort the allFiles array:
  allFiles.sort( (a,b)=>{
    if(a.name<b.name){
      return -1;
    }
    if(a.name>b.name){
      return +1;
    }
    // Get here if equal:
    return 0;
  });

  let header = '';
  // Start the contents with a logo and title:
  let contents = `<img class='custom_logo' src="images/${custom_logo}"/>\n# Document Index\n`; 
  allFiles.forEach(file=>{
    // Discard files we don't want to list on the 
    // index page:
    if(file.name.match(/^\.|\.(css|js|jpeg|jpg|png|svg)$/)){
      return;
    }
    // Check if we need to print a new subheader:
    firstLetter = file.name[0];
    firstLetter = firstLetter.toUpperCase();
    if(header!=firstLetter){
      header=firstLetter;
      contents += `# ${firstLetter}\n`;
    }
      
    // Strip the 'docs' prefix, since that is already
    // baked into the document server base path.
    // Also remove any reduplicated '//'s:
    let relPath = file.path.replace(/docs\//,'');
    relPath = relPath.replace(/\/\//,'/');

    // Print file names as bulleted lists:
    // Make titles from file names:
    let relName = file.name.replace(/.(md|html|pdf)$/,'');
    relName = relName.replace(/_/g,' ');
    //relName = relName.charAt(0).toUpperCase() + relName.slice(1);
    relName = titleize(relName);
    // Also show directory structure (below 'docs/' that is), if present:
    let crumbs = pathToBreadCrumbs(relPath);
    if(crumbs){
      crumbs = ' <span class="bc_grayed">in</span> ' + crumbs;
    }
    contents += `* [${relName}](${relPath})${crumbs}\n`;
    
  });
  const body = mdConverter.makeHtml(contents);

  res.send( head + body + tail );
}
// END index()

///////////////////////////////////////////
//
// sendSoft404Error
//
///////////////////////////////////////////
function sendSoft404Error(req,res,unnesting,notFound){
  
  const lastUpdated = getCurrentDate();
  // This is a "sentinel" unnesting used
  // so that we get display of the link
  // back to the HOME page:
  if(unnesting===''){
    const unnesting = '.';
  }
  const head = makeHtmlHeader(req.path,lastUpdated,unnesting);
  const body = `<h1>Resource not found</h1>
<p>Sorry, the requested resource,</p> 
<p><code>${notFound}</code></p>
<p>... was not found on this server 😳</p>`;
  const tail = makeHtmlFooter(unnesting);
  res.send( head + body + tail );
  
}
// END sendSoft404Error

///////////////////////////////////////////
//
// handleDirectory
//
///////////////////////////////////////////
function handleDirectory(req,res,unnesting,path){

  const lastUpdated = getCurrentDate();
  if(unnesting===''){
    const unnesting = '.';
  }
  const head = makeHtmlHeader(req.path,lastUpdated,unnesting);

  let body = `<h1>${pathToBreadCrumbs(path)}</h1>`;
  
  const arrayOfFiles = getDirectoryListing(path);
  body += displayFileListing(arrayOfFiles); 

  const tail = makeHtmlFooter(unnesting);
  res.send( head + body + tail );
  
}

///////////////////////////////////////////
//
// handleMarkdown
//
// => Handles markdown files. Anything else
//    gets passed on via next().
//
///////////////////////////////////////////
function handleMarkdown(req,res,next){
  if(req.method === 'GET'){
    //console.log(req.originalUrl);
    //console.log(`BASE: ${req.baseUrl}`);
    //console.log(`PATH: ${req.path}`);
    if(req.path==='/'){
      // Fix case where originalUrl is '/docs'
      // instead of '/docs/'
      if(req.originalUrl==='/docs'){
        res.redirect(301,req.originalUrl + '/');
        return;
      }
      // Show index page:
      index(req,res,next);
    }else if(req.path.match(/\.md$/)){
      const fullPath = '.' + req.baseUrl + req.path;
      if(fs.existsSync(fullPath)){
        // We want to know the last update date:
        const stats = fs.statSync(fullPath);
        const mt    = stats.mtime;
        const lastUpdated = mt.getUTCFullYear() +
          '-' + p0(mt.getUTCMonth() + 1) +
          '-' + p0(mt.getUTCDate());
        // And read the file too:
        fs.readFile(fullPath, "utf8", (err, data) => {
          if(err){ 
            throw err;
          }
          // Calculate the unnesting depth
          // used to resolve relative paths:
          const unnesting = calculateUnnesting(fullPath);
          // Put together the HTML pieces:
          // N.B.: We now pass depth to both the header and footer
          // methods to resolve relative path specs for things like
          // CSS and Javascript inclusions:
          const head = makeHtmlHeader(req.path,lastUpdated,unnesting);
          const body = mdConverter.makeHtml(data);
          const tail = makeHtmlFooter(unnesting);
          res.send( head + body + tail );
        });
      }else{
        // .md file does not exist ... so
        // send back a "soft" 404 error page:
        const fullPath = '.' + req.baseUrl + req.path;
        sendSoft404Error(req,res,calculateUnnesting(fullPath),fullPath);
        return;
      }
    }else{
      // Check whether the the file path exists:
      const fullPath = '.' + req.baseUrl + req.path;

      if(!fs.existsSync(fullPath)){

        // Maybe it is a directory without the final forward slash:
        if(fs.existsSync(fullPath+'/')){
          fullPath += '/';
          handleDirectory(req,res,calculateUnnesting(fullPath),fullPath);
          return;
        }else{
          // Well, we tried, but neither file nor directory exist:
          // Send back a "soft" 404 error page:
          sendSoft404Error(req,res,calculateUnnesting(fullPath),fullPath); 
          return;
        }

      }
      // We get here if the path is valid, so check if it is a directory:
      if(fs.lstatSync(fullPath).isDirectory()){
        handleDirectory(req,res,calculateUnnesting(fullPath),fullPath);
        return;
      }
      // Pass on to the generic static HTML web page handler:
      next();
    }
  }
}
// END handleMarkdown


////////////////////////////////////////////////////////////////////////
//
// HTTPS SERVER LISTENING ON PORT 3000:
//
////////////////////////////////////////////////////////////////////////

// Create the HTTPS server:
//const httpsServer = https.createServer(credentials, app);

// For debugging, because some browsers will now reject
// our self-signed https credentials, so:
const httpServer  = http.createServer(app);

/////////////////////////
//
// ROUTES:
//
/////////////////////////

///////////////////////////////////////////
//
// STATIC ELEMENTS ROUTE:
//
///////////////////////////////////////////
app.use('/docs', handleMarkdown );
app.use('/docs', express.static('docs'));

///////////////////////////////////////////
//
// DEFAULT REDIRECT:
//
// Automatically redirect atomic requests
// the default route:
//
///////////////////////////////////////////
app.get('/', function(req, res) {
  res.redirect('/docs');
});

///////////////////////////////////////////
//
// GET:
//
///////////////////////////////////////////
//app.get('/status' , reportStatus );

///////////////////////////////////////////
//
// POST:
//
///////////////////////////////////////////
//app.post('/check'   , checkSyntax     );
//app.post('/convert' , handleMarkdown );


// DEV SERVER:
//httpsServer.listen(5443);

// PRODUCTION SERVER:
httpServer.listen(3000);
