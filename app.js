const express = require("express");
const bodyParser = require("body-parser");
const expressSanitizer = require("express-sanitizer");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"));
mongoose.connect("mongodb://localhost/blog_app");

let blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});
let Blog = mongoose.model("Blog", blogSchema);
// Blog.create({title:'Awesome Lapi',image:'https://pixabay.com/get/e131b8072af11c22d2524518b7444795ea76e5d004b014439cf1c378a3e5b6_340.jpg',body:'Daily I work with this only my fav lapi ever'},(err,blog)=>{
// if (err) {
//     console.log(err)
// } else {
//     console.log(blog)
// }
// })
app.get("/", (req, res) => {
    res.redirect("/blogs");
});
app.get("/blogs", (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { blogs });
        }
    });
});
app.get("/blogs/new", (req, res) => {
    res.render("new");
});
app.post("/blogs", (req, res) => {
    req.body.blog.body=req.sanitize(req.body.blog.body)
    
    Blog.create(req.body.blog, (err, blog) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/blogs");
        }
    });
});
app.get("/blogs/:id", (req, res) => {
    Blog.findById(req.params.id, (err, blog) => {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("show", { blog });
        }
    });
});

app.get("/blogs/:id/edit", (req, res) => {
    Blog.findById(req.params.id, (err, blog) => {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", { blog });
        }
    });
});

app.put("/blogs/:id", (req, res) => {
    req.body.blog.body=req.sanitize(req.body.blog.body)

    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, blog) => {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});
app.delete("/blogs/:id", (req, res) => {
    Blog.findByIdAndRemove(req.params.id, err => {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});
app.listen(3000, () => console.log("working in 3000"));
