/**
 * @class Ext.uxold.colorpicker.SaturationSlider
 * @extends Ext.uxold.colorpicker.GenericSlider
 *
 */
Ext.define('Ext.uxold.colorpicker.SaturationSlider', {
    extend : 'Ext.uxold.colorpicker.GenericSlider',

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
            rgb  = Ext.uxold.colorpicker.color.hsv2rgb(me.h, 1, me.v),
            rgb2 = Ext.uxold.colorpicker.color.hsv2rgb(me.h, 0, me.v);

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