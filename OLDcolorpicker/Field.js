/**
 * @class Ext.uxold.colorpicker.Field
 * @extends Ext.form.field.Trigger
 *
 */
Ext.define('Ext.uxold.colorpicker.Field', {
    extend : 'Ext.form.field.Trigger',
    xtype  : 'oldcolorpickerfield',

    requires : [
        'Ext.uxold.colorpicker.color',
        'Ext.uxold.colorpicker.Colorpicker'
    ],

    enableKeyEvents : true,

    triggerBaseCls : 'x-color-field',

    value : '#ff0000',

    config : {
        /**
         * @cfg {Object} colorPicker
         */
        colorPicker : null,

        triggerHeight : 22,

        triggerWidth  : 22
    },

    initComponent : function() {
        var me = this;

        //retrieve a reference to the colorpicker
        me.colorPicker = Ext.uxold.colorpicker.Colorpicker.getSharedColorpickerInstance();

        me.callParent(arguments);

        me.on({
            keyup  : me.onKeyUp,
            render : me.onRenderField,
            scope  : me
        });

        //listen for owner changes on color picker
        me.colorPicker.on('ownerchange', me.disconnectColorPicker, me);
    },

    onKeyUp : function() {
        console.log('onKeyUp');
        this.setColor(this.getValue());
    },

    onRenderField : function() {console.log('onRenderField');
        var me        = this,
            height    = me.getTriggerHeight() + 'px',
            triggerEl = me.triggerEl.elements[0],
            width     = '0px'; // me.getTriggerWidth() + 'px';

        console.log(triggerEl.parent());

        triggerEl.parent().setStyle({
            verticalAlign : 'top'
        });

        Ext.DomHelper.insertAfter(
            triggerEl.dom,
            {
                tag   : 'div',
                cls   : 'x-checkerboard',
                style : {
                    height    : height,
                    position  : 'absolute',
                    width     : width,
                    zIndex    : 1
                }
            }
        );

        triggerEl.setStyle({
            backgroundColor : '#ff0000',
            cursor          : 'pointer',
            height          : height,
            position        : 'absolute',
            width           : width,
            zIndex          : 2
        });
    },

    onTriggerClick: function() {
        this.showColorPicker();
    },

    /**
     * Displays the colorpicker next to the button
     */
    showColorPicker : function() {
        var me          = this,
            color       = Ext.uxold.colorpicker.color.colorFromString(me.getValue()),
            colorPicker = me.colorPicker,
            el          = me.el,
            pos         = el.getXY();

        //Take over colorpicker. make sure we play nice with other users
        //returns true if taken over, or false if we already own it
        var notMine = colorPicker.takeOver(me);

        //hide the color picker (in case it is displayed somwhere else)
        colorPicker.hide();

        if (notMine) {
            colorPicker.on({
                colorchange : me.onColorChange,
                didCancel   : me.onDidCancel,
                scope       : me
            });
        }

        console.log(me.inputEl.getWidth() + parseInt(me.getTriggerHeight() / 2));

        var triggerMarginLeft = me.inputEl.getWidth();

        //show colorpicker at position
        colorPicker.showWithTipAt(pos[0], pos[1] + 2, el.getWidth(), el.getHeight(), triggerMarginLeft);

        //set color correctly and make current color the default color
        colorPicker.setRGBA(color.r, color.g, color.b, color.a);

        colorPicker.makeCurrentColorDefault();
    },

    /**
     *
     * @param color
     */
    setColor : function(color) {
        this.triggerEl.elements[0].setStyle({
            backgroundColor : color
        });
    },

    /**
     *
     * @param opacity
     */
    setOpacity : function(opacity) {
        this.triggerEl.elements[0].setStyle({
            opacity : opacity
        });
    },

    /**
     *
     * @param value
     */
    setValue : function(value) {
        this.callParent(arguments);

        if (this.rendered) {
            this.setColor(value);
        }
    },

    /**
     * When color changed from color picker
     * @param rgb
     * @param alpha
     * @param intermediate
     */
    onColorChange : function(rgb, alpha, intermediate) {
        this.setValue('#' + Ext.uxold.colorpicker.color.rgb2hex(rgb));
        this.setOpacity(alpha);
    },

    onDidCancel : function() {
        console.log('onColonDidCancelorChanged');
    },

    /**
     * When we are relinqueshed ownership of the colorpicker
     */
    disconnectColorPicker : function() {
        var me = this;

        me.colorPicker.un({
            colorchange : me.onColorChange,
            didCancel   : me.onDidCancel,
            scope       : me
        });
    }
});