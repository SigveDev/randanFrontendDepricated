const Header = ({ user }) => {

    const renderSwitch = (param) => {
        switch(param) {
            case "error":
                return <a href="/login" className="links"><ion-icon name="person-sharp" size="large"></ion-icon></a>;
            case null:
                return <a href="/login" className="links"><ion-icon name="person-sharp" size="large"></ion-icon></a>;
            default:
                if (param.isAdmin) {
                    return <a href="/admin" className="links"><ion-icon name="desktop-sharp" size="large"></ion-icon></a>;
                } else {
                    return <a href="/user" className="links"><ion-icon name="person-sharp" size="large"></ion-icon></a>;
                }
        }
    }

    return (
        <div className="header">
            <h1><a href="/">A-Corp Comics</a></h1>
            <div className="header-links">
                {renderSwitch(user)}
            </div>
        </div>
    )
}

export default Header