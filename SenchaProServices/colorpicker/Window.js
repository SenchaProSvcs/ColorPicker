/**
 * The actual floating color picker window.
 */
Ext.define('SenchaProServices.colorpicker.Window', {
    extend     : 'Ext.container.Container',
    alias      : 'widget.sps_colorpickerwindow',
    viewModel  : 'sps_colorpickerwindowmodel',
    controller : 'sps_colorpickerwindowcontroller',

    requires: [
        'Ext.layout.container.Border',
        'Ext.layout.container.HBox',
        'Ext.form.field.Text',
        'Ext.form.field.Number',
        'Ext.slider.Single',
        'SenchaProServices.colorpicker.ColorMap',
        'SenchaProServices.colorpicker.WindowModel',
        'SenchaProServices.colorpicker.WindowController',
        'SenchaProServices.colorpicker.ColorPreview',
        'SenchaProServices.colorpicker.Slider'
    ],

    fieldWidth : 50, // how wide are the fields on the bottom (also increases spacing betwen sliders)
    fieldPad   : 5,  // padding between the sliders AND HEX/R/G/B fields

    constructor: function(cfg) {
        var me = this;

        Ext.applyIf(cfg, {
            cls      : 'sps-colorpicker-window',
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
                    cls    : 'sps-colopicker-window-container-center', // needed for overflow: visible for color map dragger
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
                },
                // Pallette and "Save" button (bottom region)
                {
                    xtype  : 'container',
                    region : 'south',
                    layout: {
                        type  : 'hbox',
                        align : 'stretch'
                    },
                    items: [
                        {
                            xtype  : 'component',
                            style  : 'background: orange;',
                            html   : 'Pallette',
                            flex   : 1,
                            margin : '0 10 0 0'
                        },
                        {
                            xtype : 'button',
                            text  : 'Save',
                            width : 70
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    },

    // Splits up view declaration for readability
    // "Map" and HEX/R/G/B fields
    getMapAndHexRGBFields: function() {
        var me = this;
        return {
            xtype  : 'container',
            cls    : 'sps-colopicker-window-container-mapnfields', // needed for overflow: visible for color map dragger
            flex   : 1,
            layout : {
                type  : 'vbox',
                align : 'stretch'
            },
            margin : '0 10 0 0',
            items  : [
                // "MAP"
                {
                    xtype     : 'sps_colorpickercolormap',
                    flex      : 1,
                    bind      : {
                        position: {
                            bindTo : '{selectedColor}',
                            deep   : true
                        },
                        color: '{selectedColor.h}'
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
            width  : me.fieldWidth,
            layout : {
                type  : 'vbox',
                align : 'center'
            },
            items  : [
                {
                    xtype    : 'slider',
                    vertical : true,
                    useTips  : false,
                    flex     : 1,
                    style: Ext.isIE && Ext.ieVersion >= 8 && Ext.ieVersion <= 9
                           ? '-ms-filter: "progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=#FFFFFF, endColorstr=#00000000)";'
                           :'background-image: -webkit-linear-gradient(top, rgb(255, 255, 255), rgba(0, 0, 0, 0)), url(http://localhost/sencha/ColorPickerRepo/resources/images/colorpicker/checkerboard.png)'
                           // IE 10 & 11 needs -ms-linear-gradient
                           // IE8 cannot chain background image and gradient, so additional markup will be needed
                           //     background: url(/sencha/ColorPickerRepo/resources/images/colorpicker/checkerboard.png) center repeat; 
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
                    xtype : 'sps_colorpickerslider',
                    flex  : 1,
                    cls   : 'saturation',
                    bind  : {
                        saturation: '{saturation}'
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
            cls    : 'sps-colopicker-window-container-value',
            width  : me.fieldWidth,
            layout : {
                type  : 'vbox',
                align : 'stretch'
            },
            items  : [
                {
                    xtype : 'sps_colorpickerslider',
                    flex  : 1,
                    cls   : 'value',
                    bind  : {
                        value: '{value}'
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
                    xtype    : 'slider',
                    vertical : true,
                    useTips  : false,
                    flex     : 1
                },
                {
                    xtype          : 'numberfield',
                    fieldLabel     : 'A',
                    labelAlign     : 'top',
                    labelSeparator : '',
                    bind           : '{selectedColor.a}',
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
                    xtype  : 'sps_colorpickercolorpreview',
                    height : 60,
                    bind: {
                        color: '{hex}'
                    }
                },
                {
                    xtype  : 'component',
                    height : 60,
                    style  : 'background: saddlebrown'
                },
                {
                    xtype  : 'button',
                    text   : 'OK',
                    margin : '10 0 0 0'
                },
                {
                    xtype  : 'button',
                    text   : 'Cancel',
                    margin : '10 0 0 0'
                }
            ]
        };
    }
});