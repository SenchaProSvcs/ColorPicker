/**
 * View Model that holds the "selectedColor" of the color picker container.
 */
Ext.define('Ext.ux.colorpicker.ColorPickerModel', {
    extend : 'Ext.app.ViewModel',
    alias  : 'viewmodel.colorpickermodel',

    requires: [
        'Ext.ux.colorpicker.ColorUtils'
    ],

    data: {
        selectedColor: {
            r : 255,  // red
            g : 255,  // green
            b : 255,  // blue
            h : 0,    // hue,
            s : 1,    // saturation
            v : 1,    // value
            a : 1     // alpha (opacity)
        },
        previousColor: {
            r : 0,    // red
            g : 0,    // green
            b : 0,    // blue
            h : 0,    // hue,
            s : 1,    // saturation
            v : 1,    // value
            a : 1     // alpha (opacity)
        }
    },

    constructor: function() {
        var me = this;

        me.callParent(arguments);

        me.bind('{selectedColor}', me.onSelectedColorChange, me, { deep: true });
    },

    // Fires "select" event and calls handler() on the view
    onSelectedColorChange: function() {
        var me             = this,
            view           = me.getView(),
            hexNoHashValue = view.getValue();

        // fire handler() on view if it has it
        if (view.handler) {
            view.handler.apply(view, [view, hexNoHashValue]);
        }

        // fire event
        view.fireEvent('select', view, hexNoHashValue);
    },

    formulas: {

        // Hexadecimal representation of the color
        hex: {
            get: function(data) {
                var r = data('selectedColor.r').toString(16),
                    g = data('selectedColor.g').toString(16),
                    b = data('selectedColor.b').toString(16),
                    result;

                result = Ext.ux.colorpicker.ColorUtils.rgb2hex(r, g, b);
                return '#' + result;
            },

            set: function(hex) {
                var vm = this,
                    newRGB,
                    newHSV;

                newRGB = Ext.ux.colorpicker.ColorUtils.hex2rgb(hex);
                vm.set('selectedColor.r', newRGB.r);
                vm.set('selectedColor.g', newRGB.g);
                vm.set('selectedColor.b', newRGB.b);

                // Re-calculate HSV
                newHSV = Ext.ux.colorpicker.ColorUtils.rgb2hsv(newRGB.r, newRGB.g, newRGB.b);
                vm.set('selectedColor.h', newHSV.h);
                vm.set('selectedColor.s', newHSV.s);
                vm.set('selectedColor.v', newHSV.v);
            }
        },

        // "R" in "RGB"
        red: {
            get: function(data) {
                return data('selectedColor.r');
            },

            set: function(r) {
                var vm            = this,
                    selectedColor = vm.get('selectedColor'),
                    newHSV;

                selectedColor.r = r;

                // Re-calculate HSV
                newHSV = Ext.ux.colorpicker.ColorUtils.rgb2hsv(selectedColor.r, selectedColor.g, selectedColor.b);
                Ext.apply(selectedColor, newHSV);

                // Update ViewModel
                vm.set('selectedColor', selectedColor);
            }
        },

        // "G" in "RGB"
        green: {
            get: function(data) {
                return data('selectedColor.g');
            },

            set: function(g) {
                var vm            = this,
                    selectedColor = vm.get('selectedColor'),
                    newHSV;

                selectedColor.g = g;

                // Re-calculate HSV
                newHSV = Ext.ux.colorpicker.ColorUtils.rgb2hsv(selectedColor.r, selectedColor.g, selectedColor.b);
                Ext.apply(selectedColor, newHSV);

                // Update ViewModel
                vm.set('selectedColor', selectedColor);
            }
        },

        // "B" in "RGB"
        blue: {
            get: function(data) {
                return data('selectedColor.b');
            },

            set: function(b) {
                var vm            = this,
                    selectedColor = vm.get('selectedColor'),
                    newHSV;

                selectedColor.b = b;

                // Re-calculate HSV
                newHSV = Ext.ux.colorpicker.ColorUtils.rgb2hsv(selectedColor.r, selectedColor.g, selectedColor.b);
                Ext.apply(selectedColor, newHSV);

                // Update ViewModel
                vm.set('selectedColor', selectedColor);
            }
        },

        // "H" in HSV
        hue: {
            get: function(data) {
                return data('selectedColor.h') * 360;
            },

            set: function(hue) {
                var vm            = this,
                    selectedColor = vm.get('selectedColor'),
                    newRGB;

                selectedColor.h = hue/360;
                newRGB = Ext.ux.colorpicker.ColorUtils.hsv2rgb(selectedColor.h, selectedColor.s, selectedColor.v);
                Ext.apply(selectedColor, newRGB);
                vm.set('selectedColor', selectedColor);
            }
        },

        // "S" in HSV
        saturation: {
            get : function(data) {
                return data('selectedColor.s') * 100;
            },

            set: function(saturation) {
                var vm            = this,
                    selectedColor = vm.get('selectedColor'),
                    newRGB;

                selectedColor.s = saturation/100;
                newRGB = Ext.ux.colorpicker.ColorUtils.hsv2rgb(selectedColor.h, selectedColor.s, selectedColor.v);
                Ext.apply(selectedColor, newRGB);
                vm.set('selectedColor', selectedColor);
            }
        },

        // "V" in HSV
        value: {
            get: function(data) {
                var r = data('selectedColor.r'),
                    g = data('selectedColor.g'),
                    b = data('selectedColor.b'),
                    hsv;

                hsv = Ext.ux.colorpicker.ColorUtils.rgb2hsv(r, g, b);
                return hsv.v * 100;
            },

            set: function(value) {
                var vm            = this,
                    selectedColor = vm.get('selectedColor'),
                    newRGB;

                selectedColor.v = value/100;
                newRGB = Ext.ux.colorpicker.ColorUtils.hsv2rgb(selectedColor.h, selectedColor.s, selectedColor.v);
                Ext.apply(selectedColor, newRGB);
                vm.set('selectedColor', selectedColor);
            }
        },

        alpha: {
            get: function(data) {
                var a = data('selectedColor.a');
                return a * 100;
            },

            set: function(alpha) {
                var vm            = this,
                    selectedColor = vm.get('selectedColor');

                selectedColor.a = alpha/100;
                vm.set('selectedColor', selectedColor);
            }
        }
    } // eo formulas

});