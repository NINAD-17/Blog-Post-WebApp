const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

/*
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
*/

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Connect mongoDB using Mongoose
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/blogsDB');

// Schema of items
const blogSchema = new mongoose.Schema({
  blogTitle: String,
  blogPost: String
});

// Model
const Blog = mongoose.model('Blog', blogSchema);

// Make array to store each blog title and inner-content
// const blogsArr = [];

app.get('/', (req, res) => {
  
  Blog.find({}, (err, allBlogs) => {

    /* // Code without DB
    // if(allBlogs.length === 0) {
    //   Blog.insertMany(blogsArr, (err) => {
    //     if(err) {
    //       console.log('Something went wrong!', err);
    //     } else {
    //       console.log('Successfuly inserted all blogs in DB');
    //     }
    //   });
    //   res.redirect('/');
    // } else {
    //   if(err) {
    //     console.log('Something went wrong!', err);
    //   } else {
        
    //   }
    // }
    */

    res.render('home', { blogsArr: allBlogs});
  });
  // res.render('home', { blogsArr: blogsArr }); // Code without DB
});

app.get('/about', (req, res) => {
  res.render('about', {aboutContent: aboutContent});
});

app.get('/contact', (req, res) => {
  res.render('contact', {contactContent: contactContent});
});

app.get('/compose', (req, res) => {
  res.render('compose');
})

app.post('/compose', (req, res) => {

  // const blog = {
  //   blogTitle: req.body.blogTitle,
  //   blogPost: req.body.blogPost
  // };

  const newBlog = new Blog({
    blogTitle: req.body.blogTitle,
    blogPost: req.body.blogPost
  });

  // blogsArr.push(blog);
  newBlog.save((err) => {
    if(!err) {
      res.redirect('/');
    }
  });

});

app.get('/blogs/:blogId', (req, res) => {
  const pageName = _.lowerCase(req.params.blogPage);
  const requestedBlogId = req.params.blogId;

  Blog.findOne({_id: requestedBlogId}, (err, blogPost) => {
    res.render('post', {
      title: blogPost.blogTitle,
      content: blogPost.blogPost
    });
  });

  // blogsArr.forEach(blog => {
  //   const blogName = _.lowerCase(blog.blogTitle);
  //   Blog.findOne({name: blogName}, (err, data) => {
  //     if(err) 
  //       console.log(err);
  //     else {
  //       res.render('post', {
  //         blogTitle: data.blogTitle,
  //         blogPost: data.blogPost
  //       });
  //     }
  //   }) 
    // if (pageName === blogName) {
    //   res.render('post', {blog});
    // } else {
    //   console.log('No Match found!');
    // }
  // });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
