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
      locationRadius: "",
      location: "51, 51",
      q: "",
      maxResults: 10

      // add max results, multiple pages ask about endless pages
    },
    url: "https://www.googleapis.com/youtube/v3/search",
    type: "GET",
    success: getResults
  },
  thumbnails: [],
  titles: []
};

//modify state

function getUserSearch(userSearch) {
  //push q to data
  state.settings.data.q = "";
  state.settings.data.q = userSearch;
};

function getUserRadius(userRadius) {
  state.settings.data.locationRadius = "";
  state.settings.data.locationRadius = userRadius;
}

// function getUserLocation() {
//   //push location to data
//   debugger
//   state.settings.data.location = "";
//   var userLocation;
//   navigator.geolocation.getCurrentPosition(function(position) {
//     var lat = position.coords.latitude;
//     var lon = position.coords.longitude;
//     userLocation = lat + ", " + lon;
//   });
//   console.log(userLocation);
//   state.settings.data.location = userLocation;
// };

function getUserLocation(position) {
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;
  userLocation = lat + ", " + lon;
  state.settings.data.location = userLocation;
}

function getResults(data) {

  data.items.forEach(function(){
    debugger
    function getThumbnails() {
      state.thumbnails.push(data.snippet.thumbnails.medium);
    };

    function getVideoTitle() {
      state.titles.push(data.snippet.title);
    };
  });
};

function searchYT() {
  $.ajax(state.settings);
};

function emptySearch(target1, target2) {
  $(target1,target2).val("");
}

//render html

//event listeners

$(document).ready(function(){
  $('#wrapper').on('submit', '#searchForm', function(event) {
    event.preventDefault();
    var userSearch = $('#query').val();
    var userRadius = $('#radius').val();
    getUserSearch(userSearch);
    getUserRadius(userRadius);
    emptySearch('#query', '#radius');
    // navigator.geolocation.getCurrentPosition(getUserLocation);
    searchYT();
  });
});
