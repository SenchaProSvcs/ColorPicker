/**
 * A basic component that changes background color.
 */
Ext.define('SenchaProServices.colorpicker.ColorPreview', {
    extend     : 'Ext.Component',
    alias      : 'widget.sps_colorpickercolorpreview',

    // Called via databinding - update background color whenever
    // Window's ViewModel HEX changes
    setColor: function(hex) {
        var me = this,
            el = me.getEl();

        // Too early in rendering cycle; skip
        if (!el) {
            return;
        }

        el.setStyle({ 'background-color': hex });
    }
});
