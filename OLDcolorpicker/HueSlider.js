/**
 * @class Ext.uxold.colorpicker.HueSlider
 * @extends Ext.uxold.colorpicker.GenericSlider
 *
 */
Ext.define('Ext.uxold.colorpicker.HueSlider', {
    extend : 'Ext.uxold.colorpicker.GenericSlider',

    /**
     *
     * @param h
     * @param s
     * @param v
     * @return {Boolean}
     */
    shouldUpdate : function(h, s, v) {
        if (s || v) {
            this.updateColorAlpha();
        }

        return false;
    },

    /**
     * Gets the right grey and opacity to mix hue with the background
     */
    updateColorAlpha : function() {
        var me    = this,
            w     = 1 - me.s,
            b     = me.v,
            g     = 255,
            alpha = b * (w - 1) + 1,
            baseC = Math.round((g * w * b) / (alpha));

        me.parent.setStyle('background-color', "rgb(" + baseC + "," + baseC + "," + baseC + ")");
        me.canvas.setStyle('opacity', 1 - alpha);
    },

    /**
     *
     */
    renderMap : function() {
        this.updateColorAlpha();
        this.callParent();
    },

    /**
     *
     * @param y
     * @return {Array} RGBA
     */
    RGBAcolorAt : function(y) {
        var rgb = Ext.uxold.colorpicker.color.hsv2rgb(1 - y, this.s, this.v);
        rgb.push(255); //rgba

        return rgb;
    },

    /**
     *
     */
    updatePositionFromHSV : function() {
        this.moveSliderFromFraction(1 - this.h);
    }
});