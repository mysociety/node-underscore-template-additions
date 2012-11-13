# Underscore Template Additions

[![Build Status](https://secure.travis-ci.org/mysociety/node-underscore-template-additions.png?branch=master)](https://travis-ci.org/mysociety/node-underscore-template-additions)

A small collection of tools that add features to underscore templates. These include that ability for templates to include each other, generating AMD code for use client-side and helpers for use in Express.


## Background

[Underscore templates](http://underscorejs.org/#template) are great. Simple, fast and flexible. However they lack one thing, which is that they do not know where they were loaded from, and hence cannot load other templates. This codebase fixes that.

## Usage

### Basics: Require, add templates, render one

```javascript    
// load the code
var UTA = require('underscore-template-additions');

// create a new template object and load templates from a directory
var templates = new UTA();
templates.loadFromDir( '/path/to/templates', callback );

// render a template
var renderedContent = templates.render('template.html', { foo: 'bar'} );
```

### Including other templates in a template

One of the main reasons for this module is to allow templates to include other templates. This is done by localising the `render` method and making it available inside a template. It's use is exactly the same as in normal code.

```html
<div>
  <%= render( 'another/template.html', { foo: 'bar' }) %>
</div>
````

The original arguments are made available in the included template, with any arguments you specify being used to override them. The path to the template is relative to the path used in `loadFromDir`, or the Express `views`, not the calling template.

### Using with the Express framework

There are two helpers for express - one is an engine so that you can use `res.render(...)` and the other is middleware to return the compiled templates in AMD form for use client-side.

```javascript
// create a new object, set the cache mode depending on dev mode
var template = new UTA();
templates.cacheTemplates = app.get('env') == 'development' ? false : true;

// add the templates as an engine
app.set('views', __dirname + '/views');
app.engine('html', templates.forExpress() );

// return AMD wrapped compiled templates for a specific path
app.use( '/js/templates.js', templates.middlewareAMD() );
```

The `forExpress` method will automatically load the templates from the directory specified in `views`.

### Using client-side with AMD

If you use something like Require.js to collate your clientside javascript you can render templates like this:

```javascript
define(
  [          'jquery', 'templates' ],
  function ( $,        templates   ) {

    $('#someElement').html(
      templates.render(
        'some/template.html',
        { foo: 'bar' }
      )
    );

  }
);
```

This assumes that you make the compiled templates available as `templates.js` using one of the methods below:

### Generating AMD compiled templates

When you run in production you should write the compiled templates to a file and serve that as static content. There is a provided script that will do this for you. The command line arguments should be the paths to the template and the result is printed to `STDOUT`.

```bash
uta-compile-templates-to-amd.js path/to/templates > public/js/templates.js
```

### Loading templates from several directories

This has not been tested, but it is intended that it should be possible. You should be able to call `loadFromDir` several times and templates with names matching ones already loaded should overwrite the initial ones. Would be handy for things like co-branding.

