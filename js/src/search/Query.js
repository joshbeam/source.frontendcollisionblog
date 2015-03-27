;(function(global,$) {

	'use strict';

	Query.prototype = {
		set: function(val) {
			this.q = val;
			return this;
		},
		goToLocation: function(route) {
			if(typeof this.q !== 'undefined' && typeof this.q === 'string') {
				document.location.href=route+'/?query='+this.q;
			} else {
				return;
			}
		},
		get: function() {
			return this.q;
		},
		setFromURL: function(name) {
			name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
			var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			    results = regex.exec(location.search);

			this.q = results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));

			return this;				
		},
		getJSON: function(file) {
			return $.get(file);
		}
	};

	function Query(q) {
		if(typeof q !== 'undefined' && typeof q === 'string') {
			this.q = q;
		}
	}

	global.Query = Query;
})(this,$);