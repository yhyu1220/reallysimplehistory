For overview, usage examples, release notes, version history, a changelog, bug reports,
downloads and all other Really Simple Resources, please use these links:

Google Code: http://code.google.com/p/reallysimplehistory/
Google Group: http://groups.google.com/group/ReallySimpleHistory


*These instructions are for 0.6 RC1. For deployment of 0.4, see the [ReleaseNotesVersionZeroPointFour release notes] for that version.*


= How to deploy Really Simple History =

  * Always test RSH from a local or remote web server. It will not function properly from a file: URL on your workstation - especially in IE.

  * Always include json2007.js (or json2005.js, or an alternate JSON parser), blank.html (the library will simply not work without it), rsh.js and initialization code as below.

  * No need to include rshTestPage.html or rshTestPageTop100.opml, which merely provide a test suite for you to play with.

  * If your supported browser list differs from RSH's, you should perform browser detection in your own code. RSH does nothing to disable itself in any browser.


= Deployment examples =


== Default Install ==

{{{
<script type="text/javascript" src="json2007.js"></script>
<script type="text/javascript" src="rsh.js"></script>

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


== Install for users of Prototype.js ==

{{{

<script type="text/javascript" src="prototype.js"></script>
<script type="text/javascript" src="rsh.js"></script>

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


== Install for users who don't want to extend core JS object prototypes ==

{{{

<script type="text/javascript" src="json2005.js"></script>
<script type="text/javascript" src="rsh.js"></script>

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


== Installing in debug mode ==

{{{
<script type="text/javascript" src="json2007.js"></script>
<script type="text/javascript" src="rsh.js"></script>

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


== Passing in an event listener separately from initialization ==

{{{
<script type="text/javascript" src="json2007.js"></script>
<script type="text/javascript" src="rsh.js"></script>

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