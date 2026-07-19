"use strict";
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import St from 'gi://St';

import DesktopWidget from './desktopWidget.js';

export default GObject.registerClass(
    class ImageCarouselWidget extends DesktopWidget {
        _init(width = 300, height = 300, interval = 5000) {
            super._init(width, height);

            this._interval = interval;
            this._images = [];
            this._currentIndex = 0;
            this._timeoutId = 0;

            this._image = new St.Icon({
                style_class: 'image-carousel-image',
                icon_size: Math.min(width, height),
            });

            this.add_child(this._image);

            this._loadImages();
            this._showCurrentImage();

            this._timeoutId = GLib.timeout_add(
                GLib.PRIORITY_DEFAULT,
                this._interval,
                () => {
                    this._nextImage();
                    return GLib.SOURCE_CONTINUE;
                }
            );
        }

        _loadImages() {
            const picturesPath = GLib.build_filenamev([
                GLib.get_home_dir(),
                'Pictures',
            ]);

            const directory = Gio.File.new_for_path(picturesPath);

            try {
                const enumerator = directory.enumerate_children(
                    'standard::name,standard::type',
                    Gio.FileQueryInfoFlags.NONE,
                    null
                );

                let fileInfo;

                while ((fileInfo = enumerator.next_file(null)) !== null) {
                    if (
                        fileInfo.get_file_type() !== Gio.FileType.REGULAR
                    ) {
                        continue;
                    }

                    const name = fileInfo.get_name().toLowerCase();

                    if (
                        name.endsWith('.jpg') ||
                        name.endsWith('.jpeg') ||
                        name.endsWith('.png') ||
                        name.endsWith('.gif') ||
                        name.endsWith('.webp')
                    ) {
                        this._images.push(
                            directory.get_child(fileInfo.get_name())
                        );
                    }
                }

                enumerator.close(null);
            } catch (error) {
                console.error(
                    `Failed to load images from ${picturesPath}:`,
                    error
                );
            }
        }

        _showCurrentImage() {
            if (this._images.length === 0) {
                console.warn('No images found in ~/Pictures');
                return;
            }

            const file = this._images[this._currentIndex];

            this._image.gicon = Gio.FileIcon.new(file);
        }

        _nextImage() {
            if (this._images.length === 0)
                return;

            this._currentIndex =
                (this._currentIndex + 1) % this._images.length;

            this._showCurrentImage();
        }

        update() {
            this._loadImages();
            this._currentIndex = 0;
            this._showCurrentImage();
        }

    }
);