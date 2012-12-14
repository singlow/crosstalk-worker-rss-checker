var ide = require( 'crosstalk-ide' )();
var path = require( 'path' );
var config = require( '../config.json' );

var worker = ide.run( path.join( __dirname, '../index.js'), { name : "worker", config : config } );
worker.dontMockHttp = worker.dontMockHttps = true;

