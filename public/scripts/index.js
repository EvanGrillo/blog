window.addEventListener('load', () => {

    document.querySelector('#modal').addEventListener('click', (e) => {
        if (e.target.parentElement.tagName == 'BODY') {
            document.querySelector('#modal').style.display = 'none';
        }
    });

    document.querySelector('#closeModal').addEventListener('click', () => {
        document.querySelector('#modal').style.display = 'none';
    });

    document.querySelector('#share').addEventListener('click', () => {

        let payload = document.querySelector('#message').value;

        if (!payload.trim()) return;
        
        let url = '/send';

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                document.querySelector('.modal-content').innerHTML = '<h1>Message sent!</div>';
                setTimeout(() => {
                    document.getElementById('modal').style.display = 'none';
                    document.querySelector('.modal-content').innerHTML = xhttp.response;
                }, 3000);
            }
        };
        xhttp.open('POST', url, true);
        xhttp.send(payload);

    });
});