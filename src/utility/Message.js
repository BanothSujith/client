import store from "../reduxstore/Store";
import { setMessage, setMessageStatus } from "../reduxstore/slices";

function Message (message,status) {
    store.dispatch(setMessage(message));
    store.dispatch(setMessageStatus(status))
    setTimeout(()=> store.dispatch(setMessage(""),setMessageStatus("")) , 3000)
}
export default Message