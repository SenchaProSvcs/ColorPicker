Ext.define('SenchaProServices.colorpicker.SliderController', {
    extend : 'Ext.app.ViewController',
    alias: 'controller.sps_colorpickerslidercontroller',

    // Configure draggable constraints after the component is rendered.
    onFirstBoxReady: function() {
        var me         = this,
            view       = me.getView(),
            container  = view.down('#dragHandleContainer'),
            dragHandle = container.down('#dragHandle'),
            dd         = dragHandle.dd;

        dd.constrain = true;
        dd.constrainTo = container.getEl();
        dd.initialConstrainTo = dd.constrainTo; // needed otheriwse error EXTJS-13187

        // Sequence original onDrag function and our additional onHandleDrag behavior;
        // dragger doesn't have a clean "drag" event
        dd.onDrag = Ext.Function.createSequence(dd.onDrag, Ext.bind(me.onHandleDrag, me));
    },

    // Fires when handle is dragged; fires "handledrag" event on the slider
    // with parameter  "percentY" 0-1, representing the handle position on the slider
    // relative to the height
    onHandleDrag: function(e) {
        var me              = this,
            view            = me.getView(),
            container       = view.down('#dragHandleContainer'),
            dragHandle      = container.down('#dragHandle'),
            y               = dragHandle.getY() - container.getY(),
            containerEl     = container.getEl(),
            containerHeight = containerEl.getHeight(),
            yRatio          = y/containerHeight;

        // Adjust y ratio for dragger always being 1 pixel from the edge on the right
        if (yRatio > 0.99) {
            yRatio = 1;
        }

        view.fireEvent('handledrag', yRatio);
    },

    onSliderClick: function (e) {
        var me          = this,
            container   = me.getView(), // the Color Map
            dragHandle  = container.down('#dragHandle'),
            cY          = container.getY(),
            eY         = e.getY(),
            left, top;

        top  = eY - cY;

        dragHandle.getEl().setStyle({
            top  : top + 'px'
        });

        me.onHandleDrag();
    }
});
