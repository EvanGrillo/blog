const fs = require('fs');
const db = require('./db.js');

module.exports = {
    homeView: async (req, res) => {

        console.log("\x1b[32m", '>> homeView');
    
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

            let modalTemplate = fs.readFileSync('./public/templates/modal/modal.html', 'utf8');
            let writeMessageSnippet = fs.readFileSync('./public/templates/modal/snippets/writeMessage.html', 'utf8');
            
            modalTemplate = modalTemplate.replace('[snippet]', writeMessageSnippet);
    
            let content = 
            fs.readFileSync('./public/templates/home/index.html', 'utf8')
            .replace('[blogs]', blogPreviews);

            let index = fs.readFileSync('./public/index.html', 'utf8');
            index = index
            .replace('[inner_body]', modalTemplate + content)
            .replace('[inserts]', '');
    
            return res.end(index, 'utf8');
    
        } catch (err) {
            console.log("\x1b[31m", err);
            sendError(res, err);
        }
    
    },
    loginView: (res) => {

        try {

            let adminLoginScript = fs.readFileSync('./public/scripts/adminLogin.js', 'utf8');
            let modalTemplate = fs.readFileSync('./public/templates/modal/modal.html', 'utf8');
            let loginSnippet = fs.readFileSync('./public/templates/modal/snippets/login.html', 'utf8');
            
            let adminLoginTemplate = modalTemplate
            .replace('[snippet]', loginSnippet);
            
            adminLoginTemplate.toString('utf8');
    
            res.end(`<script>${adminLoginScript}</script>` + adminLoginTemplate);
            
        } catch (err) {
            sendError(res, err);
        }

    },
    displayAsset: async (res, url) => {
    
        let handle = url.split('/')[3];
    
        console.log("\x1b[32m", url, handle, '>> displayAsset');
    
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
            index = index.replace('[inner_body]', modalTemplate + homePage);
    
            return res.end(index, 'utf8');
    
        } catch (err) {
            console.log("\x1b[31m", err);
            sendError(res, err);
        }
    
    },
    editorView: (res) => {

        let editorHTML = fs.readFileSync('./public/templates/editor.html', 'utf8');
        res.end(editorHTML);

    }
}