"use strict";

import GObject from 'gi://GObject';
import GLib from 'gi://GLib';
import St from 'gi://St';
import DrawingWidget from '../Base-Drawing-Widget/widget.js';

export default GObject.registerClass(
    class AnalogClock extends DrawingWidget {
        _init(width, height, disable_background = false) {
            super._init(width, height);

            this.disable_background = disable_background
        }
        draw(cr) {
            const now = new Date();

            const w = this.width;
            const h = this.height;
            const cx = w / 2;
            const cy = h / 2;
            const r = Math.min(w, h) * 0.5;

            // Background
            if (!this.disable_background) {
                cr.setSourceRGBA(0.1, 0.1, 0.1, 0.6);
                cr.arc(cx, cy, r, 0, Math.PI * 2);
                cr.fill();
            }

            // Hour marks
            cr.setLineWidth(2);

            for (let i = 0; i < 12; i++) {
                const a = i * Math.PI / 6 - Math.PI / 2;

                const x1 = cx + Math.cos(a) * r * 0.85;
                const y1 = cy + Math.sin(a) * r * 0.85;

                const x2 = cx + Math.cos(a) * r * 0.95;
                const y2 = cy + Math.sin(a) * r * 0.95;

                cr.moveTo(x1, y1);
                cr.lineTo(x2, y2);
            }
            cr.setSourceRGB(1, 1, 1)
            cr.stroke();


            const ms = now.getMilliseconds();
            const sec = now.getSeconds() + ms / 1000;
            const min = now.getMinutes() + sec / 60;
            const hour = (now.getHours() % 12) + min / 60;

            const drawHand = (angle, length, width, r, g, b) => {
                angle -= Math.PI / 2;

                cr.setSourceRGB(r, g, b);
                cr.setLineWidth(width);

                cr.moveTo(cx, cy);
                cr.lineTo(
                    cx + Math.cos(angle) * length,
                    cy + Math.sin(angle) * length
                );

                cr.stroke();
            };

            drawHand(hour * Math.PI / 6, r * 0.5, 5, 1, 1, 1);
            drawHand(min * Math.PI / 30, r * 0.75, 3, 1, 1, 1);
            drawHand(sec * Math.PI / 30, r * 0.85, 1.5, 1, 0.2, 0.2);

            // Center cap
            cr.setSourceRGB(1, 1, 1);
            cr.arc(cx, cy, 4, 0, Math.PI * 2);
            cr.fill();

        }
    });