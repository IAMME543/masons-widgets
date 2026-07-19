/*
Does not work. Blur expands outside of the css border radius clip. 
Need to make a circular mask for clutter effect
*/
"use strict";
import GObject from 'gi://GObject';
import AnalogClock from "../Analog-Clock/widget.js";
import DesktopWidget from "../Base-Desktop-Widget/widget.js";
import Clutter from 'gi://Clutter';
import St from 'gi://St';
import Shell from 'gi://Shell';

export default GObject.registerClass(
    class BlurredAnalogClock extends DesktopWidget {
        _init(width, height) {
            super._init(width, height);


            let blur = new St.Widget({
                width: width,
                height: height,
                style: `
                    background-color: rgba(255,255,255,0.15);
                    border-radius: ${width / 2}px;`
            });
            blur.set_clip_to_allocation(true);

            let effect = new Shell.BlurEffect({
                brightness: 1.0,
                radius: 20,
            });

            effect.mode = Shell.BlurMode.BACKGROUND;

            blur.add_effect(effect);

            let clock = new AnalogClock(width, height, true)

            this.add_child(blur)
            this.add_child(clock)
        }
    })