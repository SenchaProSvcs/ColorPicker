/**
 * A button (not extending from button) that can be clicked to bring up the
 * color picker. It also changes its color based on the color picker selection.
 */
Ext.define('Ext.ux.colorpicker.Button', {
    extend     : 'Ext.Component',
    alias      : 'widget.colorpickerbutton',
    controller : 'colorpickerbuttoncontroller',

    requires: [
        'Ext.ux.colorpicker.ColorPicker',
        'Ext.ux.colorpicker.ButtonController',
        'Ext.ux.colorpicker.ColorUtils'
    ],

    baseCls : 'x-colorpicker-button',

    width   : 20,
    height  : 20,

    config : {
        /**
         * @cfg {String} value
         * The initial color to highlight (should be a valid 6-digit color hex code without the # symbol). Note that the hex
         * codes are case-sensitive.
         */
        value: 'FFFFFF'
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

    constructor: function(cfg) {
        var me = this,
            vc,
            cpCfg; // config for color picker instance

        me.callParent(arguments);

        vc = me.getController();

        cpCfg = {
            floating            : true,
            resizable           : true,
            alignTarget         : me,
            defaultAlign        : 'tl-br?',
            showPreviousColor   : true,
            showOkCancelButtons : true,
            listeners           : {
                select: {
                    fn    : vc.onColorPickerSelection,
                    scope : vc
                }
            }
        };

        // initial color picker value
        if (cfg.value) {
            cpCfg.value = cfg.value;
        }

        // create a color picker instance but don't render yet
        me.colorPicker = Ext.widget('acolorpicker', cpCfg);
    },

    setValue: function (color) {
        var me = this;

        if (!me.colorPicker) {
            return;
        }

        me.colorPicker.setValue(color);
    },

    getValue: function (color) {
        var me = this;
        return me.colorPicker.getValue();
    }
});