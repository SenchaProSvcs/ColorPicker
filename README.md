## Setup Instructions

All you need to do is setup references in index.html to point to your ExtJS 5 folder:

    <script type="text/javascript" src="/SDK/ext/examples/shared/include-ext.js"></script>
    <script type="text/javascript" src="/SDK/ext/examples/shared/options-toolbar.js"></script>

...make sure you run "sencha ant bootstrap" from "ext" folder (from ExtJS5 repo), otherwise some files will be missing.

# NEW IMPLEMENTATION

## Supported Platforms

Verified this working using:
* ExtJS5 from repo branch sencha-5.0.x
* Codebase from April 17, 2014
* Tested in Chrome
* Tested in FireFox
* Tested in IE8
* TODO: Test in Ext5 target platforms (IE9, IE10, IE11, Safari, Opera, Tablets, etc.)

# TODO Features
* ~~Hue Slider background in IE8~~
* ~~Alpha slider~~
* ~~"Last Color" (on right)~~
* ~~ColorMap drag handle needs to be black & white circle so it's visible in the dark colors~~
* ~~Drag functionality (on ColorMap & sliders) needs to work by clicking anywhere on the surface, not just drag handle~~
  * Currently we can click anywhere and it will work, but we cannot continue dragging from that point (it's a one-time click deal); I tried to "tie it in" to the normal drag behavior if the mouse continues to move, but so far have not succeeded
* Color swatches & saving in local storage
* ~~Actual button (that opens the window) should change its color based on selection~~
* ~~Also that actual button should re-use one instance of color picker window~~
* Also implement "color field" which would have that button as well as HEX in text field
* Color picker window should close on click outside of it


# OLD IMPLEMENTATION

## Supported Platforms

Verified this working using:
* ExtJS5 from repo branch sencha-5.0.x
* Codebase from April 17, 2014
* Tested in Chrome
* Tested in Safari
* Tested in IE11

Verified issues in:
* FireFox (mostly works, but swatches don't work)
* IE10 (mostly works, but swatches don't work)
* IE9 (shows visual, but functionality doesn't work)
* IE8 (doesn't even show initial buttons, plus the use of Canvas will require polyfil that should be in latest ExtJS5)