import GObject from 'gi://GObject';
import GLib from 'gi://GLib';
import St from 'gi://St';


export default GObject.registerClass(
    class DesktopWidget extends St.DrawingArea {
        _init(width = 300, height = 300) {
            super._init({
                width,
                height,
            });


            this.progress = 0;

            this._timer = GLib.timeout_add(
                GLib.PRIORITY_DEFAULT,
                1000 / 60, // ~60 updates per second
                () => {
                    this.progress += 0.01;

                    this.queue_repaint();

                    return GLib.SOURCE_CONTINUE;
                }
            );
        }

        vfunc_repaint() {
            let cr = this.get_context();

            // draw using current state
            cr.setSourceRGB(1, 0, 0);

            cr.arc(
                this.width / 2,
                this.height / 2,
                20 * this.progress,
                0,
                Math.PI * 2
            );

            cr.fill();

            cr.$dispose();
        }

        vfunc_destroy() {
            if (this._timer) {
                GLib.source_remove(this._timer);
                this._timer = null;
            }

            super.destroy();
        }
    })