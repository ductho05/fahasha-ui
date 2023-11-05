
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

const sendData = () => {
    const token = JSON.parse(localStorage.getItem('token'))
    navigator.serviceWorker.ready.then((registration) => {
        registration.active.postMessage({ action: 'send-token', data: token });
    });
}

const main = async () => {
    try {
        checkPermission();
        await requestNoficationPermissions();
        await registerSw()
        sendData()
    } catch (error) {
        console.log(error);
    }
};

async function ServiceWorkerNotifi() {
    main()
}

export default ServiceWorkerNotifi;