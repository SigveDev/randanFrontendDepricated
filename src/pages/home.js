import ChapterHorizontal from "../components/chapter-horizontal";
import ChapterSmall from "../components/chapter-small";
import { HeadProvider, Title } from 'react-head';

import { useState } from "react";

const Home = ({ chapters }) => {
    const [sortway, setSortway] = useState("new");

    const sort = () => {
        setSortway(document.querySelector(".sort").value);
    }

    return (
        <HeadProvider>
        <Title>A-Corp Comic - Home</Title>
        <div className="home">
            {chapters.length > 0 ?
            <div className="home-content">
                <div className="latest">
                    <h2>Latest</h2>
                    <ChapterSmall chapter={chapters[chapters.length - 1]} />
                </div>
                <div className="other">
                    <h2 className="other-header">Other</h2>
                    <select className="sort" onChange={() => sort()} defaultValue="new">
                        <option value="new">Newest</option>
                        <option value="old">Oldest</option>
                    </select>
                    {
                        sortway === "new" ?
                        chapters.slice(0).reverse().map((chapter, i) => {
                            if(chapters[chapters.length - 1]._id !== chapter._id) {
                                return <ChapterHorizontal chapter={chapter} key={i} />;
                            }
                            return null;
                        })
                        :
                        chapters.map((chapter, i) => {
                            if(chapters[chapters.length - 1]._id !== chapter._id) {
                                return <ChapterHorizontal chapter={chapter} key={i} />;
                            }
                            return null;
                        })
                    }
                </div>
            </div>
            : <h2>No chapters found...</h2>}
        </div>
        </HeadProvider>
    )
}

export default Home