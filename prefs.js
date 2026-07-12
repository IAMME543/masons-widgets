import Gio from 'gi://Gio';
import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';

import { ExtensionPreferences, gettext as _ } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';


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

    }
}