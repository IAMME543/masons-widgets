"use strict";

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

            this.connect('destroy', () => {
                this._stopTimer();
                super.destroy();
            });

            this.connect('repaint', () => {
                const cr = this.get_context();

                try {
                    this.draw(cr);
                } finally {
                    cr.$dispose();
                }
            });
        }

        _stopTimer() {
            if (this._timer) {
                GLib.Source.remove(this._timer);
                this._timer = 0;
            }
        }

        update() {
        }

        draw(cr) {
        }
    });