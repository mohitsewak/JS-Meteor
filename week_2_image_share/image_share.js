// this is image_share.js
Images = new Mongo.Collection("images");

if (Meteor.isClient) {
   
Accounts.ui.config({
  requestPermissions: {
    facebook: ['user_likes'],
    github: ['user', 'repo']
  },
  requestOfflineToken: {
    google: true
  },
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});
    
Template.images.helpers({
    images:function(){
        if (Session.get("userFilter")){
            return Images.find({createdBy:Session.get("userFilter")}, {sort:{createdOn: -1, rating:-1}})
        }
        else{
            return Images.find({}, {sort:{createdOn: -1, rating:-1}})
        }
    },
    filteringImages:function(){
        if (Session.get("userFilter")){
            return true;
        }
        else{
            return false;
        }
    },
    filteredUser:function(){
        if (Session.get("userFilter")){
            user=Meteor.users.findOne({_id:Session.get("userFilter")});
            return user.username;
        }
        else{
            return "Anonymous";
        }
    },
    getUser:function(user_id){
        var user=Meteor.users.findOne({_id:user_id});
        if (user){
            return user.username;
        }
        else {
            return "Anonymous";
        }
    }
  });
    
    Template.body.helpers({
        username:function(){
        var retName="Mr. Anonymous";
        if (Meteor.user()){
            console.log(Meteor.user());
            console.log(Meteor.user().profile.name);
            if (Meteor.user().username) {
                console.log("username:"+Meteor.user().eusername);
                retName=Meteor.user().username;
                }               
            if (Meteor.user().profile.name) {
                console.log("Profile Name:"+Meteor.user().profile.name);
                retName=Meteor.user().profile.name;
                }
            }
        else {
            console.log("No User logged in");
            retName = "Mr. Anonymous";
             }
        return retName;
        }
  });

   Template.images.events({
    'click .js-image':function(event){
        $(event.target).css("width", "50px");
    }, 
    'click .js-del-image':function(event){
       var image_id = this._id;
       console.log(image_id);
       // use jquery to hide the image component
       // then remove it at the end of the animation
       $("#"+image_id).hide('slow', function(){
        Images.remove({"_id":image_id});
       })  
    }, 
    'click .js-rate-image':function(event){
      var rating = $(event.currentTarget).data("userrating");
      console.log(rating);
      var image_id = this.id;
      console.log(image_id);

      Images.update({_id:image_id}, 
                    {$set: {rating:rating}});
    }, 
    'click .js-show-image-form':function(event){
      $("#image_add_form").modal('show');
    },
    'click .js-user-href':function(event){
        Session.set("userFilter",this.createdBy);
    },
    'click .js-unfilterImages':function(event){
        Session.set("userFilter",undefined);
    }

   });

  Template.image_add_form.events({
    'submit .js-add-image':function(event){
      var img_src, img_alt;
      img_src = event.target.img_src.value;
      img_alt = event.target.img_alt.value;
      console.log("src: "+img_src+" alt:"+img_alt);
    if (Meteor.user()){
          Images.insert({
            img_src:img_src, 
            img_alt:img_alt, 
            createdOn:new Date(),
            createdBy:Meteor.user()._id,
            rating:0
          });
        }
       $("#image_add_form").modal('hide');
      return false;
    }
  });


}

