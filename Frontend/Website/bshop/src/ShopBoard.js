import { useEffect, useState } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import Carousel from 'react-bootstrap/Carousel';
import { Modal } from "react-bootstrap";

function ShopBoard(props){
    const [board, setBoard] = useState([{ image: "/special-offer.jpg" , image_url:"/something"}, { image: "/پیشنهاد-ویزه-وجین-Copy.jpg" }])
    const [showEdit,setShowEdit] = useState(false);

    function changeURL(id){

    }

    return (
        <div>
            <Carousel interval={null} className="carousel">
        {board.map((item, i) => {
            if (item)
                return (<Carousel.Item key={i} className="board-item" onClick={()=>window.location.href = item.image_url}>
                    <div className="img-container">
                        <img src={item.image} alt="board item" />
                    </div>
                    {/* <Carousel.Caption>
                        <h5>{item.title}</h5>
                        <p>{item.description}</p>
                    </Carousel.Caption> */}
                </Carousel.Item>)
        })}
    </Carousel>
    {props.userState === "m" && <div className="edit-board" onClick={()=>setShowEdit(true)}>{!!board && board.length === 0 ? "بورد شما خالی است. ساخت بورد" : "ویرایش بورد"}</div>}
    <Modal centered size="lg" show={showEdit} onHide={() => setShowEdit(false)} style={{ display: "flex" }} className="board-outer-modal">
    <Modal.Header closeButton className="board-modal">
        <Modal.Title>تنظیم اعلانات فروشگاه</Modal.Title>
    </Modal.Header>
    <Modal.Body className="board-modal">
        <div style={{ direction: "rtl" }}>
        <Carousel interval={null} className="carousel">
        {board.map((item, i) => {
            if (item)
                return (<Carousel.Item key={i} className="board-item">
                    <div className="board-item-holder">
                    <div className="img-container">
                        <img src={item.image} alt="board item" />
                        <div className="btn board-edit-img"><EditIcon /></div>
                    </div>
                    <form className="url-input input-group input-group-lg">
                    <input type="text" className="input-lg" value={item.image_url} />
                    <div className="btn" onClick={changeURL(item.id)}>تغییر آدرس</div>
                    </form>
                    </div>
                </Carousel.Item>)
        })}
    </Carousel>
        </div>
    </Modal.Body>

</Modal>
    </div>
    )
}

export default ShopBoard;