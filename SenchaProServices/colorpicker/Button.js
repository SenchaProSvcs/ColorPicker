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

    //hack to solve issue with IE, when applying a filter the click listener is not being fired.
    style: 'position: relative',
    html: '<a class="btn" style="height:100%; width:100%; position: absolute;"></a>',
    //eo hack
    
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
        Ext.isIE && Ext.ieVersion < 10 ?
          'filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=\'#{hexAlpha}{hex}\', endColorstr=\'#{hexAlpha}{hex}\');' /* IE6-9 */
        : 'background: {rgba};'
    ),

    applyBgStyle: function (color, el) {
        var ColorUtils = SenchaProServices.colorpicker.ColorUtils,
            style = {},
            hex, alpha, rgba, bgStyle;

        hex = ColorUtils.rgb2hex(color.r, color.g, color.b);
        alpha = Math.floor(color.a * 255).toString(16) ;
        rgba = ColorUtils.getRGBAString(color);

        bgStyle = this.bgStyleTpl.apply({hex: hex, hexAlpha: alpha, rgba: rgba});

        el.applyStyles(bgStyle);
    }
});