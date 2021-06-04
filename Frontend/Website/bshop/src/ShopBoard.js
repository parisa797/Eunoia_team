import { useEffect, useState } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import Carousel from 'react-bootstrap/Carousel';
import { Modal } from "react-bootstrap";

function ShopBoard(props) {
    const [board, setBoard] = useState([{ image: "/special-offer.jpg", image_url: "/something" }, { image: "/پیشنهاد-ویزه-وجین-Copy.jpg" }])
    const [showEdit, setShowEdit] = useState(false);
    const [reloadBoard, setReloadBoard] = useState(false);

    useEffect(() => {
        fetch("http://eunoia-bshop.ir:8000/api/v1/shops/board/list/" + props.shopID, {
            method: 'GET',
            // headers: {
            //     "Authorization": "Token " + localStorage.getItem('token')
            // }
        }).then(res => {
            console.log(res.status)

            if (res.ok)
                return res.json()
        }).then(res => {
            console.log(res)
            setBoard(res)
        }).catch(err => console.log(err))
    }, [reloadBoard])

    function addToBoard(e) {
        let files = e.target.files;
        if (files.length === 0)
            return;
        for (let i = 0; i < e.target.files.length; i++) {
            let fd = new FormData();
            fd.append("shop", parseInt(props.shopID));

            fd.append("image", files[i]);
            fd.append("image_url", "");
            fetch("http://eunoia-bshop.ir:8000/api/v1/shops/board/create/", {
                method: 'POST',
                headers: {
                    "Authorization": "Token " + localStorage.getItem('token')
                }
            }).then(res => {
                console.log(res.status)
                console.log(res)
                if (!res.ok)
                    i--;
            }).catch(err => console.log(err))
        }
        setReloadBoard(!reloadBoard)
    }

    function changeURL(id,elementID) {
        let url = document.getElementById(elementID).value;
        console.log(url)

        let fd = new FormData();
        fd.append("image_url", url);
        fetch("http://eunoia-bshop.ir:8000/api/v1/shops/board/update/"+id, {
            method: 'PUT',
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.ok)
                setReloadBoard(!reloadBoard)
        }).catch(err => console.log(err))
    }

    function deleteBoard(id) {
        fetch("http://eunoia-bshop.ir:8000/api/v1/shops/board/delete/"+id, {
            method: 'DELETE',
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.ok)
                setReloadBoard(!reloadBoard)
        }).catch(err => console.log(err))
    }

    function changeImage(e, id) {
        let files = e.target.files;
        if (files.length === 0)
            return;
        let fd = new FormData();
        fd.append("image", files[0]);
        fetch("http://eunoia-bshop.ir:8000/api/v1/shops/board/update/"+id, {
            method: 'PUT',
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }
        }).then(res => {
            if (res.ok)
                setReloadBoard(!reloadBoard)
        }).catch(err => console.log(err))
    }

    return (
        <div>
            <Carousel interval={null} className="carousel">
                {board.map((item, i) => {
                    if (item)
                        return (<Carousel.Item key={i} className="board-item" onClick={() => window.location.href = item.image_url}>
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
            {props.userState === "m" && <div className="edit-board" onClick={() => setShowEdit(true)}>{!!board && board.length === 0 ? "فروشگاه اعلانی ندارد. ساخت بورد" : "ویرایش بورد"}</div>}
            <Modal centered size="lg" show={showEdit} onHide={() => setShowEdit(false)} style={{ display: "flex" }} className="board-outer-modal">
                <Modal.Header closeButton className="board-modal">
                    <Modal.Title><div>تنظیم اعلانات فروشگاه</div><label className="create-btn btn" htmlFor="new-board-photo"><AddIcon />اعلان جدید</label></Modal.Title>
                    <input multiple type="file" id="new-board-photo" accept="image/*" onChange={addToBoard} style={{ display: "none" }} />
                </Modal.Header>
                <Modal.Body className="board-modal">
                    <div style={{ direction: "rtl" }}>
                        <Carousel interval={null} className="carousel">
                            {!board || board.length == 0 ?
                                <h4>اعلانی وجود ندارد:(</h4>
                                :
                                board.map((item, i) => {
                                    if (item)
                                        return (<Carousel.Item key={i} className="board-item">
                                            <div className="board-item-holder">
                                                <div className="img-container">
                                                    <img src={item.image} alt="board item" />
                                                </div>
                                                <input type="file" id={"board-photo-" + i} accept="image/*" onChange={e => changeImage(e, item.id)} style={{ display: "none" }} />
                                                <form className="url-input input-group input-group-lg">
                                                    <input type="text" className="input-lg" id={"board-url-" + i} defaultValue={item.image_url} placeholder="آدرس مربوط به این اعلان را بنویسید" />
                                                    <div classname="board-btns" style={{ width: "fit-content", margin: "0 auto", direction:"rtl" }}>
                                                        <div className="btn" onClick={()=>changeURL(item.id,"board-url-" + i)}>{item?.image_url ? "تغییر آدرس" : "اضافه کردن آدرس"}</div>
                                                        <label className="btn board-edit-img" htmlFor={"board-photo-" + i}>تغییر عکس</label>
                                                        <btn className="btn board-delete" onClick={()=>deleteBoard(item.id)}>حذف اعلان</btn>
                                                    </div>
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