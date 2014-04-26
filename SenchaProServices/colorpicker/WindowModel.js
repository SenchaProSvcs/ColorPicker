/**
 * View Model that holds the "selectedColor" of the color picker window.
 */
Ext.define('SenchaProServices.colorpicker.WindowModel', {
    extend : 'Ext.app.ViewModel',
    alias  : 'viewmodel.sps_colorpickerwindowmodel',

    requires: [
        'SenchaProServices.colorpicker.ColorUtils'
    ],

    data: {
        selectedColor: {
            r : 20,  // red
            g : 255, // green
            b : 0,   // blue
            a : 1    // alpha (opacity)
        }
    },

    formulas: {

        // Hexadecimal representation of the color
        hex: function(data) {
            var r = data('selectedColor.r').toString(16),
                g = data('selectedColor.g').toString(16),
                b = data('selectedColor.b').toString(16),
                result;

            result = SenchaProServices.colorpicker.ColorUtils.rgb2hex(r, g, b);
            return '#' + result;
        },

        hue: function(data) {
            var r = data('selectedColor.r'),
                g = data('selectedColor.g'),
                b = data('selectedColor.b'),
                hsv;

            hsv = SenchaProServices.colorpicker.ColorUtils.rgb2hsv(r, g, b);
            return hsv.h;
        },

        saturation: function(data) {
            var r = data('selectedColor.r'),
                g = data('selectedColor.g'),
                b = data('selectedColor.b'),
                hsv;

            hsv = SenchaProServices.colorpicker.ColorUtils.rgb2hsv(r, g, b);
            return hsv.s * 100;
        },

        value: function(data) {
            var r = data('selectedColor.r'),
                g = data('selectedColor.g'),
                b = data('selectedColor.b'),
                hsv;

            hsv = SenchaProServices.colorpicker.ColorUtils.rgb2hsv(r, g, b);
            return hsv.v * 100;
        }
    }
});