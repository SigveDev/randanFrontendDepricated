import axios from "axios";
import { useState } from "react";
import { HeadProvider, Title } from 'react-head';

const Edit = ({ user, chapter }) => {
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
                    "https://comic-api.sigve.dev/upload",
                    data
                );
                tempPages.push({
                    page: i + 1,
                    image: res.data.file,
                });
            }
            for(let i = 0; i < chapter.pages.length; i++) {
                axios.delete("https://comic-api.sigve.dev/upload/delete/" + chapter.pages[i].image);
            }
        } else {
            tempPages = chapter.pages;
        }

        const newChapter = {
            title: document.querySelector(".title").value,
            chapter: parseInt(document.querySelector(".chapter-input").value),
            author: document.querySelector(".author").value,
            description: document.querySelector(".description").value,
            pages: tempPages,
            userId: user._id,
        };
        if (imageUrl) {
            const data = new FormData();
            data.append("image", file);
            const res = await axios.post(
                "https://comic-api.sigve.dev/upload",
                data
            );
            newChapter.image = res.data.file;

            axios.delete("https://comic-api.sigve.dev/upload/delete/" + chapter.image);
        } else {
            newChapter.image = chapter.image;
        }
        try {
            await axios.put("https://comic-api.sigve.dev/chapter/update/" + chapter._id, newChapter);
            window.location.replace("/admin?page=my");
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <HeadProvider>
        <Title>Edit Chapter</Title>
        <div className="edit">
            <h2>Edit Chapter</h2>
            {chapter && <form onSubmit={handleSubmit} className="edit-form">
                <input type="text" className="title" placeholder="Title" defaultValue={chapter.title} />
                <div className="left">
                    <input type="file" className="frontUpload" onChange={handleFileChange} accept="image/png, image/jpg, image/jpeg, image/gif" />
                    {imageUrl ? <img src={imageUrl} alt="Uploaded file" className="uploadedImg" onClick={handleClick} /> : <img src={"https://comic-api.sigve.dev/uploads/" + chapter.image} alt="Please upload" className="uploadedImg" onClick={handleClick} />}
                </div>
                <div className="right">
                    <input type="text" className="author" placeholder="Author" defaultValue={chapter.author}/>
                    <input type="number" className="chapter-input" placeholder="Chapter" defaultValue={chapter.chapter} />
                    <textarea className="description" placeholder="Description" defaultValue={chapter.description} />
                </div>
                <div className="pages-upload">
                    <button onClick={handlePagesClick} type="button">
                        Upload Pages
                    </button>
                    <input type="file" className="pagesUpload" onChange={handleFilesChange} multiple accept="image/png, image/jpg, image/jpeg, image/gif" /> 
                </div>
                <div className="pages-grid">
                    {imagesUrl.length === 0 ? chapter.pages.map((page, i) => (
                        <div key={i}>
                            <img src={"https://comic-api.sigve.dev/uploads/" + page.image} alt={"page " + i} className="uploadedPage" />
                            <p>Page {i + 1}</p>
                        </div>
                    )) : 
                    imagesUrl.map((image, i) => (
                        <div key={i}>
                            <img src={image} alt="Uploaded file" className="uploadedPage" />
                            <p>Page {i + 1}</p>
                        </div>
                    ))
                    }
                </div>
                <div className="submit">
                    <input type="button" value="Delete" onClick={() => {
                        if (window.confirm("Are you sure you want to delete this chapter?")) {
                            axios.delete("https://comic-api.sigve.dev/chapter/delete/" + chapter._id, {data: {userId: user._id}, withCredentials: true});
                            window.location.replace("/admin?page=my");
                        }
                    }} />
                    <input type="submit" value="Update" />
                </div>
            </form>}
        </div>
        </HeadProvider>
    )
}

export default Edit