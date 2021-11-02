const fs = require('fs');
const db = require('../db.js');

const blogs = {
    renderBlogs: async (res, url) => {

        console.log("\x1b[32m", url, '>> RenderBlogs');
    
        try {
    
            let blogs = await db.find('blogs', {});
    
            let blogPreviews = '';
            let blogPreviewTemplate = fs.readFileSync('./public/templates/blogs/blogPreview.html', 'utf8');
    
            for (blog of blogs) {
    
                let entry = blogPreviewTemplate
                .replace('[title]', blog.title)
                .replaceAll('[titleLink]', blog.handle)
                .replace('[createdDate]', blog.createdDate);
    
                blogPreviews = blogPreviews.concat(entry);
            }
    
            let content = 
            fs.readFileSync(url, 'utf8')
            .replace('[blogs]', blogPreviews);
    
            return res.end(content, 'utf8');
    
        } catch (err) {
            console.log("\x1b[31m", err);
            sendError(res, err);
        }
    
    },
    renderBlog: async (res, url) => {
    
        let handle = url.split('/')[3];
    
        console.log("\x1b[32m", url, handle, '>> RenderBlog');
    
        try {
    
            let blog = await db.findOne('blogs', {'handle': handle});
    
            let blogDisplayTemplate = fs.readFileSync('./public/templates/blogs/blogDisplay.html', 'utf8');
    
            let blogDisplay = blogDisplayTemplate
            .replace('[title]', blog.title)
            .replace('[text]', blog.text)
            .replace('[createdDate]', blog.createdDate);
    
            let content =
            fs.readFileSync('./public/index.html', 'utf8')
            .replace('[blogs]', blogDisplay);
    
            return res.end(content, 'utf8');
    
        } catch (err) {
            console.log("\x1b[31m", err);
            sendError(res, err);
        }
    
    }
}

module.exports = blogs;