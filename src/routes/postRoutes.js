const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Post = mongoose.model('Post');

const router = express.Router();

// requires user to be signed in
router.use(requireAuth);

router.get('/posts', async (req, res) => {
    const posts = await Post.find({ userId: req.user._id });

    res.send(posts);
});

router.post('/posts', async (req, res) => {
    const { title, body, imageUrl } = req.body;
    if (!title || !body) {
        return res
            .status(422)
            .send({ error: 'You must provide a title and body'});
    }

    try {
        const post = new Post({ title, body, imageUrl, userId: req.user._id });
        await post.save();
        res.send(post);
    } catch (err) {
        res.status(422).send({ error: err.message });
    }
});

module.exports = router;