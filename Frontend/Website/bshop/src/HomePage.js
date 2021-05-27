import './HomePage.css';
import SearchIcon from '@material-ui/icons/Search';
import ShopList from './ShopList';
import Carousel from 'react-bootstrap/Carousel';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import OfflineGroceries from './medias/OnlineGroceries-pana.svg';
import OnlineGroceries from './medias/OnlineGroceries-amico.svg';
import DiscountPic from './medias/Discount-pana.svg';
import { useState } from 'react';
import LocationOnIcon from '@material-ui/icons/LocationOn'
import SearchBar from './SearchBar';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import HomeItemList from './HomeItemList';

function HomePage(props) {
    const [homeBoard, setHomeBoard] = useState([{ image: "/yalda-slider-without-ad.png", url: "/shop/14" }, { image: "/special-offer.jpg", url: "/" }, { image: "/am65tyeqh1y1.jpeg", url: "/register" }])
    // document.title = "فروشگاه اینترنتی بی‌شاپ"

    const SearchDropDownToggle = (id) => {
        var dropdowns = document.getElementsByClassName("dropdown-menu");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
        document.getElementById(id).classList.toggle("show");
    }

    return (
        <div className="homepage">
            {!localStorage.getItem('token') &&
                (
                    <>
                        <div className="not-logged-header" data-testid="not-logged-header">

                            <div className="not-logged-background" />

                            <div className="header-content">
                                <div style={{ alignSelf: "center", justifySelf: "center", padding: "2vw" }}>
                                    <h2>تجربه لذت بخش خرید</h2>
                                    <h3>با بی‌شاپ</h3>
                                    <p>فروشگاه اینترنتی بی‌شاپ خدمات منحصربه‌فردی را برای خرید آنلاین و حضوری از فروشگاه‌های اطراف شما ارائه می‌دهد
                        </p>
                                    <div className="btn" onClick={() => window.location.replace("/login")}>ورود / ثبت نام</div>
                                </div>
                                <div className="read-more-below">بیشتر بدانید<ArrowDownwardIcon /></div>
                            </div>
                        </div>
                        <div className="discount-intro intro">
                            <img src={OfflineGroceries} alt="shopping at store with bishop" className="intro-pic" />
                            <div className="intro-description">
                                <h4>به خرید حضوریتان سرعت بخشید.</h4>
                                <p>با استفاده از بی‌شاپ، شما می‌توانید از کالاهای موجود در فروشگاه موردنظرتان باخبر شوید.</p>
                                <p>هنگام خرید، کد کالاها را اسکن کرده و به لیست خریدتان اضافه کنید. برای پرداخت می‌توانید از کیف پول آنلاین یا پرداخت آنلاین بهره ببرید.</p>
                            </div>
                        </div>
                        <div className="online-shopping-intro intro">
                            <img src={OnlineGroceries} alt="online-shopping" className="intro-pic" />
                            <div className="intro-description">
                                <h4>بی‌شاپ، امکان خرید آنلاین هم دارد!</h4>
                                <p>نگران ویروس کرونا هستید؟ از حالا به بعد با بی‌شاپ ایمن کارهای خود را انجام دهید. شما می‌توانید بدون رفتن به فروشگاه موردنظرتان از آن خرید کنید.</p>
                            </div>
                        </div>
                        <div className="discount-intro intro">
                            <img src={DiscountPic} alt="discount" className="intro-pic" />
                            <div className="intro-description">
                                <h4>با تخفیف بخرید، امتیاز جمع کنید و تخفیف بیشتری بگیرید!</h4>
                                <p>بی‌شاپ تخفیف های متنوعی به شما ارائه می‌دهد.</p>
                                <p>بعلاوه، با خرید از بی‌شاپ مدال‌های طلا، نقره و برنز بگیرید و به پیشنهادهای ویژه دسترسی پیدا کنید.</p>
                            </div>
                        </div>
                    </>
                )}
            <div className="logged-header" data-testid="logged-header">
                <div className="header-content">
                    <div style={{ alignSelf: "center" }}>
                        <Carousel className="carousel">
                            {homeBoard.map((item, i) => {
                                if (item)
                                    return (<Carousel.Item key={i} className="board-item">
                                        <img src={item.image} alt="board item" />
                                        <Carousel.Caption>
                                            <h5>{item.title}</h5>
                                            <p>{item.description}</p>
                                        </Carousel.Caption>
                                    </Carousel.Item>)
                            })}
                        </Carousel>
                        <div className="searchbar" >
                            
                            <div className="search">
                                <SearchBar id="home"/>
                            </div>
                            {/*<form>
                            <form inline="true" className="input-group input-group-lg">
                                    <p>دیدن کالاهای دسته</p>
                               
                                <div className="dropdown">
                                    <button className="btn dropdown-toggle filter-btn" onClick={(e) => { e.preventDefault(); SearchDropDownToggle("search-dropdown-type") }}>
                                        نوع
  </button>
                                    <div className="dropdown-menu" id="search-dropdown-type">
                                        <a className="dropdown-item" href="#">فروشگاه</a>
                                        <a className="dropdown-item" href="#">کالا</a>
                                        <a className="dropdown-item" href="#">همه</a>
                                    </div>
                                </div>
                                <p><ArrowBackIosIcon /></p>
                                </form>
                                <div className="dropdown">
                                    <button className="btn dropdown-toggle filter-btn" onClick={(e) => { e.preventDefault(); SearchDropDownToggle("search-dropdown-region") }}>
                                        منطقه
  </button>
                                    <div className="dropdown-menu" id="search-dropdown-region">
                                        <a className="dropdown-item" href="#">جدیدترین‌ها</a>
                                        <a className="dropdown-item" href="#">ارزان‌ترین‌ها</a>
                                        <a className="dropdown-item" href="#">محبوب‌ترین‌ها</a>
                                    </div>
                                </div>
                                <div className="dropdown">
                                    <button className="btn dropdown-toggle filter-btn" onClick={(e) => { e.preventDefault(); SearchDropDownToggle("search-dropdown-filter") }}>
                                        فیلتر براساس
  </button>
                                    <div className="dropdown-menu" id="search-dropdown-filter">
                                        <a className="dropdown-item" href="#">جدیدترین‌ها</a>
                                        <a className="dropdown-item" href="#">ارزان‌ترین‌ها</a>
                                        <a className="dropdown-item" href="#">محبوب‌ترین‌ها</a>
                                    </div>
                                </div>
                            </form> */}
                            <div style={{ paddingTop: "5vh" }}><a href="/" style={{ fontSize: "larger", color: "var(--font-color2)" }}>...یا از روی نقشه فروشگاه نزدیک خود را پیدا کنید<LocationOnIcon className="icon" /></a></div>
                        </div>

                    </div>
                </div>
            </div>
            <ShopList />
            <HomeItemList />
        </div>
    )
}

export default HomePage;