define([
       "underscore" , "backbone"
       , "collections/snippets" , "collections/my-form-snippets"
       , "views/tab" , "views/my-form"
       , "text!data/input.json"
       , "text!templates/app/render.html", 
], function(
  _, Backbone
  , SnippetsCollection, MyFormSnippetsCollection
  , TabView, MyFormView
  , inputJSON
  , renderTab
){
  return {
    initialize: function(){

      //Bootstrap tabs from json.
      new TabView({
        title: "Input"
        , collection: new SnippetsCollection(JSON.parse(inputJSON))
      });
      new TabView({
        title: ""
        , content: renderTab
      });


      //Make the first tab active!
      $(".tab-pane").first().addClass("active");
      $("ul.nav li").first().addClass("active");

      // Bootstrap "My Form" with 'Form Name' snippet.
      new MyFormView({
        title: "Original"
        , collection: new MyFormSnippetsCollection(CAN_form_builder_initial_JSON)
      });
    }
  }
});
