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
            color             = button.getColor(),
            originalArguments = arguments,
            btnEl             = button.getEl();

        btnEl.down('.btn').on('click', function() {
            button.fireEvent('click', originalArguments);
        });

        button.setColor(color);
    },

    // Show and align the color picker window
    onButtonClick: function() {
        var me           = this,
            pickerButton = me.getView(),
            color        = pickerButton.getColor(),
            pickerWindow = me.pickerWindow;

        if (!pickerWindow) {
            pickerWindow = Ext.create('Ext.ux.colorpicker.Window', {
                alignTarget: pickerButton,
                defaultAlign: 'tl-br?',
                animateTarget: pickerButton.getEl(),
                resizable: true,
                listeners: {
                    colorselected: 'onColorSelected',
                    scope: me
                }
            });

            me.pickerWindow = pickerWindow;
        }
    
        pickerWindow.setColor(color);
        pickerWindow.show();
    },

    onColorSelected: function (win, color) {
        var me           = this,
            pickerButton = me.getView();

        pickerButton.setColor(color);

        win.hide();
    }
});