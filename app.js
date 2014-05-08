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
            defaults : { xtype: 'component' },
            items    : [
                { html  : 'OLD Colorpicker Button', margin: '20px 0px 0px 0px' },
                { xtype : 'colorpickerbutton' },
                // { html  : 'OLD Colorpicker Field', margin: '20px 0px 0px 0px' },
                // { xtype : 'colorpickerfield' },
                { html  : 'NEW Colorpicker Button', margin: '20px 0px 0px 0px' },
                { xtype : 'sps_colorpickerbutton', color: 'blue' },
                { html  : 'NEW Colorpicker Field', margin: '20px 0px 0px 0px' },
                { xtype : 'field', width : 200, value : '#FFAAAA' }
            ]
        }]
    });
});