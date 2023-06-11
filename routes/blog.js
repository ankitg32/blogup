const { Router } = require("express");
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const multer = require("multer");
const path = require("path");

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    //   cb(null, path.resolve(`./public/uploads/${req.user._id}`))
      cb(null, path.resolve(`./public/uploads`))
    },
    filename: function (req, file, cb) {
      const fileName = Date.now() + '-' + file.originalname
      cb(null, fileName)
    }
  })  
const upload = multer({ storage: storage })

router.get('/add-new', (req,res) => {
    return res.render('addBlog', {
        user: req.user
    })
});

router.post('/', upload.single("coverImage"), async (req,res) => {
    const {title, body} = req.body;
    const blog = await Blog.create({
        title,
        body,
        createdBy: req.user.id,
        coverImageURL: `/uploads/${req.file.filename}`
    })
    return res.redirect(`/blog/${blog._id}`);
});

router.post('/comment/:id', async (req,res) => {
  const blogId = req.params.id;
  await Comment.create({
    content: req.body.comment,
    blogId,
    createdBy: req.user.id
  });
  return res.redirect(`/blog/${blogId}`)
})

router.get("/:id", async (req,res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({blogId: blog._id}).populate("createdBy");
  return res.render("blog", {
    user: req.user,
    blog,
    comments
  })
});

module.exports = router;