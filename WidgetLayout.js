"use strict";

export default class WidgetLayout {
    constructor(settings) {
        this.settings = settings;
    }
    GetActive() {
        return JSON.parse(this.settings.get_string("widget-layout"));
    }

    AddActive(id, x, y, w, h) {
        const layout =
        {
            id: id,
            x: x,
            y: y,
            w: w,
            h: h
        }

        const existing = JSON.parse(this.settings.get_string("widget-layout"))
        existing.push(layout);
        this.settings.set_string("widget-layout", JSON.stringify(existing))
    }
    MoveActive(id, x, y) {
        const existing = JSON.parse(this.settings.get_string("widget-layout"))

        const widget = existing.find(w => w.id === id);

        if (widget) {
            widget.x = x;
            widget.y = y;
        }

        this.settings.set_string(
            "widget-layout",
            JSON.stringify(existing)
        );
    }
    RemoveActive() {
        const existing = JSON.parse(this.settings.get_string("widget-layout"));
        const updated = existing.filter(widget => widget.id !== id);

        this.settings.set_string("widget-layout", JSON.stringify(updated))
    }
}