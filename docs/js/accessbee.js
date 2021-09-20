///////////////////////////////
//
// accessbee.js
//
// by Edward H. Trager <ed.trager@gmail.com>
//
// last update: 2021.07.16.et
//
//////////////////////////////


class AccessBeeWidget{

  constructor(parent=document.getElementById('access_bee')){

    this.widget = document.createElement('div');
    this.widget.setAttribute('class','accessbee_widget');
    this.darkModeIcon   = this._makeIconDiv(this.widget);
    this.smallTextIcon  = this._makeIconDiv(this.widget);
    this.mediumTextIcon = this._makeIconDiv(this.widget);
    this.bigTextIcon    = this._makeIconDiv(this.widget);
    this.speechIcon     = this._makeIconDiv(this.widget);
    this.scrollTimer; 
    
    // Add SVGs:

    // darkMode using yinyang icon:
    this._makeSVGIcon(
      [
      'M28.374 28.779A21.515 21.515 0 006.95 50.247a43.164 43.164 0 00-.001.133 43.164 43.164 0 0043.164 43.164A43.164 43.164 0 0093.277 50.38a43.164 43.164 0 000-.133h-.033a21.632 21.515 0 01-21.632 21.467 21.632 21.515 0 01-.091 0 21.632 21.515 0 01-21.542-21.467 21.515 21.515 0 00-21.514-21.468 21.515 21.515 0 00-.09 0z',
      'M50.113 7.216A43.164 43.164 0 006.95 50.246h.001A21.515 21.515 0 0128.374 28.78a21.515 21.515 0 01.09 0A21.515 21.515 0 0149.98 50.247a21.632 21.515 0 0021.542 21.467 21.632 21.515 0 00.09 0 21.632 21.515 0 0021.633-21.467h.032a43.164 43.164 0 00-43.163-43.03z', 
      ],
      [null,'#fff'],
      this.darkModeIcon
    );

    // smallText Icon:
    this._makeSVGIcon(
      [
        'M30.101 69.516v-1.76q2.045-.026 2.537-.155.517-.155.931-.544.44-.414 1.243-2.096.466-.958 3.364-7.273l6.47-14.597q1.062-2.407 4.53-10.715h1.683l11.051 25.96q2.692 6.314 3.572 7.919.492.906 1.061 1.19.595.285 2.64.311v1.76q-4.038-.259-5.642-.259l-8.334.26v-1.76q2.898-.053 3.52-.182.62-.13.828-.362.233-.26.233-.622 0-.569-.363-1.475l-3.183-7.92H41.256l-2.82 6.652q-.751 1.786-.751 2.614 0 .362.207.595.284.337.88.466.957.207 3.364.233v1.76q-4.374-.233-6.548-.233-2.51 0-5.487.233zm12.035-14.52h13.07l-6.47-15.606z'
      ],
      null,
      this.smallTextIcon
    );
    // mediumText Icon:
    this._makeSVGIcon(
      [
        'M17.76 81.244v-2.872q3.337-.042 4.139-.253.844-.253 1.52-.887.718-.676 2.027-3.42.76-1.563 5.49-11.866L41.492 38.13q1.732-3.927 7.39-17.482h2.745l18.03 42.354q4.392 10.303 5.828 12.921.802 1.478 1.731 1.943.971.464 4.307.506v2.872q-6.587-.423-9.205-.423l-13.597.423v-2.872q4.73-.084 5.743-.295 1.013-.211 1.351-.592.38-.422.38-1.013 0-.929-.591-2.407L60.41 61.144H35.96l-4.602 10.852q-1.225 2.914-1.225 4.265 0 .591.338.971.465.55 1.436.76 1.562.338 5.49.38v2.872q-7.137-.38-10.684-.38-4.096 0-8.952.38zm19.636-23.69h21.325L48.164 32.092z'
      ],
      null,
      this.mediumTextIcon
    );
    //
    // bigText Icon:
    //
    this._makeSVGIcon(
      [
        'M4.65 93.704v-4.052q4.707-.06 5.84-.358 1.191-.357 2.145-1.251 1.013-.954 2.86-4.827 1.073-2.205 7.747-16.746l14.899-33.61q2.443-5.543 10.428-24.672h3.874L77.889 67.96q6.198 14.54 8.224 18.235 1.132 2.086 2.443 2.742 1.371.655 6.079.715v4.052q-9.297-.596-12.991-.596l-19.19.596v-4.052q6.675-.12 8.105-.417 1.43-.298 1.907-.835.537-.596.537-1.43 0-1.311-.835-3.397l-7.33-18.235H30.334l-6.496 15.315q-1.728 4.112-1.728 6.019 0 .834.477 1.37.655.775 2.026 1.073 2.205.477 7.747.537v4.052q-10.071-.536-15.077-.536-5.78 0-12.634.536zm27.71-33.432h30.095L47.556 24.337z'
      ],
      null,
      this.bigTextIcon
    );
    //
    // speech Icon:
    //
    this._makeSVGIcon(
      [
        'M77.204 6.523l-7 5.57c6.107 7.571 9.76 17.21 9.76 27.727 0 10.356-3.542 19.863-9.483 27.382l7.002 5.569c7.184-9.065 11.48-20.517 11.48-32.951 0-12.594-4.408-24.178-11.759-33.297zM63.28 17.602l-7 5.57c3.685 4.53 5.89 10.32 5.89 16.648 0 6.167-2.094 11.824-5.613 16.303l7 5.57c4.764-6.025 7.613-13.627 7.613-21.873 0-8.405-2.961-16.14-7.89-22.218zm-27.485 4.444A17.773 17.773 0 0018.04 39.819a17.773 17.773 0 0017.773 17.773A17.773 17.773 0 0053.586 39.82a17.773 17.773 0 00-17.773-17.773 17.773 17.773 0 00-.019 0zM22.45 64.63a11.864 11.864 0 00-11.884 11.52h-.01v13.557a2.639 2.639 0 002.645 2.645h45.226a2.639 2.639 0 002.644-2.645V76.152h-.01A11.864 11.864 0 0049.176 64.63H22.45z'
      ],
      null,
      this.speechIcon
    );

    // EVENT LISTENERS:
   
    // DARK-LIGHT MODE 
    // toggleDarkLightMode is in invert.js
    this.darkModeIcon.addEventListener('mouseup',toggleDarkLightMode);

    // SMALL TEXT:
    this.smallTextIcon.addEventListener('mouseup',event=>{
      const content = document.getElementById('content');
      content.style.fontSize='70%';
    });
    
    // MEDIUM TEXT (DEFAULT):
    this.mediumTextIcon.addEventListener('mouseup',event=>{
      const content = document.getElementById('content');
      content.style.fontSize='100%';
    });

    // BIG TEXT:
    this.bigTextIcon.addEventListener('mouseup',event=>{
      const content = document.getElementById('content');
      content.style.fontSize='150%';
    });

    // SPEECH: toggleSpeech is in speech.js:
    this.speechIcon.addEventListener('mouseup',toggleSpeech);
    
    // FINALLY ADD TO THE DOM TREE IF
    // PARENT WAS GIVEN:
    if(parent){
      parent.appendChild(this.widget);
      //
      // 2021.04.08.et addendum:
      //
      // Work around cross-browser
      // bugs and inconsistencies in css 'fixed'
      // by just 'fixing' the position
      // via javascript:
      //
      document.addEventListener('scroll', function(e) {

        // Fade out when beginning to scroll:
        parent.classList.add('fadeOut');

        // Clear the timer as long as we continue to scroll:
        window.clearTimeout(this.scrollTimer);

        // Keep always at 120px from top edge of view port:
        parent.style.top = (120 + window.pageYOffset) + 'px';

        // Set timer to run. It will run after the last scrolling event:
        this.scrollTimer = setTimeout( () => {
          parent.classList.remove('fadeOut');
	},300);

      });

      
    }    
  }
  // END OF CONSTRUCTOR

  //
  // _makeIconDiv
  //
  _makeIconDiv(parent){
    const div = document.createElement('div');
    div.setAttribute('class','accessbee_icon');
    if(parent){
      parent.appendChild(div);
    }
    return div;
  }

  //
  // makeSVGIcon
  //
  _makeSVGIcon(pathArray,fillArray,parent){
    // Create SVG:
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 100 100');
    // Add paths to SVG:
    for(let i=0;i<pathArray.length;i++){
      const node = document.createElementNS('http://www.w3.org/2000/svg','path');
      node.setAttribute('d',pathArray[i]);
      if(fillArray && fillArray[i]){
        node.setAttribute('fill',fillArray[i]);
      }
      svg.appendChild(node);
    }
    if(parent){
      parent.appendChild(svg);
    }
    return svg;
  }
  // END OF _makeSVGIcon
  
}

