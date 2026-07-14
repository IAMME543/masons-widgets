import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

export default class WidgetRegistry {
    constructor(extension_path, settings) {
        this.extension_path = extension_path;
        this._registry = this._GetAvailableWidgets();
        this.settings = settings;
    }

    GetActive() {
        return JSON.parse(this.settings.get_string("widget-layout"));
    }

    get(id) {
        return this._registry.get(id)
    }
    list() {
        return this._registry.keys()
    }
    async load(id) {
        const entry = this.get(id);

        if (!entry) {
            throw new Error(`Widget '${id}' not found`);
        }

        const uri = GLib.filename_to_uri(entry.script.get_path(), null);
        const module = await import(uri);

        return module.default;
    }
    _GetAvailableWidgets() {
        let registry = new Map()
        const dir = Gio.File.new_for_path(`${this.extension_path}/widgets`)

        const enumerator = dir.enumerate_children(
            "standard::name,standard::type",
            Gio.FileQueryInfoFlags.NONE,
            null
        );


        let info;
        while ((info = enumerator.next_file(null)) !== null) {
            const name = info.get_name();
            const type = info.get_file_type();

            if (type === Gio.FileType.DIRECTORY) {
                console.log(`Found widget: ${name}`);

                const widget_dir = dir.get_child(name);

                const metadata_file = widget_dir.get_child("metadata.json");

                const [success, contents] = metadata_file.load_contents(null);
                const script = widget_dir.get_child("widget.js");
                console.log(script.get_path());

                if (success) {
                    const json = new TextDecoder().decode(contents);
                    const metadata = JSON.parse(json);


                    registry.set(metadata.id, {
                        metadata, directory: widget_dir, script: script
                    })
                } else {
                    console.error(`Widget metadata not found in ${widget_dir}`)
                }
            }
        }

        enumerator.close(null);

        return registry
    }
}