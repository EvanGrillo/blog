window.addEventListener('load', () => {

    document.querySelector('#modal').addEventListener('click', (e) => {
        if (e.target.parentElement.tagName == 'BODY' && document.activeElement == document.body) {
            document.querySelector('#modal').style.display = 'none';
        }
    });

    document.querySelector('#closeModal').addEventListener('click', () => {
        document.querySelector('#modal').style.display = 'none';
    });

    sendMsg = () => {

        if (window.requestPending) return;
        window.requestPending = 1;

        let payload = {
            msg: document.querySelector('#message').value,
            name: document.querySelector('#name').value,
            email: document.querySelector('#email').value
        }

        let formCheck_valueFails = [
            !payload.msg.trim(),
            !payload.name.trim(),
            !(/\S+@\S+\.\S+/).test(payload.email)
        ];

        if (formCheck_valueFails.includes(true)) return;

        document.querySelector('#share').setAttribute('disabled', '');
        
        let url = '/send';

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                document.querySelector('.modal-content').innerHTML = '<h1>Message sent!</div>';
                setTimeout(() => {
                    document.getElementById('modal').style.display = 'none';
                    document.querySelector('.modal-content').innerHTML = xhttp.response;
                    window.requestPending = 0;
                }, 3000);
            }
        };
        xhttp.open('POST', url, true);
        xhttp.send(JSON.stringify(payload));
        
    }

});