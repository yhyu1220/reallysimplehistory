For overview, usage examples, release notes, version history, a changelog, bug reports,
downloads and all other Really Simple Resources, please use these links:

Google Code: http://code.google.com/p/reallysimplehistory/
Google Group: http://groups.google.com/group/ReallySimpleHistory


*These instructions are for 0.6 RC1. For deployment of 0.4, see the [ReleaseNotesVersionZeroPointFour release notes] for that version.*


= How to deploy Really Simple History =

* Always deploy RSH from a local or remote web server. It will not function properly from a file: URL on your workstation - especially in IE. This is true of lots of DHTML applications, but especially true of RSH.

* Always call dhtmlHistory.initialize() and dhtmlHistory.addListener() from within a window.onload event. *RSH will break, especially in IE, if you try to initialize it from any flavor of DOMContentLoaded.* IE doesn't load up its saved cross-session form values until just after the body.onload event, so DOMContentLoaded is not an appropriate event for the initialization of RSH.

* Always include blank.html in your RSH deployment. The library will simply not work without it. It is recommended that you serve blank.html from the same directory as rsh.js; otherwise you'd have to modify the library's source code.

* RSH ships with a default JSON parser (json2007.js) that adds methods to Object.prototype, Function.prototype, Array.prototype and other core JS objects. For users who would prefer a less intrusive set of JSON utilities, swap in json2005.js - an optional, alternative library that's also included - and deploy using the instructions below.

* Users of Prototype, jQuery and other Ajax libraries may leave out both JSON parsers and use the JSON utilities from their own libraries instead. Again, see deployment instructions below.

* No need to include rshTestPage.html or rshTestPageTop100.opml, which merely provide a test suite for you to play with.

* If your supported browser list differs from RSH's, you should perform browser detection in your own code. RSH does nothing to disable itself in any browser.

= Deployment examples =

== Default install with json2007.js ==

{{{
<head>
	<script type="text/javascript" src="json2007.js"></script>
	<script type="text/javascript" src="rsh.js"></script>
</head>

<body>
	<script type="text/javascript">
		window.dhtmlHistory.create();
		var yourListener = function(newLocation, historyData) {
			//do something;
		}
		window.onload = function() {
			dhtmlHistory.initialize(yourListener);
		};
	</script>
}}}

== Install for users of json2005.js ==

{{{

<head>
	<script type="text/javascript" src="json2005.js"></script>
	<script type="text/javascript" src="rsh.js"></script>
</head>

<body>
	<script type="text/javascript">
		window.dhtmlHistory.create({
			toJSON: function(o) {
				return JSON.stringify(o);
			}
			, fromJSON: function(s) {
				return JSON.parse(s);
			}
		});

		var yourListener = function(newLocation, historyData) {
			//do something;
		}

		window.onload = function() {
			dhtmlHistory.initialize(yourListener);
		};
	</script>

}}}

== Install for users of prototype.js ==

{{{

<head>
	<script type="text/javascript" src="prototype.js"></script>
	<script type="text/javascript" src="rsh.js"></script>
</head>

<body>
	<script type="text/javascript">
		window.dhtmlHistory.create({
			toJSON: function(o) {
				return Object.toJSON(o);
			}
			, fromJSON: function(s) {
				return s.evalJSON();
			}
		});

		var yourListener = function(newLocation, historyData) {
			//do something;
		}

		window.onload = function() {
			dhtmlHistory.initialize(yourListener);
		};
	</script>

}}}

== Install in debug mode ==

{{{
<head>
	<script type="text/javascript" src="json2007.js"></script>
	<script type="text/javascript" src="rsh.js"></script>
</head>

<body>
	<script type="text/javascript">
		window.dhtmlHistory.create({
			debugMode: true
		});

		var yourListener = function(newLocation, historyData) {
			//do something;
		}

		window.onload = function() {
			dhtmlHistory.initialize(yourListener);
		};
	</script>
}}}

== Install with a separate call to dhtml.addListener ==

{{{
<head>
	<script type="text/javascript" src="json2007.js"></script>
	<script type="text/javascript" src="rsh.js"></script>
</head>

<body>
	<script type="text/javascript">
		window.dhtmlHistory.create();

		var yourListener = function(newLocation, historyData) {
			//do something;
		}

		window.onload = function() {
			dhtmlHistory.initialize();
	
			//do some other stuff
	
			dhtmlHistory.addListener(yourListener);
		};
	</script>
}}}

== Install with a non-standard location for blank.html ==

{{{
<head>
	<script type="text/javascript" src="json2007.js"></script>
	<script type="text/javascript" src="rsh.js"></script>
</head>

<body>
	<script type="text/javascript">
		window.dhtmlHistory.create({
			blankURL: '/someDirectory/blank.html?'
		});
		var yourListener = function(newLocation, historyData) {
			//do something;
		}
		window.onload = function() {
			dhtmlHistory.initialize(yourListener);
		};
	</script>
}}}