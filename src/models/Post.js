const { default: mongoose } = require('mongoose');

const metaTags = new mongoose.Schema({
    name: String
});

const postSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        default: ''
    },
    body: {
        type: String,
        default: ''
    },
    imageUrl: {
        type: String,
        default: ''
    },
    tags: {
        type: [metaTags],
        default: undefined
    }
});

mongoose.model('Post', postSchema);