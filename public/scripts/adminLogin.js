window.addEventListener('load', () => {

    document.querySelector('#modal').style.display = 'block';

    document.querySelector('#modal').addEventListener('click', (e) => {
        if (e.target.parentElement.tagName == 'BODY' && document.activeElement == document.body) {
            window.location = '/';
        }
    });

    document.querySelector('#closeModal').addEventListener('click', () => {
        window.location = '/';
    });

    document.querySelector('#login').addEventListener('click', () => {
        
        let payload = {
            email: document.querySelector('#email').value,
            password: document.querySelector('#password').value
        }

        if (!payload.email.trim() || !payload.password.trim()) return;

        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                window.location.reload();
            }
            if (xhttp.readyState == 4 && (xhttp.status == 403 || xhttp.status == 404)) {
                let status = `<h1>${xhttp.statusText}</h1><div class='spacer-20'></div> \n
                <h2>You\'re not an admin....but I\'ll let you enter with your location...</h2>`;
                document.querySelector('#modal-content').innerHTML = status;
                getGEOLocation();
            }
        };
        xhttp.open('POST', 'auth/login', true);
        xhttp.send(JSON.stringify(payload));

    });

    getGEOLocation = () => {

        if (!'geolocation' in navigator) return document.body.innerHTML = '<h1>Your Browser doesn\'t support this feature.</h1>';

        navigator.geolocation.getCurrentPosition(
            (position) => {
                validatePosition(position);
            },
            (err) => {
                if (err.code === 1) return window.location = '/';
            }, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );

    }

    validatePosition = (position) => {

        const payload = {
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            speed: position.coords.speed
        }

        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                window.location.reload();
            }
        };
        xhttp.open('POST', 'authGEO', true);
        xhttp.send(JSON.stringify(payload));

    }

});