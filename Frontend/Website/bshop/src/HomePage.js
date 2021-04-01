import './HomePage.css';
import { Form, FormControl } from 'react-bootstrap';
import Lottie from 'react-lottie';
import animationData from './22148-shopping-lady.json'
import SearchIcon from '@material-ui/icons/Search';
import ShopList from './ShopList';

function HomePage(props) {

    return (
        <div className="homepage">
            {!localStorage.getItem('username') ?
                (
                    <div className="not-logged-header" data-testid="not-logged-header">
                        <Lottie options={{
                            loop: true,
                            autoplay: true,
                            animationData: animationData,
                        }}
                        />
                        <div className="header-content">
                            <div style={{ alignSelf: "center" }}>
                                <h2>!خرید، راحتتر از همیشه</h2>
                                <p>با  بیشاپ، میتوانید از فروشگاه دلخواهتون چه آنلاین و چه حضوری آسان تر خرید کنید
                        </p>
                                <div className="btn">ورود / ثبت نام</div>
                            </div>
                        </div>
                    </div>
                )
                :
                (
                    <div className="logged-header" data-testid="logged-header">
                        <div className="header-content">
                            <div style={{ alignSelf: "center" }}>
                                <h2>فروشگاه موردنظرتان را پیدا کنید</h2>
                                <p>
                                </p>
                                <Form>
                                    <FormControl type="text" placeholder="فروشگاهی را در نظر دارید؟" className="search" />
                                    <div className="btn search-btn" type="submit" ><SearchIcon className="search-icon" /></div>
                                </Form>
                            </div>
                        </div>
                    </div>
                )}
            <ShopList />

        </div>
    )
}

export default HomePage;