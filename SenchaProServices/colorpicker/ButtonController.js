Ext.define('SenchaProServices.colorpicker.ButtonController', {
    extend : 'Ext.app.ViewController',
    alias: 'controller.sps_colorpickerbuttoncontroller',

    requires: [
        'SenchaProServices.colorpicker.Window',
        'SenchaProServices.colorpicker.ColorUtils'
    ],

    // Propagate "click" event from el
    onFirstRender: function() {
        var me                = this,
            button            = me.getView(),
            originalArguments = arguments,
            btnEl             = button.getEl();

        btnEl.on('click', function() {
            button.fireEvent('click', originalArguments);
        });

        btnEl.applyStyles({
            backgroundColor: SenchaProServices.colorpicker.ColorUtils.getRGBAString(button.getColor())
        });
    },

    // Show and align the color picker window
    onButtonClick: function() {
        var me           = this,
            pickerButton = me.getView(),
            pickerWindow = me.pickerWindow;

        if (!pickerWindow) {
            pickerWindow = Ext.create('SenchaProServices.colorpicker.Window', {
                alignTarget: pickerButton,
                defaultAlign: 'tl-br?',
                animateTarget: pickerButton.getEl(),
                listeners: {
                    colorselected: 'onColorSelected',
                    scope: me
                }
            });

            me.pickerWindow = pickerWindow;
        }

        pickerWindow.show();
    },

    onColorSelected: function (win, color) {
        var me           = this,
            pickerButton = me.getView();

        pickerButton.setColor(color);

        win.hide();
    }
});