const Header = ({ user }) => {
    return (
        <div className="header">
            <h1><a href="/">Randan</a></h1>
            <div className="header-links">
                {user !== "error" ? <a href="/admin" className="links"><ion-icon name="desktop-sharp" size="large"></ion-icon></a> : <a href="/login" className="links"><ion-icon name="person-sharp" size="large"></ion-icon></a>}
            </div>
        </div>
    )
}

export default Header