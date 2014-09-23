define([
       "underscore", "backbone"
      , "views/temp-snippet"
      , "helper/pubsub"
      , "text!templates/app/renderform.html"
], function(
  _, Backbone
  , TempSnippetView
  , PubSub
  , _renderForm
){
  return Backbone.View.extend({
    tagName: "fieldset"
    , initialize: function(){
      this.collection.on("add", this.render, this);
      this.collection.on("remove", this.render, this);
      this.collection.on("change", this.render, this);
      PubSub.on("mySnippetDrag", this.handleSnippetDrag, this);
      PubSub.on("tempMove", this.handleTempMove, this);
      PubSub.on("tempDrop", this.handleTempDrop, this);
      this.$build = $("#build");
      this.renderForm = _.template(_renderForm);
      this.render();
    }

    , render: function(){
      //Render Snippet Views
      this.$el.empty();
      var that = this;
      _.each(this.collection.renderAll(), function(snippet){
        that.$el.append(snippet);
      });
      $("#render").val(that.renderForm({
        text: _.map(this.collection.renderAllClean(), function(e){return e.html()}).join("\n")
      }));
      $('#visual_form_input_json').val(JSON.stringify(this.collection.models)); // put json representation of form into a hidden input so we can save and retrive later
      this.$el.appendTo("#build form");
      this.delegateEvents();
    }
	//choose where to drop snippet
    , getBottomAbove: function(eventY){
      var myFormBits = $(this.$el.find(".component"));
      var topelement = _.find(myFormBits, function(renderedSnippet) {
	      //console.log(eventY);
	      //console.log($(renderedSnippet).offset().top + $(renderedSnippet).height());
        if (($(renderedSnippet).offset().top + $(renderedSnippet).height()) > eventY - 90) {
          return true;
        }
        else {
          return false;
        }
      });
      if (topelement){
        return topelement;
      } else {
        return myFormBits[0];
      }
    }

    , handleSnippetDrag: function(mouseEvent, snippetModel) {
      $("body").append(new TempSnippetView({model: snippetModel}).render());
      this.collection.remove(snippetModel);
      PubSub.trigger("newTempPostRender", mouseEvent);
    }
	
	//move snippet when clicked and dragged
    , handleTempMove: function(mouseEvent){
	  //var parentOffset = $('#fancybox-content').offset();
	  	//console.log(parentOffset.top);
	    //console.log(mouseEvent.pageY);
	    //console.log($('.form_create #fancybox-content').offset().top + $('.form_create #fancybox-content').height());
	  $('#build').parent().css('position','relative');
      $(".target").removeClass("target");
      if(mouseEvent.pageX >= this.$build.position().left &&
          mouseEvent.pageX < (this.$build.width() + this.$build.position().left) &&
          mouseEvent.pageY >= this.$build.offset().top &&
          mouseEvent.pageY < (this.$build.height() + this.$build.offset().top)){
	          //console.log('in');
        $(this.getBottomAbove(mouseEvent.pageY)).addClass("target");
      } else {
	      //console.log('out');
        $(".target").removeClass("target");
      }
      
      //handle scrolling
      if (mouseEvent.pageX >= this.$build.position().left &&
          mouseEvent.pageX < (this.$build.width() + this.$build.position().left) && 
          mouseEvent.pageY <= ($('.form_create #fancybox-content').offset().top)) {
        //mouseEvent.pageY > (this.$build.height() + this.$build.offset().top)) {
	        //console.log('scroll up');
	    	$('.form_create #fancybox-content').animate({scrollTop: 0}, 1300);    
        } else if (mouseEvent.pageX >= this.$build.position().left &&
          mouseEvent.pageX < (this.$build.width() + this.$build.position().left) && 
          mouseEvent.pageY >= ($('.form_create #fancybox-content').offset().top + $('.form_create #fancybox-content').height())) {
	        //console.log('scroll down');
	    	$('.form_create #fancybox-content').animate({scrollTop: $('.form_create #fancybox-content > div').height()}, 1300);
	    } else {
		    $('.form_create #fancybox-content').stop();
	    }
    }

	// handle dropping
    , handleTempDrop: function(mouseEvent, model, index){
	  $('.form_create #fancybox-content').stop();
      if(mouseEvent.pageX >= this.$build.position().left &&
         mouseEvent.pageX < (this.$build.width() + this.$build.position().left) &&
         mouseEvent.pageY >= this.$build.offset().top &&
         mouseEvent.pageY < (this.$build.height() + this.$build.offset().top)) {
        var index = $(".target").index();
        $(".target").removeClass("target");
        this.collection.add(model,{at: index+1});
      } else {
        $(".target").removeClass("target");
      }
    }
  })
});
