import { useStore } from '../stores/hooks';
import { getAuthInstance } from '../utils/axiosConfig';

function SendNotification(filter, notification) {
    const authInstance = getAuthInstance();

    const [state, dispatch] = useStore();

    // authInstance
    //     .post(`/webpush/send`, {
    //         filter,
    //         notification,
    //     })
    //     .then((result) => {
    //         if (result.data.status === 'OK') {
    //             state.socket.emit('send-notification');
    //         }
    //     })
    //     .catch((err) => {
    //         console.error(err);
    //     });
}

export default SendNotification;
