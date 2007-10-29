/*
Copyright (c) 2007 Brian Dillard and Brad Neuberg:
Brian Dillard | Project Lead | bdillard@pathf.com | http://blogs.pathf.com/agileajax/
Brad Neuberg | Original Project Creator | http://codinginparadise.org
   
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
(the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge,
publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*An object that provides history, history data, and bookmarking for DHTML and Ajax applications. */

window.dhtmlHistory = {
	
	/*public: Initializes our DHTML history. You must call this after the page is finished loading. */
	initialize: function() {
		/*IE needs to be explicitly initialized. IE doesn't autofill form data until the page is finished loading, so we have to wait
		for onload to fire. */
		if (this.isIE) {
			/*if this is the first time this page has loaded*/
			if (!historyStorage.hasKey(this.PAGELOADEDSTRING)) {
				/*For IE, we do this in initialize(); for other browsers, we do it in create()*/
				this.fireOnNewListener = false;
				this.firstLoad = true;
				historyStorage.put(this.PAGELOADEDSTRING, true);
			}
			/*else if this is a fake onload event*/
			else {
				this.fireOnNewListener = true;
				this.firstLoad = false;   
			}
		}
	},

	/*public: Adds a history change listener. Note that only one listener is supported at this time. */
	addListener: function(listener) {
		this.listener = listener;
		/*if the page was just loaded and we should not ignore it, fire an event to our new listener now*/
		if (this.fireOnNewListener) {
			this.fireHistoryEvent(this.currentLocation);
			this.fireOnNewListener = false;
		}
	},
	
	/*public*/
	add: function(newLocation, historyData) {
		if (this.isSafari) {
			
			/*remove any leading hash symbols on newLocation*/
			newLocation = this.removeHash(newLocation);

			/*store the history data into history storage*/
			historyStorage.put(newLocation, historyData);

			/*save this as our current location*/
			this.currentLocation = newLocation;
	
			/*change the browser location*/
			window.location.hash = newLocation;
		
			/*save this to the safari form field*/
			this.putSafariState(newLocation);

		} else {
			
			/*Most browsers require that we wait a certain amount of time before changing the location, such
			as 200 milliseconds; rather than forcing external callers to use window.setTimeout to account for
			this to prevent bugs, we internally handle this detail by using a 'currentWaitTime' variable and
			have requests wait in line */
			var that = this;
			var addImpl = function() {

				/*indicate that the current wait time is now less*/
				if (that.currentWaitTime > 0) {
					that.currentWaitTime = that.currentWaitTime - that.WAIT_TIME;
				}
			
				/*remove any leading hash symbols on newLocation*/
				newLocation = that.removeHash(newLocation);

				/*IE has a strange bug; if the newLocation is the same as _any_ preexisting id in the
				document, then the history action gets recorded twice; throw a programmer exception if
				there is an element with this ID*/
				if (document.getElementById(newLocation)) {
					var e = "Exception: History locations can not have the same value as _any_ IDs that might be in the document,"
					+ " due to a bug in IE; please ask the developer to choose a history location that does not match any HTML"
					+ " IDs in this document. The following ID is already taken and cannot be a location: " + newLocation;
					throw e; 
				}

				/*store the history data into history storage*/
				historyStorage.put(newLocation, historyData);

				/*indicate to the browser to ignore this upcomming location change*/
				that.ignoreLocationChange = true;

				/*indicate to IE that this is an atomic location change block*/
				that.ieAtomicLocationChange = true;

				/*save this as our current location*/
				that.currentLocation = newLocation;
		
				/*change the browser location*/
				window.location.hash = newLocation;

				/*change the hidden iframe's location if on IE*/
				if (that.isIE) {
					that.iframe.src = "blank.html?" + newLocation;
				}

				/*end of atomic location change block for IE*/
				that.ieAtomicLocationChange = false;
			};

			/*now queue up this add request*/
			window.setTimeout(addImpl, this.currentWaitTime);

			/*indicate that the next request will have to wait for awhile*/
			this.currentWaitTime = this.currentWaitTime + this.WAIT_TIME;
		}
	},

	/*public*/
	isFirstLoad: function() {
		return this.firstLoad;
	},

	/*public*/
	getVersion: function() {
		return "0.6";
	},

	/*Gets browser's current hash location; for Safari, reads value from a hidden form field */

	/*public*/
	getCurrentLocation: function() {
		var r = (this.isSafari
			? this.getSafariState()
			: this.removeHash(window.location.hash)
		);
		return r;
	},
	
	/*public: switch debug mode on and off and toggle associated styles*/
	setDebugMode: function(newDebugMode) {
		if (this.debugging != newDebugMode) {
			/*toggle flag*/
			this.debugging = newDebugMode;
			/*now toggle styles*/
			var styles = (this.debugging
				? historyStorage.showStyles
				: historyStorage.hideStyles
			);
			styles = styles.split(";");
			for (var i = 0, j = styles.length; i < j; i++) {
				var item = styles[i].split(":");
				var key = item[0];
				var val = item[1];
				historyStorage.storageField.style[key] = val;
				if (this.isIE) {
					this.iframe.style[key] = val;
				}
				else if (this.isSafari) {
					val = (key == 'height' ? '30px' : val); 
					this.safariStack.style[key] = val;
					this.safariLength.style[key] = val;
				}
			}
		}
	},
	
	/*- - - - - - - - - - - - */
	
	/*private: Key for our own internal history event called when the page is loaded*/
	PAGELOADEDSTRING: "DhtmlHistory_pageLoaded",
	
	/*private: milliseconds to wait between add requests - will be reset for certain browsers*/
	WAIT_TIME: 200,
	
	/*private: if true, show various hidden DOM elements for debugging*/
	debugging: false,

	/*private*/
	isIE: null,
	
	/*private*/
	isOpera: null,

	/*private*/
	isSafari: null,
	
	/*private: Our history change listener. */
	listener: null,

	/*private: setInterval handle for our history polling */
	pollHandle: null,
	
	/*private: milliseconds before an add request can execute */
	currentWaitTime: 0,

	/*private: Our current hash location, without the "#" symbol. */
	currentLocation: null,

	/*private: hidden iframe used to IE to detect history changes*/
	iframe: null,

	/*private: Used only by Safari*/
	safariHistoryStartPoint: null,

	/*private: Used only by Safari*/
	safariStack: null,

	/*private: flag used to handle edge cases*/
	ignoreLocationChange: null,

	/*private: A flag that indicates that we should fire a history change event when we are ready, i.e. after we are initialized and
	we have a history change listener. This is needed due to an edge case in browsers other than IE; if you leave a page entirely
	then return, we must fire this as a history change event. Unfortunately, we have lost all references to listeners from earlier,
	because JavaScript clears out. */
	fireOnNewListener: null,

	/*private: A variable that indicates whether this is the first time this page has been loaded. If you go to a web page, leave it
	for another one, and then return, the page's onload listener fires again. We need a way to differentiate between the first page
	load and subsequent ones. This variable works hand in hand with the pageLoaded variable we store into historyStorage.*/
	firstLoad: null,

	/*private: A variable to handle an important edge case in IE. In IE, if a user manually types an address into their browser's
	location bar, we must intercept this by continiously checking the location bar with an timer interval. However, if we manually
	change the location bar ourselves programmatically, when using our hidden iframe, we need to ignore these changes. Unfortunately,
	these changes are not atomic, so we surround them with the variable 'ieAtomicLocationChange', that if true, means we are
	programmatically setting the location and should ignore this atomic chunked change. */
	ieAtomicLocationChange: null,
	
	/*private: Create IE-specific DOM nodes and overrides*/
	createIE: function(initialHash) {
		/*write out a hidden iframe for IE and set the amount of time to wait between add() requests*/
		if (this.isIE) {
			this.WAIT_TIME = 400;/*IE needs longer between history updates*/

			var rshIframeID = "rshIDHistoryFrame";
			var rshIframeHTML = '<iframe name="' + rshIframeID + '" id="' + rshIframeID + '" style="' + historyStorage.hideStyles
				+ '" src="blank.html?' + initialHash + '"></iframe>'
			;
			document.write(rshIframeHTML);
			this.iframe = document.getElementById(rshIframeID);
		}
	},
	
	/*private: Create Opera-specific DOM nodes and overrides*/
	createOpera: function() {
		if (this.isOpera) {
			var imgHTML = '<img src="javascript:location.href=\'javascript:dhtmlHistory.checkLocation();\';" style="visibility:hidden" />';
			document.write(imgHTML);
		}
	},
	
	/*private: Create Safari-specific DOM nodes and overrides*/
	createSafari: function() {
		if (this.isSafari) {
			this.WAIT_TIME = 400;
			var stackID = "rshSafariStack";
			var lengthID = "rshSafariLength";
			var stackHTML = '<form>'
				+ '<input type="text" style="' + historyStorage.hideStyles + '" id="' + stackID + '" value="[]"/>'
				+ '<input type="text" style="' + historyStorage.hideStyles + '" id="' + lengthID + '" value=""/>'
				+ '</form>'
			;
			document.write(stackHTML);
			this.safariStack = document.getElementById(stackID);
			this.safariLength = document.getElementById(lengthID);
			if (!historyStorage.hasKey(this.PAGELOADEDSTRING)) {
				this.safariHistoryStartPoint = history.length;
				this.safariLength.value = this.safariHistoryStartPoint;
			} else {
				this.safariHistoryStartPoint = this.safariLength.value;
			}
		}
	},
	
	/*private: safari-only method to read the history stack from a hidden form field*/
	getSafariStack: function() {
		var r = this.safariStack.value;
		return historyStorage.parseJSON(r);
	},

	/*private: safari-only method to read from the history stack*/
	getSafariState: function() {
		var stack = this.getSafariStack();
		var state = stack[history.length - this.safariHistoryStartPoint - 1];
		return state;
	},			
	/*private: safari-only method to write the history stack to a hidden form field*/
	putSafariState: function(newLocation) {
	    var stack = this.getSafariStack();
	    stack[history.length - this.safariHistoryStartPoint] = newLocation;
	    this.safariStack.value = historyStorage.toJSONString(stack);
	},

	/*private: create the DHTML history infrastructure*/
	create: function() {

		/*set user-agent flags*/
		var UA = navigator.userAgent.toLowerCase();
		this.isIE = ((document.all != undefined) && UA.indexOf('msie') != -1);
		this.isOpera = (UA.indexOf('opera') != -1),
		this.isSafari = (UA.indexOf('safari') != -1),
		
		/*create Opera/Safari-specific code*/
		this.createSafari();
		this.createOpera();
		
		/*get our initial location*/
		var initialHash = this.getCurrentLocation();

		/*save it as our current location*/
		this.currentLocation = initialHash;

		/*now that we have a hash, create IE-specific code*/
		this.createIE(initialHash);

		/*Add an unload listener for the page; this is needed for FF 1.5+ because this browser caches all dynamic updates to the
		page, which can break some of our logic related to testing whether this is the first instance a page has loaded or whether
		it is being pulled from the cache*/
		var that = this;
		window.onunload = function() {
			that.firstLoad = null;
		};

		/*determine if this is our first page load; for IE, we do this in this.iframeLoaded(), which is fired on pageload. We do it
		there because we have no historyStorage at this point, which only exists after the page is finished loading in IE*/
		if (this.isIE) {
			/*the iframe will get loaded on page load, and we want to ignore this fact*/
			this.ignoreLocationChange = true;
		} else {
			if (!historyStorage.hasKey(this.PAGELOADEDSTRING)) {
				this.ignoreLocationChange = true;
				this.firstLoad = true;
				historyStorage.put(this.PAGELOADEDSTRING, true);
			} else {
				/*indicate that we want to pay attention to this location change*/
				this.ignoreLocationChange = false;
				/*For browsers other than IE, fire a history change event; on IE, the event will be thrown automatically when its
				hidden iframe reloads on page load. Unfortunately, we don't have any listeners yet; indicate that we want to fire
				an event when a listener is added.*/
				this.fireOnNewListener = true;
			}
		}

		/*other browsers can use a location handler that checks at regular intervals as their primary mechanism; we use it for IE as
		well to handle an important edge case; see checkLocation() for details*/
		var that = this;
		var locationHandler = function() {
			that.checkLocation();
		};
		this.pollHandle = setInterval(locationHandler, 100);
	},

	/*private: Notify the listener of new history changes. */
	fireHistoryEvent: function(newHash) {
		/*extract the value from our history storage for this hash*/
		var historyData = historyStorage.get(newHash);
		/*call our listener*/
		this.listener.call(null, newHash, historyData);
	},
	
	/*private: Sees if the browsers has changed location.  This is the primary history mechanism for Firefox. For IE, we use this to
	handle an important edge case: if a user manually types in a new hash value into their IE location bar and press enter, we want to
	to intercept this and notify any history listener.*/
	checkLocation: function() {
		
		/*ignore any location changes that we made ourselves for browsers other than IE*/
		if (!this.isIE && this.ignoreLocationChange) {
			this.ignoreLocationChange = false;
			return;
		}

		/*if we are dealing with IE and we are in the middle of making a location change from an iframe, ignore it*/
		if (!this.isIE && this.ieAtomicLocationChange) {/*TODO BD - Comments contradict the logic here, and it's hard to test */
			return;
		}
		
		/*get hash location*/
		var hash = this.getCurrentLocation();

		/*do nothing if there's been no change*/
		if (hash == this.currentLocation) {
			return;
		}

		/*In IE, users manually entering locations into the browser; we do this by comparing the browser's location against the
		iframe's location; if they differ, we are dealing with a manual event and need to place it inside our history, otherwise
		we can return*/
		this.ieAtomicLocationChange = true;

		if (this.isIE && this.getIFrameHash() != hash) {
			this.iframe.src = "blank.html?" + hash;
		}
		else if (this.isIE) {
			/*the iframe is unchanged*/
			return;
		}

		/*save this new location*/
		this.currentLocation = hash;

		this.ieAtomicLocationChange = false;

		/*notify listeners of the change*/
		this.fireHistoryEvent(hash);
	},

	/*private: Gets the current location of the hidden IFrames that is stored as history. For IE. */
	getIFrameHash: function() {
		var doc = this.iframe.contentWindow.document;
		var hash = String(doc.location.search);
		if (hash.length == 1 && hash.charAt(0) == "?") {
			hash = "";
		}
		else if (hash.length >= 2 && hash.charAt(0) == "?") {
			hash = hash.substring(1);
		}
		return hash;
	},

	/*private: Removes any leading hash that might be on a location. */
	removeHash: function(hashValue) {
		var r;
		if (hashValue == null || hashValue == undefined) {
			r = null;
		}
		else if (hashValue == "") {
			r = "";
		}
		else if (hashValue.length == 1 && hashValue.charAt(0) == "#") {
			r = "";
		}
		else if (hashValue.length > 1 && hashValue.charAt(0) == "#") {
			r = hashValue.substring(1);
		}
		else {
			r = hashValue;
		}
		return r;
	},

	/*private: For IE, says when the hidden iframe has finished loading. */
	iframeLoaded: function(newLocation) {
		/*ignore any location changes that we made ourselves*/
		if (this.ignoreLocationChange) {
			this.ignoreLocationChange = false;
			return;
		}

		/*get the new location*/
		var hash = String(newLocation.search);
		if (hash.length == 1 && hash.charAt(0) == "?") {
			hash = "";
		}
		else if (hash.length >= 2 && hash.charAt(0) == "?") {
			hash = hash.substring(1);
		}

		/*move to this location in the browser location bar if we are not dealing with a page load event*/
		if (this.pageLoadEvent != true) {
			window.location.hash = hash;
		}

		/*notify listeners of the change*/
		this.fireHistoryEvent(hash);
	}

};

