Ext.Loader.setConfig({
    paths : {
        'Ext.uxold.colorpicker' : 'OLDcolorpicker',
        'Ext.ux'                : 'ux'
    }
});

Ext.require([
    // old
    'Ext.uxold.colorpicker.Button',
    'Ext.uxold.colorpicker.Colorpicker',
    'Ext.uxold.colorpicker.Field',

    // new
    'Ext.container.Viewport',
    'Ext.layout.container.Fit',
    'Ext.panel.Panel',
    'Ext.form.FieldSet',
    'Ext.ux.colorpicker.ColorPicker',
    'Ext.ux.colorpicker.Button'
]);

Ext.onReady(function() {
    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [{
            xtype       : 'panel',
            title       : 'ColorPicker Example',
            autoScroll  : true,
            bodyPadding : 10,
            frame       : true,
            margin      : 10,
            renderTo    : Ext.getBody(),
            defaults    : { xtype: 'component' },
            items       : [
                { html: 'OLD (Architect) Colorpicker Button', margin: '20px 0px 0px 0px' },
                { xtype: 'oldcolorpickerbutton' },
                

                { html: 'NEW Colorpicker Button (default format)', margin: '20px 0px 0px 0px' },
                { 
                    xtype     : 'colorpickerbutton',
                    value     : '00FFFF',
                    listeners : {
                        selected: function(cp, val) {
                            Ext.getCmp('defaultFormatValue').setData({value: val});
                        }
                    }
                },
                { id: 'defaultFormatValue', tpl: 'Value: {value}', data: {value: 'FFFFFF'} },
                

                { html: 'NEW Colorpicker Button (format: hex8)', margin: '20px 0px 0px 0px' },
                { 
                    xtype     : 'colorpickerbutton',
                    value     : '#00FF0099',
                    format    : 'hex8',
                    width     : 200,
                    height    : 50,
                    listeners : {
                        selected: function(cp, val) {
                            Ext.getCmp('hex8FormatValue').setData({value: val});
                        }
                    }
                },
                { id: 'hex8FormatValue', tpl: 'Value: {value}', data: {value: '#00FF0099'} },


                { html: 'NEW Colorpicker Field (TODO)', margin: '20px 0px 0px 0px' },
                { xtype: 'field', width : 200, value : '#FFAAAA' },


                { html: 'NEW Colorpicker Embedded (Default Size in a Panel)', margin: '20px 0px 0px 0px' },
                {
                    xtype      : 'panel',
                    frame      : true,
                    title      : 'Sencha Pro Services Rock!',
                    shrinkWrap : true,
                    items      : [{
                        xtype  : 'acolorpicker',
                        format : 'hex8',
                        value  : '#FF0000FF'
                    }]
                },


                { html: 'NEW Colorpicker Embedded (Bare + Smallest + Laggy Text Update)', margin: '20px 0px 0px 0px' },
                { id: 'embeddedPickerValue', tpl: 'Value: {value}', data: {value: '#FFFFFF99'} },
                { 
                    xtype  : 'acolorpicker',
                    format : 'hex8', // IE 8 issue
                    value  : '#FFFFFF99',
                    // format : 'hex6',
                    // value  : '#FF0000',
                    width  : Ext.ux.colorpicker.ColorPicker.prototype.minWidth,
                    height : Ext.ux.colorpicker.ColorPicker.prototype.minHeight,
                    listeners: {
                        select: function(cp, val) {
                            Ext.getCmp('embeddedPickerValue').setData({value: val});
                        }
                    }
                },


                { html: 'NEW Colorpicker Embedded (Default Size in a Container with custom background)', margin: '20px 0px 0px 0px' },
                {
                    xtype      : 'container',
                    style      : 'background: cornflowerblue; display: inline-block;',
                    shrinkWrap : true,
                    items      : [{
                        xtype  : 'acolorpicker',
                        format : 'hex8',
                        value  : '#FF0000FF'
                    }]
                }
            ]
        }]
    });
});