import './HomePage.css';
import { useEffect, useState } from 'react';
import { Form, FormControl } from 'react-bootstrap';

function HomePage(props) {
    const [type, setType] = useState(null);
    useEffect(() => {
        let t = localStorage.getItem('user type'); //change later if not this
        setType(t);
        console.log(t)
        if (t === 'm')
            window.location.replace('/myshops');
    })
    return (
        <div className="homepage">
            {!type ?
                (
                    <div className="not-logged-header">
                        <div className="header-content">
                            <div style={{ alignSelf: "center" }}>
                                <h2>!خرید، راحتتر از همیشه</h2>
                                <p>با  بیشاپ، میتوانید از فروشگاه دلخواهتون چه آنلاین و چه حضوری راحتتر خرید کنید
                        </p>
                                <div className="btn">ورود / ثبت نام</div>
                            </div>
                        </div>
                    </div>
                )
                :
                (
                    <div className="logged-header">
                        <div className="header-content">
                            <div style={{ alignSelf: "center" }}>
                                <h2>!خوش آمدید</h2>
                                <p>
                                </p>
                                <Form>
                                    <FormControl type="text" placeholder="فروشگاهی را در نظر دارید؟" className="search" />
                                    <div className="btn" type="submit" ></div>
                                </Form>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    )
}

export default HomePage;