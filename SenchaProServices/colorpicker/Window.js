/**
 * The actual floating color picker window.
 */
Ext.define('SenchaProServices.colorpicker.Window', {
    extend     : 'Ext.container.Container',
    alias      : 'widget.sps_colorpickerwindow',

    requires: [
        'Ext.layout.container.Border',
        'Ext.layout.container.HBox'
    ],

    sliderWidth : 30, // width of every slider
    sliderPad   : 5,  // padding between the sliders AND HEX/R/G/B fields

    constructor: function(cfg) {
        var me = this;

        Ext.applyIf(cfg, {
            cls      : 'sps-colorpicker-window',
            width    : 500,
            height   : 300,
            padding  : 5,
            floating : true,
            layout   : 'border',
            items: [
                // Map, Sliders, Fields, and Preview (center region)
                {
                    xtype  : 'container',
                    region : 'center',
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
            flex   : 1,
            layout : {
                type  : 'vbox',
                align : 'stretch'
            },
            margin : '0 10 0 0',
            items  : [
                // "MAP"
                {
                    xtype  : 'component',
                    style  : 'background: tomato;',
                    html   : 'Map',
                    flex   : 1
                },
                // HEX/R/G/B FIELDS
                {
                    xtype    : 'container',
                    defaults : {
                        style          : 'display: inline-table; margin-right: ' + me.sliderPad + 'px;',
                        labelSeparator : ''
                    },
                    items: [
                        {
                            xtype      : 'field',
                            fieldLabel : 'HEX',
                            labelAlign : 'top'
                        },
                        {
                            xtype      : 'field',
                            fieldLabel : 'R',
                            labelAlign : 'top'
                        },
                        {
                            xtype      : 'field',
                            fieldLabel : 'G',
                            labelAlign : 'top'
                        },
                        {
                            xtype      : 'field',
                            fieldLabel : 'B',
                            labelAlign : 'top'
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
            width  : me.sliderWidth,
            layout : {
                type  : 'vbox',
                align : 'stretch'
            },
            items  : [
                {
                    xtype  : 'component',
                    style  : 'background: cornflowerblue;',
                    flex   : 1
                },
                {
                    xtype          : 'field',
                    fieldLabel     : 'H',
                    labelAlign     : 'top',
                    labelSeparator : ''
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
            width  : me.sliderWidth,
            layout : {
                type  : 'vbox',
                align : 'stretch'
            },
            margin: {
                right  : me.sliderPad,
                left   : me.sliderPad
            },
            items  : [
                {
                    xtype  : 'component',
                    style  : 'background: cornflowerblue;',
                    flex   : 1
                },
                {
                    xtype          : 'field',
                    fieldLabel     : 'S',
                    labelAlign     : 'top',
                    labelSeparator : ''
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
            width  : me.sliderWidth,
            layout : {
                type  : 'vbox',
                align : 'stretch'
            },
            items  : [
                {
                    xtype  : 'component',
                    style  : 'background: cornflowerblue;',
                    flex   : 1
                },
                {
                    xtype          : 'field',
                    fieldLabel     : 'V',
                    labelAlign     : 'top',
                    labelSeparator : ''
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
            width  : me.sliderWidth,
            layout : {
                type  : 'vbox',
                align : 'stretch'
            },
            margin: {
                left   : me.sliderPad
            },
            items  : [
                {
                    xtype  : 'component',
                    style  : 'background: cornflowerblue;',
                    flex   : 1
                },
                {
                    xtype          : 'field',
                    fieldLabel     : 'A',
                    labelAlign     : 'top',
                    labelSeparator : ''
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
                    xtype  : 'component',
                    height : 60,
                    style  : 'background: sandybrown'
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