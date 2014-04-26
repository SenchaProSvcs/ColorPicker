Ext.define('SenchaProServices.colorpicker.ColorMapController', {
    extend : 'Ext.app.ViewController',
    alias: 'controller.sps_colorpickercolormapcontroller',

    // Configure draggable constraints after the component is rendered.
    onFirstBoxReady: function() {
        var me         = this,
            colorMap   = me.getView(),
            dragHandle = colorMap.down('#dragHandle'),
            dd         = dragHandle.dd;

        dd.constrain = true;
        dd.constrainTo = colorMap.getEl();
        dd.initialConstrainTo = dd.constrainTo; // needed otheriwse error EXTJS-13187
        dd.onDrag = Ext.Function.createSequence(dd.onDrag, Ext.bind(me.onHandleDrag, me));
    },

    // Fires when handle is dragged; propagates "handledrag" event on the ColorMap
    // with parameters "percentX" and "percentY", both 0-1, representing the handle
    // position on the color map, relative to the container
    onHandleDrag: function(e) {
        var me              = this,
            container       = me.getView(), // the Color Map
            dragHandle      = container.down('#dragHandle'),
            x               = dragHandle.getX() - container.getX(),
            y               = dragHandle.getY() - container.getY(),
            containerEl     = container.getEl(),
            containerWidth  = containerEl.getWidth(),
            containerHeight = containerEl.getHeight();

        container.fireEvent('handledrag', x/containerWidth, y/containerHeight);
    }
});