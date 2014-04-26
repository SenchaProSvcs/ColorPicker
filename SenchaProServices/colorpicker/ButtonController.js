Ext.define('SenchaProServices.colorpicker.ButtonController', {
    extend : 'Ext.app.ViewController',
    alias: 'controller.sps_colorpickerbuttoncontroller',

    requires: [
        'SenchaProServices.colorpicker.Window'
    ],

    // Propagate "click" event from el
    onFirstRender: function() {
        var me                = this,
            button            = me.getView(),
            originalArguments = arguments;

        button.getEl().on('click', function() {
            button.fireEvent('click', originalArguments);
        });
    },

    // Show and align the color picker window
    onButtonClick: function() {
        var me           = this,
            pickerButton = this.getView(),
            pickerWindow = Ext.widget('sps_colorpickerwindow');

        pickerWindow.show();
        pickerWindow.alignTo(pickerButton, 'tl-br?');
    }
});