Ext.define('SenchaProServices.colorpicker.WindowController', {
    extend : 'Ext.app.ViewController',
    alias: 'controller.sps_colorpickerwindowcontroller',

    requires: [
        'SenchaProServices.colorpicker.ColorUtils'
    ],

    // Updates Saturation/Value in the model based on ColorMap; params:
    // xPercent - where is the handle relative to the color map width
    // yPercent - where is the handle relative to the color map height
    onColorMapHandleDrag: function(xPercent, yPercent) {
        // console.log(xPercent,yPercent);
        var me = this,
            vm = me.getViewModel(),
            rgba = vm.get('selectedColor'),
            hsv;

        // Color map selection really only affects saturation and value of the color
        hsv = SenchaProServices.colorpicker.ColorUtils.rgb2hsv(rgba.r, rgba.g, rgba.b);

        // x-axis of color map with value 0-1 translates to saturation
        hsv.s = xPercent;

        // y-axis of color map with value 0-1 translates to reverse of "value"
        hsv.v = 1-yPercent;

        // Save back to view model in one shot
        Ext.apply(rgba, SenchaProServices.colorpicker.ColorUtils.hsv2rgb(hsv.h, hsv.s, hsv.v));
        vm.set('selectedColor', rgba);
    }
});