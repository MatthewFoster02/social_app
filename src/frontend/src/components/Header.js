import '../style/Header.css';

const HeaderNav = () =>
{
    const openLeftModal = () =>
    {

    }

    const openRightModal = () =>
    {

    }

    return (
        <div className="headerMobile">
            <button className='link-header' onClick={openLeftModal}>Profile</button>
            <button className='link-header' onClick={openRightModal}>Search</button>
        </div>
    );
}
export default HeaderNav;
