import { Meteor } from 'meteor/meteor';


Images = new Mongo.Collection("images");
console.log("Images in db before startup:"+Images.find().count());

Meteor.startup(() => {
  // code to run on server at startup
    if (Images.find().count()==0){
        for (var i=1;i<23;i++){
             Images.insert({
                img_src:"img_"+i+".jpg", 
                img_alt:"Image #:"+i, 
                createdOn:new Date()
      });
        }
    }
console.log("Images in db after loop load:"+Images.find().count());
});
