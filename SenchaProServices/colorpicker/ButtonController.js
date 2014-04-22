Ext.define('SenchaProServices.colorpicker.ButtonController', {
    extend : 'Ext.app.ViewController',
    alias: 'controller.sps_colorpickerbuttoncontroller',

    requires: [
        'SenchaProServices.colorpicker.Window'
    ],

    onButtonClick: function() {
        Ext.widget('sps_colorpickerwindow').showBy(this.getView());
    }
});