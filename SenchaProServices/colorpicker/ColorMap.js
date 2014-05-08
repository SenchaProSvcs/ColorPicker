/**
 * The main colorful square for selecting color shades by dragging around the
 * little circle.
 */
Ext.define('SenchaProServices.colorpicker.ColorMap', {
    extend     : 'Ext.container.Container',
    alias      : 'widget.sps_colorpickercolormap',
    controller : 'sps_colorpickercolormapcontroller',

    requires: [
        'SenchaProServices.colorpicker.ColorMapController'
    ],

    cls  : 'sps-colorpicker-colormap',

    // This is the image with transparent PNG with black and white gradient shades;
    // it blends with the background color (which changes with hue selection)
    html : '<img class="sps-colorpicker-colormap-blender" src="resources/images/colorpicker/map_gradient.png"></img>',

    // This is the drag "circle"; note it's 1x1 in size to allow full 
    // travel around the color map; the inner div has the bigger image
    items: [{
        xtype     : 'component',
        cls       : 'sps-colorpicker-colormap-draghandle-container',
        itemId    : 'dragHandle',
        width     : 1,
        height    : 1,
        draggable : true,
        html: '<div class="sps-colorpicker-colormap-draghandle"></div>'
    }],

    listeners : {
        boxready : {
            single  : true,
            fn      : 'onFirstBoxReady',
            scope   : 'controller'
        },
        colorbindingchanged: {
            fn    : 'onColorBindingChanged',
            scope : 'controller'
        },
        huebindingchanged: {
            fn    : 'onHueBindingChanged',
            scope : 'controller'
        },
        click : {
            fn    : 'onMapClick',
            scope : 'controller'
        }
    },

    onRender: function () {
        var me = this;

        me.callParent(arguments);

        me.mon(me.el, 'click', me.onClick, me);
    },

    onClick: function (event) {
        this.fireEvent('click', event);
    },

    // Called via data binding whenever selectedColor changes; fires "colorbindingchanged"
    setPosition: function(data) {
        var me         = this,
            dragHandle = me.down('#dragHandle');

        // Too early in the render cycle? Skip event
        if (!dragHandle.dd || !dragHandle.dd.constrain) {
            return;
        }

        // User actively dragging? Skip event
        if (typeof dragHandle.dd.dragEnded !== 'undefined' && !dragHandle.dd.dragEnded) {
            return;
        }

        me.fireEvent('colorbindingchanged', data);
    },

    // Called via data binding whenever selectedColor.h changes; fires "huebindingchanged" event
    setHue: function(hue) {
        var me = this;

        // Too early in the render cycle? Skip event
        if (!me.getEl()) {
            return;
        }

        me.fireEvent('huebindingchanged', hue);
    }
});