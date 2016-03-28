Brian and Brad are happy to announce Really Simple History 0.6. This release represents many enhancements over 0.4 and many bug-fixes over 0.6 beta. The final, stable version of 0.6 was released on 12.03.2007. For people who downloaded 0.6RC1, the only changes were the inclusion of a minified version of rsh.js and more complete release notes. All other users should upgrade ASAP.

## Where to get it ##

For latest stable, packaged-up ZIP files, go to the **[downloads tab](http://code.google.com/p/reallysimplehistory/downloads/list)**

For up-to-the-minute revisions, visit the **[SVN repo](http://code.google.com/p/reallysimplehistory/source)**. However, **do not use the SVN repo for production code. SVN code is by its nature unstable; the only versions recommended for application development are the packaged-up releases on the [downloads tab](http://code.google.com/p/reallysimplehistory/downloads/list).**

## How to use it ##

For basic installation notes, visit the [Usage Instructions](UsageInstructions.md) page.

For step-by-step instructions, visit the [Usage Examples](UsageExamples.md) page.

## Changelog ##

### 0.6 Final ###

  * Added more complete release notes to the README file.
  * Added a minified version of rsh.js using Dojo ShrinkSafe.

### 0.6 RC 1 ###

  * Added rock-solid support of Opera up to 9.5 beta for Mac and PC.
  * Added rock-solid support of Safari/Mac from 2.03 through 3.03.
  * Changed window.onunload event to a modern listener using addEventListener/attachEvent.
  * Performed tons of internal refactoring.
  * Moved to two-line initialization of dhtmlHistory and historyStorage (as opposed to the previous two init calls in the library and two more in your code).
  * Added support for an optional options bundle in the initialization call to trigger debug mode or override default JSON methods.
  * Provided better ompatibility with Prototype.js thanks to the aforementioned JSON override capability.
  * Added additional choice in JSON parsers; we now ship with a default 2007 JSON parser that alters core object prototypes and an older 2005 version that doesn't.
  * Provided better user-agent sniffing that's more resistant to UA spoofing.
  * Removed a bug introduced in 0.6 beta that threw an error when you hit a virgin (hashless) page state.
  * Added graceful swallowing of errors in non-debug mode.
  * Replaced equality operators with JSLint-friendly identity operators where appropriate.
  * Cleaned up a little cruft from the 0.4 and 0.6 beta versions.

### 0.6 Beta ###

  * Added support for IE7
  * Added support for Opera/Mac and Opera/Win (though some bugs remain)
  * Added support for Safari 2/Mac (though some bugs remain)
  * Modernized the JSON parser and moved it to a separate file
  * Provided bridge methods for JSON calls to make it easier to swap out JSON parsers
  * Rebuilt original test pages into a single test page that allows you to peek behind the scenes at hidden, hacked-in DOM elements
  * Refactored many private and public methods for better support of more browsers
  * Changed name of private historyStorage.init method to historyStorage.setup to avoid confucion with dhtmlHistory.initialize
  * Removed unused isInternational() method
  * Removed blocks of deprecated, commented-out code

## Known issues ##

**[SEE THE ISSUES TAB](http://code.google.com/p/reallysimplehistory/issues/list)** and the release notes.

## Supported and unsupported browsers ##

### Supported ###

  * IE6 (Windows)
  * IE7 (Windows)
  * Firefox/Mozilla/Netscape/Gecko-based browsers (Mac, Windows, Linux - all versions since 2005)
  * Opera 9.22-9.5 (Mac and Windows)
  * Safari 2.03, 2.04 and 3.03 (Mac)

### Unsupported ###

  * Safari 3.x (Windows): Falls prey to fundamental bugs in Apple's current beta release.
  * Non-Mozilla-based Linux browsers.
  * Any browser not listed above; test before you deploy.

### Browsers without recent test coverage ###

  * All browsers on Vista
  * All browsers on Leopard
  * Non-standalone IE7/XP
  * Konquerer
  * Older versions of Opera
  * IE 5.5