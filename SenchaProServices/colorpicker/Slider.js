/**
 * View for the 4 sliders seen on the color picker window.
 */
Ext.define('SenchaProServices.colorpicker.Slider', {
    extend     : 'Ext.container.Container',
    alias      : 'widget.sps_colorpickerslider',
    controller : 'sps_colorpickerslidercontroller',
    
    baseCls : 'sps-colorpicker-slider',
    layout  : 'center',

    requires: [
        'Ext.layout.container.Center',
        'SenchaProServices.colorpicker.SliderController'
    ],

    // Container for the drag handle; needed since the slider
    // is of static size, while the parent container positions
    // it in the center; this is what receives the beautiful
    // color gradients for the visual
    items: [{
        xtype  : 'container',
        cls    : 'draghandle-container',
        itemId : 'dragHandleContainer',
        height : '100%',

        // This is the drag handle; note it's 100%x1 in size to allow full 
        // vertical drag travel; the inner div has the bigger image
        items: [{
            xtype     : 'component',
            cls       : 'draghandle-outer',
            itemId    : 'dragHandle',
            width     : '100%',
            height    : 1,
            draggable : true,
            html: '<div class="draghandle"></div>'
        }]
    }],

    listeners : {
        boxready: {
            single  : true,
            fn      : 'onFirstBoxReady',
            scope   : 'controller'
        }
    },

    // <debug>
    // Called via data binding whenever selectedColor.h changes;
    setHue: function(hue) {
        Ext.Logger.warn('Must implement setHue() in a child class!');
    },
    // </debug>

});