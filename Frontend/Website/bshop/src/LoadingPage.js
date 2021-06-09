import { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import animationData from './medias/53735-cart-icon-loader.json';
import HomePage from './HomePage';
import SearchResults from "./SearchResults";
import ItemsListPage from "./ItemsListPage";
import ShopDispatcher from './ShopDispatcher';
import RegisterStore from "./registerStore";
import ProfilePage from "./ProfilePage";
import Login from "./login";
import Register from "./register";
import ShopsListPage from "./ShopsListPage";
import MapPage from './MapPage';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import ProfileDispatcher from './ProfileDispatcher';

function LoadingPage(props) {
    const [loaded, setLoaded] = useState(false)
    const [text, setText] = useState("در حال ورود...")
    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }
    useEffect(() => {
        if ((!localStorage.getItem("token"))) {
            if (!localStorage.getItem("shops") || !JSON.parse(localStorage.getItem("shops"))) {
                localStorage.setItem("shops", JSON.stringify([]))
                timeout(100);
            }
            if (!localStorage.getItem("shoplists") || !JSON.parse(localStorage.getItem("shoplists"))) {
                localStorage.setItem("shoplists", JSON.stringify({}))
                timeout(100);
            }
            setLoaded(true);
            return;
        }
        if (!!localStorage.getItem("username") && !!localStorage.getItem("role")
            && !!localStorage.getItem("shops") && !!JSON.parse(localStorage.getItem("shops"))
            && !!localStorage.getItem("shoplists") && !!JSON.parse(localStorage.getItem("shoplists"))) {
            setLoaded(true)
            return;
        }
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        localStorage.removeItem("shops");
        localStorage.removeItem("shoplists");
        fetch("http://eunoia-bshop.ir:8000/users/profile", {
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
                fetch("http://eunoia-bshop.ir:8000/api/v1/shoppings/", {
                    method: 'GET',
                    headers: {
                        "Authorization": "Token " + localStorage.getItem('token')
                    }
                })
                    .then((res) => {
                        if (res.status === 200) {
                            return res.json()
                        }
                        return [];
                    }
                    )
                    .then((d) => {
                        let usersLists = {}
                        if (!!d)
                            d.forEach((e) => usersLists["" + e.shop] = e.id)
                        localStorage.setItem("shoplists", JSON.stringify(usersLists))
                        if (res.role === "seller") {
                            fetch("http://eunoia-bshop.ir:8000/api/v1/shops/user/", {
                                method: 'GET',
                                headers: {
                                    "Authorization": "Token " + localStorage.getItem('token')
                                }
                            })
                                .then((res) => {
                                    if (res.status === 200) {
                                        return res.json()
                                    }
                                    return [];
                                }
                                )
                                .then((d) => {
                                    let usersShops = []
                                    for (let shop in d) {
                                        usersShops.push(d[shop].id)
                                    }
                                    localStorage.setItem("shops", JSON.stringify(usersShops))
                                    timeout(100);
                                    setLoaded(true)
                                }).catch(e => { console.log(e); });
                        }
                        else {
                            localStorage.setItem("shops", JSON.stringify([]))
                            timeout(100);
                            setLoaded(true)
                        }
                    }).catch(e => { console.log(e); });

            }
        )
            .catch(e => { console.log(e); setText("ارتباط با سرور ممکن نیست، دوباره امتحان کنید.") });
    },[])

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
        <Router>
            <Switch>
                <Route exact path="/" component={HomePage} />
                <Route
                    path="/profile/info"
                    render={(p) => (
                        <ProfilePage
                            triggerNavbarUpdate={props.triggerNavbarUpdate}
                            setTriggerNavUpdate={props.setTriggerNavUpdate}
                            {...p}
                        />
                    )}
                />
                <Route path="/profile" component={ProfileDispatcher} />
                {/* <Route exact path='/loginstore' component={LoginStore} /> */}
                <Route exact path="/registerstore" component={RegisterStore} />
                <Route path="/store/search" component={SearchResults} />
                <Route path="/items/search" component={SearchResults} />
                <Route path="/stores/" component={ShopsListPage} />
                <Route path="/items/" component={ItemsListPage} />
                <Route path="/store/:storeid/items/search" component={SearchResults} />
                <Route path="/store/:id" component={ShopDispatcher} />
                <Route path="/maps" component={MapPage} />
                {/* <Route exact path='/Items' component={Items} /> */}
            </Switch>
        </Router>
    )
}

export default LoadingPage;