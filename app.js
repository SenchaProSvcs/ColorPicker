Ext.Loader.setConfig({
    paths : {
        'Ext.ux.colorpicker' : 'colorpicker',
        'SenchaProServices'  : 'SenchaProServices'
    }
});

Ext.require([
    'Ext.ux.colorpicker.Button',
    'Ext.ux.colorpicker.Colorpicker',
    'Ext.ux.colorpicker.Field',

    'Ext.container.Viewport',
    'Ext.form.FieldSet',
    'SenchaProServices.colorpicker.Button'
]);

Ext.onReady(function() {
    Ext.create('Ext.container.Viewport', {
        items: [{
            xtype    : 'panel',
            title    : 'ColorPicker Example',
            padding  : 20,
            frame    : true,
            margin   : 10,
            renderTo : Ext.getBody(),
            defaults : { xtype : 'fieldset' },
            items    : [{
                title : 'OLD Colorpicker Button',
                items : [{
                    xtype : 'colorpickerbutton'
                }]
            },
            {
                xtype : 'fieldset',
                title : 'OLD Colorpicker Field',
                items : [{
                    xtype : 'colorpickerfield'
                }]
            },
            {
                xtype : 'fieldset',
                title : 'NEW Colorpicker Button',
                padding: 5,
                items : [{
                    xtype : 'sps_colorpickerbutton'
                }]
            },
            {
                xtype : 'fieldset',
                title : 'NEW Colorpicker Field',
                flex  : 1,
                items : [{
                    xtype : 'field',
                    width : 200,
                    value : '#FFAAAA'
                }]
            }]
        }]
    });
});