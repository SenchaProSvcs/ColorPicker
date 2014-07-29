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
    'Ext.ux.colorpicker.ColorPicker',
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
                { html  : 'NEW Colorpicker Button', margin: '20px 0px 0px 0px' },
                { xtype : 'colorpickerbutton', value: 'FFFFFF' },
                { html  : 'NEW Colorpicker Button #2', margin: '20px 0px 0px 0px' },
                { xtype : 'colorpickerbutton', value: '00FF00', width: 200 },
                { html  : 'NEW Colorpicker Field', margin: '20px 0px 0px 0px' },
                { xtype : 'field', width : 200, value : '#FFAAAA' },
                { html  : 'NEW Colorpicker Embedded', margin: '20px 0px 10px 0px' },
                { 
                    xtype         : 'acolorpicker',
                    value         : 'b84646',
                    previousValue : '00ff00',
                    handler: function(cp, col) {
                        console.log('Color change via handler(): ' + col);
                    },
                    listeners: {
                        selected: function(cp, col) {
                            console.log('Color change via "selected" event: ' + col);
                        }
                    }
                } 
            ]
        }]
    });
});