import React, {useState} from 'react'
import Cookies from 'js-cookie';


const handleLogout =()=>{
    Cookies.remove('token','user');
    window.location.href = '/login';
}
function Logout() {
    const [message, setMessage] = useState('You have been logged out.');
  return (
    <div>
        <button onClick={handleLogout}>logout</button>
        {
            (Cookies.token? <p>{message}</p> : <p>you are  logged in</p>)
        }
    </div>
  )
}

export default Logout