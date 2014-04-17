All you need to do is setup references in index.html to point to your ExtJS 5 folder:

    <script type="text/javascript" src="/SDK/ext/examples/shared/include-ext.js"></script>
    <script type="text/javascript" src="/SDK/ext/examples/shared/options-toolbar.js"></script>

...make sure you run "sencha ant bootstrap" from "ext" folder, otherwise some files will be missing.