import GObject from 'gi://GObject';
import GLib from 'gi://GLib';
import St from 'gi://St';

export default GObject.registerClass(
    class DesktopWidget extends St.Widget {
        _init(width = 300, height = 300) {
            super._init({ width, height });
        }

        update() {
            // subclasses can override
        }

        vfunc_destroy() {

            super.destroy();
        }
    });