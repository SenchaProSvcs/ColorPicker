/**
 * Used for "Value" slider
 */
Ext.define('SenchaProServices.colorpicker.SliderValue', {
    extend : 'SenchaProServices.colorpicker.Slider',
    alias  : 'widget.sps_colorpickerslidervalue',
    cls    : 'value',

    requires: [
        'Ext.XTemplate'
    ],

    gradientStyleTpl: Ext.create('Ext.XTemplate',
        Ext.isIE && Ext.ieVersion < 10
        ? 'filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=\'#{hex}\', endColorstr=\'#000000\');' /* IE6-9 */
        : 'background: -moz-linear-gradient(top, #{hex} 0%, #000000 100%);' +   /* FF3.6+ */
          'background: -webkit-linear-gradient(top, #{hex} 0%,#000000 100%);' + /* Chrome10+,Safari5.1+ */
          'background: -o-linear-gradient(top, #{hex} 0%,#000000 100%);' +      /* Opera 11.10+ */
          'background: -ms-linear-gradient(top, #{hex} 0%,#000000 100%);' +     /* IE10+ */
          'background: linear-gradient(to bottom, #{hex} 0%,#000000 100%);'     /* W3C */
    ),

    // Called via data binding whenever selectedColor.v changes; value param is 0-100
    setValue: function(value) {
        var view            = this,
            vm              = view.getController().getViewModel(),
            rgba            = vm.get('selectedColor'),
            container       = view.down('#dragHandleContainer'),
            dragHandle      = container.down('#dragHandle'),
            containerEl     = container.getEl(),
            containerHeight = containerEl.getHeight(),
            yRatio,
            top;

        // Too early in the render cycle? Skip event
        if (!dragHandle.dd || !dragHandle.dd.constrain) {
            return;
        }

        // User actively dragging? Skip event
        if (typeof dragHandle.dd.dragEnded !== 'undefined' && !dragHandle.dd.dragEnded) {
            return;
        }

        // y-axis of slider with value 0-1 translates to reverse of "value"
        yRatio = 1-(value/100);
        top = containerHeight*yRatio;

        // Position dragger
        dragHandle.getEl().setStyle({
            top  : top + 'px'
        });
    },

    // Called via data binding whenever selectedColor.h changes; hue param is 0-1
    setHue: function(hue) {
        var me = this,
            fullColorRGB,
            hex;

        // Too early in the render cycle? Skip event
        if (!me.getEl()) {
            return;
        }

        // Determine HEX for new hue and set as background based on template
        fullColorRGB = SenchaProServices.colorpicker.ColorUtils.hsv2rgb(hue, 1, 1);
        hex = SenchaProServices.colorpicker.ColorUtils.rgb2hex(fullColorRGB.r, fullColorRGB.g, fullColorRGB.b);
        me.down('#dragHandleContainer').getEl().applyStyles(me.gradientStyleTpl.apply({hex: hex}));
    }
});