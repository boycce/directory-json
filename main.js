/*
 * dirjson
 *
 * Copyright (c) 2018 Ricky Boyce
 * Licensed under the MIT license.
 * https://github.com/Boycce/dirjson/blob/master/LICENSE
 */

'use strict'

var fs = require('fs')
var _ = require('lodash')
var path = require('path')
var async = require('async')

/**
 * Initialize
 * @return callback(err, res)
 */
function init (dir, options, done) {
  if (!dir || !options) {
    return console.error('Missing directory or callback')
  }

  // Options are optional
  if (!done) {
    done = options
    options = {}
  }

  options = _.defaults(options || {}, {
    cwd: '.',
    recurse: true,
    hashLength: 0,
    prettify: false
  })

  // Main task, then return json
  dirObject(dir, options, function (err, res) {
    if (err) return done(err)
    done(null, JSON.stringify(res, null, (options.prettify ? 2 : null)))
  })
}

/**
 * Creates a object from a directory strucutre
 * @return callback(err, [files, ..])
 */
function dirObject (dir, options, done) {
  var dirinfo = {
    dir: dir,
    name: path.basename(dir),
    path: path.normalize(options.cwd + '/' + dir),
    children: {}
  }

  // Find children of directory
  fs.readdir(dirinfo.path, function (err, files) {
    if (err) return done('Trying to read directory :' + err)

    // Directory is empty?
    if (!files.length) return done(null)

    // Create an array file promises
    files = files.map(function (filename) {
      return function (done) {
        processFile(filename, dirinfo, options, done)
      }
    })

    // Start processing files, then return sorted children
    async.parallel(files, function (err, res) {
      if (err) return done(err)
      done(null, _(dirinfo.children).toPairs().sortBy(0).fromPairs().value())
    })
  })
}

/**
 * Process each file
 * return nothing, but calls done()
 */
function processFile (filename, dirinfo, options, done) {
  var absolutePath = path.resolve(dirinfo.path, filename)
  var relativePath = path.join(dirinfo.dir, filename)
  var key = processKey(filename, options.hashLength)

  fs.stat(absolutePath, statCb)

  function statCb (err, stat) {
    if (err) return done(err)

    // Is a directory
    if (stat && stat.isDirectory()) {
      if (!options.recurse) return done(null)
      dirObject(relativePath, options, dirObjectCb)

    // Is a file
    } else {
      dirinfo.children[key] = relativePath
      done(null)
    }
  }

  function dirObjectCb (err, res) {
    if (err) return done(err)
    dirinfo.children[key] = res
    done(null)
  }
}

/**
 * Process key without file extension and hash if requested
 * return string
 */
function processKey (filename, hashLength) {
  var re = new RegExp('\\.[a-zA-Z0-9]{' + hashLength + '}(\\.[\\w]{1,4})$')
  if (hashLength) filename = filename.replace(re, '$1')
  return filename.replace(/\.[\w]{1,4}$/, '')
}

module.exports = init
