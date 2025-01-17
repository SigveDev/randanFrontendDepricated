import axios from "axios";
import { useEffect, useState } from "react";
import { HeadProvider, Title } from 'react-head';

import ChapterSmallAd from "../components/chapter-small-admin";
import New from "./new";
import Edit from "./edit";
import Stats from "./stats";

const Admin = ({ user }) => {
    const [chapters, setChapters] = useState([]);

    useEffect(() => {
        const getChapters = async () => {
            try {
                const res = await axios.get("https://comic-api.sigve.dev/chapter/findmine/" + user._id);
                setChapters(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        getChapters();
    }, [user]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page');
        switch (page) {
            case null:
                document.querySelector(".ana").classList.add("active");
                document.querySelector(".chap").classList.remove("active");
                document.querySelector(".newc").classList.remove("active");
                break;
            case "my":
                document.querySelector(".chap").classList.add("active");
                document.querySelector(".ana").classList.remove("active");
                document.querySelector(".newc").classList.remove("active");
                break;
            case "new":
                document.querySelector(".newc").classList.add("active");
                document.querySelector(".ana").classList.remove("active");
                document.querySelector(".chap").classList.remove("active");
                break;
            default:
                break;
        }
    }, []);

    const renderSwitch = (param) => {
        switch (param) {
            case null:
                return (
                    <Stats user={user} />
                );
            case "my":
                return (
                    <div className="admin-content">
                        <h2>My Chapters</h2>
                        {chapters.length > 0 ? <div className="chapters">
                            {chapters.slice(0).reverse().map((chapter, i) => (
                                <ChapterSmallAd chapter={chapter} key={i} />
                            ))}
                        </div> :
                        <div className="no-chapters">
                            <h3>You have no chapters yet...</h3>
                            <a href="/admin?page=new">Create one now!</a>
                        </div>}
                    </div>
                );
            case "new":
                return (
                    <New user={user} />
                );
            case "edit":
                const chapterId = new URLSearchParams(window.location.search).get('chapter');
                
                const chapter = chapters.find(chapter => chapter._id === chapterId);
                
                return (
                    <Edit user={user} chapter={chapter} />
                );
            default:
                return (
                    <div className="admin-content">
                        <h2>404 Page not found...</h2>
                    </div>
                );
        }
    };

    useEffect(() => {
        if(user === "error") {
            window.location.replace("/login");
        } else if (user !== "error"){
            if(user !== null) {
                if(user.isAdmin === false) {
                    window.location.replace("/");
                }
            }
        }
    }, [user]);

    return (
        <HeadProvider>
        <Title>Admin Panel</Title>
        <div className="admin">
            <div className="admin-menu">
                <a className="ana" href="/admin">Analytics</a>
                <a className="chap" href="/admin?page=my">My Chapters</a>
                <a className="newc" href="/admin?page=new">New Chapter</a>
                <button className="logout" onClick={
                    () => {
                        localStorage.removeItem('user');
                        localStorage.removeItem('ttl');
                        window.location.replace('/login');
                    }
                }>Logout</button>
            </div>
            <div className="admin-view">
                {renderSwitch(new URLSearchParams(window.location.search).get('page'))}
            </div>
        </div>
        </HeadProvider>
    )
}

export default Admin;