import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import ShoppingLists from "./ShoppingLists";

function ProfileDispatcher(props) {
    return <Router>
        <Switch>
            <Route
                path="/profile/order-history"
                render={(p) => (
                    <ShoppingLists
                        type={"history"}
                        {...p}
                    />
                )}
            />
            <Route
                path="/"
                render={(p) => (
                    <ShoppingLists
                        type={"current"}
                        {...p}
                    />
                )}
            />
        </Switch>
    </Router>
}

export default ProfileDispatcher;