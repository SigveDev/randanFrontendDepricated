import { useEffect, useState } from 'react';
import ChapterSmall from '../components/chapter-small';
import axios from 'axios';

const User = ({ user, chapters, likes }) => {
    const [reading, setReading] = useState(null);
    const [parameterMet, setParameterMet] = useState(false);
    const [window2, setWindow2] = useState("liked");
    const [liked, setLiked] = useState(null);

    useEffect(() => {
        const changeReading = async () => {
            const temp = chapters.find(chapter => chapter._id === likes.reading[0].id);
            if(temp === undefined) {
                setReading(null);

                const res = await axios.delete("https://comic-api.sigve.dev/liked/reading/" + user._id, {
                    id: likes.reading[0].id
                }, { withCredentials: true });
                if(res.status === 200) {
                    localStorage.setItem('likes', JSON.stringify(res.data));
                    window.location.reload();
                }

                setReading(chapters.find(chapter => chapter._id === likes.reading[0].id));
                return;
            }
            setReading(temp);
        };
        if(likes !== null && likes.reading.length !== 0 && chapters.length !== 0) {
            changeReading();
        }
        if(reading !== null || reading !== undefined) {
            if(chapters.length !== 0) {
                if(likes !== null) {
                    if(likes.reading.length !== 0) {
                        setParameterMet(true);
                    }
                }
            }
        }
    }, [likes, chapters, user, reading]);

    useEffect(() => {
        if(user === "error") {
            window.location.replace("/login");
        }
    }, [user]);

    useEffect(() => {
        setLiked(JSON.parse(localStorage.getItem('likes')));
    }, []);

    useEffect(() => {
        const checkLikes = async () => {
            if(liked !== null && chapters !== null && user !== null) {
                if(liked.liked.length !== 0) {
                    liked.liked.forEach(like => {
                        if(chapters.find(chapter => chapter._id === like) === undefined) {
                            const res = axios.put("https://comic-api.sigve.dev/liked/like/" + user._id, {
                                id: like
                            }, { withCredentials: true });
                            if(res.status === 200) {
                                localStorage.setItem('likes', JSON.stringify(res.data));
                            }
                        }
                    });
                }
                if(liked.history.length !== 0) {
                    liked.history.forEach(history => {
                        if(chapters.find(chapter => chapter._id === history) === undefined) {
                            const res = axios.put("https://comic-api.sigve.dev/liked/history/" + user._id, {
                                id: history
                            }, { withCredentials: true });
                            if(res.status === 200) {
                                localStorage.setItem('likes', JSON.stringify(res.data));
                            }
                        }
                    });
                }
            }
        }
        checkLikes();
    }, [liked, chapters, user]);

    const changeWindow = () => {
        if(window2 === "liked") {
            setWindow2("history");
        } else {
            setWindow2("liked");
        }
    }

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('ttl');
        localStorage.removeItem('likes');
        window.location.replace("/login");
    }

    return (
        <div className="user">
            <div className="user-content">
                <div className="current">
                    {user !== null ? <div className="user-info">
                        <h2 className="user-settings">User Settings</h2>
                        <p>Username: {user.username}</p>
                        <button className="logout" onClick={logout}>Logout</button>
                    </div> : <p>Nothing here yet</p>}

                    <h2>Current Reading</h2>
                    {parameterMet && reading ? <ChapterSmall chapter={reading} /> : <p>Nothing here yet</p>}
                </div>
                <div className="other">
                    <div className="selector">
                        {window2 === "liked" ? <button className="liked" onClick={changeWindow}>Liked</button> : <button className="history" onClick={changeWindow}>History</button>}
                    </div>
                    <div className="content">
                        {window2 === "liked" ? <div className="liked-content">
                            {liked && chapters ? liked.liked.map((chapterLiked, index) => {
                                const chapterInfo = chapters.find(chapter => chapter._id === chapterLiked);
                                if(chapterInfo === undefined || chapterInfo === null) {
                                    return null;
                                }
                                return <ChapterSmall chapter={chapterInfo} key={index} />;
                            }) : <p>Nothing here yet</p>}
                        </div> : <div className="history-content">
                            {liked && chapters ? liked.history.map((chapterHistory, index) => {
                                const chapterInfo = chapters.find(chapter => chapter._id === chapterHistory);
                                if(chapterInfo === undefined || chapterInfo === null) {
                                    return null;
                                }
                                return <ChapterSmall chapter={chapterInfo} key={index} />;
                            }) : <p>Nothing here yet</p>}
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default User;