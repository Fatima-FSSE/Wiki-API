require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const connectDB = async ()=> {
    try{
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDb Connected: ${conn.connection.host}`);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("article", articleSchema);


//******************** Requests targeting all Articles  *****************/
app.route("/articles")

.get(
    async (req, res) => {
        try {
          await Article.find().then(function(foundArticles){
            res.send(foundArticles);
          });    
        } catch (error) {
            console.log(error);  
        }
    }  
)

.post(
    async (req, res) => {
        try {
          const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
          });
          await newArticle.save().then(function(){
            res.send("Successfully added a new article");
          });  
        } catch (error) {
            console.log(error);
        }
    }
)

.delete(
    async (req, res) => {
        try {
          await Article.deleteMany().then(function(){
              res.send("Successfully deleted all the articles");
          });
        } catch (error) {
          console.log(error);
        }  
      }
);

//******************** Requests targeting specific Article  *****************/
app.route("/articles/:articleTitle")

.get(
    async (req, res) => {
        try {
          const articleTitle = req.params.articleTitle;  
          await Article.findOne({title: articleTitle}).then(function(foundArticle){
            res.send(foundArticle);
          });    
        } catch (error) {
            console.log(error);  
        }
    }  
)

.put( // always overwrtie all fields and no need to mention overwrite flag
    async (req, res) => {
        try {
            await Article.replaceOne(
                {title: req.params.articleTitle}, req.body
            ).then(function(){
                res.send("Successfully updated Article");
            });
        } catch (error) {
            console.log(error);
        }
    }
)

.patch( // always update the specific fields needs to be updated no need to use $set flag
   async (req, res) => {
    try {
       await Article.updateOne(
        {title: req.params.articleTitle}, req.body
       ).then(function(){
        res.send("Successfully updated Article");
       }); 
    } catch (error) {
      console.log(error);  
    }
   }
)

.delete(
    async (req, res) => {
      try {
        await Article.deleteOne(
            {title: req.params.articleTitle}
        ).then(function(){
            res.send("Successfully deleted article.")
        });
      } catch (error) {
        console.log(error);
      }
    }
);

connectDB().then(function(){
    app.listen(PORT, function(){
      console.log(`Server started. Listening on port ${PORT}`);
    });
  });