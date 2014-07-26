/**
 * @class Ext.uxold.colorpicker.ValueSlider
 * @extends Ext.uxold.colorpicker.GenericSlider
 *
 */
Ext.define('Ext.uxold.colorpicker.ValueSlider', {
    extend : 'Ext.uxold.colorpicker.GenericSlider',

    /**
     * OPTIMIZED, canvas is static.
     * @param y
     * @return {Array}
     */
    RGBAcolorAt : function(y) {
        return [0, 0, 0, Math.round(255 * y)]; //rgba
    },

    /**
     *
     * @param h
     * @param s
     * @param v
     * @return {Boolean}
     */
    shouldUpdate : function(h, s, v) {
        if (h || s) {
            var rgb = Ext.uxold.colorpicker.color.hsv2rgb(this.h, this.s, 1);
            this.parent.setStyle('background-color', "rgb(" + rgb[0] + "," + rgb[1] + ", " + rgb[2] + ")");
        }

        return false;
    },

    /**
     *
     */
    updatePositionFromHSV : function() {
        this.moveSliderFromFraction(1 - this.v);
    }
});