/**
 * The actual floating color picker window.
 */
Ext.define('SenchaProServices.colorpicker.Window', {
    extend     : 'Ext.window.Window',
    alias      : 'widget.sps_colorpickerwindow',

    constructor: function(cfg) {
        var me = this;
        Ext.applyIf(cfg, {
            baseCls   : 'sps-colorpicker-window',
            width     : 300,
            height    : 300,
            html: 'BLAH',
            title: 'WEEE',
            border: true
        });
        me.callParent(arguments);
    }
});