import Gio from 'gi://Gio';
import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';

import { ExtensionPreferences, gettext as _ } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';
import WidgetLayout from './WidgetLayout.js';
import WidgetRegistry from './WidgetRegistry.js';


export default class ExamplePreferences extends ExtensionPreferences {

    fillPreferencesWindow(window) {
        //create a settings object to bind to
        window._settings = this.getSettings();


        // Create a preferences page, with a single group
        const page = new Adw.PreferencesPage({
            title: _('General'),
            icon_name: 'dialog-information-symbolic',
        });
        window.add(page);

        const group = new Adw.PreferencesGroup({
            title: _('Configure'),
            description: _('Configure the extension'),
        });
        page.add(group);

        let sizeRow = new Adw.SpinRow({
            title: "Widget size",
            adjustment: new Gtk.Adjustment({
                lower: 100,
                upper: 1000,
                step_increment: 10,
                page_increment: 50,
            }),
        });
        group.add(sizeRow)

        window._settings.bind(
            "widget-size",
            sizeRow,
            "value",
            Gio.SettingsBindFlags.DEFAULT
        );

        let innerRow = new Adw.SpinRow({
            title: "Inner widget spacing.",
            adjustment: new Gtk.Adjustment({
                lower: 0,
                upper: 100,
                step_increment: 2,
                page_increment: 10,
            }),
        });
        group.add(innerRow)

        window._settings.bind(
            "inner-spacing",
            innerRow,
            "value",
            Gio.SettingsBindFlags.DEFAULT
        );

        let outerRow = new Adw.SpinRow({
            title: "Outer widget spacing.",
            adjustment: new Gtk.Adjustment({
                lower: 0,
                upper: 100,
                step_increment: 2,
                page_increment: 10,
            }),
        });
        group.add(outerRow)

        window._settings.bind(
            "outer-spacing",
            outerRow,
            "value",
            Gio.SettingsBindFlags.DEFAULT
        );

        /* Layout configuration */
        let widget_layout = new WidgetLayout(window._settings)
        let widget_registry = new WidgetRegistry(this.path, window._settings)

        const layout_group = new Adw.PreferencesGroup({
            title: _('Layout'),
            description: _('Configure the widget layout.'),
        });
        page.add(layout_group);


        let options = widget_registry.list()

        const dropdown = new Adw.ComboRow({
            title: 'Add item',
            model: Gtk.StringList.new(options),
        });
        layout_group.add(dropdown)



        const row = new Adw.SpinRow({
            title: 'Row position',
            adjustment: new Gtk.Adjustment({
                lower: 0,
                upper: 999,
                step_increment: 1
            })
        })
        layout_group.add(row)

        const column = new Adw.SpinRow({
            title: 'Column position',
            adjustment: new Gtk.Adjustment({
                lower: 0,
                upper: 999,
                step_increment: 1
            })
        })
        layout_group.add(column)

        const button_wrapper = new Adw.ActionRow({
            title: 'Add item',
        });

        const button = new Gtk.Button({
            label: 'Add',
            valign: Gtk.Align.CENTER,
        });
        button.connect('clicked', () => {
            this.AddWidgetToLayout(
                widget_layout,
                options[dropdown.selected],
                row.value,
                column.value
            );
        });
        button_wrapper.add_suffix(button);
        layout_group.add(button_wrapper)

        //const active_items = new Adw.ActionRow({})
    }

    AddWidgetToLayout(widget_layout, widget_id, row, column) {
        //widget_meta = widget_registry.get(widget_id).metadata;

        widget_layout.AddActive(widget_id, row, column, 1, 1) // eventually update to dynamically know the w and h

    }
}