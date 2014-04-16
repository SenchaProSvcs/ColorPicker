/**
 * @class Ext.ux.colorpicker.AlphaSlider
 * @extends Ext.ux.colorpicker.GenericSlider
 *
 */
Ext.define('Ext.ux.colorpicker.AlphaSlider', {
    extend : 'Ext.ux.colorpicker.GenericSlider',

    /**
     *
     * @param y
     * @return {*}
     */
    RGBAcolorAt : function (y) {
        var rgb = Ext.ux.colorpicker.color.hsv2rgb(this.h, this.s, this.v);
        rgb.push(Math.round((1 - y) * 255)); //rgba
        return rgb;
    },

    /**
     * Override -> base method not needed
     * @override
     * @private
     */
    renderMap : function () {
        this.createGradient();
    },

    /**
     *
     */
    createGradient : function () {
        var rgb  = Ext.ux.colorpicker.color.hsv2rgb(this.h, this.s, this.v),
            rgb1 = "rgba(" + rgb.join(',') + ',1)',
            rgb2 = "rgba(" + rgb.join(',') + ',0)';

        this.parent.setStyle({
            backgroundImage : "-webkit-linear-gradient(" + rgb1 + "," + rgb2 + "), url('resources/images/colorpicker/checkerboard.png')"
        });
    },

    /**
     * @override
     * @private
     * @param h
     * @param s
     * @param v
     * @return {Boolean}
     */
    shouldUpdate : function (h, s, v) {
        if (h || s || v) {
            this.createGradient();
            return true;
        }

        return false;
    },

    /**
     * Override to prevent the moving of the Slider
     * @override
     * @private
     */
    updatePositionFromHSV : function () {
        //hsv doesn't change alpha
    },

    /**
     * Animate the Slider Thumb to the new position
     * @param alpha
     */
    setAlpha : function (alpha) {
        if (!this.dragging) {
            this.moveSliderFromFraction(1 - alpha);
        }
    }
});