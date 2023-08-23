import axios from "axios";
import { useState } from "react";

import tempImage from "../images/please-upload.png";

const New = ({ user }) => {
    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [files, setFiles] = useState([]);
    const [imagesUrl, setImagesUrl] = useState([]);
    const [pages, setPages] = useState(0);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setImageUrl(URL.createObjectURL(e.target.files[0]));
    };
    
    const handleFilesChange = (e) => {
        setFiles(e.target.files);
        const imagesUrl = [];
        for (let i = 0; i < e.target.files.length; i++) {
            imagesUrl.push(URL.createObjectURL(e.target.files[i]));
        }
        setImagesUrl(imagesUrl);
        setPages(imagesUrl.length);
    };

    const handleClick = () => {
        document.querySelector(".frontUpload").click();
    };

    const handlePagesClick = () => {
        document.querySelector(".pagesUpload").click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let tempPages = [];
        if(pages !== 0) {
            for (let i = 0; i < pages; i++) {
                const data = new FormData();
                data.append("image", files[i]);
                const res = await axios.post(
                    "https://node.binders.net:8123/upload",
                    data
                );
                tempPages.push({
                    page: i + 1,
                    image: res.data.file,
                });
            }
        }

        const newChapter = {
            title: document.querySelector(".title").value,
            chapter: parseInt(document.querySelector(".chapter-input").value),
            author: document.querySelector(".author").value,
            description: document.querySelector(".description").value,
            pages: tempPages,
            userId: user._id,
        };
        const data = new FormData();
        data.append("image", file);
        const res = await axios.post(
            "https://node.binders.net:8123/upload",
            data
        );
        newChapter.image = res.data.file;
        try {
            await axios.post("https://node.binders.net:8123/chapter/new", newChapter);
            window.location.replace("/admin?page=my");
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="new">
            <h2>New Chapter</h2>
            <form onSubmit={handleSubmit} className="new-form">
                <input type="text" className="title" placeholder="Title" />
                <div className="left">
                    <input type="file" className="frontUpload" onChange={handleFileChange} accept="image/png, image/jpg, image/jpeg, image/gif" />
                    {imageUrl ? <img src={imageUrl} alt="Uploaded file" className="uploadedImg" onClick={handleClick} /> : <img src={tempImage} alt="Please upload" className="uploadedImg" onClick={handleClick} />}
                </div>
                <div className="right">
                    {user ? <input type="text" className="author" placeholder="Author" defaultValue={user.username}/> : <></>}
                    <input type="number" className="chapter-input" placeholder="Chapter" />
                    <textarea className="description" placeholder="Description" />
                </div>
                <div className="pages-upload">
                    <button onClick={handlePagesClick} type="button">
                        Upload Pages
                    </button>
                    <input type="file" className="pagesUpload" onChange={handleFilesChange} multiple accept="image/png, image/jpg, image/jpeg, image/gif" /> 
                </div>
                <div className="pages-grid">
                    {imagesUrl && imagesUrl.map((image, i) => (
                        <div key={i}>
                            <img src={image} alt="Uploaded file" className="uploadedPage" />
                            <p>Page {i + 1}</p>
                        </div>
                    ))}
                </div>
                <div className="submit">
                    <input type="submit" value="Publish" />
                </div>
            </form>
        </div>
    )
}

export default New