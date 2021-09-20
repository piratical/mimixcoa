//////////////////////////////////////////////////////
//
// Speech.js
//
// by Edward H. Trager <ed.trager@gmail.com>
// 
// init: 2021.03.23
// last update: 2021.07.16.et
//
//////////////////////////////////////////////////////

// These are GLOBAL:
const synth = window.speechSynthesis;
let availableVoices=0; // Global but initialize in toggle
let selectedVoices=0;  // Global but initialize in toggle

// Default welcome message:
const welcomeMessage = `Welcome to Access Bee. Hover the mouse over any text
and I will read it for you.`;

// Default goodbye message:
const goodbyeMessage = 'goodbye!';

/////////////////////////////////////
//
// selectVoices()
//
// selects the preferredVoices
// if available. If not available,
// then an equivalent number of voices
// are chosen. In place of specific
// voice names, certain hints are allowed:
// 'female','male','neutral'.
// If the preferredVoices array is empty,
// then at a minimum, a female and male pair 
// are selected, if possible.
//
/////////////////////////////////////
function selectVoices(preferredVoices=[]){

  if(preferredVoices.length===0){
    preferredVoices = ['female','male'];
  }

  // The destination container:
  const selected=[];

  // Iterate over the entries to get
  // available voices:
  preferredVoices.forEach( entry=>{
    selected.push( selectVoice(entry) );
  });

  return selected;
}
// END OF selectVoices()

////////////////////////////////////////////
//
// function selectVoice
//
// => In addition to specifc named
//    voices, this accepts a limited
//    set of hints. Currently, 
//    'female' and 'male' are recognized.
//
////////////////////////////////////////////
function selectVoice(voiceNameOrHint='female'){

  console.log(`IN selectVoice() with '${voiceNameOrHint}'...`);
  // VOICE OPTIONS:

  // 1. FEMALE VOICE OPTIONS:
  const femaleVoices = [
      'Microsoft Zira - English (United States)', // Microsoft on vanilla en-US Win10
      'Microsoft Aria Online (Natural) - English (United States)', // Microsoft Edge onMac
      'Samantha', // Apple female
      'Google UK English Female', // Google Chrome browser on en-US Win10
      'English (Received Pronunciation)' // Firefox on Ubuntu Linux
    ];

  // 2. MALE VOICE OPTIONS:
  const maleVoices = [
    'Microsoft David - English (United States)', // Microsoft on vanilla en-US Win10
    'Microsoft Guy Online (Natural) - English (United States)', // Microsoft Edge onMac
    'Tom',   // Apple male
    'Google UK English Male', // Google Chrome browser on en-US Win10
    'English (Scotland)' // Firefox on Ubuntu Linux
  ];

  // 3. NEUTRAL VOICE OPTIONS: TODO!
  const neutralVoices = [
    '',
    '',
    ''
  ];

  console.log(`There are ${availableVoices.length} available voices`);
  for(let i=0;i<availableVoices.length;i++){
    console.log(`${availableVoices[i].name} :: ${availableVoices[i].lang}`);
  }

  let optionArray;
  switch(voiceNameOrHint){
    case 'female':
      optionArray=femaleVoices;
      break;
    case 'male':
      optionArray=maleVoices;
      break;
    default:
      // Here we assume a named voice, could be male or
      // female or neutral. Currently, we are only
      // handling male and female, pending further research:
      optionArray= [ ...femaleVoices, ...maleVoices ];
      break;
  }

  
  // Select one of the options:
  for(let j=0;j<availableVoices.length;j++){
    for(let i=0;i<optionArray.length;i++){
      if(optionArray[i] === availableVoices[j].name){
        return availableVoices[j];
      }
    }
  } 

  // Nothing available:
  return '';

}
// END OF selectVoice

