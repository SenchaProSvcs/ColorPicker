Ext.define('Ext.ux.colorpicker.ButtonController', {
    extend : 'Ext.app.ViewController',
    alias: 'controller.colorpickerbuttoncontroller',

    requires: [
        'Ext.ux.colorpicker.Window'
    ],

    // Propagate "click" event from el
    onFirstRender: function() {
        var me                = this,
            button            = me.getView(),
            originalArguments = arguments,
            btnEl             = button.getEl();

        btnEl.down('.btn').on('click', function() {
            button.fireEvent('click', originalArguments);
        });
    },

    // Show and align the color picker window
    onClick: function() {
        var me           = this,
            pickerButton = me.getView(),
            picker       = pickerButton.colorPicker;
            
        picker.show();
    },

    // Whenever selection on the color picker changes (i.e when dragging);
    // not to be confused with actually clicking the Ok button
    onColorPickerSelection: function(colorPicker, hashlessHex) {
        var me = this;
        me.applyBtnBgStyle(colorPicker.getViewModel().get('selectedColor'));
    },

    applyBtnBgStyle: function(color) {
        var ColorUtils     = Ext.ux.colorpicker.ColorUtils,
            me             = this,
            view           = me.getView(),
            style          = {},
            el             = view.getEl().down('.filter'),
            hex, alpha, rgba, bgStyle;

        hex     = ColorUtils.rgb2hex(color.r, color.g, color.b);
        alpha   = Math.floor(color.a * 255).toString(16) ;
        rgba    = ColorUtils.getRGBAString(color);
        bgStyle = view.bgStyleTpl.apply({hex: hex, hexAlpha: alpha, rgba: rgba});
        el.applyStyles(bgStyle);
    }

    // onColorSelected: function (win, color) {
    //     var me           = this,
    //         pickerButton = me.getView();

    //     pickerButton.setColor(color);
    //     win.hide();
    // }
});