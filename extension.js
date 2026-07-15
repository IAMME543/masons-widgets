/* TODO
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
        this.widget_registry = new WidgetRegistry(this.path, this.getSettings())
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
        if (this._settingsChangedId) {
            this.settings.disconnect(this._settingsChangedId);
            this._settingsChangedId = null;
        }

        if (this._monitorChangedId) {
            Main.layoutManager.disconnect(this._monitorChangedId);
            this._monitorChangedId = null;
        }

        if (this.grid) {
            if (this.grid.get_parent()) {
                this.grid.get_parent().remove_child(this.grid);
            }
            this.grid.destroy();
            this.grid = null;
        }

        this.settings = null;
        this.widget_registry = null;
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



        const active_widgets = this.widget_registry.GetActive();

        for (const widget of active_widgets) {
            const widget_from_reg = this.widget_registry.get(widget.id);
            console.log(widget_from_reg);


            const widget_class = await this.widget_registry.load(widget_from_reg.metadata.id);
            let widget_instance = new widget_class(widget_size, widget_size)

            widget_instance.set_size(widget_size, widget_size);
            widget_instance.set_x_expand(false);
            widget_instance.set_y_expand(false);
            widget_instance.set_x_align(Clutter.ActorAlign.CENTER);
            widget_instance.set_y_align(Clutter.ActorAlign.CENTER);

            layout.attach(
                widget_instance,
                widget.x,
                widget.y,
                1,
                1
            );
        }
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {

                if (!active_widgets.some(w => w.x === i && w.y === j)) {
                    const empty = new St.Widget({
                        // uncomment for debug
                        // width: 300,
                        // height: 300,
                        // style: 'background-color: red;',
                        // x_expand: false,
                        // y_expand: false,
                        // x_align: Clutter.ActorAlign.CENTER,
                        // y_align: Clutter.ActorAlign.CENTER
                    });
                    layout.attach(empty, i, j, 1, 1)
                }
            }

        }

        if (this.grid) {
            if (this.grid.get_parent()) {
                this.grid.get_parent().remove_child(this.grid);
            }
            this.grid.destroy();
        }

        this.grid = new_grid;
        Main.layoutManager._backgroundGroup.add_child(this.grid);
        console.log("DESKTOP WIDGET ENABLE CALLED");
    }

}