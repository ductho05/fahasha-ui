import { api } from "../constants"
import { useStore } from "../stores/hooks"

function SendNotification(filter, notification) {

    const [state, dispatch] = useStore()

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
            if (result.status === "OK") {
                state.socket.emit("send-notification")
            }
        })
        .catch(err => {
            console.error(err)
        })
}

export default SendNotification