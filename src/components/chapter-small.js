const ChapterSmall = ({ chapter }) => {
    return (
        <a className="chapter-small" href={`http://localhost:3000/chapter/${chapter._id}`}>
            <img src={"http://localhost:5000/uploads/" + chapter.image} alt={chapter.title} />
            <h2 className="chapter-small__title">{chapter.title}</h2>
            <p className="chapter-small__author">{chapter.author}</p>
            <p className="pages-count">pages: {chapter.pages.length}</p>
        </a>
    );
}

export default ChapterSmall