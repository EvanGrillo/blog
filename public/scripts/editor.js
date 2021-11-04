window.addEventListener('load', () => {
    
    window.editors = {
        html_mixed: CodeMirror(document.querySelector('#html_mixed'), {
            indentWithTabs: true,
            lineWrapping: true,
            lineNumbers: true,
            mode: 'htmlmixed',
            value: '<h1>Hello World</h1>'
        }),
        js: CodeMirror(document.querySelector('#js'), {
            indentWithTabs: true,
            lineWrapping: true,
            foldGutter: true,
            lineNumbers: true,
            mode: 'javascript',
            value: 'window.addEventListener("load", () => { \
            \console.log("hello world"); \
            })'
        }),
        css: CodeMirror(document.querySelector('#css'), {
            indentWithTabs: true,
            lineWrapping: true,
            foldGutter: true,
            lineNumbers: true,
            mode: 'css',
            value: '\
            body { \
                background: #ffffff; \
                color: #000000; \
            }'
        }),
    }

    insert_preview(undefined);

    document.getElementById('html_mixed').addEventListener('change', (e) => {
        insert_preview('html');
    });
    document.getElementById('js').addEventListener('change', (e) => {
        insert_preview('js');
    });
    document.getElementById('css').addEventListener('change', (e) => {
        insert_preview('css');
    });

    function insert_preview(mode) {
        var body = {
            html: window.editors.html_mixed.getValue(),
            js: window.editors.js.getValue(),
            css: window.editors.css.getValue()
        };
        document.getElementById('preview').srcdoc = 
        `<style> ${body.css} </style><script> ${body.js} </script><body> ${body.html} </body>`;
    };

    var bar_left = document.querySelector('#left');
    var bar_middle = document.querySelector('#middle');
    var bar_right = document.querySelector('#right');
    var bar_vertical = document.querySelector('#vertical');
    var html_bar = document.querySelector('#html_mixed');
    var js_bar = document.querySelector('#js');
    var css_bar = document.querySelector('#css');
    var mouse_is_down_left = false;
    var mouse_is_down_middle = false;
    var mouse_is_down_right = false;
    var mouse_is_down_vertical = false;

    bar_left.addEventListener('mousedown', (e) => {
        mouse_is_down_left = true;
    })

    bar_middle.addEventListener('mousedown', (e) => {
        mouse_is_down_middle = true;
    })

    bar_right.addEventListener('mousedown', (e) => {
        mouse_is_down_right = true;
    })

    bar_vertical.addEventListener('mousedown', (e) => {
        mouse_is_down_vertical = true;
    })

    document.addEventListener('mousemove', (e) => {
        
        if (mouse_is_down_left) {
            html_bar.style.width = e.clientX;
        } else if (mouse_is_down_middle) {
            js_bar.style.width = e.clientX;
        } else if (mouse_is_down_right) {
            css_bar.style.width = e.clientX;
        } else if (mouse_is_down_vertical && e.clientY > 60) {

            html_bar.style.height = e.clientY;
            js_bar.style.height = e.clientY;
            css_bar.style.height = e.clientY;
            window.editors.html_mixed.setSize(null,e.clientY);
            window.editors.js.setSize(null,e.clientY);
            window.editors.css.setSize(null,e.clientY);
            document.querySelector('#editors').height = e.clientY;
        }

    });

    document.addEventListener('mouseup', () => {
        mouse_is_down_left = false;
        mouse_is_down_middle = false;
        mouse_is_down_right = false;
        mouse_is_down_vertical = false;
    });

    document.getElementById('generate_page').addEventListener('click', (e) => {
        
        let html = {
            html: window.editors.html_mixed.getValue(),
            js: window.editors.js.getValue(),
            css: window.editors.css.getValue()
        }

        const client = new XMLHttpRequest();
        client.open("POST", `/api/html`);
        client.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
        client.send(JSON.stringify(html));
        client.onreadystatechange = (e) => {

            if (client.readyState === 4) {
                document.write(client.response);
            }
        }

    }, false);

});
