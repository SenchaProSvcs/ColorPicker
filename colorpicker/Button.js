/**
 * @class Ext.ux.colorpicker.Button
 * @extends Ext.Component
 *
 */
Ext.define('Ext.ux.colorpicker.Button', {
    extend : 'Ext.Component',
    alias  : 'widget.colorpickerbutton',

    requires : [
        'Ext.ux.colorpicker.color'
    ],

    cls : [
        'xds-button',
        'colorpicker'
    ],

    height : 23,
    width  : 23,

    renderTpl : [
        '<div id="{id}-btnWrap" class="AN-colorbtn {childElCls}" unselectable="on">',
            '<a id="{id}-btnEl" class="{baseCls}-button" role="button" hidefocus="on" unselectable="on"',
                    '<tpl if="tabIndex"> tabIndex="{tabIndex}"</tpl>',
                    '<tpl if="disabled"> disabled="disabled"</tpl>',
                '>',
                '<span id="{id}-btnInnerEl" class="{baseCls}-inner {innerCls}',
                    '{childElCls}" unselectable="on">',
                    '{text}',
                '</span>',
                '<div class="AN-colorbtn-rgba"></div>',
                '<div class="AN-colorbtn-mask"></div>',

                '<span id="{id}-btnIconEl" class="{baseCls}-icon {iconCls}"<tpl if="iconUrl"> style="background-image:url({iconUrl})"</tpl>></span>',
            '</a>',
        '</div>'
    ],

    /**
     *
     * @param config
     */
    constructor : function(config) {
        var me = this;

        //selected color
        me.color = {
            r: 255,
            g: 50,
            b: 50,
            a: 1
        };

        me.originalColorString = "rgba(255,50,50,1)";

        me.originalColor = {
            r: 255,
            g: 50,
            b: 50,
            a: 1
        };

        //call Ext.button.Button constructor
        me.callParent(arguments);

        //retrieve a reference to the colorpicker
        me.colorPicker = Ext.ux.colorpicker.Colorpicker.getSharedColorpickerInstance();
        me.colorPickerConnected = false;

        //listen for owner changes on color picker
        me.colorPicker.on("ownerchange", me.disconnectColorPicker, me);
    },

    /**
     * Set to rgba color directly
     * @param r
     * @param g
     * @param b
     * @param a
     */
    setRGBAColor : function(r, g, b, a) {
        var me          = this,
            color       = me.color,
            colorPicker = me.colorPicker;

        Ext.apply(me.color, {
            r : r,
            g : g,
            b : b,
            a : a
        });

        //update button color elements
        me.updatePreviewColors();

        //if we are owner of the color picker
        if (colorPicker.owner === this && colorPicker.isVisible()) {
            //update colorpicker color and alpha
            colorPicker.setRGBA(color.r, color.g, color.b, color.a);
        }
    },

    /**
     * Displays the colorpicker next to the button
     */
    showColorPicker : function() {
        var me          = this,
            color       = me.color,
            colorPicker = me.colorPicker,
            el          = me.el,
            pos         = el.getXY();

        console.log(me.color);

        //Take over colorpicker. make sure we play nice with other users
        //returns true if taken over, or false if we already own it
        var notMine = colorPicker.takeOver(me);

        //hide the color picker (in case it is displayed somwhere else)
        colorPicker.hide();

        //if we just took over the color picker
        if (notMine) {
            colorPicker.on({
                colorchange : me.colorChanged,
                didCancel   : me.onDidCancel,
                scope       : me
            });
        }

        //show colorpicker at position
        colorPicker.showWithTipAt(pos[0], pos[1], el.getWidth(), el.getHeight(), 0);

        //set color correctly and make current color the default color
        colorPicker.setRGBA(color.r, color.g, color.b, color.a);
        colorPicker.makeCurrentColorDefault();
    },

    /**
     * When we are relinqueshed ownership of the colorpicker
     */
    disconnectColorPicker : function() {
        var me = this;

        me.colorPicker.un({
            colorchange : me.colorChanged,
            didCancel   : me.onDidCancel,
            scope       : me
        });
    },

    /**
     * When color changed from color picker
     * @param rgb
     * @param alpha
     * @param intermediate
     */
    colorChanged : function(rgb, alpha, intermediate) {
        var me = this;

        Ext.apply(me.color, {
            r : rgb[0],
            g : rgb[1],
            b : rgb[2],
            a : alpha
        });

        //update color of button
        me.updatePreviewColors();

        var rgba = Ext.ux.colorpicker.color.getRGBAString(me.color);

        //fire colorchange event
        this.fireEvent('colorchange', rgba);
    },

    /**
     *
     */
    onDidCancel : function() {
        var me = this;

        me.fireEvent('colorchange', me.originalColorString);
        me.color = me.originalColor;
        me.updatePreviewColors();
    },

    /**
     * Extending onRender method of parent Ext.button to work with the new color preview
     * @param ct
     * @param position
     */
    onRender : function(ct, position) {
        var me = this;

        me.callParent(arguments);

        //find the two color preview elements
        me.solidColorEl = me.el.down(".AN-colorbtn-rgb");
        me.alphaColorEl = me.el.down(".AN-colorbtn-rgba");

        //update color of elements
        me.updatePreviewColors();

        me.el.on('click', me.showColorPicker, me);
    },

    /**
     *
     */
    updatePreviewColors : function() {
        //this.alphaColorEl.dom.style.backgroundColor = Ext.ux.colorpicker.color.getRGBAString(this.color);
    },

    /**
     * Override Ext.button.Button class to add custom class
     * @param cls
     * @return {*}
     */
    setIconClass : function(cls) {
        var me = this;

        me.iconCls = cls;

        if (me.el) {
            me.btnEl.dom.className = '';
            me.btnEl.addClass(["AN-colorpicker-btn", cls || '']);
            me.setButtonClass();
        }

        return me;
    }
});