/**
 * The actual floating color picker window.
 */
Ext.define('Ext.ux.colorpicker.Window', {
    extend     : 'Ext.container.Container',
    alias      : 'widget.colorpickerwindow',
    viewModel  : 'colorpickerwindowmodel',
    controller : 'colorpickerwindowcontroller',

    requires: [
        'Ext.layout.container.Border',
        'Ext.layout.container.HBox',
        'Ext.form.field.Text',
        'Ext.form.field.Number',
        'Ext.slider.Single',
        'Ext.ux.colorpicker.ColorMap',
        'Ext.ux.colorpicker.WindowModel',
        'Ext.ux.colorpicker.WindowController',
        'Ext.ux.colorpicker.ColorPreview',
        'Ext.ux.colorpicker.Slider',
        'Ext.ux.colorpicker.SliderAlpha',
        'Ext.ux.colorpicker.SliderSaturation',
        'Ext.ux.colorpicker.SliderValue',
        'Ext.ux.colorpicker.SliderHue'
    ],

    fieldWidth : 50, // how wide are the fields on the bottom (also increases spacing betwen sliders)
    fieldPad   : 5,  // padding between the sliders AND HEX/R/G/B fields

    config: {
        color: undefined
    },

    constructor: function(cfg) {
        var me = this;

        Ext.applyIf(cfg, {
            cls      : 'x-colorpicker-window',
            width    : 600,
            height   : 300,
            padding  : 10,
            floating : true,
            layout   : 'border',
            items: [
                // Map, Sliders, Fields, and Preview (center region)
                {
                    xtype  : 'container',
                    region : 'center',
                    cls    : 'x-colopicker-window-container-center',
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
                        me.getPreviewAndButtons()
                    ]
                }
                // Pallette and "Save" button (bottom region)
                // {
                //     xtype  : 'container',
                //     region : 'south',
                //     layout: {
                //         type  : 'hbox',
                //         align : 'stretch'
                //     },
                //     items: [
                //         {
                //             xtype  : 'component',
                //             style  : 'background: orange;',
                //             html   : 'Pallette',
                //             flex   : 1,
                //             margin : '0 10 0 0'
                //         },
                //         {
                //             xtype : 'button',
                //             text  : 'Save',
                //             width : 70
                //         }
                //     ]
                // }
            ]
        });

        me.callParent(arguments);
    },

    setColor: function (color) {
        var me = this,
            vm = me.getViewModel();

        vm.set('selectedColor', color);

        vm.set('previousColor', Ext.clone(color));

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
                        style          : 'display: inline-table; margin-right: ' + me.fieldPad + 'px;',
                        labelSeparator : ''
                    },
                    items: [
                        {
                            xtype      : 'textfield',
                            fieldLabel : 'HEX',
                            labelAlign : 'top',
                            width      : 75,
                            bind       : '{hex}'
                        },
                        {
                            xtype       : 'numberfield',
                            fieldLabel  : 'R',
                            labelAlign  : 'top',
                            bind        : '{red}',
                            width       : me.fieldWidth,
                            hideTrigger : true,
                            maxValue    : 255,
                            minValue    : 0
                        },
                        {
                            xtype       : 'numberfield',
                            fieldLabel  : 'G',
                            labelAlign  : 'top',
                            bind        : '{green}',
                            width       : me.fieldWidth,
                            hideTrigger : true,
                            maxValue    : 255,
                            minValue    : 0
                        },
                        {
                            xtype       : 'numberfield',
                            fieldLabel  : 'B',
                            labelAlign  : 'top',
                            bind        : '{blue}',
                            width       : me.fieldWidth,
                            hideTrigger : true,
                            maxValue    : 255,
                            minValue    : 0
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
                    minValue       : 0
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
                    minValue       : 0
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
                    minValue       : 0
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
                    minValue       : 0
                }
            ]
        };
    },

    // Splits up view declaration for readability
    // Preview squares and OK and Cancel buttons
    getPreviewAndButtons: function() {
        return {
            xtype  : 'container',
            width  : 70,
            margin : '0 0 0 10',
            layout : {
                type  : 'vbox',
                align : 'stretch'
            },
            items: [
                {
                    xtype  : 'colorpickercolorpreview',
                    height : 60,
                    bind: {
                        color: {
                            bindTo: '{selectedColor}',
                            deep: true
                        }
                    }
                },
                {
                    xtype  : 'colorpickercolorpreview',
                    bind: {
                        color: {
                            bindTo: '{previousColor}',
                            deep: true
                        }
                    },
                    height : 60,
                    listeners: {
                        click: 'onPreviousColorSelected'
                    }
                },
                {
                    xtype  : 'button',
                    text   : 'OK',
                    margin : '10 0 0 0',
                    handler: 'onColorSelected'
                },
                {
                    xtype  : 'button',
                    text   : 'Cancel',
                    margin : '10 0 0 0',
                    handler: 'onCancel'
                }
            ]
        };
    }
});