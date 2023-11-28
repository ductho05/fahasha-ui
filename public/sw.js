const PUBLIC_KEY = "BChIP9bgEuPaXNXFpNSQaIVpF5DsKYSl9WoueBtNKA-FX1LOvuS6oxc-92DBgFMgcojDPfTzPvxmbzeFz27lJ68"
let token = null;

const urlBase64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = atob(base64);
    const buffer = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        buffer[i] = rawData.charCodeAt(i);
    }

    return buffer;
}

const saveSubscription = async (subscription, token) => {
    const response = await fetch('https://bookstore-ta.onrender.com/bookstore/api/v1/webpush/subscription', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            subscription,
            token
        })
    })

    return response.json()
}

self.addEventListener("message", (event) => {
    if (event.data.action == 'send-token') {
        token = event.data.data
    }
});

self.addEventListener("activate", async (e) => {
    const subcription = await self.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY)
    })

    await saveSubscription(subcription, token)
})

self.addEventListener("push", (e) => {
    const notificationData = e.data.json();
    const { title, description, image, url } = notificationData;

    self.registration.showNotification(title, {
        body: description,
        icon: image,
        data: {
            url: url
        }
    })
})

self.addEventListener("notificationclick", (e) => {
    e.notification.close();

    const url = e.notification.data.url;
    clients.openWindow(url)
})