/////////////////////////////////////////////////////////
//
// speak
//
// event: an event object, or false (default)
//
/////////////////////////////////////////////////////////
function speak(text,options={event:false}){

  if (synth.speaking) {
    //DEBUG: console.error('speechSynthesis.speaking');
    return;
  }
  
  if ( text === '' ){
    //console.log('Nothing to say!');
    return;
  } 
     
  const sayThis = new SpeechSynthesisUtterance(text);

  // Save custom options on the SpeechSynthesisUtterance object:
  sayThis.options=options;

  console.log(`Tagname is ${event.target.tagName} ...`);
  if(options.event && options.event.target && options.event.target.tagName.match( /^(A|SUMMARY)$/ ) ){
    switch(options.event.target.tagName){
      case 'A':
      case 'SUMMARY':
        sayThis.pitch = 1.0;
        sayThis.rate  = 1.0;
        sayThis.lang  = 'en-US';
        sayThis.voice = selectedVoices[1];
        break;
      default:
        sayThis.pitch = 1.0;
        sayThis.rate  = 1.0;
        sayThis.lang  = 'en-US';
        sayThis.voice = selectedVoices[0];
        break;
    }
  }else{
    // Default voicing:
    sayThis.pitch = 1.0;
    sayThis.rate  = 1.0;
    sayThis.lang  = 'en-US';
    sayThis.voice = selectedVoices[0];
  }
  //////////////////////////////////////
  //
  // onend event handler:
  //
  //////////////////////////////////////
  sayThis.onend = function (event) {

    // We play a brief tick, click, or tone to indicate that
    // certain elements are clickable
    // if(this.options.event.target.tagName==='SUMMARY'){
    let audioIndicator=0;
    switch(this.options.event.target.tagName){
      case 'SUMMARY':
        const openSoundURL     = '/docs/sounds/clave_wood_bell.mp3' ; // 'tock' sound
        const closedSoundURL   = '/docs/sounds/olivewood_mortar.mp3'; // 'tick' sound
        // Sound depends on whether the <details> parent node is expanded or not:
        const summaryTagSoundURL = this.options.event.target.parentNode.open ? openSoundURL : closedSoundURL ;
        audioIndicator = new Audio(summaryTagSoundURL);
        break;
      case 'A':
        const linkSoundURL    = '/docs/sounds/cava_glass.mp3' ; // glass 'ting' sound
        audioIndicator = new Audio(linkSoundURL);
        break;
    }
    // Play audio if an indicator was set up:
    if(audioIndicator){
      audioIndicator.addEventListener("canplaythrough", event => {
        /* the audio is now playable; play it if permissions allow */
        audioIndicator.play();
      });
    }

    //  const voc = new SpeechSynthesisUtterance('Click to expand');
    //  voc.pitch = 1.5;
    //  voc.rate  = 1.5;
    //  synth.speak(voc);
    //}
  }
  // END OF sayThis.onend

  sayThis.onerror = function (event) {
    //console.error('SpeechSynthesisUtterance.onerror');
  }
 
  // Say the text:
  synth.speak(sayThis);
}

// TESTING:
counter = 0;
voiceArray=[
  'Samantha',
  'Microsoft Aria Online (Natural) - English (United States)',
  'Microsoft Guy Online (Natural) - English (United States)',
  'Google US English',
  'Google UK English Female'
];

///////////////////////////
//
// printVoiceList
//
///////////////////////////
function printVoiceList(){
  // DEBUG:
  const vList = synth.getVoices();
  for(let i=0;i<vList.length;i++){
    console.log(`${vList[i].name} :: ${vList[i].lang}`);
  }
}

///////////////////////////
//
// saySomething 
// => for testing
///////////////////////////
function saySomething(){

  // DEBUG:
  const vList = synth.getVoices();
  for(let i=0;i<vList.length;i++){
    console.log(`${vList[i].name} :: ${vList[i].lang}`);
  }

  const thisVoice = voiceArray[counter];
  console.log(`=> ${thisVoice} is speaking`);
  speak(inputText,{voiceName:thisVoice});
  counter++;
  if(counter>4){
    counter=0;
  }
}



//////////////////////////////////
//
// toggleSpeech
//
//////////////////////////////////
function toggleSpeech(){
  // INITIALIZED ON DEMAND:
  if(!localStorage.getItem('speak')){
    localStorage.setItem('speak','0');
  }

  console.log(localStorage);

  // TOGGLE FUNCTIONALITY:
  let speaking = localStorage.getItem('speak')==='1';
  // toggle it:
  speaking = !speaking;
  localStorage.setItem('speak',speaking?'1':'0');

  // DEBUG:
  if(speaking){
    // Get available voices from system:
    availableVoices = synth.getVoices();
    // On some platforms, no voices are available
    // (For example, the Snap package of the Brave browser
    // on Ubuntu registers no voices), so we have:
    if(availableVoices.length===0){
      localStorage.setItem('speak','0');
      alert('Unfortunately, no voices are available on this browser on this operating system at this time. You may want to try a different browser.');
      return;
    } 
    
    selectedVoices  = selectVoices();
    // Also check if any voices could be selected:
    if(selectedVoices.length===0){
      localStorage.setItem('speak','0');
      alert('Unfortunately, AccessBee was not able to select voices for you. Please report this to the developers!');
      return;
    }
    // DEBUG: Print the available list in console:
    printVoiceList();
    // ... as well as what was chosen (or not, as the case may be):
    console.log(selectedVoices);
  }

  // Get current voice from storage:
  if(speaking){
    speak(welcomeMessage);
    //speak(inputSSML); // Does not work correctly even on MS Edge
  }else{
    speak(goodbyeMessage);
  }

}

///////////////////////////////////////
//
// activateNodeList
//
///////////////////////////////////////
function activateNodeList(nodeList){

  for(let i=0;i<nodeList.length;i++){
  
    const currentNode = nodeList[i];

    // Activate on mouse over:
    currentNode.addEventListener("mouseover", event=>{
      const speaking = localStorage.getItem('speak')==='1';
      if(!speaking){
        return;
      }
      // SPEAK:
      //console.log(event.target.tagName);
      
      speak(event.target.textContent,{event:event});

    });

    //Cancel on mouse leave:
    currentNode.addEventListener("mouseout", event=>{
      synth.cancel();
    });
  }
};

///////////////////////////////////////////////////////////
//
// Now enable all headers, paragraphs, li, ul, and code.
// We now also look for <details> and <summary> elements:
//
///////////////////////////////////////////////////////////
const readableTags=['h1','h2','p','li','code','details','summary'];
readableTags.forEach(tag=>{
  activateNodeList(document.getElementsByTagName(tag));
});


