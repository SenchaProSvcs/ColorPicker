/**
 * A button (not extending from button) that can be clicked to bring up the
 * color picker. It also changes its color based on the color picker selection.
 */
Ext.define('SenchaProServices.colorpicker.Button', {
    extend     : 'Ext.Component',
    alias      : 'widget.sps_colorpickerbutton',
    controller : 'sps_colorpickerbuttoncontroller',

    requires: [
        'SenchaProServices.colorpicker.ButtonController'
    ],

    baseCls : 'sps-colorpicker-button',
    width   : 20,
    height  : 20,

    listeners: {
        afterrender : {
            single  : true,
            fn      : 'onFirstRender',
            scope   : 'controller'
        },
        click: {
            fn    : 'onButtonClick',
            scope : 'controller'
        }
    }
});