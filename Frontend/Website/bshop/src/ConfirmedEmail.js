import Lottie from 'react-lottie';
import animationData from './medias/53735-cart-icon-loader.json';
import confirmed from './medias/Confirmed-pana.svg';

function ConfirmedEmail(){
    return <div style={{ height:"calc( 100vh - 56px - 4rem)",width:"100vw", background: "var(--bg-color)", alignItems: "center", display: "flex", flexDirection: "column", direction: "rtl"}}>
        {/* <div style={{width:"100%", height:"100%"}}> */}
        <div style={{width:"70%", height:"70%", marginTop:"auto"}}>
            <img src={confirmed} alt="shopping at store with bishop" style={{width: "100%", height:"100%"}} />
        </div>
        <h3 style={{ color: "var(--font-color)" }} >ایمیل شما تایید شد!</h3>
        <a style={{ color: "var(--primary-color)", marginBottom:"auto" }} href="/login">برای رفتن به صفحه ورود کلیک کنید. </a>
    </div>
    // </div>
}

export default ConfirmedEmail;