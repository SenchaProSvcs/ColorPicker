/**
 * @class Ext.ux.colorpicker.Colorpicker
 * @extends Ext.ux.colorpicker.Popup
 *
 */
Ext.define('Ext.ux.colorpicker.Colorpicker', {
    extend : 'Ext.ux.colorpicker.Popup',

    requires : [
        'Ext.ux.colorpicker.View',
        'Ext.ux.colorpicker.color',
        'Ext.ux.colorpicker.Swatches'
    ],

    mixins : {
        observable : 'Ext.util.Observable'
    },

    statics : {
        /**
         *
         */
        _sharedColorpicker : false,

        /**
         *
         * @return Ext.ux.colorpicker.Colorpicker
         */
        getSharedColorpickerInstance : function() {
            if (!this._sharedColorpicker) {
                this._sharedColorpicker = new Ext.ux.colorpicker.Colorpicker();
            }
            return this._sharedColorpicker;
        }
    },

    /**
     *
     */
    defaultColor : {
        rgb   : [0, 0, 0],
        alpha : 1
    },

    /**
     *
     */
    firstEvent : true,

    /**
     *
     */
    sliders : [],

    /**
     *
     * @param config
     */
    constructor : function(config) {
        this.callParent(arguments);
        this.mixins.observable.constructor.call(this, config);
    },

    /**
     *
     * @param owner
     * @return {Boolean}
     */
    takeOver : function(owner) {
        //if same owner, don't need to do anything
        if (owner === this.owner) {
            return false;
        }

        //if not the same owner
        this.fireEvent("ownerchange");

        this.owner = owner;

        return true;
    },

    /**
     *
     */
    initComponent : function() {
        var me = this;

        me.height = 373;
        me.width  = 524;
        me.contentClass = "th-colorpicker";

        me.callParent(arguments);

        me.addEvents(
            /**
             * @event didCancel
             * Fires when the **{@link #autoSize}** function is triggered and the field is resized according to the
             */
            'didCancel',

            /**
             * @event didCancel
             * Fires when the **{@link #autoSize}** function is triggered and the field is resized according to the
             */
            'didCancel',

            /**
             * @event didCancel
             * Fires when the **{@link #autoSize}** function is triggered and the field is resized according to the
             */
            'didCancel',

            /**
             * @event didCancel
             * Fires when the **{@link #autoSize}** function is triggered and the field is resized according to the
             */
            'didCancel'
        );
    },

    /**
     *
     */
    onRender : function() {
        var me = this;

        me.callParent(arguments);

        //render color picker view
        me.view = new Ext.ux.colorpicker.View();

        me.view.renderInsideElement(me.contentEl);

        me.connectToView();

        var view = me.view;

        me.sliders = [
            view.map,
            view.barH,
            view.barS,
            view.barV,
            view.barA
        ];
    },

    /**
     *
     */
    connectToView : function() {
        var me   = this,
            view = me.view;

        view.on({
            addToPalette      : me.onAddToPalette,
            cancel            : me.onCancel,
            defaultColorClick : me.useDefaultColor,
            fieldChange       : me.onFieldChange,
            fieldChangeDone   : me.onChangeComplete,
            save              : me.onSave,
            scope             : me
        });

        view.map.on({
            positionChange         : me.onMapChange,
            positionChangeComplete : me.onChangeComplete,
            scope                  : me
        });

        view.barH.on({
            positionChange         : me.onHueChange,
            positionChangeComplete : me.onChangeComplete,
            scope                  : me
        });

        view.barS.on({
            positionChange         : me.onSaturationChange,
            positionChangeComplete : me.onChangeComplete,
            scope                  : me
        });

        view.barV.on({
            positionChange         : me.onValueChange,
            positionChangeComplete : me.onChangeComplete,
            scope                  : me
        });

        view.barA.on({
            positionChange         : me.onAlphaChange,
            positionChangeComplete : me.onChangeComplete,
            scope                  : me
        });

        view.swatches.on('paletteSetSwatch', me.onPaletteSetSwatch, me);
    },

    /**
     *
     */
    onSave : function() {
        this.fireEvent('didSave', this);
        this.hide();
    },

    /**
     *
     */
    onCancel : function() {
        this.fireEvent('didCancel', this);
        this.hide();
    },

    /**
     *
     */
    onAddToPalette : function() {
        var me = this;

        me.view.swatches.addSwatch(
            me.rgb[0],
            me.rgb[1],
            me.rgb[2],
            me.alpha
        );
    },

    /**
     *
     * @param rgba
     */
    onPaletteSetSwatch : function(rgba) {
        var me = this;

        me.rgb[0] = rgba.r;
        me.rgb[1] = rgba.g;
        me.rgb[2] = rgba.b;
        me.alpha  = rgba.a;

        me.updateHSV();
        me.updateView();

        me.fireLastChangeEvent();
    },

    /**
     *
     */
    useDefaultColor : function() {
        var me           = this,
            defaultColor = me.defaultColor;

        me.rgb[0] = defaultColor.rgb[0];
        me.rgb[1] = defaultColor.rgb[1];
        me.rgb[2] = defaultColor.rgb[2];
        me.alpha  = defaultColor.alpha;

        me.updateHSV();
        me.updateView();

        me.fireLastChangeEvent();
    },

    /**
     *
     */
    onChangeComplete : function() {
        this.fireLastChangeEvent();
    },

    /**
     *
     * @param value
     * @param colorChannel
     */
    onFieldChange : function(value, colorChannel) {
        var me = this;

        switch (colorChannel) {
            case 'r':
                me.rgb[0] = value;
                me.updateHSV();
                break;
            case 'g':
                me.rgb[1] = value;
                me.updateHSV();
                break;
            case 'b':
                me.rgb[2] = value;
                me.updateHSV();
                break;
            case 'h':
                me.hsv[0] = value;
                me.updateRGB();
                break;
            case 's':
                me.hsv[1] = value;
                me.updateRGB();
                break;
            case 'v':
                me.hsv[2] = value;
                me.updateRGB();
                break;
            case 'a':
                me.alpha = value;
                break;
            case 'hex':
                me.rgb = Ext.ux.colorpicker.color.hex2rgb(value, this.rgb);
                me.updateHSV();
                break;
        }

        me.updateView();
        me.fireChangeEvent();
    },

    /**
     *
     * @param xy
     */
    onMapChange : function(xy) {
        var me = this;

        //s & 1-v
        me.hsv[1] = xy[0];
        me.hsv[2] = 1 - xy[1];

        me.updateRGB();
        me.updateView();
        me.fireChangeEvent();
    },

    /**
     * a "xPrime" means x = 1 - xPrime;
     * @param hPrime
     */
    onHueChange : function(hPrime) {
        var me = this;

        me.hsv[0] = 1 - hPrime;

        me.updateRGB();
        me.updateView();
        me.fireChangeEvent();
    },

    /**
     *
     * @param sPrime
     */
    onSaturationChange : function(sPrime) {
        var me = this;

        me.hsv[1] = 1 - sPrime;

        me.updateRGB();
        me.updateView();
        me.fireChangeEvent();
    },

    /**
     *
     * @param vPrime
     */
    onValueChange : function(vPrime) {
        var me = this;

        me.hsv[2] = 1 - vPrime;

        me.updateRGB();
        me.updateView();
        me.fireChangeEvent();
    },

    /**
     *
     * @param aprime
     */
    onAlphaChange : function(aprime) {
        this.alpha = 1 - aprime;

        this.updateView();
        this.fireChangeEvent();
    },

    /**
     *
     * @param r
     * @param g
     * @param b
     * @param a
     */
    setRGBA : function(r, g, b, a) {
        var me = this;

        me.rgb   = [r, g, b];
        me.alpha = a;
        me.hsv   = Ext.ux.colorpicker.color.rgb2hsv(r, g, b);

        me.updateView();
    },

    /**
     *
     * @return {*}
     */
    getColor : function() {
        return this.rgb.concat([this.alpha]);
    },

    /**
     *
     */
    makeCurrentColorDefault : function() {
        var me = this;

        me.defaultColor.alpha  = me.alpha;
        me.defaultColor.rgb[0] = me.rgb[0];
        me.defaultColor.rgb[1] = me.rgb[1];
        me.defaultColor.rgb[2] = me.rgb[2];

        me.view.setOldPreviewColor(me.defaultColor.rgb, me.defaultColor.alpha);
    },

    /**
     * This fires an event that does not get an undo, execpt for the first event
     */
    fireChangeEvent : function() {
        var me = this;

        if (me.firstEvent) {
            me.fireUndoableEvent();
            me.firstEvent = false;
        } else {
            me.fireEvent('colorchange', me.rgb, me.alpha, true);
        }
    },

    /**
     *
     */
    fireLastChangeEvent : function() {
        this.fireChangeEvent();
        this.firstEvent = true;
    },

    /**
     *
     */
    fireUndoableEvent : function() {
        this.fireEvent('colorchange', this.rgb, this.alpha, false);
    },

    /**
     *
     */
    updateRGB : function() {
        var hsv = this.hsv;
        this.rgb = Ext.ux.colorpicker.color.hsv2rgb(hsv[0], hsv[1], hsv[2]);
    },

    /**
     *
     */
    updateHSV : function() {
        var rgb = this.rgb;
        this.hsv = Ext.ux.colorpicker.color.rgb2hsv(rgb[0], rgb[1], rgb[2]);
    },

    /**
     *
     */
    updateView : function() {
        var me   = this,
            view = me.view;

        for (var i = 0; i < me.sliders.length; i++) {
            me.sliders[i].setHSV(me.hsv[0], me.hsv[1], me.hsv[2]);
        }

        view.barA.setAlpha(me.alpha);

        view.setNewPreviewColor(me.rgb, me.alpha);

        view.setColor(me.rgb, me.alpha, me.hsv);
    }
});