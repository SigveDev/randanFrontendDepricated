const ChapterSmallAd = ({ chapter }) => {
    return (
        <a className="chapter-small-ad" href={`/admin?page=edit&chapter=${chapter._id}`}>
            <img src={"https://comic-api.sigve.dev/uploads/" + chapter.image} alt={chapter.title} />
            <h2 className="chapter-small-ad__title">{chapter.title}</h2>
            <p className="chapter-small-ad__author">{chapter.author}</p>
            <div className="chapter-hover">
                <ion-icon name="create-sharp"></ion-icon>
            </div>
        </a>
    );
}

export default ChapterSmallAd