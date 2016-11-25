/*
ip = user search query, user radius
op = clickable video thumbnails with video titles

$.ajax({
url: ,
data: {

},
type: ,
dataType:
}).done(function())

GEOLOCATION:
navigator.geolocation.getCurrentPosition(function(position) {
do_something(position.coords.latitude, position.coords.longitude);
});

http://www.javascriptkit.com/dhtmltutors/youtube-api-lightbox.shtml

*/

//state
var state = {
  settings: {
    data: {
      key: "AIzaSyDo_PA7LhMLynSVFvISD6QlmqcsPpKFzIY",
      part: "snippet",
      type: "video",
      q: "",
      maxResults: 10
      // add max results, multiple pages ask about endless pages
    },
    url: "https://www.googleapis.com/youtube/v3/search",
    type: "GET",
    success: getResults
  },
  thumbnails: [],
  titles: [],
  links: [],
  sourceHTML: {
    titleHTMLStart: '<div class="title" id="title">',
    titleHTMLEnd: '</div>',
    tnHTMLStart: '<a href="',
    tnHTML0: '" id="videoLink"><img src="',
    tnHTMLEnd: '" id:"YTimg"/></a>',
    videoCardHTMLStart: '<div class="videoCard">',
    videoCardHTMLEnd: '</div>'
  },
  finalHTML: []
};

//modify state

function getUserSearch(userSearch) {
  state.settings.data.q = "";
  state.settings.data.q = userSearch;
};

function getResults(data) {
  data.items.forEach(function(item){
    state.thumbnails.push(item.snippet.thumbnails.high.url);
    state.titles.push(item.snippet.title);
    state.links.push("https://www.youtube.com/watch?v="+item.id.videoId);
  });
  insertResults();
  renderResults('#results')
};

function searchYT() {
  $.ajax(state.settings);
};

function insertResults() {
  //target results append HTML
  for (i = 0; i < state.titles.length; i++) {
    var fHTML = state.sourceHTML.videoCardHTMLStart+state.sourceHTML.titleHTMLStart+
    state.titles[i]+state.sourceHTML.titleHTMLEnd+state.sourceHTML.tnHTMLStart+state.links[i]+
    state.sourceHTML.tnHTML0+state.thumbnails[i]+state.sourceHTML.tnHTMLEnd+state.sourceHTML.videoCardHTMLEnd;

    state.finalHTML.push(fHTML);
  }
};

//render html

function emptySearch(target1) {
  $(target1).val("");
};

function renderResults(target) {
  $(target).append(state.finalHTML);
};

//event listeners

$(document).ready(function(){
  $('#wrapper').on('submit', '#searchForm', function(event) {
    event.preventDefault();
    var userSearch = $('#query').val();
    getUserSearch(userSearch);
    emptySearch('#query');
    searchYT();
  });
});
