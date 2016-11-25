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
      maxResults: 10,
      location: "",
      locationRadius: ""
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
    playerHTMLStart: '<div class="video-player" id="videoPlayer"><iframe width="288" height="162" src="',
    playerHTMLEnd: '" frameborder="0" allowfullscreen></iframe></div>',
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

function getUserRadius(userRadius) {
  state.settings.data.locationRadius = "";
  state.settings.data.locationRadius = userRadius + "km";
}

function getResults(data) {
  pushResults('#resultsHeader');
  data.items.forEach(function(item){
    state.thumbnails.push(item.snippet.thumbnails.high.url);
    state.titles.push(item.snippet.title);
    state.links.push("https://www.youtube.com/embed/"+item.id.videoId+"?rel=0");
  });
  insertResults();
  renderResults('#results');
};

function searchYT() {
  pushLoading('#resultsHeader')
  navigator.geolocation.getCurrentPosition(getUserLocation);
};

function insertResults() {
  //target results append HTML
  for (i = 0; i < state.titles.length; i++) {
    var fHTML = state.sourceHTML.videoCardHTMLStart+state.sourceHTML.titleHTMLStart+
    state.titles[i]+state.sourceHTML.titleHTMLEnd+state.sourceHTML.playerHTMLStart+state.links[i]+
    state.sourceHTML.playerHTMLEnd+state.sourceHTML.videoCardHTMLEnd;

    state.finalHTML.push(fHTML);
  }
};

function getUserLocation(position) {
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;
  var userLocation = lat + "," + lon;
  state.settings.data.location = userLocation;
  clearResults('#results');
  $.ajax(state.settings);
}

function clearState() {
  state.thumbnails = [];
  state.titles = [];
  state.links = [];
  state.finalHTML = [];
}

//render html

function emptySearch(target1, target2) {
  $(target1).val("");
  $(target2).val("");
};

function renderResults(target) {
  $(target).html(state.finalHTML);
};

function clearResults(target) {
  $(target).html("");
}

function pushResults(target) {
  var rText = "'" + state.settings.data.q + "'" + " videos in " + state.settings.data.locationRadius +
  " radius around you";
  $(target).text(rText);
}

function pushLoading(target) {
  $(target).removeClass('hidden');
  $(target).text('Loading...');
}

//event listeners

$(document).ready(function(){
  $('#wrapper').on('submit', '#searchForm', function(event) {
    event.preventDefault();
    clearState();
    var userSearch = $('#query').val();
    var userRadius = $('#radius').val();
    if (userRadius === "" || userSearch === "") {
      $('#resultsHeader').removeClass('hidden');
    } else {
      getUserSearch(userSearch);
      getUserRadius(userRadius);
      emptySearch('#query', '#radius');
      searchYT();
    }
  });
});
