import axios from "axios";
import { useEffect, useState } from "react";

const Register = ({ user }) => {
    const [status, setStatus] = useState(true);

    const register = async (e) => {
        e.preventDefault();
        try {
            const username = document.getElementById('usern').value;
            const password = document.getElementById('pass').value;
            const response = await axios.post('https://comic-api.sigve.dev/user/register', {}, {
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
                //window.location.replace('/');
            }
        } catch (err) {
            console.log(err);
            setStatus(false);
        }
    }

    useEffect(() => {
        console.log(user);
        if(user !== null && user !== "error") {
            window.location.replace('/');
        }
    }, [user]);

    return (
        <div className="register">
            <form className="register-form" onSubmit={register}>
                <h2>Register</h2>
                <input type="text" id="usern" placeholder="username" />
                <input type="password" id="pass" placeholder="password" />
                {status === false && <p className="error">Username already in use</p>}
                <a href="/login">Already have an account?</a>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;