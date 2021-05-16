import './HomePage.css';
import { useEffect, useState } from 'react';
import ItemsList from './ItemsList';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

function HomeItemList(props) {
    const [discounted, setDiscounted] = useState([]);
    const [newest, setNewest] = useState([]);
    const [thisCategoryItems, setThisCategoryItems] = useState([]);
    // const [category, setCategory] = useState(8);
    const categories = [
        { name: 'ادویه، چاشنی و مخلفات غذا', eng_name: 'Spices and condiments and food side dishes' },
        { name: 'بهداشت و مراقبت پوست', eng_name: 'Cosmetics' },
        { name: 'آرایش و پیرایش', eng_name: 'Makeup and trimming' },
        { name: 'پروتئینی', eng_name: 'Protein' },
        { name: "تنقلات", eng_name: 'Junk Food' },
        { name: 'خشکبار', eng_name: 'Nuts' },
        { name: 'شیرینیجات و دسرها', eng_name: 'Sweets and desserts' },
        { name: 'عطر، ادکلن و اسپری', eng_name: 'perfume' },
        { name: 'غذا، کنسرو و سبزیجات', eng_name: 'Fruits and vegetables' },
        { eng_name: 'Dairy', name: 'لبنیات' },
        { eng_name: 'Drinks', name: 'نوشیدنیها' },
        { eng_name: 'Washing and Cleaning Equipment', name: 'وسایل شستشو و نظافت' },
        { eng_name: 'others', name: 'متفرقه' }
    ]

    function swapCategories() {
        var ret = {};
        for (var key in categories) {
            ret[categories[key]] = key;
        }
        return ret;
    }
    useEffect(() => {
        fetch("http://eunoia-bshop.ir:8000/items/new/", {
            method: 'GET'
        })
            .then((res) => {
                if (res.status === 200) {
                    return res.json()
                }
                return [];
            }
            )
            .then((d) => {
                setNewest(d.slice(0, 10));
            });
        fetch("http://eunoia-bshop.ir:8000/items/discount/", {
            method: 'GET'
        })
            .then((res) => {
                if (res.status === 200) {
                    return res.json()
                }
                return [];
            }
            )
            .then((d) => {
                if (d)
                    setDiscounted(d.slice(0, 10));
            });

        fetch("http://eunoia-bshop.ir:8000/items/category/?q=Fruits and vegetables", {
            method: 'GET'
        })
            .then((res) => {
                if (res.status === 200) {
                    return res.json()
                }
                return [];
            }
            )
            .then((d) => {
                if (d)
                    setThisCategoryItems(d.slice(0, 10));
            });
    }, [])

    // useEffect(() => {
    //     fetch("http://eunoia-bshop.ir:8000/api/v1/shops/region/?q=" + category, {
    //         method: 'GET',
    //         headers: {
    //             "Authorization": "Token " + localStorage.getItem('token')
    //         }
    //     })
    //         .then((res) => {
    //             if (res.status === 200) {
    //                 return res.json()
    //             }
    //             return [];
    //         }
    //         )
    //         .then((d) => {
    //             console.log(d)
    //             if (d)
    //                 setThisCategoryItems(d.slice(0, 10));
    //         });
    // }, [category])

    // function changeRegion(e) {
    //     let val = e.target.value;
    //     // if(val.match(/^\d+$/) !== null && val>0 && val<23){
    //     setCategory(val)
    //     // }
    // }

    return (<div className="all-shops-list-container">
        {!!newest && newest.length > 0 && <>
            <h3>جدیدترین کالاها</h3>
            <div data-testid="myshops" style={{ width: "100%", direction: "rtl"/*, position: "absolute", top: "200px", left: "0px"*/, zIndex: "1", margin: "0 0 5vh 0" }}  >
                <ItemsList url={"/items/newest"} id="newest" items={newest} listType="horizontal" itemHolderClass="col-12 col-sm-4 col-md-3 col-lg-2" />
            </div>
        </>
        }
        {!!discounted && discounted.length > 0 && <>
        <h3>!با تخفیف بخرید</h3>
        <div data-testid="shops" style={{ width: "100%", direction: "rtl"/*, position: "absolute", top: "200px", left: "0px"*/, zIndex: "1", margin: "0" }}  >
            <ItemsList url={"/items/discounted"} id="discounted" items={discounted} listType="horizontal" itemHolderClass="col-12 col-sm-4 col-md-3 col-lg-2" />
        </div>
        </>
        }
        {!!thisCategoryItems && thisCategoryItems.length > 0 && <>
        <h3>
            {/* <input value={categories[category].name} onFocus={(e) => document.getElementById("category-dropdown").classList.toggle("show")} style={{ position: "relative", color: "var(--primary-color)" }} />
        <div className="dropdown-menu" id="category-dropdown" style={{ position: "absolute" }}>
            {categories.map((c,i)=>
            <button className="dropdown-item" onClick={(e) => { e.preventDefault(); setCategory(i) }}>{c.name}</button>
            )}
        </div> */}
        <a className="header-list-link" href="/items/"><ChevronLeftIcon />دسته های دیگر</a>
        غذا، کنسرو و سبزیجات </h3>
        
        <div data-testid="region-shops" style={{ width: "100%", direction: "rtl"/*, position: "absolute", top: "200px", left: "0px"*/, zIndex: "1", margin: "0" }}  >
            <ItemsList url={"/items/category?=Fruits and vegetables"} id="fruits" items={thisCategoryItems} listType="horizontal" itemHolderClass="col-12 col-sm-4 col-md-3 col-lg-2" />
        </div>
        </>
        }
    </div>)
}

export default HomeItemList;