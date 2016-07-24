Websites = new Mongo.Collection("websites");

if (Meteor.isClient) {

	/////
	// routing
	/////

    Router.configure({
      layoutTemplate: 'ApplicationLayout'
    });

    Router.route('/', function () {
      this.render('navbar', {
        to:"navbar"
      });
      this.render('website_list', {
        to:"main"
      });
    });

    Router.route('/websites', function () {
      this.render('navbar', {
        to:"navbar"
      });
      this.render('website_list', {
        to:"main"
      });
    });

    Router.route('/website/:_id', function () {
      this.render('navbar', {
        to:"navbar"
      });
      this.render('website', {
        to:"main", 
        data:function(){
          return Websites.findOne({_id:this.params._id});
        }
      });
    });


    
    
    
    
	/////
	// template helpers 
	/////

	// helper function that returns all available websites
	Template.website_list.helpers({
		websites:function(){
			return Websites.find({},{sort:{upVote:-1}});
		}
	});


	/////
	// template events 
	/////

	Template.website_item.events({
		"click .js-upvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Up voting website with id "+website_id);
			// put the code in here to add a vote to a website!
                // getting existing vote
                var websiteObj=Websites.findOne({_id:website_id});
                var existingUpVote=websiteObj.upVote;
                var existingDownVote=websiteObj.downVote;
                var newUpVote=existingUpVote+1
                console.log(websiteObj);
                console.log("ExistingUpVote:"+existingUpVote);
                console.log("ExistingDownVote:"+existingDownVote);
                console.log("NewUpVote:"+newUpVote);
            Websites.update({_id:website_id}, 
                    {$set: {upVote:newUpVote}});
			return false;// prevent the button from reloading the page
		}, 
		"click .js-downvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Down voting website with id "+website_id);
			// put the code in here to remove a vote from a website!
            var websiteObj=Websites.findOne({_id:website_id});
            var existingUpVote=websiteObj.upVote;
            var existingDownVote=websiteObj.downVote;
            var newDownVote=existingDownVote+1
                console.log(websiteObj);
                console.log("ExistingUpVote:"+existingUpVote);
                console.log("ExistingDownVote:"+existingDownVote);
                console.log("NewDownVote:"+newDownVote);
            Websites.update({_id:website_id}, 
                    {$set: {downVote:newDownVote}});
			return false;// prevent the button from reloading the page
		}
	})

	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
		}, 
		"submit .js-save-website-form":function(event){
			// here is an example of how to get the url out of the form:
			var url = event.target.url.value;
			console.log("The url they entered is: "+url);
			//  put your website saving code in here!	
			return false;// stop the form submit from reloading the page

		}
	});
    
    Template.website.events({
       'submit .js-comment-form':function(event){
           console.log(event.currentTarget);
           console.log(event.target);
           console.log(this._id);
           return false;
       } 
    });
}


if (Meteor.isServer) {
	// start up function that creates entries in the Websites databases.
  Meteor.startup(function () {
    // code to run on server at startup
    if (!Websites.findOne()){
    	console.log("No websites yet. Creating starter data.");
    	  Websites.insert({
    		title:"Goldsmiths Computing Department", 
    		url:"http://www.gold.ac.uk/computing/", 
    		description:"This is where this course was developed.", 
    		createdOn:new Date(),
            createdBy:"System",
            upVote:0,
            downVote:0,
            commentList:[{commentBy:'SYstem',commentText:'Site preloaded by system'}]
    	});
    	 Websites.insert({
    		title:"University of London", 
    		url:"http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route", 
    		description:"University of London International Programme.", 
    		createdOn:new Date(),
            createdBy:"System",
            upVote:0,
            downVote:0,
            commentList:[{commentBy:'SYstem',commentText:'Site preloaded by system'}]
    	});
    	 Websites.insert({
    		title:"Coursera", 
    		url:"http://www.coursera.org", 
    		description:"Universal access to the world’s best education.", 
    		createdOn:new Date(),
            createdBy:"System",
            upVote:0,
            downVote:0,
            commentList:[{commentBy:'SYstem',commentText:'Site preloaded by system'}]
    	});
    	Websites.insert({
    		title:"Google", 
    		url:"http://www.google.com", 
    		description:"Popular search engine.", 
    		createdOn:new Date(),
            createdBy:"System",
            upVote:0,
            downVote:0,
            commentList:[{commentBy:'System',commentText:'Site preloaded by system'}]
    	});
    }
  });
}
