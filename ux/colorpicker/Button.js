/**
 * A button (not extending from button) that can be clicked to bring up the
 * color picker. It also changes its color based on the color picker selection.
 */
Ext.define('Ext.ux.colorpicker.Button', {
    extend     : 'Ext.Component',
    alias      : 'widget.colorpickerbutton',
    controller : 'colorpickerbuttoncontroller',

    requires: [
        'Ext.ux.colorpicker.ButtonController',
        'Ext.ux.colorpicker.ColorUtils'
    ],

    baseCls : 'x-colorpicker-button',

    width   : 20,
    height  : 20,

    config : {
        color   : undefined
    },

    //hack to solve issue with IE, when applying a filter the click listener is not being fired.
    style: 'position: relative',
    html: '<div class="filter" style="height:100%; width:100%; position: absolute;"></div>'+
          '<a class="btn" style="height:100%; width:100%; position: absolute;"></a>',
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
            ColorUtils = Ext.ux.colorpicker.ColorUtils,
            el = me.getEl();

        if (color && typeof color === 'string'){
            color = ColorUtils.colorFromString(color);
        }

        if (el) {
            me.applyBgStyle(color);
        }

        this.color = color;
    },

    bgStyleTpl: Ext.create('Ext.XTemplate',
        Ext.isIE && Ext.ieVersion < 10 ?
          'filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=\'#{hexAlpha}{hex}\', endColorstr=\'#{hexAlpha}{hex}\');' /* IE6-9 */
        : 'background: {rgba};'
    ),

    applyBgStyle: function (color) {
        var ColorUtils = Ext.ux.colorpicker.ColorUtils,
            me = this,
            style = {},
            el = me.getEl().down('.filter'),
            hex, alpha, rgba, bgStyle;

        hex = ColorUtils.rgb2hex(color.r, color.g, color.b);
        alpha = Math.floor(color.a * 255).toString(16) ;
        rgba = ColorUtils.getRGBAString(color);

        bgStyle = me.bgStyleTpl.apply({hex: hex, hexAlpha: alpha, rgba: rgba});

        el.applyStyles(bgStyle);
    }
});