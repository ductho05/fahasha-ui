
const checkPermission = () => {
    if (!('serviceWorker' in navigator)) {
        throw new Error('No support for service worker')
    }

    if (!('Notification' in window)) {
        throw new Error('No support for notification Api')
    }
}

const registerSw = async () => {
    const registration = await navigator.serviceWorker.register('./sw.js')
    return registration
}

const requestNoficationPermissions = async () => {
    const permission = await Notification.requestPermission()

    if (permission !== "granted") {
        throw new Error('Notification permission not allowed!')
    } else {
        console.log('dax vo')
        new Notification("hello world")
    }
}

const main = async () => {
    checkPermission()
    registerSw()
    requestNoficationPermissions()
}


function ServiceWorkerNotifi() {
    main()
}

export default ServiceWorkerNotifi