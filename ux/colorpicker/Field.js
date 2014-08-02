/**
 * A field that can be clicked to bring up the color picker. The value changes based on the color picker selection.
 * The defaul selected color is configurable via {@link #value}.
 *
 *     @example
 *     Ext.create('Ext.ux.colorpicker.Field', {
 *         value     : '993300',  // initial selected color
 *         renderTo  : Ext.getBody(),
 *         listeners : {
 *             select: function(picker, selColor) {
 *                 alert(selColor);
 *             }
 *         }
 *     });
 */
Ext.define('Ext.ux.colorpicker.Field', {
    extend     : 'Ext.form.field.Picker',
    alias      : 'widget.colorpickerfield',
    controller : 'colorpickerfieldcontroller',

    requires: [
        'Ext.window.Window',
        'Ext.ux.colorpicker.ColorPicker',
        'Ext.ux.colorpicker.FieldController',
        'Ext.ux.colorpicker.ColorUtils'
    ],

    matchFieldWidth : false, // picker is usually wider than field
    editable        : false,

    config : {
        /**
         * @cfg {String} [value=FF0000]
         * The initial color to highlight; see {@link #format} for supported formats.
         */
        value: 'FF0000',

        /**
         * @cfg {String} [format=hex6NoHash]
         * !important - if changing this from default, make sure to set {@link #value} to
         * a default value that matches your format.
         * Which color format to use for getValue()/setValue() methods (or the initial value
         * config); supported formats are configured with parse/format method inside of
         * {@link Ext.ux.colorpicker.ColorUtils#formats}; they are:
         * - hex6NoHash - i.e. "FFAA00" - the default format used as it happens to match the
         *   (one and only) format of the standard {@link Ext.picker.Color}; note that this 
         *   formats lacks transparency data
         * - hex6 - i.e. "#FFAA00" - nearly the same thing as hex6NoHash, but with the hash
         * - hex8 - i.e. "#FFAA00FF" - the last 2 chars represent a 0-FF transparency value
         */
        format: 'hex6NoHash'
    },

    /**
     * @event select
     * Fires when a color is selected. Simply dragging sliders around will trigger this.
     * @param {Ext.ux.colorpicker.ColorPicker} the color picker
     * @param {String} color The value of the selected color as per specified {@link #format}.
     */

    /**
     * @event selected
     * Fires when a color is selected by actually clicking the Ok button on the colorpicker
     * or by clicking outside of it in order to hide it.
     * @param {Ext.ux.colorpicker.ColorPicker} the color picker
     * @param {String} color The value of the selected color as per specified {@link #format}.
     */

    // override as required by parent pickerfield
    createPicker: function() {
        var me    = this,
            value = me.getValue(),
            vc,
            cpCfg; // config for color picker instance

        vc = me.getController();

        cpCfg = {
            format              : me.getFormat(),
            showPreviousColor   : true,
            showOkCancelButtons : true,
            value               : value,
            previousValue       : value,
            listeners           : {
                select: {
                    fn    : vc.onColorPickerSelect,
                    scope : vc
                },
                okbuttonclick: {
                    fn    : vc.onColorPickerOkBtn,
                    scope : vc
                },
                cancelbuttonclick: {
                    fn    : vc.onColorPickerCancelBtn,
                    scope : vc
                }
            }
        };

        // create a color picker instance but don't render yet
        me.colorPicker = Ext.widget('acolorpicker', cpCfg);

        // the window will actually be shown and will house the picker
        me.colorPickerWindow = Ext.widget('window', {
            items        : [me.colorPicker],
            header       : false,
            resizable    : false
        });

        return me.colorPickerWindow;
    },

    // Sets value of the input DOM node
    setText: function(text) {
        var me = this;

        // if rendered, apply to the input
        if (me.inputEl && me.inputEl.dom) {
            me.inputEl.dom.value = text;
        }
        // otherwise defer until first render
        else {
            me.on({
                render: {
                    single : true,
                    scope  : me,
                    fn     : function() {
                        var me = this;
                        me.inputEl.dom.value = me.getValue();
                    }
                }
            });
        }
    },

    // Expects value formatted as per "format" config
    setValue: function(color) {
        var me = this;

        me.setText(color);

        if (!me.colorPicker) {
            return;
        }

        me.colorPicker.setValue(color);
    },

    // Returns value formatted as per "format" config
    getValue: function(color) {
        var me = this;

        if (!me.colorPicker) {
            return me.config.value;
        }

        return me.colorPicker.getValue();
    },

    // Sets this.format and color picker's setFormat()
    setFormat: function(format) {
        var me = this,
            cp = me.colorPicker;

        me.format = format;

        if (cp) {
            cp.setFormat(format);
        }
    },

    // Return this.format
    getFormat: function() {
        var me = this;
        return me.format;
    }
});