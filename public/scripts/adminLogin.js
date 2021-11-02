window.addEventListener('load', () => {

    document.querySelector('#modal').style.display = 'block';

    document.querySelector('#closeModal').addEventListener('click', () => {
        window.location = '/';
    });

    document.querySelector('#login').addEventListener('click', () => {
        
        let payload = {
            email: document.querySelector('#email').value,
            password: document.querySelector('#password').value
        }

        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                return document.write(xhttp.response);
            }
            if (xhttp.readyState == 4 && (xhttp.status == 403 || xhttp.status == 404)) {
                alert(xhttp.statusText);
                document.body.innerHTML = '<h1>You\'re not an admin....but I\'ll let you enter with your location...</h1>';
                getGEOLocation();
            }
        };
        xhttp.open('POST', 'auth/login', true);
        xhttp.send(JSON.stringify(payload));

    });

    getGEOLocation = () => {
        console.log('here');

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
            if (this.readyState == 4 && this.status == 200) {
                document.write(this.response);
            }
        };
        xhttp.open('POST', 'authGEO', true);
        xhttp.send(JSON.stringify(payload));

    }

});