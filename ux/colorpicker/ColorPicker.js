/**
 * Sencha Pro Services presents xtype "acolorpicker"; "a" is for "advanced" (or "awesome").
 * API has been kept as close to the regular colorpicker as possible. The picker can be rendered to any container.
 * The defaul selected color is configurable via {@link #value} config. Usually used in forms via 
 * {@link Ext.ux.colorpicker.Button} or {@link Ext.ux.colorpicker.Field}.
 * Typically you will need to implement a handler function to be notified when the user chooses a color from the picker;
 * you can register the handler using the {@link #event-select} event, or by implementing the {@link #handler} method.
 *
 *     @example
 *     Ext.create('Ext.ux.colorpicker.ColorPicker', {
 *         value     : '993300',  // initial selected color
 *         renderTo  : Ext.getBody(),
 *         listeners : {
 *             select: function(picker, selColor) {
 *                 alert(selColor);
 *             }
 *         }
 *     });
 */
Ext.define('Ext.ux.colorpicker.ColorPicker', {
    extend     : 'Ext.container.Container',
    alias      : 'widget.acolorpicker',
    viewModel  : 'colorpickermodel',
    controller : 'colorpickercontroller',

    requires: [
        'Ext.layout.container.Border',
        'Ext.layout.container.HBox',
        'Ext.form.field.Text',
        'Ext.form.field.Number',
        'Ext.slider.Single',
        'Ext.ux.colorpicker.ColorMap',
        'Ext.ux.colorpicker.ColorPickerModel',
        'Ext.ux.colorpicker.ColorPickerController',
        'Ext.ux.colorpicker.ColorPreview',
        'Ext.ux.colorpicker.Slider',
        'Ext.ux.colorpicker.SliderAlpha',
        'Ext.ux.colorpicker.SliderSaturation',
        'Ext.ux.colorpicker.SliderValue',
        'Ext.ux.colorpicker.SliderHue'
    ],

    width     : 580, // default width and height gives 255x255 color map in Crisp
    minWidth  : 440,
    height    : 337,
    minHeight : 250,

    /**
     * @cfg fieldWidth {Number} Width of the text fields on the container (excluding HEX);
     * since the width of the slider containers is the same as the text field under it 
     * (it's the same vbox column), changing this value will also affect the spacing between
     * the sliders.
     */
    fieldWidth: 50,

    /**
     * @cfg fieldPad {Number} padding between the sliders and HEX/R/G/B fields.
     */    
    fieldPad: 5,

    config: {
        /**
         * @cfg {String} [value=FF0000]
         * The initial color to highlight; see {@link #format} for supported formats.
         */
        value: 'FF0000',

        /**
         * @cfg {String} [previousValue=000000]
         * The "previous" color (shown on the top right corner, below the "active selection" box);
         * see {@link #format} for supported formats.
         */
        previousValue: '000000',

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
     * @cfg {Boolean} [showPreviousColor=false]
     * Whether "previous color" region (in upper right, below the selected color preview) should be shown;
     * these are relied upon by the {@link Ext.ux.colorpicker.Button} and the {@link Ext.ux.colorpicker.Field}.
     */

    /**
     * @cfg {Boolean} [showOkCancelButtons=false]
     * Whether Ok and Cancel buttons (in upper right, below the selected color preview) should be shown;
     * these are relied upon by the {@link Ext.ux.colorpicker.Button} and the {@link Ext.ux.colorpicker.Field}.
     */

    /**
     * @cfg {Function} handler
     * A function that will handle the select event of this picker. Simply dragging sliders around
     * will trigger this. The handler is passed the following parameters:
     *
     * - `picker` : ColorPicker
     *
     *   The {@link Ext.ux.colorpicker.ColorPicker picker}.
     *
     * - `color` : String
     *
     *   The value of the selected color as per specified {@link #format}.
     */

    /**
     * @event select
     * Fires when a color is selected. Simply dragging sliders around will trigger this.
     * @param {Ext.ux.colorpicker.ColorPicker} this
     * @param {String} color The value of the selected color as per specified {@link #format}.
     */

    /**
     * @event okbuttonclick
     * Fires when Ok button is clicked (see {@link #showOkCancelButtons}).
     * @param {Ext.ux.colorpicker.ColorPicker} this
     * @param {String} color The value of the selected color as per specified {@link #format}.
     */

    /**
     * @event cancelbuttonclick
     * Fires when Cancel button is clicked (see {@link #showOkCancelButtons}).
     * @param {Ext.ux.colorpicker.ColorPicker} this
     */

    constructor: function(cfg) {
        var me = this;

        Ext.applyIf(cfg, {
            cls      : 'x-colorpicker',
            padding  : 10,
            layout : {
                type  : 'hbox',
                align : 'stretch'
            },
            items: [
                me.getMapAndHexRGBFields(),
                me.getSliderAndHField(),
                me.getSliderAndSField(),
                me.getSliderAndVField(),
                me.getSliderAndAField(),
                me.getPreviewAndButtons(cfg)
            ]
        });

        me.callParent(arguments);
    },

    setValue: function(color) {
        var me = this,
            vm = me.getViewModel(),
            colorO;

        colorO = Ext.ux.colorpicker.ColorUtils.formats[me.getFormat()].parse(color);
        vm.set('selectedColor', colorO);
    },

    getValue: function() {
        var me = this,
            vm = me.getViewModel(),
            colorO;

        colorO = vm.get('selectedColor');
        return Ext.ux.colorpicker.ColorUtils.formats[me.getFormat()].format(colorO);
    },

    setPreviousValue: function(color) {
        var me = this,
            vm = me.getViewModel(),
            colorO;

        colorO = Ext.ux.colorpicker.ColorUtils.formats[me.getFormat()].parse(color);
        vm.set('previousColor', colorO);
    },

    getPreviousValue: function() {
        var me = this,
            vm = me.getViewModel(),
            colorO;

        colorO = vm.get('previousColor');
        return Ext.ux.colorpicker.ColorUtils.formats[me.getFormat()].format(colorO);
    },

    // Sets this.format
    setFormat: function(format) {
        var me = this;
        me.format = format;
    },

    // Return this.format
    getFormat: function() {
        var me = this;
        return me.format;
    },

    // Splits up view declaration for readability
    // "Map" and HEX/R/G/B fields
    getMapAndHexRGBFields: function() {
        var me = this;
        return {
            xtype  : 'container',
            cls    : 'x-colopicker-escape-overflow',
            flex   : 1,
            layout : {
                type  : 'vbox',
                align : 'stretch'
            },
            margin : '0 10 0 0',
            items  : [
                // "MAP"
                {
                    xtype     : 'colorpickercolormap',
                    flex      : 1,
                    bind      : {
                        position: {
                            bindTo : '{selectedColor}',
                            deep   : true
                        },
                        hue: '{selectedColor.h}'
                    },
                    listeners : {
                        handledrag: {
                            fn: 'onColorMapHandleDrag'
                            // scope : 'controller' // cannot use here; EXTJS-13185
                        }
                    }
                },
                // HEX/R/G/B FIELDS
                {
                    xtype    : 'container',
                    defaults : {
                        style          : 'display: inline-table;',
                        labelSeparator : '',
                        allowBlank     : false,
                        onChange       : function() { // prevent data binding propagation if bad value
                            var me = this;
                            if (me.isValid()) {
                                // this is kind of dirty and ideally we would extend these fields
                                // and override the method, but works for now
                                Ext.form.field.Base.prototype.onChange.apply(me, arguments);
                            }
                        }
                    },
                    items: [
                        {
                            xtype      : 'textfield',
                            fieldLabel : 'HEX',
                            labelAlign : 'top',
                            width      : 75,
                            bind       : '{hex}',
                            margin     : { top: 0, right: me.fieldPad, bottom: 0, left: 0 },
                            readOnly   : true
                        },
                        {
                            xtype       : 'numberfield',
                            fieldLabel  : 'R',
                            labelAlign  : 'top',
                            bind        : '{red}',
                            width       : me.fieldWidth,
                            hideTrigger : true,
                            maxValue    : 255,
                            minValue    : 0,
                            margin      : { top: 0, right: me.fieldPad, bottom: 0, left: 0 }
                        },
                        {
                            xtype       : 'numberfield',
                            fieldLabel  : 'G',
                            labelAlign  : 'top',
                            bind        : '{green}',
                            width       : me.fieldWidth,
                            hideTrigger : true,
                            maxValue    : 255,
                            minValue    : 0,
                            margin      : { top: 0, right: me.fieldPad, bottom: 0, left: 0 }
                        },
                        {
                            xtype       : 'numberfield',
                            fieldLabel  : 'B',
                            labelAlign  : 'top',
                            bind        : '{blue}',
                            width       : me.fieldWidth,
                            hideTrigger : true,
                            maxValue    : 255,
                            minValue    : 0,
                            margin      : 0
                        }
                    ]
                }
            ]
        };
    },

    // Splits up view declaration for readability
    // Slider and H field 
    getSliderAndHField: function() {
        var me = this;
        return {
            xtype  : 'container',
            cls    : 'x-colopicker-escape-overflow',
            width  : me.fieldWidth,
            layout : {
                type  : 'vbox',
                align : 'stretch'
            },
            items  : [
                {
                    xtype    : 'colorpickersliderhue',
                    flex     : 1,
                    bind     : {
                        hue: '{selectedColor.h}'
                    },
                    listeners : {
                        handledrag: {
                            fn: 'onHueSliderHandleDrag'
                            // scope : 'controller' // cannot use here; EXTJS-13185
                        }
                    }
                },
                {
                    xtype          : 'numberfield',
                    fieldLabel     : 'H',
                    labelAlign     : 'top',
                    width          : me.fieldWidth,
                    labelSeparator : '',
                    bind           : '{hue}',
                    hideTrigger    : true,
                    maxValue       : 360,
                    minValue       : 0,
                    allowBlank     : false,
                    margin         : 0
                }
            ]
        };
    },

    // Splits up view declaration for readability
    // Slider and S field 
    getSliderAndSField: function() {
        var me = this;
        return {
            xtype  : 'container',
            cls    : 'x-colopicker-escape-overflow',
            width  : me.fieldWidth,
            layout : {
                type  : 'vbox',
                align : 'stretch'
            },
            margin: {
                right  : me.fieldPad,
                left   : me.fieldPad
            },
            items  : [
                {
                    xtype : 'colorpickerslidersaturation',
                    flex  : 1,
                    bind  : {
                        saturation : '{saturation}',
                        hue        : '{selectedColor.h}'
                    },
                    listeners : {
                        handledrag: {
                            fn: 'onSaturationSliderHandleDrag'
                            // scope : 'controller' // cannot use here; EXTJS-13185
                        }
                    }
                },
                {
                    xtype          : 'numberfield',
                    fieldLabel     : 'S',
                    labelAlign     : 'top',
                    labelSeparator : '',
                    bind           : '{saturation}',
                    hideTrigger    : true,
                    maxValue       : 100,
                    minValue       : 0,
                    allowBlank     : false,
                    margin         : 0
                }
            ]
        };
    },

    // Splits up view declaration for readability
    // Slider and V field 
    getSliderAndVField: function() {
        var me = this;
        return {
            xtype  : 'container',
            cls    : 'x-colopicker-escape-overflow',
            width  : me.fieldWidth,
            layout : {
                type  : 'vbox',
                align : 'stretch'
            },
            items  : [
                {
                    xtype : 'colorpickerslidervalue',
                    flex  : 1,
                    bind  : {
                        value : '{value}',
                        hue   : '{selectedColor.h}'
                    },
                    listeners : {
                        handledrag: {
                            fn: 'onValueSliderHandleDrag'
                            // scope : 'controller' // cannot use here; EXTJS-13185
                        }
                    }
                },
                {
                    xtype          : 'numberfield',
                    fieldLabel     : 'V',
                    labelAlign     : 'top',
                    labelSeparator : '',
                    bind           : '{value}',
                    hideTrigger    : true,
                    maxValue       : 100,
                    minValue       : 0,
                    allowBlank     : false,
                    margin         : 0
                }
            ]
        };
    },

    // Splits up view declaration for readability
    // Slider and A field 
    getSliderAndAField: function() {
        var me = this;
        return {
            xtype  : 'container',
            cls    : 'x-colopicker-escape-overflow',
            width  : me.fieldWidth,
            layout : {
                type  : 'vbox',
                align : 'stretch'
            },
            margin: {
                left   : me.fieldPad
            },
            items  : [
                {
                    xtype : 'colorpickerslideralpha',
                    flex  : 1,
                    bind  : {
                        alpha : '{alpha}',
                        color : {
                            bindTo: '{selectedColor}',
                            deep: true
                        }
                    },
                    listeners : {
                        handledrag: {
                            fn: 'onAlphaSliderHandleDrag'
                            // scope : 'controller' // cannot use here; EXTJS-13185
                        }
                    }
                },
                {
                    xtype          : 'numberfield',
                    fieldLabel     : 'A',
                    labelAlign     : 'top',
                    labelSeparator : '',
                    bind           : '{alpha}',
                    hideTrigger    : true,
                    maxValue       : 100,
                    minValue       : 0,
                    allowBlank     : false,
                    margin         : 0
                }
            ]
        };
    },

    // Splits up view declaration for readability
    // Preview current/previous color squares and OK and Cancel buttons
    getPreviewAndButtons: function(cfg) {
        var items = [];

        // selected color preview is always shown
        items.push({
            xtype  : 'colorpickercolorpreview',
            flex   : 1,
            bind   : {
                color: {
                    bindTo : '{selectedColor}',
                    deep   : true
                }
            }
        });

        // previous color preview is optional
        if (cfg.showPreviousColor) {
            items.push({
                xtype  : 'colorpickercolorpreview',
                flex   : 1,
                bind   : {
                    color: {
                        bindTo : '{previousColor}',
                        deep   : true
                    }
                },
                listeners: {
                    click: 'onPreviousColorSelected'
                }
            });
        }

        // Ok/Cancel buttons are optional
        if (cfg.showOkCancelButtons) {
            items.push({
                xtype   : 'button',
                text    : 'OK',
                margin  : '10 0 0 0',
                handler : 'onOkBtn'
            },
            {
                xtype   : 'button',
                text    : 'Cancel',
                margin  : '10 0 0 0',
                handler : 'onCancelBtn'
            });
        }

        return {
            xtype  : 'container',
            width  : 70,
            margin : '0 0 0 10',
            items  : items,
            layout : {
                type  : 'vbox',
                align : 'stretch'
            }
        };
    }
});