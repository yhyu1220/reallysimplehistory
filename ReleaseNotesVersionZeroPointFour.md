# This version of RSH is deprecated #

**These release notes are for the original, 2005 public release of RSH. They are archived here for historical purposes only. If you wish to use RSH, please download the current version and refer to its release notes.**

# What is This? #

The Really Simple History (RSH) framework makes it easy for AJAX applications to incorporate bookmarking and back and button support. By default, AJAX systems are not bookmarkable, nor can they recover from the user pressing the browser's back and forward buttons. The RSH library makes it possible to handle both cases.

In addition, RSH provides a framework to cache transient session information that persists after a user leaves the web page. This cache is used by the RSH framework to help with history issues, but can also be used by your own applications to improve application performance. The cache is linked to a single instance of the web page, and will disappear when the user closes their browser or clear their browser's cache.

RSH works on Internet Explorer 6+ and Gecko-based browsers, like Firefox. Safari is not supported.

# Contributors #

The primary developer on RSH is Brad Neuberg. Special thanks to Erik Arvidsson for several important suggestions concerning the framework, as well as Alex Russell and the Dojo Toolkit project for pioneering history support in AJAX applications.

# License #

RSH is available under a BSD license.

# How Do I Use This? #

The RSH framework exposes two primary objects you will use to add history support to your application: dhtmlHistory and historyStorage.

dhtmlHistory is the primary entry point for adding bookmark and back button support to your application. The primary flow when working with RSH is as follows:

  1. Initialize dhtmlHistory
  1. Register your application as interested in being notified whenever the user presses the back or forward buttons.
  1. Determine the initial location of your application and initialize your state accordingly.
  1. As a user interacts with your AJAX application add history entries to the dhtmlHistory object. The history entry specifies a new location, such as edit:somePage, as well as some optional contextual data that is associated with the new location. When you add a new history entry, the RSH framework updates the browser's location bar with the new location, added after a hash, such as http://somesite.com/myapp#edit:somePage.
  1. If a user presses the back or forward buttons, the RSH framework will call the history change callback you registered earlier, passing in the new location as well as any history data that might have been associated with this location by you. The browser's URL field will also jump between any previous or next hash history entries.

The chief idea behind RSH is that your application adds custom history events as a user interacts with the application; the framework itself uses the history entry to update the browser's location bar. The only way to update a browser location without reloading the entire page is by using a hash fragment, so the new location is added after a hash fragment, such as #edit:somePage. When you add a history entry, you can also pass in contextual data that is associated with this location; this is optional information and can be useful for sophisticated uses, such as saving the state of an edit form.

If a user presses the back or forward buttons, the RSH framework "jumps" through any history entries that were added by the programmer before. The RSH framework then calls your history change listener, passing in the new location as well as any history data that was associated with this location. Your application now has the responsibility of taking this location and updating it's UI accordingly; RSH doesn't update your UI at all, since this is very application specific.

You should choose location URLs that contain enough state for you to update your application or initialize yourself. For example, if the user jumps to the location #view:somePage, your application should be able to use this to know that you must remotely fetch somePage and view it. Choose location URLs that make sense to your application, recording enough state to re-initialize themselves.

Finally, you must include a file named blank.html in the same directory as your application. This file is included with the RSH download and is needed by Internet Explorer.

Here's some simple pseudo-code on how to use RSH:

```
/** RSH must be initialized after the
    page is finished loading. */
window.onload = initialize;

function initialize() {
  // initialize RSH
  dhtmlHistory.initialize();
  
  // add ourselves as a listener for history
  // change events
  dhtmlHistory.addListener(handleHistoryChange);
  
  // determine our current location so we can
  // initialize ourselves at startup
  var initialLocation = 
                dhtmlHistory.getCurrentLocation();
  
  // if no location specified, use the default
  if (initialLocation == null)
    initialLocation = "location1";
  
  // now initialize our starting UI
  updateUI(initialLocation, null);
}

/** A function that is called whenever the user
    presses the back or forward buttons. This
    function will be passed the newLocation,
    as well as any history data we associated
    with the location. */
function handleHistoryChange(newLocation,
                             historyData) {
  // use the history data to update our UI
  updateUI(newLocation, historyData);                           
}

/** A simple method that updates our user
    interface using the new location. */
function updateUI(newLocation,
                  historyData) {
  var output = document.getElementById("output");
  
  // simply display the location and the
  // data
  var historyMessage;
  if (historyData != null)
    historyMessage = historyData.message;
    
  var message = "New location: "
                + newLocation 
                + ", history data="
                + historyMessage;
                
  output.innerHTML = message;
}
```

