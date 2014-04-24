Ext.define('SenchaProServices.colorpicker.ColorMapController', {
    extend : 'Ext.app.ViewController',
    alias: 'controller.sps_colorpickercolormapcontroller',

    // Configure draggable constraints after the component is rendered.
    // Couldn't use events like afterrender because dragHandle.dd would still
    // be null.
    onFirstBoxReady: function() {
        var me = this,
            colorMap = me.getView(),
            dragHandle = colorMap.down('#dragHandle'),
            dd = dragHandle.dd;

        dd.constrain = true;
        dd.constrainTo = colorMap.getEl();
        dd.initialConstrainTo = dd.constrainTo; // needed otheriwse errors
    }
});