import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import GLib from 'gi://GLib';
import St from 'gi://St';
import Clutter from 'gi://Clutter';

export default class DesktopWidgetsExtension {
    constructor() {
        this.grid = null;
        this._monitorChangedId = null;
    }
    enable() {
        this._monitorChangedId = Main.layoutManager.connect(
            'monitors-changed',
            () => {
                this.buildGrid();
            }
        );

        this.buildGrid();

    }

    disable() {
        if (this._monitorChangedId) {
            Main.layoutManager.disconnect(this._monitorChangedId);
            this._monitorChangedId = null;
        }

        if (this.grid) {
            this.grid.destroy();
            this.grid = null;
        }
    }

    buildGrid() {
        const outer_spacing = 20; //px
        const inner_spacing = 10; //px
        const widget_size = 200; //px

        // make sure it doesnt exist before we start making it
        if (this.grid) {
            this.grid.destroy();
            this.grid = null;
        }



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

        this.grid = new St.Widget({
            layout_manager: new Clutter.GridLayout(),
        });
        this.grid.set_position(
            work_area.x + outer_spacing,
            work_area.y + outer_spacing
        );

        this.grid.set_size(
            columns * widget_size + (columns - 1) * inner_spacing,
            rows * widget_size + (rows - 1) * inner_spacing
        );

        let layout = this.grid.layout_manager;
        layout.set_column_homogeneous(true);
        layout.set_row_homogeneous(true);
        layout.set_column_spacing(inner_spacing);
        layout.set_row_spacing(inner_spacing);

        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                layout.attach(new St.Widget({
                    style: 'background: red;',
                    width: widget_size,
                    height: widget_size,
                }), i, j, 1, 1)
            }

        }

        Main.layoutManager._backgroundGroup.add_child(this.grid);
        console.log("DESKTOP WIDGET ENABLE CALLED");
    }
}