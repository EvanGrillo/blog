window.onload = (e) => {

    document.querySelector('#share').addEventListener('click', () => {

        let payload = document.querySelector('#message').value;

        if (!payload.trim()) return;
        
        let url = '/send';

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let msg = this.response;
                document.querySelector('.modal-content').innerHTML = msg;
                setTimeout(() => {
                    document.getElementById('modal').style.display = 'none';
                    document.querySelector('.modal-content').innerHTML = `
                    <h1>Write me a message</h1>
                    <div class="spacer-30"></div>
                    <textarea id='message' rows='3' class='pa-10 field' type="text" placeholder="Write message here..."></textarea>
                    <div class="spacer-30"></div>
                    <div class="display-flex justify-center">
                        <div id='share' class="btn ml-10 display-flex justify-center align-center">Share</div>
                    </div>`
                }, 3000);
            }
        };
        xhttp.open('POST', url, true);
        xhttp.send(payload);

    });
}