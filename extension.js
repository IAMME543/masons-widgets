/* TODO

 - find a way to select widgets from widgets folder and set to specific position in grid.
 - Make some widgets
 - interactive non technical way to move, configure and add widgets

*/

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import GLib from 'gi://GLib';
import St from 'gi://St';
import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio'
import WidgetRegistry from './WidgetRegistry.js';

export default class DesktopWidgetsExtension extends Extension {
    constructor(metadata) {
        super(metadata);
        this.grid = null;
        this.settings = null;
        this._monitorChangedId = null;
        this.widget_registry = new WidgetRegistry(this.path)
    }
    enable() {

        this.settings = this.getSettings()
        this._monitorChangedId = Main.layoutManager.connect(
            'monitors-changed',
            () => {
                this.buildGrid().catch(console.error);
            }
        );

        this._settingsChangedId = this.settings.connect(
            'changed',
            (settings, key) => {
                console.log(`Setting changed: ${key}`);
                try {
                    this.buildGrid();
                } catch (e) {
                    console.error(e);
                }
            }
        );

        this.buildGrid().catch(console.error);

    }

    disable() {
        if (this._monitorChangedId) {
            Main.layoutManager.disconnect(this._monitorChangedId);
            this._monitorChangedId = null;
        }
        if (this._settingsChangedId) {
            this.settings.disconnect(this._settingsChangedId);
            this._settingsChangedId = null;
        }

        if (this.grid) {
            this.grid.destroy();
            this.grid = null;
        }
        this.grid = null;
        this.settings = null;
        this._monitorChangedId = null;
    }

    async buildGrid() {
        console.log("BUILD GRID CALLED");

        const outer_spacing = this.settings.get_int("outer-spacing");
        const inner_spacing = this.settings.get_int("inner-spacing");
        const widget_size = this.settings.get_int("widget-size");



        let work_area = Main.layoutManager.getWorkAreaForMonitor(
            Main.layoutManager.primaryIndex
        );
        let columns = Math.floor(
            work_area.width / (widget_size + inner_spacing)
        );

        let rows = Math.floor(
            work_area.height / (widget_size + inner_spacing)
        );


        /*  */
        let new_grid;

        new_grid = new St.Widget({
            layout_manager: new Clutter.GridLayout(),
        });
        new_grid.set_position(
            work_area.x + outer_spacing,
            work_area.y + outer_spacing
        );

        new_grid.set_size(
            columns * widget_size + (columns - 1) * inner_spacing,
            rows * widget_size + (rows - 1) * inner_spacing
        );

        let layout = new_grid.layout_manager;
        layout.set_column_homogeneous(true);
        layout.set_row_homogeneous(true);
        layout.set_column_spacing(inner_spacing);
        layout.set_row_spacing(inner_spacing);

        const clock = await this.widget_registry.load("analog-clock")

        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                // layout.attach(new St.Widget({
                //     style: 'background: red;',
                //     width: widget_size,
                //     height: widget_size,
                // }), i, j, 1, 1)

                layout.attach(new clock(widget_size, widget_size), i, j, 1, 1)
            }

        }



        if (new_grid) {
            if (this.grid)
                this.grid.destroy();

            this.grid = new_grid;
        }

        Main.layoutManager._backgroundGroup.add_child(this.grid);
        console.log("DESKTOP WIDGET ENABLE CALLED");
    }

}