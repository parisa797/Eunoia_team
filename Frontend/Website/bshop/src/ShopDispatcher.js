import Shop from "./Shop";
import EditShop from "./EditShop";
import ItemsList from "./ItemsList";
import Item from './Item';
import EditItem from "./EditItem"
import AddItem from "./AddItem";
import { useEffect, useState } from "react";
import Lottie from 'react-lottie';
import animationData from './medias/53735-cart-icon-loader.json';
import DeleteItem from './DeleteItem'
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Itemslist from "./ItemsList";
import ItemsListPage from "./ItemsListPage";
import ShoppingList from "./ShoppingList";
import ShoppingListCompletion from "./ShoppingListCompletion"
import { ContactSupportOutlined } from "@material-ui/icons";

function ShopDispatcher() {
    const [userState, setUserState] = useState(null) //u for unsigned user, l for logged in, m for manager
    const [triggerReload,setTriggerReload] = useState(false);
    const [deleteItemModal,setDeleteItemModal] = useState({show:false,item:0});
    const showDeleteItemModal = (id,name)=>{
        setDeleteItemModal({show:true,id:id,name:name})
    }
    let shopID = window.location.pathname.match(/[^\/]+/g)[1]
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            setUserState("u")
            return;
        }
        if(!localStorage.getItem("role"))
        {
            setUserState("l");
            return;
        }
        let usersShops = JSON.parse(localStorage.getItem("shops"));
        if(!!usersShops && usersShops.includes(parseInt(shopID))){
            setUserState("m");
        }
        else setUserState("l");
        // fetch("http://eunoia-bshop.ir:8000/api/v1/shops/user/", {
        //     method: 'GET',
        //     headers: {
        //         "Authorization": "Token " + localStorage.getItem('token')
        //     }
        // })
        //     .then((res) => {
        //         if (res.status === 200) {
        //             return res.json()
        //         }
        //         setUserState("l")
        //         return {};
        //     }
        //     )
        //     .then((d) => {
        //         var state = "l";
        //         for (let shop in d) {
        //             if (d[shop].id === parseInt(shopID)) {
        //                 state = "m" //is a manager
        //                 break
        //             }
        //         }
        //         setUserState(state)
        //     }).catch(e => { console.log(e); setUserState("l") });
    }, [])

    useEffect(()=>{
        if(!!userState && userState !=="m")
            {
                let path = window.location.pathname;
                if(path.includes("AddItem")||path.includes("edit"))
                    window.location.href = "/"; //they're not a shop manager to edit or add anything to shop
            }
    },[userState])

    return <>
        {!!userState ?
            <>
            <DeleteItem showDeleteModal={deleteItemModal} setShowDeleteModal={setDeleteItemModal} shopID={shopID} setTriggerReload={setTriggerReload}  triggerReload={triggerReload}/>
            <Router>
                <Switch>
                    <Route exact path="/store/:id/items" render={(props) => (
                        <ItemsListPage
                            triggerReload={triggerReload}
                            setTriggerReload={setTriggerReload}
                            userState={userState}
                            showDeleteItemModal={showDeleteItemModal}
                            {...props}
                        />)}
                    />
                    <Route path="/store/:id/AddItem" render={(props) => (
                        <AddItem
                        userState={userState}
                        {...props}
                    />)}
                    />
                    <Route path="/store/:id/items/list" render={(props) => (
                        <ItemsListPage
                        userState={userState}
                        {...props}
                    />)} />
                    <Route path="/store/:id/items/:itemid/edit" render={(props) => (
                        <EditItem
                        triggerReload={triggerReload}
                        setTriggerReload={setTriggerReload}
                        userState={userState}
                        deleteItemModal={deleteItemModal}
                        setShowDeleteModal={setDeleteItemModal}
                        showDeleteItemModal={showDeleteItemModal}
                        {...props}
                    />)}
                    />
                    <Route path="/store/:id/items/:itemid" render={(props) => (
                        <Item
                        userState={userState}
                        {...props}
                    />)}
                    />
                    <Route exact path="/store/:id/shopping-list/complete-order" render={(props) => (
                        <ShoppingListCompletion
                            // triggerReload={triggerReload}
                            // setTriggerReload={setTriggerReload}
                            userState={userState}
                            // showDeleteItemModal={showDeleteItemModal}
                            {...props}
                        />)}
                    />
                    <Route exact path="/store/:id/shopping-history/:shoppingid" render={(props) => (
                        <ShoppingList
                            completed={true}
                            userState={userState}
                            {...props}
                        />)}
                    />
                    <Route exact path="/store/:id/shopping-list" render={(props) => (
                        <ShoppingList
                            // triggerReload={triggerReload}
                            // setTriggerReload={setTriggerReload}
                            completed={false}
                            userState={userState}
                            // showDeleteItemModal={showDeleteItemModal}
                            {...props}
                        />)}
                    />
                    <Route path="/store/:id/edit-info" render={(props) => (
                        <EditShop
                        userState={userState}
                        setTriggerReload={setTriggerReload}
                        triggerReload={triggerReload}
                        {...props}
                    />)}
                    />
                    <Route path="/store/:id/" render={(props) => (
                        <Shop
                        setTriggerReload={setTriggerReload}
                        triggerReload={triggerReload}
                        showDeleteItemModal={showDeleteItemModal}
                        userState={userState}
                        {...props}
                    />)}
                    />
                </Switch>
            </Router> </>:
            <div style={{ position: "fixed", top: 0, bottom: 0, left: 0, right: 0, zIndex: "3000", background: "var(--bg-color)", alignItems: "center", display: "flex", flexDirection: "column", direction: "rtl", width: "100vw", height: "100vh" }}>
                <Lottie options={{
                    loop: true,
                    autoplay: true,
                    animationData: animationData,
                    rendererSettings: {
                        preserveAspectRatio: 'xMidYMid slice'
                    }
                }}
                    height={400}
                    width={400} />
                <h3 style={{ color: "var(--primary-color)" }} data-testid="loading-text">کمی صبر کنید...</h3>
            </div>}
    </>
}

export default ShopDispatcher;