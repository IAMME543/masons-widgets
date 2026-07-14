import GObject from 'gi://GObject';
import GLib from 'gi://GLib';
import St from 'gi://St';

export default GObject.registerClass(
    class DrawingWidget extends St.DrawingArea {
        _init(width = 300, height = 300) {
            super._init({ width, height });

            this._timer = GLib.timeout_add(
                GLib.PRIORITY_DEFAULT,
                1000 / 60,
                () => {
                    this.update();
                    this.queue_repaint();
                    return GLib.SOURCE_CONTINUE;
                }
            );
        }

        update() {
            // subclasses can override
        }

        draw(cr) {
            // subclasses override
        }

        vfunc_repaint() {
            const cr = this.get_context();
            this.draw(cr);
            cr.$dispose();
        }

        vfunc_destroy() {
            if (this._timer)
                GLib.source_remove(this._timer);

            super.destroy();
        }
    });