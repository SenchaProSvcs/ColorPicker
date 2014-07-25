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
        dd.on('drag', Ext.bind(me.onHandleDrag, me));
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

        // Adjust y ratio for dragger always being 1 pixel from the edge on the bottom
        if (yRatio > 0.99) {
            yRatio = 1;
        }

        view.fireEvent('handledrag', yRatio);
    },

    onMouseDown: function(e){
        var me          = this,
            container   = me.getView(),
            dragHandle      = container.down('#dragHandle');

        dragHandle.setY(e.getY());
        me.onHandleDrag();
        dragHandle.dd.onMouseDown(e, dragHandle.dd.el);
    }
});
