For overview, usage examples, release notes, version history, a changelog, bug reports,
downloads and all other Really Simple Resources, please use these links:

Google Code: http://code.google.com/p/reallysimplehistory/
Google Group: http://groups.google.com/group/ReallySimpleHistory

--

HOW TO DEPLOY REALLY SIMPLE HISTORY

1. Always test RSH from a local or remote web server. It will not function properly from a file: URL on your workstation - especially in IE.

2. Always include json2007.js (or json2005.js, or an alternate JSON parser), blank.html (the library will simply not work without it), rsh.js and initialization code as below.

3. No need to include rshTestPage.html or rshTestPageTop100.opml, which merely provide a test suite for you to play with.

4. If your supported browser list differs from RSH's, you should perform browser detection in your own code. RSH does nothing to disable itself in any browser.

5. Additional usage examples and real-world samples will be available at Google Code.

--

DEFAULT INSTALL

--

<script type="text/javascript" src="json2007.js"></script>
<script type="text/javascript" src="rsh.js"></script>

<script type="text/javascript">
window.dhtmlHistory.create();

var yourListener = function(newLocation, historyData) {
	//do something;
}

window.onload = function() {
	dhtmlHistory.initialize();
	dhtmlHistory.addListener(yourListener);
};
</script>

--

PROTOTYPE USERS

--

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
	dhtmlHistory.initialize();
	dhtmlHistory.addListener(yourListener);
};
</script>

--

USERS WHO DON'T WANT TO MODIFY OBJECT.PROTOTYPE, FUNCTION.PROTOTYPE, ETC.

--

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
	dhtmlHistory.initialize();
	dhtmlHistory.addListener(yourListener);
};
</script>
