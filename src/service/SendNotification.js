import { api } from "../constants"

function SendNotification(filter, notification) {
    fetch(`${api}/webpush/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            filter,
            notification
        })
    })
        .then(response => response.json())
        .then(result => {

        })
        .catch(err => {
            console.error(err)
        })
}

export default SendNotification