//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
  title : String,
  content : String
};
//collection in mongodb
const Article =  mongoose.model("Article", articleSchema);

//request for all articles

app.route("/articles").get(function(req,res){

  Article.find(function(err, foundArticles){
    if(!err){
      res.send(foundArticles);
    }else{
      res.send(err);
    }

  });
})

.post(function(req,res){

  const newArticle = new Article({

    title : req.body.title,
    content : req.body.content
  });
newArticle.save(function(err){
    if(!err){
      res.send("Successfully added a new article");
    } else {
      res.send(err);
    }
});
})

.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted all articles");
    }else {
      res.send(err);
    }
  });
});

//request for specific article

app.route("/articles/:articleTitle").get(function(req,res){

  let article = req.params.articleTitle;

  Article.findOne({title: article}, function(err, foundArticle){

    if(foundArticle){
      res.send(foundArticle);
    }else {
      res.send("No article found");
    }
  });
})
  //updates whole object
.put(function(req,res){
  let article = req.params.articleTitle;

Article.update({title:article}, {title: req.body.title, content: req.body.content}, {overwrite: true}, function(err){
  if(!err){
    res.send("Successfully updated article");
  }
  else {
    res.send(err);
  }
});
})
//updates specific
.patch(function(req,res){
  let article = req.params.articleTitle;

Article.update({title: article}, {$set: req.body }, function(err){
  if(!err){
    res.send("Successfully updated article");
  }else {
    res.send(err);
  }
});
})
//deletes specific article 
.delete(function(req,res){
  let article = req.params.articleTitle;

Article.deleteOne({title: article}, function(err){
  if(!err){
    res.send("Successfully deleted article");
  }else {
    res.send(err);
  }
});
});



app.listen(3000,function(){
  console.log("Server started at port 3000");

});
