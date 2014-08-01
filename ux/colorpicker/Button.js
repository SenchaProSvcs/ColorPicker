/**
 * A button (not extending from button) that can be clicked to bring up the
 * color picker. It also changes its color based on the color picker selection.
 */
Ext.define('Ext.ux.colorpicker.Button', {
    extend     : 'Ext.Component',
    alias      : 'widget.colorpickerbutton',
    controller : 'colorpickerbuttoncontroller',

    requires: [
        'Ext.window.Window',
        'Ext.ux.colorpicker.ColorPicker',
        'Ext.ux.colorpicker.ButtonController',
        'Ext.ux.colorpicker.ColorUtils'
    ],

    baseCls : 'x-colorpicker-button',

    width   : 20,
    height  : 20,

    config : {
        /**
         * @cfg {String} [value=FFFFFF]
         * The initial color to highlight; see {@link #format} for supported formats.
         */
        value: 'FFFFFF',

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

    // hack to solve issue with IE, when applying a filter the click listener is not being fired.
    style : 'position: relative',
    html  : '<div class="filter" style="height:100%; width:100%; position: absolute;"></div>'+
            '<a class="btn" style="height:100%; width:100%; position: absolute;"></a>',
    // eo hack

    // button's background reflects the selected color
    bgStyleTpl: Ext.create('Ext.XTemplate',
        Ext.isIE && Ext.ieVersion < 10 ?
          'filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=\'#{hexAlpha}{hex}\', endColorstr=\'#{hexAlpha}{hex}\');' /* IE6-9 */
          : 'background: {rgba};'
    ),
    
    listeners: {
        afterrender : {
            single  : true,
            fn      : 'onFirstRender',
            scope   : 'controller'
        },
        click: {
            fn    : 'onClick',
            scope : 'controller'
        }
    },

    /**
     * @event select
     * Fires when a color is selected. Simply dragging sliders around will trigger this.
     * @param {Ext.ux.colorpicker.ColorPicker} the color picker
     * @param {String} color The value of the selected color as per specified {@link #format}.
     */

    /**
     * @event selected
     * Fires when a color is selected by actually clicking the Ok button on the colorpicker.
     * @param {Ext.ux.colorpicker.ColorPicker} the color picker
     * @param {String} color The value of the selected color as per specified {@link #format}.
     */

    constructor: function(cfg) {
        var me = this,
            vc,
            cpCfg; // config for color picker instance

        me.callParent(arguments);

        vc = me.getController();

        cpCfg = {
            format              : me.getFormat(),
            showPreviousColor   : true,
            showOkCancelButtons : true,
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

        // initial color picker value
        if (cfg.value) {
            cpCfg.value         = cfg.value;
            cpCfg.previousValue = cfg.value;
        }

        // create a color picker instance but don't render yet
        me.colorPicker = Ext.widget('acolorpicker', cpCfg);

        // the window will actually be shown and will house the picker
        me.colorPickerWindow = Ext.widget('window', {
            items        : [me.colorPicker],
            header       : false,
            resizable    : false
        });
    },

    // Expects value formatted as per "format" config
    setValue: function(color) {
        var me = this;

        if (!me.colorPicker) {
            return;
        }

        me.colorPicker.setValue(color);
    },

    // Returns value formatted as per "format" config
    getValue: function(color) {
        var me = this;
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