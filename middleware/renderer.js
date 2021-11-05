const fs = require('fs');
const db = require('./db.js');

const renderer = {
    homeView: async (req, res) => {

        console.log("\x1b[32m", '>> RenderBlogs');
    
        try {
    
            let blogs = await db.find('blogs', {});
    
            let blogPreviews = '';
            let blogPreviewTemplate = fs.readFileSync('./public/templates/blogs/blogPreview.html', 'utf8');

            for (blog of blogs) {
    
                let entry = blogPreviewTemplate
                .replace('[title]', blog.title)
                .replaceAll('[titleLink]', blog.handle)
                .replace('[createdDate]', blog.createdDate)
                .replace('[inserts]', )
    
                blogPreviews = blogPreviews.concat(entry);
            }

            let modalTemplate = fs.readFileSync('./public/templates/modal/modal.html', 'utf8');
            let writeMessageSnippet = fs.readFileSync('./public/templates/modal/snippets/writeMessage.html', 'utf8');
            
            modalTemplate = modalTemplate.replace('[snippet]', writeMessageSnippet);
    
            let content = 
            fs.readFileSync('./public/templates/home/index.html', 'utf8')
            .replace('[blogs]', blogPreviews);

            let index = fs.readFileSync('./public/index.html', 'utf8');
            index = index
            .replace('[inner_body]', content)
            .replace('[inserts]', modalTemplate);
    
            return res.end(index, 'utf8');
    
        } catch (err) {
            console.log("\x1b[31m", err);
            sendError(res, err);
        }
    
    },
    displayAsset: async (res, url) => {
    
        let handle = url.split('/')[3];
    
        console.log("\x1b[32m", url, handle, '>> RenderBlog');
    
        try {
    
            let blog = await db.findOne('blogs', {'handle': handle});
    
            let blogDisplayTemplate = fs.readFileSync('./public/templates/blogs/blogDisplay.html', 'utf8');
    
            let blogDisplay = blogDisplayTemplate
            .replace('[title]', blog.title)
            .replace('[text]', blog.text)
            .replace('[createdDate]', blog.createdDate);

            let modalTemplate = fs.readFileSync('./public/templates/modal/modal.html', 'utf8');
            let writeMessageSnippet = fs.readFileSync('./public/templates/modal/snippets/writeMessage.html', 'utf8');
            
            modalTemplate = modalTemplate.replace('[snippet]', writeMessageSnippet);
    
            let homePage =
            fs.readFileSync('./public/templates/home/index.html', 'utf8')
            .replace('[blogs]', blogDisplay);

            let index = fs.readFileSync('./public/index.html', 'utf8');
            index = index.replace('[inner_body]', homePage)
            .replace('[inserts]', modalTemplate);
    
            return res.end(index, 'utf8');
    
        } catch (err) {
            console.log("\x1b[31m", err);
            sendError(res, err);
        }
    
    }
}

module.exports = renderer;