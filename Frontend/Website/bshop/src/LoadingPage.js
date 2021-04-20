import { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import animationData from './media/53735-cart-icon-loader.json';
import HomePage from './HomePage'

function LoadingPage(props) {
    const [loaded, setLoaded] = useState(false)
    const [text, setText] = useState("در حال ورود...")
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            setLoaded(true)
        }
        localStorage.removeItem("username");
        localStorage.removeItem("role")
        fetch("http://127.0.0.1:8000/users/profile", {
            method: 'GET',
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }
        }).then(
            res => {
                if (res.status === 200) {
                    return res.json()
                }
                setText("ارتباط با سرور ممکن نیست، دوباره امتحان کنید.")
                return null;
            }
        ).then(
            res => {
                if (res === null)
                    return;
                localStorage.setItem("role", res.role);

                localStorage.setItem("username", res.user_name);
                setLoaded(true)
            }
        )
            .catch(e => { console.log(e); setText("ارتباط با سرور ممکن نیست، دوباره امتحان کنید.") });
    })

    return (!loaded ? <div style={{ position: "fixed", top: 0, bottom: 0, left: 0, right: 0, zIndex: "3000", background: "var(--bg-color)", alignItems: "center", display: "flex", flexDirection: "column", direction: "rtl", width: "100vw", height: "100vh" }}>
        <Lottie options={{
            loop: true,
            autoplay: true,
            animationData: animationData,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        }}
            isStopped={text !== "در حال ورود..."}
            height={400}
            width={400} />
        <h3 style={{ color: "var(--primary-color)" }} data-testid="loading-text">{text}</h3>
    </div>
        :
        <HomePage />
    )
}

export default LoadingPage;