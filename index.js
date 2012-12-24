/*
 * index.js: Sendgrid SMTP API Worker
 *
 * (C) 2012 Jacob Williams.
 */
"use strict";

var xml2js = require( 'xml2js' );
var _ = require( 'underscore' );
var logger = require( 'logger' );
var clone = require( 'clone' );

var config = clone( require( 'config' ) );

var http = config.feedURI.substr( 0, 5 ) === 'https' ? require( 'https' ) : require( 'http' );

var history = [];
config.target = config.target || 'rss.new';
config.checkFrequency = config.checkFrequency || 5;

var getFeed = function getFeed( uri, callback ) {
	
	var request = http.request( uri, function( response ) {
		
		var data = '';
		
		response.on( 'data', function( chunk ) {
			data += chunk;
		});

		response.on( 'end', function() {
			var options = {
			  ignoreAttrs: true
			};
			new xml2js.Parser(options).parseString( data, function( error, obj ) {
				callback( error, obj );
			});
		});

	}); // http.request

	request.on('error', function( error ) {
		callback( error );
	});

	request.end();

}; // getFeed

var checkFeed = function checkFeed( firstRun ) {

	firstRun = firstRun || false;

	getFeed(config.feedURI, function( error, data ) {
		
		if (error) {
			crosstalk.emit( "error" , error );
			return;
		}


		if ( ! firstRun ) {
			var newItemCount = 0;
			_.each( data.channel.item, function( item, index ) {
				var guid = getGUID(item);
				if ( ! _.contains( history, guid ) ) {
					crosstalk.emit(config.target, item);
					newItemCount++;
				}
			});
		  logger.info(newItemCount + " new items in feed.");
		}

		history = _.map( data.channel.item, function( item ) {
			return getGUID(item);
		});

	});

}

var getGUID = function getGUID(item) {
	return item.guid || item.link
}

setInterval( checkFeed, Math.max(config.checkFrequency, 5) * 60 * 1000);
setTimeout( function() { checkFeed(true); }, 1000 );
