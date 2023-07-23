const ChapterHorizontal = ({ chapter }) => {
    return (
        <a className="chapter-small-hoz" href={`http://localhost:3000/chapter/${chapter._id}`}>
            <img src={"http://localhost:5000/uploads/" + chapter.image} alt={chapter.title} />
            <div className="info">
                <h2 className="chapter-small-hoz__title">{chapter.title}</h2>
                <p className="chapter-small-hoz__author">By {chapter.author}</p>
                <p className="chapter-desc">{chapter.description}</p>
                <p className="pages-count">{chapter.pages.length} pages</p>
            </div>
        </a>
    );
}

export default ChapterHorizontal