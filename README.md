experiments
===========

Experiments that may be used in more complex projects

ThreeJs experiment
======
This experiment is based on the sample "CSS3 Periodic Table" provided on [Threejs.org](http://threejs.org website): [Periodic Table example](http://threejs.org/examples/#css3d_periodictable) and also use [tweenjs](http://github.com/sole/tween.js) to ease the animation.
When I read about threejs and found this sample, I used integrated controls to place camera inside the helix. However, cards were not looking at the center of the scene so I changed the logic of the helix placement to have cards looking at the center of the scene.
Finally, I've changed the controls that allowed me to look upside down in order to limit movements. Now, you can click of an element and the camera will change its orientation to look at it with a smooth transition.

Dependencies
------
The only external dependency is Jquery standard library which is not included in the repository. Other libs are provided

How to use
------
Load the page, wait for the elements to be displayed and then click of any to change camera orientation

Next steps
------
- Add more controls, keyboard controls mainly
- Move also the selected element on selection for it use more space on the screen (move closer to the camera/center of the scene)
- Change contents to use dynamic loaded information (weather for instance)
- Add some kind of "grid" feature to be able to display different card size
