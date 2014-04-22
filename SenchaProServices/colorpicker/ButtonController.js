Ext.define('SenchaProServices.colorpicker.ButtonController', {
    extend : 'Ext.app.ViewController',
    alias: 'controller.sps_colorpickerbuttoncontroller',

    requires: [
        'SenchaProServices.colorpicker.Window'
    ],

    onButtonClick: function() {
        var me           = this,
            pickerButton = this.getView(),
            pickerWindow = Ext.widget('sps_colorpickerwindow');

        pickerWindow.show();
        pickerWindow.alignTo(pickerButton);
    }
});