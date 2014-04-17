Ext.Loader.setConfig({
    paths : {
        'Ext.ux.colorpicker' : 'colorpicker'
    }
});

Ext.require([
    'Ext.ux.colorpicker.Button',
    'Ext.ux.colorpicker.Colorpicker',
    'Ext.ux.colorpicker.Field'
]);

Ext.onReady(function(){
    Ext.create('Ext.container.Viewport', {
        items : [
            {
                xtype    : 'panel',
                title    : 'ColorPicker Example',
                padding  : 20,
                frame    : true,
                margin   : 10,
                height   : 400,
                width    : 600,
                renderTo : Ext.getBody(),
                layout : {
                    type  : 'vbox',
                    align : 'stretch'
                },
                items : [
                    {
                        xtype : 'fieldset',
                        title : 'Colorpicker Button',
                        flex  : 1,
                        items : [
                            {
                                xtype : 'colorpickerbutton'
                            }
                        ]
                    },
                    {
                        xtype : 'fieldset',
                        title : 'Colorpicker Field',
                        flex  : 1,
                        items : [
                            {
                                xtype : 'colorpickerfield'
                            }
                        ]
                    },

                ]
            }
        ]
    });
});