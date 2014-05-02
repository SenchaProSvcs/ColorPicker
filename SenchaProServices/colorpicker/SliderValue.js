/**
 * Used for "Value" slider
 */
Ext.define('SenchaProServices.colorpicker.SliderValue', {
    extend : 'SenchaProServices.colorpicker.Slider',
    alias  : 'widget.sps_colorpickerslidervalue',
    cls    : 'value',

    // Called via data binding whenever selectedColor.v changes; value param is 0-100
    setValue: function(value) {
        var view       = this,
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

    // Called via data binding whenever selectedColor.h changes; fires "huebindingchanged" event
    setHue: function(hue) {
        var me = this;

        // Too early in the render cycle? Skip event
        if (!me.getEl()) {
            return;
        }

        console.log('setting HUE! for VALUE', hue);

        // var me            = this,
        //     vm            = me.getViewModel(),
        //     fullColorRGB,
        //     hex;

        // fullColorRGB = SenchaProServices.colorpicker.ColorUtils.hsv2rgb(hue, 1, 1);
        // hex = SenchaProServices.colorpicker.ColorUtils.rgb2hex(fullColorRGB.r, fullColorRGB.g, fullColorRGB.b);
        // me.getView().getEl().setStyle({ 'background-color': '#' + hex });
    }
});