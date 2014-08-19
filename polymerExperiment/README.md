Polymer experiment
======

Slide show using polymer library. [Polymer](http://www.polymer-project.org/) is the library that implements Material Design.
I've used paper elements (UI widgets) and animation features to create this slide show.

Dependencies
------
No external dependency is used, you can clone the project and run it locally.
The project includes:
- jQuery
- Polymer library (cleaning may be necessary, some files might not be used)

How to use
------
Load the page, click/press Enter/press right key to go to the next slide. Second slide gives an overview of the controls available. Demo can be run at http://experiments.midkemia.fr/polymerExperiment/

Next steps
------
- Add more slide samples (with images, embedded elements...)
- Improve slides theme (sorry, I'm not a graphic designer)
- Test on different platforms
- Bug fix (of course)

Going further
------
This experiment may be used to build a more advanced slide show creator and viewer. Next and Previous actions could be controlled by another window with message exchange or even by another browser.
A slide creator may also be built upon it since no slide number is hard coded (only need to launch slides.init method again).