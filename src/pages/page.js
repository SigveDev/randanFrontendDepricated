import { useEffect, useState } from "react";
import axios from "axios";

const Page = ({ chapters, likes, user }) => {
    const [page, setPage] = useState(null);
    const [fullpage, setFullpage] = useState(false);

    const url = window.location.pathname.split("/");
    const id = url[url.length - 2];
    const number = url[url.length - 1];

    useEffect(() => {
        const getPage = async () => {
            const chapter = chapters.find((chapter) => chapter._id === id);
            setPage(chapter);
        }
        getPage();
    }, [chapters, id]);

    useEffect(() => {
        const changeReading = async () => {
            console.log(user._id);
            await axios.post("https://comic-api.sigve.dev/liked/reading/" + user._id, {
                id: id,
                title: page.title,
            });
            const res = await axios.get('https://comic-api.sigve.dev/liked/likes/' + user._id, {}, { withCredentials: true });
            localStorage.setItem('likes', JSON.stringify(res.data));
        }
        if(likes !== null && user !== null && user !== "error") {
            if(likes.reading.length === 0) {
                changeReading();
            } else {
                if(likes.reading[0].id !== id) {
                    changeReading();
                }
            }
        }
    }, [likes, id, user, page]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const full = params.get("full");
        if (full === "true") {
            setFullpage(true);
        }
    }, []);

    const ChangeFullPage = () => {
        setFullpage(!fullpage);
        const params = new URLSearchParams(window.location.search);
        params.set("full", !fullpage);
        const newUrl = window.location.pathname + "?" + params.toString();
        window.history.pushState({}, "", newUrl);
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            const params = new URLSearchParams(window.location.search);
            const full = params.get("full");
            if (event.keyCode === 37) { // Left arrow key
                let leftLink;
                if(full === "true") {
                    leftLink = document.querySelector(".left-link-full");
                } else {
                    leftLink = document.querySelector(".left-link");
                }
                if (leftLink) {
                    leftLink.click();
                }
            } else if (event.keyCode === 39) { // Right arrow key
                let rightLink;
                if(full === "true") {
                    rightLink = document.querySelector(".right-link-full");
                } else {
                    rightLink = document.querySelector(".right-link");
                }
                if (rightLink) {
                    rightLink.click();
                }
            } else if (event.keyCode === 70) { // F key
                document.getElementById("pageImage").click();
            } else if (event.keyCode === 27) { // Esc key
                if (full === "true") {
                    document.getElementById("pageImage").click();
                }
            } else if (event.keyCode === 38) { // Up arrow key
                const activeElement = document.querySelector(".fullpage");
                if (activeElement) {
                    activeElement.scrollTop -= activeElement.clientHeight / 4;
                }
            } else if (event.keyCode === 40) { // Down arrow key
                const activeElement = document.querySelector(".fullpage");
                if (activeElement) {
                    activeElement.scrollTop += activeElement.clientHeight / 4;
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    useEffect(() => {
        const changeReading = async () => {
            if(parseInt(number) === page.pages.length) {
                console.log("change reading");
                const res = await axios.post("https://comic-api.sigve.dev/liked/history/" + id, {
                    userId: user._id,
                }, { withCredentials: true });
                if(res.status === 200) {
                    localStorage.setItem('likes', JSON.stringify(res.data));
                }
            }
        }
        if(user !== null && user !== "error" && page && id && number) {
            changeReading();
        }
    }, [number, page, id, user]);

    return (
        <div className="page">
            <div className="page-viewer">
                {page && <div className="page-ui"><a href={`/chapter/${page._id}`}><ion-icon name="chevron-back-sharp"></ion-icon>Back</a></div>}
                {page &&
                <div className="page-content">
                    {number > 0 ?
                        <img src={`https://comic-api.sigve.dev/uploads/${page.pages[number - 1].image}`} id="pageImage" alt={"page " + number} onClick={ChangeFullPage} />
                        :  
                        <img src={`https://comic-api.sigve.dev/uploads/${page.image}`} id="pageImage" alt={"page " + number} onClick={ChangeFullPage} />
                    }
                </div>
                }
                {page && <div className="page-ui-bottom">Page {parseInt(number)}</div>}
                {page && 
                    <div className="page-ui-left">
                        {number > 0 && <a className="left-link" href={`/page/${id}/${parseInt(number) - 1}?full=false`}><ion-icon name="chevron-back-sharp"></ion-icon></a>}
                    </div>
                }
                {page &&
                    <div className="page-ui-right">
                        {number < page.pages.length && <a className="right-link" href={`/page/${id}/${parseInt(number) + 1}?full=false`}><ion-icon name="chevron-forward-sharp"></ion-icon></a>}
                    </div>
                }
            </div>
            {fullpage &&
                <div className="fullpage">
                    {page &&
                        <div className="fullpage-content">
                            {number > 0 ?
                                <img src={`https://comic-api.sigve.dev/uploads/${page.pages[number - 1].image}`} alt={"page " + number} onClick={ChangeFullPage} />
                                :  
                                <img src={`https://comic-api.sigve.dev/uploads/${page.image}`} alt={"page " + number} onClick={ChangeFullPage} />
                            }
                        </div>
                    }
                    {page && 
                        <div className="fullpage-ui-left">
                            {number > 0 && <a className="left-link-full" href={`/page/${id}/${parseInt(number) - 1}?full=true`}><ion-icon name="chevron-back-sharp"></ion-icon></a>}
                        </div>
                    }
                    {page &&
                        <div className="fullpage-ui-right">
                            {number < page.pages.length && <a className="right-link-full" href={`/page/${id}/${parseInt(number) + 1}?full=true`}><ion-icon name="chevron-forward-sharp"></ion-icon></a>}
                        </div>
                    }
                </div>
            }
        </div>
    )
}

export default Page;