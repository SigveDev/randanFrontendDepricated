import { useEffect, useState } from "react";
import axios from "axios";

const Chapter = ({ chapters, user }) => {
    const [chapter, setChapter] = useState(null);
    const [liked, setLiked] = useState(null);
    const [likeButton, setLikeButton] = useState(false);
    const url = window.location.pathname.split("/");
    const id = url[url.length - 1];

    const pageAccessedByReload = (
        (window.performance.navigation && window.performance.navigation.type === 1) ||
          window.performance
            .getEntriesByType('navigation')
            .map((nav) => nav.type)
            .includes('reload')
    );

    useEffect(() => {
        const getChapter = async () => {
            const chapter = chapters.find((chapter) => chapter._id === id);
            setChapter(chapter);
            if(!pageAccessedByReload) {
                setTimeout(() => {
                    axios.put("https://comic-api.sigve.dev/vidstats/update/views/" + id, {});
                }, 5000);
            }
        }
        getChapter();
    }, [chapters, id, pageAccessedByReload]);

    const like = async () => {
        const url = window.location.pathname.split("/");
        const id = url[url.length - 1];
        const res = await axios.post("https://comic-api.sigve.dev/liked/like/" + id, {
            userId: user._id
        }, { withCredentials: true });
        if(res.status === 200) {
            localStorage.setItem('likes', JSON.stringify(res.data));
            setLiked(res.data);
            if(likeButton === false) {
                await axios.put('https://comic-api.sigve.dev/vidstats/update/likes/add/' + id, {});
            } else if(likeButton === true) {
                await axios.put('https://comic-api.sigve.dev/vidstats/update/likes/remove/' + id, {});
            }
        }
    }

    useEffect(() => {
        const liked = JSON.parse(localStorage.getItem('likes'));
        if(liked) {
            if(liked.liked.includes(id)) {
                setLikeButton(true);
            } else {
                setLikeButton(false);
            }
        }
    }, [liked, id]);

    return (
        <div className="chapter">
            {chapter &&
            <div className="chapter-content">
                <a className="left" href={"/page/" + id + "/0"}>
                    <img src={`https://comic-api.sigve.dev/uploads/${chapter.image}`} alt="" />
                </a>
                <div className="right">
                    <h1>{chapter.title}</h1>
                    <h3>Chapter {chapter.chapter}</h3>
                    <h4>By {chapter.author}</h4>
                    <p>{chapter.description}</p>
                    {user !== null && user !== "error" ? <div>
                    {likeButton ? <button onClick={like} className="liked"><ion-icon name="heart"></ion-icon></button> : <button onClick={like}><ion-icon name="heart-outline"></ion-icon></button>}
                    </div> : <div></div>}
                </div>
            </div>
            }
            {chapter &&
            <div className="pages">
                <h2>Pages</h2>
                <div className="pages-content">
                    {chapter.pages.map((page, i) => (
                        <a href={`/page/${chapter._id}/${i + 1}?full=false`} key={i}>
                            <img src={"https://comic-api.sigve.dev/uploads/" + page.image} alt={"page " + i} className="pageImg" />
                            <p>Page {i + 1}</p>
                        </a>
                    ))}
                </div>
            </div>
            }
        </div>
    )
}

export default Chapter