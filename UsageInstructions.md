**These instructions are for RSH 0.6. For deployment of 0.4, see the [release notes](ReleaseNotesVersionZeroPointFour.md) for that version.**

# How to deploy Really Simple History #

  * Always deploy RSH from a local or remote web server. It will not function properly from a file: URL on your workstation - especially in IE. This is true of lots of DHTML applications, but especially true of RSH.

  * Always call dhtmlHistory.initialize() and dhtmlHistory.addListener() from within a window.onload event. **RSH will break, especially in IE, if you try to initialize it from any flavor of DOMContentLoaded.** IE doesn't load up its saved cross-session form values until just after the body.onload event, so DOMContentLoaded is not an appropriate event for the initialization of RSH.

  * Always include blank.html in your RSH deployment. The library will simply not work without it. It is recommended that you serve blank.html from the same directory as rsh.js; otherwise you'd have to modify the library's source code. A future version of RSH will support a configurable location for blank.html. However, due to cross-domain-scripting issues, blank.html must be served from the same domain as the rest of your application's HTML pages (though you can server your JS from a separate domain). In other words, if your site runs on www.foo.com, blank.html must run on ww.foo.com even if rsh.js runs on foo.someotherdomain.com.

  * RSH ships with a default JSON parser (json2007.js) that adds methods to Object.prototype, Function.prototype, Array.prototype and other core JS objects. For users who would prefer a less intrusive set of JSON utilities, swap in json2005.js - an optional, alternative library that's also included - and deploy using the instructions below.

  * Users of Prototype, jQuery and other Ajax libraries may leave out both JSON parsers and use the JSON utilities from their own libraries instead. Again, see deployment instructions below.

  * No need to include rshTestPage.html or rshTestPageTop100.opml, which merely provide a test suite for you to play with.

  * If your supported browser list differs from RSH's, you should perform browser detection in your own code. RSH does nothing to disable itself in any browser, but it may fail in unexpected ways in unsupported browsers.

# Deployment examples #

## Default install with json2007.js ##

```
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
```


## Install for users of json2005.js ##

```

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

```

## Install for users of prototype.js ##

```

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

```