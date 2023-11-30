
const checkPermission = () => {
    if (!('serviceWorker' in navigator)) {
        console.log('No support for service worker');
    }

    if (!('Notification' in window)) {
        console.log('No support for notification API');
    }
};

const registerSw = async () => {
    const registration = await navigator.serviceWorker.register('./sw.js')
    return registration;
};

const requestNoficationPermissions = async () => {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
        console.log('Notification permission not allowed!');
    } else {
        console.log('Permission granted');
    }
};

const sendData = async () => {
    const token = JSON.parse(localStorage.getItem('token'))
    navigator.serviceWorker.ready.then((registration) => {
        registration.active.postMessage({ action: 'send-token', data: token });
    });
}

const checkSubscription = async () => {
    navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
        serviceWorkerRegistration.pushManager
            .getSubscription()
            .then(async (subscription) => {
                const token = JSON.parse(localStorage.getItem('token'))
                await fetch('https://bookstore-ta.onrender.com/bookstore/api/v1/webpush/subscription', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        token,
                        subscription
                    })
                })
                    .then(response => response.json())
                    .then(result => {
                        
                    })
            })
            .catch((err) => {
                console.error(`Error during getSubscription(): ${err}`);
            });
    });
}

const main = async () => {
    try {
        checkPermission();
        await requestNoficationPermissions();
        await registerSw()
        await sendData()
        await checkSubscription()
    } catch (error) {
        console.log(error);
    }
};

async function ServiceWorkerNotifi() {
    main()
}

export default ServiceWorkerNotifi;
