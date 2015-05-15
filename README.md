MUJIN Frontend Programming Challenge
=============

Howdy there candidate! This programming challenge is to help us gauge your frontend software engineering skills during our hiring process. You'll be developing a simple app with Backbone (or AngularJS, or a framework X that can neatly organize resources and work seamlessly with a RESTful backend) from scratch.

For this challenge, you'll be using Backbone/AngularJS/X in conjunction with [threejs](http://threejs.org/) to make a simple 3d object viewer and editor. Users should be able to create / edit / update / delete 3d primitives (like boxes, spheres, etc.) in their browser. It'll be similar in function to the [threejs editor](http://threejs.org/editor/) but far less complicated and built with Backbone/AngularJS/X instead of vanilla javascript.

###Instructions:

- Create a new repository on github and copy this README file in. DO NOT fork this repo and don't put "MUJIN" in the name of the repo.
- Complete the challenge, making commits along the way. The components and other things we're looking for are outlined below. You can use any additional dependencies / development tools you want (within reason), but at minimum you have to use Backbone/AngularJS/X and threejs.
- Deploy your completed application somewhere public on the internet and send us the link when you're done.

###Major components of the application:

- Renderer
  - Should be a view that wraps the threejs renderer
  - Able to navigate around the 3d environment with a mouse
  - Click on drawables in the renderer and trigger a custom event that the rest of the application responds to
- Drawable
  - Should be a model that represents objects in the scene
  - Store model attributes in browser local storage. Should be able to refresh the page and not lose any information about the drawables.
  - All changes to model attributes should be immediately reflected in the renderer when they happen
  - Able to change position and orientation of drawable by modifying model attributes. You can choose what attributes you want to use to represent this (could use a 4x4 `matrix` attribute, or separate `translation` / `quaternion` attributes for example).
  - Able to change the color of the drawable by modifying the `color` attribute
  - Able to change the name of the drawable by modifying the `name` attribute
  - Able to change various model attributes to change the properties of the dimensions of the geometry depending on the geometry type. So for example, if the drawable is a `box`, able to set the `length`, `width`, and `height`.
    - Geometry types and dimension attributes:
      - `box` (`length`, `width`, `height`)
      - `sphere` (`radius`)
- Drawable list
  - One or more views that list all the objects by name and type
- Drawable create / delete controls
  - One or more views that allows the creation and deletion of drawables
- Drawable edit controls
  - One or more views that allows the modification of drawable attributes
  - Should be able to edit attributes common to all drawables, as well as attributes that depend on the geometry type of the drawable
  - If a drawable is clicked in the renderer, focus of the controls should change to that drawable

###Bonus feature:
- Allow clicking and dragging of drawables to change their position and orientation

###Scoring:
You can take a look at scoring.md for more details.



###Good luck!
Feel free to email us with any questions!