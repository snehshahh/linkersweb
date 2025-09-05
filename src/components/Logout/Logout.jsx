import { useCookies } from "react-cookie";
export default function Logout(){
    const [removeCookie] = useCookies(['userId']);
    const handleLogOut = () => {
        localStorage.setItem('userId', '');
        removeCookie('userId');
        navigate('../../../LoginSignUp.js');
      };
    return(

        <div className='col-md-12' style={{ margin: '0px auto 0px auto' }}>
            <div className='button-container'>
            <div></div>
            <div>
                <button className="btn mb-3 pr-5 mr-5" onClick={handleLogOut}>
                <FontAwesomeIcon icon={faPowerOff} />
                </button>
            </div>
            <div></div>
            </div>
        </div>
        );
}