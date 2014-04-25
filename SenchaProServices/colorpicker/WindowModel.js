/**
 * View Model that holds the "selectedColor" of the color picker window.
 */
Ext.define('SenchaProServices.colorpicker.WindowModel', {
    extend : 'Ext.app.ViewModel',
    alias  : 'viewmodel.sps_colorpickerwindowmodel',

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
                b = data('selectedColor.b').toString(16);

            if (r.length < 2) {
                r = '0' + r;
            }

            if (g.length < 2) {
                g = '0' + g;
            }

            if (b.length < 2) {
                b = '0' + b;
            }

            return '#' + r + g + b;
        },

        hue: function(data) {
            return 'hTODO';
        },

        saturation: function(data) {
            return 'sTODO';
        },

        value: function(data) {
            return 'vTODO';
        }
    }
});