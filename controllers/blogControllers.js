//blog_index, blog_details, blog_create, blog_delete
const Blog = require('../models/blog');
const blog_index = (req, res) =>
{
   Blog.find().sort({ createdAt: -1 })
      .then((result) => {
         res.render('index', { title: 'All Blogs', blogs: result });
      })
      .catch((err) => {
         console.error('DB error fetching blogs:', err && err.message ? err.message : err);
         // Render the index page with an empty list and a friendly message instead of hanging
         res.render('index', { title: 'All Blogs', blogs: [], error: 'Unable to load posts — database unavailable.' });
      });
}


const blog_details = (req, res) =>{
    const id = req.params.id;
   
   Blog.findById(id)
      .then((result) => {
         if (!result) return res.status(404).render('404', { title: '404' });
         res.render('details', { blog: result, title: 'Blog Details' });
      })
      .catch((err) => {
         console.error('DB error fetching details:', err && err.message ? err.message : err);
         res.status(500).render('details', { title: 'Blog Details', blog: { title: '(unavailable)', body: 'Unable to load blog details — database error.' }, error: 'Database error' });
      });
}

const blog_create_get = (req, res) =>{
    res.render('create', {title: 'Create a new Blog'})
}

const blog_create_post = (req, res) => {
   console.log('POST /blogs body:', req.body);
   const blog = new Blog(req.body);
   blog.save()
      .then((result) => {
         res.redirect('/blogs');
      })
      .catch((err) => {
         console.error('DB save failed:', err && err.message ? err.message : err);
         // Render the create page with an error message and keep user inputs
         res.status(500).render('create', { title: 'Create a new Blog', error: 'Unable to save post — database error.', titleValue: req.body.title, snippetValue: req.body.snippet, bodyValue: req.body.body });
      });
}

 const blog_delete = (req, res) =>{const id = req.params.id;  
   Blog.findByIdAndDelete(id)
   .then((result) => {
      if (!result) return res.status(404).json({ error: 'Blog not found' });
      res.json({ redirect: '/blogs' });
   })
   .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Server error' });
   });
 }

module.exports = {
    blog_index , blog_details , blog_create_get , blog_create_post, blog_delete
}