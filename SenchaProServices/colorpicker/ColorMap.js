/**
 * The main colorful square for selecting colors by dragging around the
 * little circle.
 */
Ext.define('SenchaProServices.colorpicker.ColorMap', {
    extend     : 'Ext.container.Container',
    alias      : 'widget.sps_colorpickercolormap',
    controller : 'sps_colorpickercolormapcontroller',

    requires: [
        'SenchaProServices.colorpicker.ColorMapController'
    ],

    style : 'background-color: red;',
    html  : '<img src="/sencha/ColorPickerRepo/resources/images/colorpicker/map_gradient.png" style="position:absolute; top: 0; left: 0; width: 100%; height: 100%;"/>',
    items: [{
        xtype     : 'component',
        itemId    : 'dragHandle',
        width     : 1,
        height    : 1,
        style     : 'overflow: visible; z-index: 1;',
        draggable : true,
        html: '<div style="width: 15px; height: 15px; position: relative; left: -7px; top: -7px; background: url(/sencha/ColorPickerRepo/resources/images/colorpicker/drag_circle_black.png);"></div>'
    }],

    listeners : {
        boxready : {
            single  : true,
            fn      : 'onFirstBoxReady',
            scope   : 'controller'
        },
        colorbindingchanged: {
            fn: 'onColorBindingChanged',
            scope   : 'controller'
        }
    },

    // Called via data binding whenever selected color changes; fires "colorbindingchanged"
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
    }
});