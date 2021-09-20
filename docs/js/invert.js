//////////////////////////////////////
//
// invert.js
//
// init: 2021.03.19.et
// by: Ed Trager <ed.trager@gmail.com>
// 
// desc: Use CSS filter properties
//       to toggle between dark
//       and light "theme"
//
//////////////////////////////////////

////////////////////////////
//
// toggleDarkLightMode
//
////////////////////////////
function toggleDarkLightMode(){ 

  // Initialization if never set before:
  if(typeof localStorage.inverted === undefined){
    localStorage.setItem('inverted','0');
    console.log(`INIT: ${localStorage.inverted}`);
  }

  const isInverted = localStorage.getItem('inverted')==='1';
  // DEBUG: console.log(`BEFORE TOGGLE: ${localStorage.inverted}`);
  setDarkLightModeTo(!isInverted);

}

////////////////////////////////
//
// restoreSavedDarkLightMode
//
////////////////////////////////
function restoreSavedDarkLightMode(){

  // DEBUG: console.log(`BEFORE RESTORE: ${localStorage.inverted}`);
  const isInverted = localStorage.getItem('inverted')==='1';
  setDarkLightModeTo(isInverted);

}

///////////////////////////////
//
// setDarkLightModeTo
//
///////////////////////////////
function setDarkLightModeTo(state){
  // CSS to inject:
  const cssInverted = 'body { filter:invert(100%); }';
  const cssNormal   = 'body { filter:invert(0%); }';

  const head        = document.getElementsByTagName('head')[0];
  const style       = document.createElement('style');

  let newCss;

  if(!state){
    // Normal light state:
    newCss = cssNormal;
    //head.setAttribute('inverted','0');
    localStorage.setItem('inverted','0');
    // Set img that were previously inverted back:
    // BUT EXCLUDE bw_line IMAGES (such as b&w logos)
    //for(img of document.getElementsByTagName('img')){
    for(img of document.querySelectorAll("img:not(.bw_line)")){
      img.style.filter='invert(0%)';
    }
    // Restore background to white:
    document.body.style.backgroundColor='rgba(255,255,255,1)';
  }else{
    // Dark mode:
    newCss = cssInverted;
    //head.setAttribute('inverted','1');
    localStorage.setItem('inverted','1');
    // Fix images however, so they are not inverted:
    // This requires inverting the inversion:
    // BUT EXCLUDE bw_line IMAGES
    //for(img of document.getElementsByTagName('img')){
    for(img of document.querySelectorAll("img:not(.bw_line)")){
      img.style.filter='invert(100%)';
    }
    // Make background dark, but not fully black: 
    document.body.style.backgroundColor='rgba(32,32,32,1)';
  }
  style.type = 'text/css';
  if (style.styleSheet){
    style.styleSheet.cssText = newCss
  } else {
    style.appendChild(document.createTextNode(newCss));
  }
  head.appendChild(style);
  // DEBUG: console.log(`AFTER SETTING: ${localStorage.inverted}`);
}

