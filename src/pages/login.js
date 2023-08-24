import axios from "axios";
import { useEffect, useState } from "react";

const Login = ({ user }) => {
    const [status, setStatus] = useState(true);

    const login = async (e) => {
        e.preventDefault();
        try {
            const username = document.getElementById('usern').value;
            const password = document.getElementById('pass').value;
            const response = await axios.post('https://comic.api.sigve.dev/user/login', {}, {
                withCredentials: true,
                headers: {
                    username: username,
                    password: password
                }
            });
            console.log(response);
            if(response.status === 200) {
                localStorage.setItem('user', JSON.stringify(response.data.accessToken));
                let now = new Date();
                localStorage.setItem('ttl', JSON.stringify(now.getTime() + (86400000 * 7)));
                if(response.data.user.isAdmin === true) {
                    window.location.replace('/admin');
                } else {
                    window.location.replace('/user');
                }
            }
        } catch (err) {
            console.log(err);
            setStatus(false);
        }
    };

    useEffect(() => {
        if(user !== null) {
            if(user.isAdmin === false) {
                window.location.replace('/user');
            } else if (user.isAdmin === true) {
                window.location.replace('/admin');
            }
        }
    }, [user]);

    return (
        <div className="login">
            <form className="login-form" onSubmit={login}>
                <h2>Login</h2>
                <input type="text" id="usern" placeholder="username" />
                <input type="password" id="pass" placeholder="password" />
                {status === false && <p className="error">Feil brukernavn eller passord</p>}
                <a href="/register">New user?</a>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
