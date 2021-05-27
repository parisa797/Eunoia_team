import { useState } from 'react';
import './ShopSideBar.css';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

function ShopSideBar(props) {
    // let shopID = window.location.pathname.match(/[^\/]+/g)[1]
    let category = [{ name: "خوراکی", sublist: ["غذا، کنسرو و سبزیجات", "تنقلات", "پروتئینی", "خشکبار", "شیرینی‌جات و دسرها", "لبنیات", "نوشیدنی‌ها"] }, { name: "بهداشتی", sublist: ["آرایش و پیرایش", "بهداشت و مراقبت پوست", "وسایل شستشو و نظافت", "عطر، ادکلن و اسپری"] }, { name: "متفرقه", sublist: ["محصولات دیگر"] }]
    const categories = {
        'ادویه، چاشنی و مخلفات غذا':'Spices and condiments and food side dishes',
        'بهداشت و مراقبت پوست':'Cosmetics',
        'آرایش و پیرایش':'Makeup and trimming',
        'پروتئینی':'Protein',
        "تنقلات" :'Junk Food',
        'خشکبار':'Nuts',
        'شیرینی‌جات و دسرها':'Sweets and desserts',
        'عطر، ادکلن و اسپری':'perfume',
        'غذا، کنسرو و سبزیجات':'Fruits and vegetables',
        'لبنیات':'Dairy',
        'نوشیدنی‌ها':'Drinks',
        'وسایل شستشو و نظافت':'Washing and Cleaning Equipment',
        'محصولات دیگر':'others'
    }
    const toggleSection = (divID) => {
        let element = document.getElementById(divID);
        element.hidden = !element.hidden;
    }

    function toggleSidebar(){
        let sideElement = document.getElementById("shop-sidebar");
        sideElement.classList.toggle("active"); 
    }
    return (
        <>
        <div className="shop-sidebar-btn btn" onClick={()=>toggleSidebar()}><MenuIcon /></div>
        <div className="shop-sidebar" id="shop-sidebar">
        <div className="in-sidebar-btn btn" onClick={()=>toggleSidebar()}><ArrowForwardIcon /></div>
            <div className="section">
                <div className="section-contents">
                    <div className="section-header">
                        دسته بندی
            </div>
                    {category.map((section, sectionNum) => {
                        return (<div className="sub-section" key={section + sectionNum}>
                            <div className="btn" onClick={() => toggleSection("sub-sub-section" + sectionNum)}>{section.name}</div>
                            <div className="sub-sub-section" id={"sub-sub-section" + sectionNum}>
                                {section.sublist.map((subSection, subNum) =>
                                    <a href={(props.shopID?"/store/"+props.shopID+"/items/list/category?=":"/items/category?=")+categories[subSection]} key={subSection + subNum}>{subSection}</a>
                                )}
                            </div>
                        </div>)
                    })}
                <div className="sub-sub-section" id={"sub-sub-section" + "all"} style={{marginRight:"0"}}>
                                    <a href={(props.shopID?"/store/"+props.shopID:"")+"/items"} key={"allitems"}>همه محصولات</a>
                            </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default ShopSideBar;