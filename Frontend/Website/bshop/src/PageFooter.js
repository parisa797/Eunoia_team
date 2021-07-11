import './PageFooter.css'

function PageFooter(props) {
    return (<div className="page-footer">
        <div className="row" >
            <div className="col-12 col-sm-6 col-md-4" >
                <h4>بیشتر بدانید</h4>
                <a>درباره ما</a>
                <a  /*href="/sth.apk" download*/>دانلود اپلیکیشن اندروید</a>
                <a>قوانین سایت</a>
            </div>
            <div className="col-12 col-sm-6 col-md-4" >
                <h4>ارتباط با ما</h4>
                <a>تماس با ما</a>
                <a>حریم خصوصی</a>
            </div>
            <div className="col-12 col-sm-6 col-md-4" >
                <h4>به ما بپیوندید!</h4>
                <a href="/registerstore">ثبت فروشگاه</a>
                <a>قوانین ثبت فروشگاه</a>
            </div>
        </div>
        <p>BShop 2021</p>
    </div>)
}

export default PageFooter;