# Mason's Gnome Widgets
Custom extendable desktop widget extention for Gnome.

**In Development**

# TODO
* find a way to select widgets from widgets folder and set to specific position in grid.
* Make some widgets
* interactive non technical way to move, configure and add widgets


# Making Widgets
create a javascript file in `/.widgets` and extend the `DesktopWidget` class. Overide `vfunc_repaint` to create the contents of the widget using cairo. `vfunc_destroy` is also overidable if content is created outside of the widget actor.

# Contributing
If you wanna go ahead. 

Not a clue what dependencies you'll need, you'll figure it out when you get an error for a missing package. 

To build, clone the repository, and either symlink it to `~/.local/share/gnome-shell/extensions/masons-widgets@masondoesthings.com` or use the commands:

```
gnome-extensions pack
gnome-extensions install
```