/*An object that uses a hidden form to store history state across page loads. The chief mechanism for doing so is using the
fact that browsers save the text in form data for the life of the browser and cache, which means the text is still there when
the user navigates back to the page.*/

window.historyStorage = {

	/*public*/
	put: function(key, value) {
		this.assertValidKey(key);
		/*if we already have a value for this, remove the value before adding the new one*/
		if (this.hasKey(key)) {
			this.remove(key);
		}
		/*store this new key*/
		this.storageHash[key] = value;
		/*save and serialize the hashtable into the form*/
		this.saveHashTable(); 
	},

	/*public*/
	get: function(key) {
		this.assertValidKey(key);
		/*make sure the hash table has been loaded from the form*/
		this.loadHashTable();
		var value = this.storageHash[key];
		value = (value == undefined
			? null
			: value
		);
		return value;
	},

	/*public*/
	remove: function(key) {
		this.assertValidKey(key);
		/*make sure the hash table has been loaded from the form*/
		this.loadHashTable();
		/*delete the value*/
		delete this.storageHash[key];
		/*serialize and save the hash table into the form*/
		this.saveHashTable();
	},

	/*public: Clears out all saved data. */
	reset: function() {
		this.storageField.value = "";
		this.storageHash = {};
	},

	/*public*/
	hasKey: function(key) {
		this.assertValidKey(key);
		/*make sure the hash table has been loaded from the form*/
		this.loadHashTable();
		return (typeof this.storageHash[key] != "undefined");
	},

	/*public*/
	isValidKey: function(key) {
		var r = (key == undefined
			? false
			: typeof key == "string"
		);
		return r;
	},
	
	/*public - CSS strings utilized by both objects to hide or show behind-the-scenes DOM elements*/
	showStyles: 'left:auto;top:auto;width:800px;height:100px;border:1px solid black;position:static',

	hideStyles: 'left:-1000px;top:-1000px;width:1px;height:1px;border:0;position:absolute',
	
	/*- - - - - - - - - - - - */

	/*private: Our hash of key name/values. */
	storageHash: {},

	/*private: If true, we have loaded our hash table out of the storage form. */
	hashLoaded: false, 

	/*private: A reference to our textarea field. */
	storageField: null,

	/*private: write a hidden form and textarea into the page*/
	setup: function() {
		var textareaID = "rshStorageField";
		var textareaHTML = '<form><textarea id="' + textareaID + '" style="' + this.hideStyles + '"></textarea></form>';
		document.write(textareaHTML);
		this.storageField = document.getElementById(textareaID);
	},

	/*private: Asserts that a key is valid, throwing an exception if it is not. */
	assertValidKey: function(key) {
		if (!this.isValidKey(key)) {/*TODO BD figure out whether this is safe in safari and if so uncomment it*/
			//var e = "Please provide a valid key for window.historyStorage, key= " + key;
			//throw e;
		}
	},

	/*private: Loads the hash table up from the form. */
	loadHashTable: function() {
		if (!this.hashLoaded) {	
			var serializedHashTable = this.storageField.value;
			if (serializedHashTable != "" && serializedHashTable != null) {
				this.storageHash = this.parseJSON(serializedHashTable);
			}
			this.hashLoaded = true;
		}
	},

	/*private: Saves the hash table into the form. */
	saveHashTable: function() {
		this.loadHashTable();
		var serializedHashTable = this.toJSONString(this.storageHash);
		this.storageField.value = serializedHashTable;
	},
	
	/*private: A bridge for our toJSONString implementation. */
	toJSONString: function(s) {
		if (s.toJSONString) {
			return s.toJSONString();
		}
		else {
			var e = "No JSON stringify method defined."
			throw e;
		}
	},
	/*private: A bridge for our parseJSON implementation. */
	parseJSON: function(s) {
		if (s.parseJSON) {
			return s.parseJSON();
		}
		else {
			var e = "No JSON parse method defined."
			throw e;
		}
	}
};

/*instantiate our objects*/
window.historyStorage.setup();
window.dhtmlHistory.create();
