/**
 * The actual floating color picker window.
 */
Ext.define('SenchaProServices.colorpicker.Window', {
    extend     : 'Ext.container.Container',
    alias      : 'widget.sps_colorpickerwindow',

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
                // TOP REGION
                {
                    xtype: 'container',
                    region: 'center',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                        // "MAP" and HEX/R/G/B FIELDS
                        {
                            xtype: 'container',
                            flex: 1,
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            margin: '0 2 0 0',
                            items: [
                                // "MAP"
                                {
                                    xtype: 'component',
                                    style: 'background: tomato;',
                                    html: 'Map',
                                    flex: 1,
                                    margin: '0 0 5 0'
                                },
                                // HEX/R/G/B FIELDS
                                {
                                    xtype: 'container',
                                    defaults: {
                                        style: 'display: inline-table; margin-right: 2px;'
                                    },
                                    items: [
                                        {
                                            xtype: 'field',
                                            fieldLabel: 'HEX',
                                            labelAlign: 'top'
                                        },
                                        {
                                            xtype: 'field',
                                            fieldLabel: 'R',
                                            labelAlign: 'top'
                                        },
                                        {
                                            xtype: 'field',
                                            fieldLabel: 'G',
                                            labelAlign: 'top'
                                        },
                                        {
                                            xtype: 'field',
                                            fieldLabel: 'B',
                                            labelAlign: 'top'
                                        }
                                    ]
                                }
                            ]
                        },
                        // SLIDER and H FIELD
                        {
                            xtype: 'container',
                            width: 20,
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            margin: '0 2 0 2',
                            items: [
                                {
                                    xtype: 'component',
                                    style: 'background: cornflowerblue;',
                                    flex: 1,
                                    margin: '0 0 5 0'
                                },
                                {
                                    xtype: 'field',
                                    fieldLabel: 'H',
                                    labelAlign: 'top'
                                }
                            ]
                        },
                        // SLIDER and S FIELD 
                        {
                            xtype: 'container',
                            width: 20,
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            margin: '0 2 0 2',
                            items: [
                                {
                                    xtype: 'component',
                                    style: 'background: cornflowerblue;',
                                    flex: 1,
                                    margin: '0 0 5 0'
                                },
                                {
                                    xtype: 'field',
                                    fieldLabel: 'S',
                                    labelAlign: 'top'
                                }
                            ]
                        },
                        // SLIDER and V FIELD 
                        {
                            xtype: 'container',
                            width: 20,
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            margin: '0 2 0 2',
                            items: [
                                {
                                    xtype: 'component',
                                    style: 'background: cornflowerblue;',
                                    flex: 1,
                                    margin: '0 0 5 0'
                                },
                                {
                                    xtype: 'field',
                                    fieldLabel: 'V',
                                    labelAlign: 'top'
                                }
                            ]
                        },
                        // SLIDER and A FIELD 
                        {
                            xtype: 'container',
                            width: 20,
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            margin: '0 2 0 2',
                            items: [
                                {
                                    xtype: 'component',
                                    style: 'background: cornflowerblue;',
                                    flex: 1,
                                    margin: '0 0 5 0'
                                },
                                {
                                    xtype: 'field',
                                    fieldLabel: 'A',
                                    labelAlign: 'top'
                                }
                            ]
                        },
                        // PREVIEW
                        {
                            xtype: 'component',
                            style: 'background: cornflowerblue;',
                            width: 100
                        }
                    ]
                },
                // PALLETTE
                {
                    xtype: 'container',
                    region: 'south',
                    style: 'background: orange;',
                    html: 'Pallette'
                }
            ]
        });
        me.callParent(arguments);
    }
});