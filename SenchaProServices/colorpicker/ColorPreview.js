/**
 * A basic component that changes background color.
 */
Ext.define('SenchaProServices.colorpicker.ColorPreview', {
    extend     : 'Ext.Component',
    alias      : 'widget.sps_colorpickercolorpreview',

    //hack to solve issue with IE, when applying a filter the click listener is not being fired.
    style: 'position: relative',
    html: '<a class="btn" style="height:100%; width:100%; position: absolute;"></a>',
    //eo hack


    onRender: function () {
        var me = this;

        me.callParent(arguments);

        me.mon(me.el.down('.btn'), 'click', me.onClick, me);
    },

    onClick: function () {
        this.fireEvent('click', this, this.color);
    },

    // Called via databinding - update background color whenever
    // Window's ViewModel changes
    setColor: function(color) {
        var me = this,
            el = me.getEl();

        // Too early in rendering cycle; skip
        if (!el) {
            return;
        }
        me.color = color;

        me.applyBgStyle(color, el);
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
