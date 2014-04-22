/**
 * The actual floating color picker window.
 */
Ext.define('SenchaProServices.colorpicker.Window', {
    extend     : 'Ext.container.Container',
    alias      : 'widget.sps_colorpickerwindow',

    constructor: function(cfg) {
        var me = this;
        Ext.applyIf(cfg, {
            cls      : 'sps-colorpicker-window',
            width    : 300,
            height   : 300,
            floating : true,
            html: "I am your window; fear me!"
        });
        me.callParent(arguments);
    }
});