Meteor.music = new Mongo.Collection("music");

if (Meteor.isServer) {
  Meteor.publish("music", function(){
     return Meteor.music.find({});
  });
  console.log("Published music collection to clients");
}

if(Meteor.isClient){
	Meteor.subscribe("music");
	console.log("Subscribed to music collection!");
}