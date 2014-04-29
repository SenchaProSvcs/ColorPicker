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
        hex: {
            get: function(data) {
                var r = data('selectedColor.r').toString(16),
                    g = data('selectedColor.g').toString(16),
                    b = data('selectedColor.b').toString(16),
                    result;

                result = SenchaProServices.colorpicker.ColorUtils.rgb2hex(r, g, b);
                return '#' + result;
            },

            set: function(hex) {
                var vm = this,
                    newRgb;

                newRgb = SenchaProServices.colorpicker.ColorUtils.hex2rgb(hex);
                vm.set('selectedColor.r', newRgb.r);
                vm.set('selectedColor.g', newRgb.g);
                vm.set('selectedColor.b', newRgb.b);
            }
        },

        // "H" in HSV
        hue: {
            get: function(data) {
                var r = data('selectedColor.r'),
                    g = data('selectedColor.g'),
                    b = data('selectedColor.b'),
                    hsv;

                hsv = SenchaProServices.colorpicker.ColorUtils.rgb2hsv(r, g, b);
                return hsv.h * 360;
            },

            set: function(hue) {
                var vm      = this,
                    curRgba = vm.get('selectedColor'),
                    newRgb,
                    hsv;

                hsv = SenchaProServices.colorpicker.ColorUtils.rgb2hsv(curRgba.r, curRgba.g, curRgba.b);
                hsv.h = hue/360;
                newRgb = SenchaProServices.colorpicker.ColorUtils.hsv2rgb(hsv.h, hsv.s, hsv.v);
                vm.set('selectedColor.r', newRgb.r);
                vm.set('selectedColor.g', newRgb.g);
                vm.set('selectedColor.b', newRgb.b);
            }
        },

        // "S" in HSV
        saturation: function(data) {
            var r = data('selectedColor.r'),
                g = data('selectedColor.g'),
                b = data('selectedColor.b'),
                hsv;

            hsv = SenchaProServices.colorpicker.ColorUtils.rgb2hsv(r, g, b);
            return hsv.s * 100;
        },

        // "V" in HSV
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