/**
 * @class Ext.ux.colorpicker.SaturationSlider
 * @extends Ext.ux.colorpicker.GenericSlider
 *
 */
Ext.define('Ext.ux.colorpicker.SaturationSlider', {
    extend : 'Ext.ux.colorpicker.GenericSlider',

    /**
     *
     * @param y
     * @return {Array}
     */
    RGBAcolorAt : function(y) {
        return [0, 0, 0, 0];
    },

    /**
     * Override -> base method not needed
     */
    renderMap : function() {
        this.createGradient();
    },

    /**
     *
     */
    createGradient : function() {
        var me   = this,
            rgb  = Ext.ux.colorpicker.color.hsv2rgb(me.h, 1, me.v),
            rgb2 = Ext.ux.colorpicker.color.hsv2rgb(me.h, 0, me.v);

        rgb  = "rgb(" + rgb.join(',') + ')';
        rgb2 = "rgb(" + rgb2.join(',') + ')';

        me.parent.setStyle({
            backgroundImage : "-webkit-linear-gradient(" + rgb + "," + rgb2 + ")"
        });
    },

    /**
     *
     * @param h
     * @param s
     * @param v
     * @return {Boolean}
     */
    shouldUpdate : function(h, s, v) {
        if (h || v) {
            this.createGradient();
        }
        return false;
    },

    /**
     *
     */
    updatePositionFromHSV : function() {
        this.moveSliderFromFraction(1 - this.s);
    }
});