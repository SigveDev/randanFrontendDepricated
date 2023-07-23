import { useEffect, useState } from "react";
import axios from "axios";

const Chapter = ({ chapters }) => {
    const [chapter, setChapter] = useState(null);
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
                    axios.put("http://localhost:5000/vidstats/update/views/" + id, {});
                }, 5000);
            }
        }
        getChapter();
    }, [chapters, id, pageAccessedByReload]);

    return (
        <div className="chapter">
            {chapter &&
            <div className="chapter-content">
                <a className="left" href={"http://localhost:3000/page/" + id + "/0"}>
                    <img src={`http://localhost:5000/uploads/${chapter.image}`} alt="" />
                </a>
                <div className="right">
                    <h1>{chapter.title}</h1>
                    <h3>Chapter {chapter.chapter}</h3>
                    <h4>By {chapter.author}</h4>
                    <p>{chapter.description}</p>
                </div>
            </div>
            }
            {chapter &&
            <div className="pages">
                <h2>Pages</h2>
                <div className="pages-content">
                    {chapter.pages.map((page, i) => (
                        <a href={`http://localhost:3000/page/${chapter._id}/${i + 1}?full=false`} key={i}>
                            <img src={"http://localhost:5000/uploads/" + page.image} alt={"page " + i} className="pageImg" />
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