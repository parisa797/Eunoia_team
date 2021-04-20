import './ShopSideBar.css';
import ShopSideBar from './ShopSideBar';

function Shop(props){
    let shopID = window.location.pathname.match(/[^\/]+/g)[1]
    let category = [{name:"بهداشتی",sublist:["دستمال","الکل"]},{name:"بهداشتی",sublist:["دستمال","الکل"]},{name:"بهداشتی",sublist:["دستمال","الکل"]}]
    const toggleSection = (divID) =>{
        let element = document.getElementById(divID);
        element.hidden=!element.hidden;
    }
    return(
    <div className="shop-sidebar">
        <div className="section">
            <div className="section-contents">
            <div className="section-header">
                دسته بندی
            </div>
            {category.map((section,sectionNum)=>{
                return(<div className="sub-section" key={section+sectionNum}>
                <a className="btn" onClick={()=>toggleSection("sub-sub-section"+sectionNum)}>{section.name}</a>
                <div className="sub-sub-section" id={"sub-sub-section"+sectionNum}>
                {section.sublist.map((subSection,subNum)=>
                     <a key={subSection+subNum}>{subSection}</a>
                )}
            </div>
            </div>)
            })}
                
            </div>
        </div>
    </div>
    )
}

export default Shop;