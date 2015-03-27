$(function(Query,utils) {
	var query = new Query(),
		site = location.protocol + "//" + location.host,
		utils = utils;

	query
		.setFromURL('query')
		.getJSON('/posts.json')
		.done(function(data) {
			var searchIndex, results, $resultsCount = $('.search-results-count'), $results = $('.search-results'), totalScore = 0, percentOfTotal;
			// set up the allowable fields
			searchIndex = lunr(function() {
				this.field('title');
				this.field('category');
				this.field('content');
				this.ref('url');
				this.field('date');
			});
			
			// add each item from posts.json to the index
			$.each(data,function(i,item) {
				searchIndex.add(item);
			});

			// search for the query and store the results as an array
			results = searchIndex.search(query.get());
			
			// add the title of each post into each result, too (this doesn't come standard with lunr.js)
			for(var result in results) {
				results[result].title = data.filter(function(post) {
					return post.url === results[result].ref;
				})[0].title;
			}

			// show how many results there were, in the DOM
			$resultsCount.append(results.length + (results.length === 1 ? ' result' : ' results') + ' for "' + query.get() +'"');

			// get the total score of all items, so that we can divide each result into it, giving us a percentage
			$.each(results, function(i, result) {
				totalScore+=result.score;
			});

			// append each result link, with a border that corresponds to a color with a strength equal to its percentage
			// of the total score
			$.each(results, function(i,result) {
				percentOfTotal = result.score/totalScore;

				$results.append('<li><a href="'+ site + result.ref +'">'+result.title+'</a></li>');
				$results.children('li').last().css({
					'border-left': '20px solid '+utils.shade('#ffffff',-percentOfTotal)
				});
			});
		});
}(Query,utils));