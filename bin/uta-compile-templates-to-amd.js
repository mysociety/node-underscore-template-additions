#!/usr/bin/env node

var UTA   = require('..'),
    async = require('async'),
    _     = require('underscore'),
    path  = require('path');


// Get the directories from the command line and resolve relative to the CWD.
var directories = _.map(
  _.rest(process.argv, 2), // skip initial two
  function(dir) {
    return path.resolve( process.cwd(), dir );
  }
);


var templates = new UTA();


async.forEachSeries(
  directories,
  function(dir, done) {
    templates.loadFromDir(
      dir,
      done
    );    
  }, function (err) {
    if (err) throw err;
    process.stdout.write( templates.asAMD() );    
  }
);
