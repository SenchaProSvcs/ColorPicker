Ext.define('Ext.ux.colorpicker.FieldController', {
    extend : 'Ext.app.ViewController',
    alias  : 'controller.colorpickerfieldcontroller',

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

    // Whenever selection on the color picker changes (i.e when dragging);
    // not to be confused with actually clicking the Ok button
    onColorPickerSelect: function(colorPicker, formattedValue) {
        var me   = this,
            view = me.getView();

        view.setText(formattedValue);
        view.fireEvent('select', colorPicker, formattedValue);
    },

    // When the Ok button is clicked on color picker, preserve the previous value
    onColorPickerOkBtn: function(colorPicker, formattedValue) {
        var me    = this,
            view  = me.getView(),
            cp    = view.colorPicker,
            cpWin = view.colorPickerWindow;

        cpWin.hide();
        cp.setPreviousValue(formattedValue);
        view.setText(formattedValue);
        view.fireEvent('selected', colorPicker, formattedValue);
    },

    // When the Cancel button is clicked on color picker
    onColorPickerCancelBtn: function(colorPicker) {
        var me      = this,
            view    = me.getView(),
            cp      = view.colorPicker,
            cpWin   = view.colorPickerWindow,
            prevVal = cp.getPreviousValue();

        cpWin.hide();
        cp.setValue(prevVal);
        view.setText(prevVal);
    }
});