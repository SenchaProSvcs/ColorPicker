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
        render: {
            single : true,
            fn     : 'onFirstRender',
            scope  : 'this'
        },
        click: {
            fn    : 'onButtonClick',
            scope : 'controller'
        }
    },

    // Propagate "click" event from el
    onFirstRender: function() {
        var me = this,
            originalArguments = arguments;
        me.getEl().on('click', function() {
            me.fireEvent('click', originalArguments);
        });
    }
});