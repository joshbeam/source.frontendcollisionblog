function populateGitHub(res) {
  var repos = res.data,
      popular = [];

  repos.forEach(function(info) {
    if(info.stargazers_count > 1) {
      popular.push(info);
    }
  });

  popular = popular.sort(function(a,b) {
    return b.stargazers_count - a.stargazers_count;
  })

  $('.github-title').prepend([
    'Showing '+popular.length+' of '+repos.length+' public repos '
  ].join(''));

  popular.forEach(function(repo) {
    $('.github').append([
        //'<dl>',
          '<dt>',
            '<a href="'+repo.html_url+'">'+repo.name+'</a>',
            ' <span>('+repo.language+', '+repo.stargazers_count+' starrers)</span>',
          '</dt>',
          '<dd>'+repo.description+'</dd>',
        //'</dl>'
      ].join(''));
  });
}

var script = document.createElement('script');
script.src = 'https://api.github.com/users/joshbeam/repos?callback=populateGitHub';

document.getElementsByTagName('head')[0].appendChild(script);