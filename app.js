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
    'Ext.form.FieldSet',
    'Ext.ux.colorpicker.Button'
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
                { xtype : 'oldcolorpickerbutton' },
                // { html  : 'OLD Colorpicker Field', margin: '20px 0px 0px 0px' },
                // { xtype : 'oldcolorpickerfield' },
                { html  : 'NEW Colorpicker Button', margin: '20px 0px 0px 0px' },
                { xtype : 'colorpickerbutton', color: 'blue' },
                { html  : 'NEW Colorpicker Field', margin: '20px 0px 0px 0px' },
                { xtype : 'field', width : 200, value : '#FFAAAA' }
            ]
        }]
    });
});