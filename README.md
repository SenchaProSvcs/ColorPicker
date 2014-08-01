# Setup Instructions

All you need to do is setup references in index.html to point to your ExtJS 5 (as in raw SDK) folder:

    <script type="text/javascript" src="/SDK/ext/examples/shared/include-ext.js"></script>
    <script type="text/javascript" src="/SDK/ext/examples/shared/options-toolbar.js"></script>

...make sure you run "sencha ant bootstrap" from "ext" folder (from ExtJS5 repo), otherwise some files will be missing.

# NEW IMPLEMENTATION

## Supported Platforms
Verified this working using:
* ExtJS5 from repo tag 5.0.0 (aka GA)
* Tested in Chrome
* Tested in FireFox
* Tested in IE8
* TODO: Test in Ext5 target platforms (IE9, IE10, IE11, Safari, Opera, Tablets, etc.)

## TODO Features
* IE8 - color preview opacity disappears at near-0 alpha
* Implement format config (which would drive value) in both button and cp
* Putting blank value in any of the fields breaks it
* Previous color doesn't reflect opacity
* Also implement "color field" with arrow (?) trigger which would have that button as well as HEX in text field
* Move to SDK examples
* Color swatches & saving in local storage

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