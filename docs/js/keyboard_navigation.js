//
// keyboard_navigation.js
//
// author: Ed Trager
// init: 2021.04.08
//

//
// Named keyboard codes:
// 
const KB={
  backspace:8,
  tab:9,
  space:32,
  del:46,
  fstart:112,
  fend:123,
  enter:13,
  down:40,
  up:38,
  left:37,
  right:39,
  escape:27,
  shift:16,
  control:17,
  appleCommandKey:224,
  windowsKey:0
};

//
// handle keyup/down navigation
//
document.addEventListener('keydown',e=>{
  if(e.which===KB.down || e.which===KB.up){
    //console.log(e.target);
    //console.log(e.target.childNodes);
  }
});

