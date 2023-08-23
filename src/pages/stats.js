import axios from "axios";
import { useEffect, useState } from "react";

const Stats = ({ user }) => {
    const [chapters, setChapters] = useState([]);
    const [stats, setStats] = useState([]);
    const [views, setViews] = useState(0);
    const [viewsCalcRun, setViewsCalcRun] = useState(false);

    useEffect(() => {
        const getChapters = async () => {
            try {
                const res = await axios.get("http://node.binders.net:8123/chapter/findmine/" + user._id);
                setChapters(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        const getStats = async () => {
            try {
                const res = await axios.get("http://node.binders.net:8123/vidstats/findmine/" + user._id);
                setStats(res.data.slice(0).reverse());
            } catch (err) {
                console.log(err);
            }
        }
        getChapters();
        getStats();
    }, [user]);

    useEffect(() => {
        if(stats.length !== 0 && !viewsCalcRun) {
            let temp = 0;
            for(let i = 0; i < stats.length; i++) {
                temp += stats[i].views;
            }
            setViews(temp);
            setViewsCalcRun(true);
        }
    }, [stats, viewsCalcRun]);

    return (
        <div className="stats">
            <h2>Analytics</h2>
            {chapters && stats && views ? <div className="stats-content">
                <div className="overall">
                    <ion-icon name="eye-sharp"></ion-icon>
                    <p>{views}</p>
                </div>
                <div className="chapters">
                    {chapters.slice(0).reverse().map((chapter, i) => (
                        <div className="chapterStats" key={i}>
                            <img src={`http://node.binders.net:8123/uploads/${chapter.image}`} alt="" />
                            <p className="title">{chapter.title}</p>
                            <p className="views">{stats[i].views}<ion-icon name="eye-sharp"></ion-icon></p>
                        </div>
                    ))}
                </div>
            </div> :
            <div>
                {(!stats && chapters) || (stats && !chapters) ? <p>Loading...</p> : <p>No chapters yet!</p>}
            </div>}
        </div>
    );
}

export default Stats;