Our HTML is straightforward; it simply consists of a serious of links that users can click on, which we use to update the history:

```
<body>
  <h1>Output</h1>
  <div id="output"></div>
  
  <div onclick="dhtmlHistory.add(
                     'location1', 
                     {message: 'hello world 1'})">
    Change to Location 1                   
  </div>        
  
  <div onclick="dhtmlHistory.add(
                     'location2', 
                     {message: 'hello world 2'})">
    Change to Location 2                   
  </div>              
  
  <div onclick="dhtmlHistory.add(
                     'location3', 
                     {message: 'hello world 3'})">
    Change to Location 3                   
  </div>   
</body>
```

Notice that we use dhtmlHistory.add() in the links above to update the history with a new entry.

RSH also provides an object that can be used to store transient session information for the page, named historyStorage. historyStorage simulates a hash table, making it possible to put and get name/value pairs that persist even after the user has left the web page. Note that these values are linked just to the single instance of the web page they were stored on. If the user opens a new browser window and navigates to your site then the values will not be visible. For permanent, long-term storage of large amounts of information you should use the AJAX MAssive Storage System (AMASS) instead.

Sample code for working with historyStorage:

```
/** RSH must be initialized after the
    page is finished loading. */
window.onload = initialize;

function initialize() {
  // initialize RSH
  dhtmlHistory.initialize();
  
  // storage a value into the historyStorage
  // if it doesn't exist yet; otherwise, grab
  // the pre-existing value from the history
  // storage
  var savedObject;
  if (historyStorage.hasKey("message"))
    savedObject = historyStorage.get("message");
  else {
    savedObject = new Object();
    savedObject.id = "someId";
    savedObject.message = "Hello Watason";
    savedObject.testArray = new Array();
    savedObject.testArray[0] = "Hello";
    savedObject.testArray[1] = "World";
    savedObject.nestedObject = {someProp: "bye"};
    
    historyStorage.put("message", savedObject);
  }
  
  // now work with savedObject
  alert("message="+savedObject.message);
  alert("nestedObject="+savedObject.nestedObject);
```

The key for historyStorage must be a string, while the value can be an arbitrary JavaScript object. The RSH framework will fully serialize your JavaScript object and pull it back out as an object. Note that DOM nodes and native browser objects, such as XMLHttpRequest, will not be saved or persisted.

Both historyStorage and dhtmlHistory have a few more methods that are useful in some cases; see the source code for details.

# How Does It Internally Work? #

RSH works differently internally for different browsers, but in general we use a combination of hidden iframes, timers, and hidden form fields to detect various history changes and to persist history and location data in a way that will still be around if the user leaves and then returns to the page. The hidden form field is used to persist information between page loads using the auto save capability of web forms; see my blog post "AJAX Tutorial: Saving Session Across Page Loads Without Cookies, On The Client Side" for implementation details. historyStorage wraps the auto save trick with an easy hash table API for developers, and the main RSH framework then uses the historyStorage class to implement stateless tracking of history; variables that allow the detection of fake versus real page load events; and more.

# Articles #

The O'Reilly Network will be publishing a forthcomming article, titled "AJAX: How to Handle Bookmarks and Back Buttons." This article goes into much more detail, with full examples, than this README can accomodate.
Demos and Examples

The O'Reilly Network article will have full examples. Until then, see the two testing classes for the RSH framework for sample code (both included with the download):

  * testDhtmlHistory.html
  * testHistoryStorage.html

# Support #

My primary means of support is through open source consulting using the kinds of frameworks I create and give away. For this reason I generally charge for support. I can answer simple questions, but beyond that we should structure a consulting arrangement to solve your problems using the RSH framework. For details, email at bkn3@columbia.edu or call me at 510-938-3263.
Download

[Download the latest release of the Really Simple History framework.](http://code.google.com/p/reallysimplehistory/downloads/list)

# Known Issues #

  * Safari is not supported.
  * On Internet Explorer, if you add a location to dhtmlHistory that matches the ID of any HTML element already in the document, then you will get very strange behavior. It is recommended that you make sure these don't collide. For example, if I have an HTML DIV with the ID "addressBook," and then add the location "addressBook" to dhtmlHistory using add(), then IE's history won't work correctly and you will have subtle bugs.