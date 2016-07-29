music = new Mongo.Collection("music");
playlists = new Mongo.Collection("playlists");
playlistTracks = new Mongo.Collection("playlistTracks");

if (Meteor.isServer) {
  Meteor.publish("music", function(){
     return music.find({});
  });
  console.log("Published music collection to clients");

  Meteor.publish("playlists", function(){
  	return playlists.find({});
  });

  Meteor.publish("playlistTracks", function(){
    return playlistTracks.find({});
  });
  console.log("Published playlists collection to clients");
}

if(Meteor.isClient){
	
	Meteor.subscribe("music");
	console.log("Subscribed to music collection!");

	Meteor.subscribe("playlists");
  Meteor.subscribe("playlistTracks");
	console.log("Subscribed to playlists collection!");

	queueCollection = new Mongo.Collection(null);

	console.log("Created local queue collection!");

}