/**
 * View for the 4 sliders seen on the color picker window.
 */
Ext.define('SenchaProServices.colorpicker.Slider', {
    extend  : 'Ext.container.Container',
    alias   : 'widget.sps_colorpickerslider',
    
    baseCls : 'sps-colorpicker-slider',
    layout  : 'center',

    requires: [
        'Ext.layout.container.Center'
    ],

    // Container for the drag handle; needed since the slider
    // is of static size, while the parent container positions
    // it in the center; this is what receives the beautiful
    // color gradients for the visual
    items: [{
        xtype  : 'container',
        cls    : 'draghandle-container',
        itemId : 'dragHandleContainer',
        height : '100%',

        // This is the drag handle; note it's 100%x1 in size to allow full 
        // vertical drag travel; the inner div has the bigger image
        items: [{
            xtype     : 'component',
            cls       : 'draghandle-outer',
            itemId    : 'dragHandle',
            width     : '100%',
            height    : 1,
            draggable : true,
            html: '<div class="draghandle"></div>'
        }]
    }],

    listeners : {
        boxready: {
            single  : true,
            fn      : 'onFirstBoxReady',
            scope   : 'this'
        },
        valuebindingchanged: {
            fn    : 'onValueBindingChanged',
            scope : 'this'
        },
        saturationbindingchanged: {
            fn    : 'onSaturationBindingChanged',
            scope : 'this'
        }
    },

    // Configure draggable constraints after the component is rendered.
    onFirstBoxReady: function() {
        var me         = this,
            container  = me.down('#dragHandleContainer'),
            dragHandle = container.down('#dragHandle'),
            dd         = dragHandle.dd;

        dd.constrain = true;
        dd.constrainTo = container.getEl();
        dd.initialConstrainTo = dd.constrainTo; // needed otheriwse error EXTJS-13187
        dd.onDrag = Ext.Function.createSequence(dd.onDrag, Ext.bind(me.onHandleDrag, me));
    },

    // Fires when handle is dragged; propagates "handledrag" event on the slider
    // with parameter  "percentY" 0-1, representing the handle position on the slider
    // relative to the height
    onHandleDrag: function(e) {
        var me              = this,
            container       = me.down('#dragHandleContainer'),
            dragHandle      = container.down('#dragHandle'),
            y               = dragHandle.getY() - container.getY(),
            containerEl     = container.getEl(),
            containerHeight = containerEl.getHeight(),
            yRatio          = y/containerHeight;

        // Adjust y ratio for dragger always being 1 pixel from the edge on the right
        if (yRatio > 0.99) {
            yRatio = 1;
        }

        me.fireEvent('handledrag', yRatio);
    },

    // Called via data binding whenever selectedColor.v changes; fires "valuebindingchanged"
    // value param is 0-100
    setValue: function(value) {
        var me         = this,
            dragHandle = me.down('#dragHandle');

        // Too early in the render cycle? Skip event
        if (!dragHandle.dd || !dragHandle.dd.constrain) {
            return;
        }

        // User actively dragging? Skip event
        if (typeof dragHandle.dd.dragEnded !== 'undefined' && !dragHandle.dd.dragEnded) {
            return;
        }

        me.fireEvent('valuebindingchanged', value);
    },

    // Whenever underlying data HSV value changed we need to update the position of the dragger
    onValueBindingChanged: function(value) {
        var me              = this,
            vm              = me.up('sps_colorpickerwindow').getViewModel(),
            rgba            = vm.get('selectedColor'),
            container       = me.down('#dragHandleContainer'),
            dragHandle      = container.down('#dragHandle'),
            containerEl     = container.getEl(),
            containerHeight = containerEl.getHeight(),
            yRatio,
            top;

        // y-axis of slider with value 0-1 translates to reverse of "value"
        yRatio = 1-(value/100);
        top = containerHeight*yRatio;

        // Position dragger
        dragHandle.getEl().setStyle({
            top  : top + 'px'
        });
    },

    // Called via data binding whenever selectedColor.s changes; fires "saturationbindingchanged"
    // saturation param is 0-100
    setSaturation: function(saturation) {
        var me         = this,
            dragHandle = me.down('#dragHandle');

        // Too early in the render cycle? Skip event
        if (!dragHandle.dd || !dragHandle.dd.constrain) {
            return;
        }

        // User actively dragging? Skip event
        if (typeof dragHandle.dd.dragEnded !== 'undefined' && !dragHandle.dd.dragEnded) {
            return;
        }

        me.fireEvent('saturationbindingchanged', saturation);
    },

    // Whenever underlying data HSV saturation changed we need to update the position of the dragger
    onSaturationBindingChanged: function(saturation) {
        var me              = this,
            vm              = me.up('sps_colorpickerwindow').getViewModel(),
            rgba            = vm.get('selectedColor'),
            container       = me.down('#dragHandleContainer'),
            dragHandle      = container.down('#dragHandle'),
            containerEl     = container.getEl(),
            containerHeight = containerEl.getHeight(),
            yRatio,
            top;

        // y-axis of slider with value 0-1 translates to reverse of "value"
        yRatio = 1-(saturation/100);
        top = containerHeight*yRatio;

        // Position dragger
        dragHandle.getEl().setStyle({
            top  : top + 'px'
        });
    }
});