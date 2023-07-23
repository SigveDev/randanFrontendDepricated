import { useEffect, useState } from "react";

const Page = ({ chapters }) => {
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

    return (
        <div className="page">
            <div className="page-viewer">
                {page && <div className="page-ui"><a href={`http://localhost:3000/chapter/${page._id}`}><ion-icon name="chevron-back-sharp"></ion-icon>Back</a></div>}
                {page &&
                <div className="page-content">
                    {number > 0 ?
                        <img src={`http://localhost:5000/uploads/${page.pages[number - 1].image}`} id="pageImage" alt={"page " + number} onClick={ChangeFullPage} />
                        :  
                        <img src={`http://localhost:5000/uploads/${page.image}`} id="pageImage" alt={"page " + number} onClick={ChangeFullPage} />
                    }
                </div>
                }
                {page && <div className="page-ui-bottom">Page {parseInt(number)}</div> }
                {page && 
                    <div className="page-ui-left">
                        {number > 0 && <a className="left-link" href={`http://localhost:3000/page/${id}/${parseInt(number) - 1}?full=false`}><ion-icon name="chevron-back-sharp"></ion-icon></a>}
                    </div>
                }
                {page &&
                    <div className="page-ui-right">
                        {number < page.pages.length - 1 && <a className="right-link" href={`http://localhost:3000/page/${id}/${parseInt(number) + 1}?full=false`}><ion-icon name="chevron-forward-sharp"></ion-icon></a>}
                    </div>
                }
            </div>
            {fullpage &&
                <div className="fullpage">
                    {page &&
                        <div className="fullpage-content">
                            {number > 0 ?
                                <img src={`http://localhost:5000/uploads/${page.pages[number - 1].image}`} alt={"page " + number} onClick={ChangeFullPage} />
                                :  
                                <img src={`http://localhost:5000/uploads/${page.image}`} alt={"page " + number} onClick={ChangeFullPage} />
                            }
                        </div>
                    }
                    {page && 
                        <div className="fullpage-ui-left">
                            {number > 0 && <a className="left-link-full" href={`http://localhost:3000/page/${id}/${parseInt(number) - 1}?full=true`}><ion-icon name="chevron-back-sharp"></ion-icon></a>}
                        </div>
                    }
                    {page &&
                        <div className="fullpage-ui-right">
                            {number < page.pages.length - 1 && <a className="right-link-full" href={`http://localhost:3000/page/${id}/${parseInt(number) + 1}?full=true`}><ion-icon name="chevron-forward-sharp"></ion-icon></a>}
                        </div>
                    }
                </div>
            }
        </div>
    )
}

export default Page;