/**
 * Used for "Hue" slider
 */
Ext.define('Ext.ux.colorpicker.SliderHue', {
    extend : 'Ext.ux.colorpicker.Slider',
    alias  : 'widget.colorpickersliderhue',
    cls    : 'hue',

    // Called via data binding whenever selectedColor.h changes; hue param is 0-1
    setHue: function(hue) {
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

        // y-axis of slider with value 0-1 translates to reverse of "hue"
        yRatio = 1-hue;
        top = containerHeight*yRatio;

        // Position dragger
        dragHandle.getEl().setStyle({
            top  : top + 'px'
        });
    }
});