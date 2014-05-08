/**
 * A button (not extending from button) that can be clicked to bring up the
 * color picker. It also changes its color based on the color picker selection.
 */
Ext.define('SenchaProServices.colorpicker.Button', {
    extend     : 'Ext.Component',
    alias      : 'widget.sps_colorpickerbutton',
    controller : 'sps_colorpickerbuttoncontroller',

    requires: [
        'SenchaProServices.colorpicker.ButtonController',
        'SenchaProServices.colorpicker.ColorUtils'
    ],

    baseCls : 'sps-colorpicker-button',
    width   : 20,
    height  : 20,

    config : {
        color   : undefined
    },
    

    listeners: {
        afterrender : {
            single  : true,
            fn      : 'onFirstRender',
            scope   : 'controller'
        },
        click: {
            fn    : 'onButtonClick',
            scope : 'controller'
        }
    },

    setColor : function (color) {
        var me = this,
            ColorUtils = SenchaProServices.colorpicker.ColorUtils,
            el = me.getEl();

        if (color && typeof color === 'string'){
            color = ColorUtils.colorFromString(color);
        }


        if (el) {
            me.applyBgStyle(color, el);
        }

        this.color = color;
    },

    bgStyleTpl: Ext.create('Ext.XTemplate',
        Ext.isIE && Ext.ieVersion < 9 ?
          // 'filter: progid:DXImageTransform.Microsoft.Alpha(Opacity={alpha});'+
          // '-ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity={alpha});'+
          'background-color: #{hex}' /* IE6-9 */
        : 'background: {rgba};'
    ),

    applyBgStyle: function (color, el) {
        var ColorUtils = SenchaProServices.colorpicker.ColorUtils,
            style = {},
            hex, alpha, rgba;

        hex = ColorUtils.rgb2hex(color.r, color.g, color.b);
        alpha = color.a;
        rgba = ColorUtils.getRGBAString(color);

        el.applyStyles(this.bgStyleTpl.apply({hex: hex, alpha: alpha, rgba: rgba}));
    }
});