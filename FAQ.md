## Why isn't RSH written as a plug-in for Prototype, jQuery, YUI or `[insert name of Ajax framework here]`? ##

To maintain its portability and usefulness to a wide variety of developers, RSH is written in POJS (plain old JavaScript). That way, it works with all Ajax frameworks.

## How big is RSH? ##

Minimized, the library is only 12k, not including the required JSON parser. For sites who already employ an Ajax framework with a JSON parser, RSH can be configured to use the framework's existing JSON functionality with just a couple lines of code. Otherwise, it ships with your choice of two parsers, both of which can themselves be minified.

## Why doesn't RSH work with `[insert name of browser here]`? ##

RSH relies on a collection of browser-specific hacks to work. The more browsers it tries to support, the larger and more difficult to maintain the library becomes. By supporting IE6+, Firefox 1.5+ (and its Gecko-based equivalents), Opera 9+ and Safari/Mac 2.03+, RSH supports the same A-grade, modern browsers as most Ajax applications.

## I need to serve blank.html from someplace other than the same directory as my other HTML files. How can I accomlish this? ##

Starting with version 0.8, RSH will support a configurable location from blank.html. You'll be able to pass in any arbitrary URL for this resource. However, browser security constraints with regard to cross-domain scripting will not let you serve this resource from a different domain; rsh.js itself can be served from elsewhere, but blank.html (or its equivalent) must be on the same domain.

## Can I change blank.html to blank.php, blank.asp or some other file format? ##

Theoretically, this should be no problem. However, issues may arise if you're not careful how you set cache control on your renamed blank.??? resource. See this bug report for the issue tracker for info on one user's experience using PHP:

http://code.google.com/p/reallysimplehistory/issues/detail?id=36