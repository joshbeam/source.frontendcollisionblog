$(function(utils,Query) {
	'use strict';

	var query = new Query();

	$('.search').on('submit',exec);

	function exec(e) {
		e.preventDefault();
		query.set($('.search-box').val().trim()).goToLocation('/search');		
	}

}(utils,Query));