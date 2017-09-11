var segs = [];
segs.push.apply(segs, document.getElementsByClassName('seg'));
var numSegs = segs.length;

var textSegs = [];
textSegs.push.apply(textSegs, document.getElementsByClassName('text-seg'));
var numTextSegs = textSegs.length;

var notes = [];
notes.push.apply(notes, document.getElementsByClassName('note'));
var numNotes = notes.length;

// Temporary for playing with color

var hue = 43;
var sat = 100;

var nps = []
nps.push.apply(nps, document.getElementsByClassName('np'));

//

// For older browsers that don't have nextElementSibling
function getNextElementSibling(el) {
  if (el.nextElementSibling) {
    return el.nextElementSibling;
  } else {
    do {
      el = el.nextSibling;
    } while (el && el.nodeType !== 1);
    return el;
  }
}

// Should this go here or elsewhere?
function getNextSeg(el) {
  do {
    el = getNextElementSibling(el);
  } while (el && el.classList.contains('seg') !== true);
  return el;
}

// Indentation

// In FF, first rect empty if wrap pushes span to start on new line 
function getSegLeft(seg) {
  var rects = seg.getClientRects();
  for (var i = 0; i < rects.length; i += 1) {
    if (rects[i].width) {
      return rects[i].left;
    }
  }
}

function getTextLeft() {
  var textLeft = getSegLeft(textSegs[0]);
  return textLeft;
}

function indent(arrayOrSeg) {
  var segLeft;
  var segIndent;
  var textLeft = getTextLeft();
  var sgs = [].concat(arrayOrSeg || []).reverse(); // Bottom-up
  for (var i = 0; i < sgs.length; i += 1) { // Does top seg, no need
    segLeft = getSegLeft(sgs[i]);
    segIndent = segLeft - textLeft;
    if (segIndent) {
      sgs[i].style.marginLeft = segIndent + 'px';
    }
  }
}

// Show and hide notes

function hideNotes(arrayOrNote) {
  var nts = [].concat(arrayOrNote || []);
  for (var i = 0; i < nts.length; i += 1) {
    if (getNextSeg(nts[i])) {
      getNextSeg(nts[i]).style.marginLeft = '';
    }
    nts[i].classList.add('hide');
  }
}

function showNotes(arrayOrNote) {
  var nts = [].concat(arrayOrNote || []);
  hideNotes(notes);
  // For each note to be shown...
  for (var i = 0; i < nts.length; i += 1) {
    // ...indent seg underneath...
    indent(getNextSeg(nts[i]));
    // ...and show that note
    nts[i].classList.remove('hide');
  }
}

// Playing with color

function changeColor() {
  for (var i = 0; i < nps.length; i += 1) {
    var cssText = 'hsla(' + hue + ', ' + sat + '%, 50%, 0.055)'
    console.log(cssText);
    nps[i].style.background = cssText;
  }
}

// Event handlers

function handleKeydown(e) {
  switch(e.keyCode) {
    case 37:
      if (hue > 0) {
        hue -= 1;
      } else {
        hue = 359;
      }
      changeColor();
      break;
    case 38:
      e.preventDefault();
      if (sat < 100) {
        sat += 1;
      }
      changeColor();
      break;
    case 39:
      if (hue < 359) {
        hue += 1;
      } else {
        hue = 0;
      }
      changeColor();
      break;
    case 40:
      e.preventDefault();
      if (sat > 0) {
        sat -= 1;
      }
      changeColor();
      break;
  }
}

// Event listeners

window.addEventListener('keydown', handleKeydown, false);
