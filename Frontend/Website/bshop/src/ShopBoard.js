import { useEffect, useState } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import Carousel from 'react-bootstrap/Carousel';
import { Modal } from "react-bootstrap";
import { useSnackbar } from 'notistack';

function ShopBoard(props) {
    const [board, setBoard] = useState([])
    const [showEdit, setShowEdit] = useState(false);
    const [reloadBoard, setReloadBoard] = useState(false);
    // const [loadCarousel, setLoadCarousel ] = useState(true);
    const { enqueueSnackbar } = useSnackbar();

    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    useEffect(() => {
        clearAddressInputs()
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
            clearDeletedBoards()
        }).catch(err => console.log(err))
    }, [reloadBoard])

    function clearAddressInputs(){
        for(let i=0; i < board.length; i++){
            document.getElementById("board-photo-" + i).value="";
        }
    }

    function clearDeletedBoards(){
        let allBoards = document.getElementsByClassName("board-item-holder");
        let allBoards2 = document.getElementsByClassName("img-container");
        let carousel = document.getElementsByClassName("carousel-inner");
        console.log(carousel)
        for (let i = 0; i < allBoards.length; i++) {
            var b = allBoards[i];
            if (b.classList.contains('deleted')) {
              b.classList.remove('deleted');
            }
          }
        for (let i = 0; i < allBoards2.length; i++) {
            var b = allBoards2[i];
            if (b.classList.contains('deleted')) {
              b.classList.remove('deleted');
            }
          }
        carousel.className = "";
        carousel.className = "carousel-inner";
    }

    function addToBoard(e) {
        let files = e.target.files;
        if (files.length === 0)
            return;
        for (let i = 0; i < e.target.files.length; i++) {
            let fd = new FormData();
            fd.append("image", files[i]);
            fd.append("image_url", "");
            fd.append("shop", parseInt(props.shopID));
            fetch("http://eunoia-bshop.ir:8000/api/v1/shops/board/create/", {
                method: 'POST',
                headers: {
                    "Authorization": "Token " + localStorage.getItem('token')
                },
                body: fd
            }).then(res => {
                console.log(res.status)
                console.log(res)
                if (res.ok && i === files.length - 1) {
                    // const tempboard = [...board]; // Spread syntax creates a shallow copy
                    // tempboard.push(res); // Spread again to push each selected file individually
                    // setBoard(tempboard)
                    enqueueSnackbar("!اعلان اضافه شد")
                    setReloadBoard(!reloadBoard)
                }
            }).catch(err => console.log(err))
        }
    }

    function changeURL(id, elementID) {
        let url = document.getElementById(elementID).value;
        console.log(url)
        let fd = new FormData();
        fd.append("image_url", url);
        fetch("http://eunoia-bshop.ir:8000/api/v1/shops/board/update/" + id, {
            method: 'PUT',
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            },
            body: fd
        }).then(res => {
            if (res.ok)
        {
            enqueueSnackbar(".آدرس با موفقیت ثبت شد")
                setReloadBoard(!reloadBoard)
        }
        }).catch(err => console.log(err))
    }

    function deleteBoard(id, i) {
        // console.log()
        console.log(id)
        fetch("http://eunoia-bshop.ir:8000/api/v1/shops/board/delete/" + id, {
            method: 'DELETE',
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }
        }).then(res => {
            console.log(res)
            if (res.ok) {
                // if(i === board.length - 1)
                    // slideToPage(board.length-2);
                document.getElementById("item-"+id).className += " deleted";
                document.getElementById("item-edit-"+id).className += " deleted";
                // document.querySelectorAll('.carousel').carousel({   
                //     pause: true,
                //     interval: false
                // }).carousel(0);
                enqueueSnackbar("!اعلان حذف شد")
            }
        }).catch(err => console.log(err))
    }

    // function slideToPage(num) {
    //     var dropdowns = document.getElementsByClassName("carousel-item");
    //     console.log(dropdowns)
    //     var i;
    //     for (i = 0; i < dropdowns.length; i++) {
    //         var openDropdown = dropdowns[i];
    //         console.log(openDropdown.id)
    //         if (openDropdown.id === "item-" + num) {
    //             if (!openDropdown.classList.contains('active'))
    //                 // openDropdown.classList.push('active');
    //                 openDropdown.className += " active"
    //         }
    //         else if (openDropdown.classList.contains('active')) {
    //             openDropdown.classList.remove('active');
    //         }
    //     }
    //     // var selectedPages = dropdowns.filter(d=>d.id === num).forEach(element => {
    //     //     element.classList.push('active');
    //     // });
    //     console.log(dropdowns)
    // }

    function changeImage(e, id) {
        let files = e.target.files;
        if (files.length === 0)
            return;
        let fd = new FormData();
        fd.append("image", files[0]);
        fetch("http://eunoia-bshop.ir:8000/api/v1/shops/board/update/" + id, {
            method: 'PUT',
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            },
            body: fd
        }).then(res => {
            if (res.ok)
                {
                    enqueueSnackbar("!تصویر اعلان با موفقیت تغییر یافت")
                    setReloadBoard(!reloadBoard)
                }
        }).catch(err => console.log(err))
    }

    return (
        <div>
            {board && Array.isArray(board) && board.length > 0 && <Carousel interval={null} className="carousel">
                {board.map((item, i) => {
                    if (item)
                        return (<Carousel.Item key={i} className="board-item" onClick={() => {if(item?.image_url) window.location.href = item.image_url}} style={{cursor:item?.image_url?"pointer":"default"}}>
                            <div className="img-container"  id={"item-" + item.id}>
                                <img src={item.image} alt="board item" />
                            </div>
                        </Carousel.Item>)
                })}
            </Carousel>}
            {props.userState === "m" && <div className="edit-board" onClick={() => {setReloadBoard(true); setShowEdit(true)}}>{!!board && board.length === 0 ? "تابلو اعلانات فروشگاه خالیست. ساخت اعلان" : "ویرایش تابلو اعلانات"}</div>}
            <Modal centered size="lg" show={showEdit} onHide={() => setShowEdit(false)} style={{ display: "flex" }} className="board-outer-modal">
                <Modal.Header closeButton className="board-modal">
                    <Modal.Title><div>تنظیم تابلو اعلانات فروشگاه</div><label className="create-btn btn" htmlFor="new-board-photo"><AddIcon />اعلان جدید</label></Modal.Title>
                    <input multiple type="file" id="new-board-photo" accept="image/*" onChange={addToBoard} style={{ display: "none" }} />
                </Modal.Header>
                <Modal.Body className="board-modal">
                    <div style={{ direction: "rtl" }}>
                        <Carousel interval={null} className="carousel" id="carousel">
                            {/* <div data-target="#carousel" data-slide-to="next" style={{display:"none"}} id="carousel-page-changer" ></div> */}
                            {!board || board.length == 0 ?
                                <h4>اعلانی وجود ندارد. با کلیک بر روی گزینه «اعلان جدید» اعلان بسازید.</h4>
                                :
                                board.map((item, i) => {
                                    if (item)
                                        return (<Carousel.Item key={i} className="board-item">
                                            <div className="board-item-holder" id={"item-edit-" + item.id}>
                                                <div className="img-container">
                                                    <img src={item.image} alt="board item" />
                                                </div>
                                                <input type="file" id={"board-photo-" + i} accept="image/*" onChange={e => changeImage(e, item.id)} style={{ display: "none" }} />
                                                <form className="url-input input-group input-group-lg">
                                                    <input type="text" className="input-lg" id={"board-url-" + i} defaultValue={item.image_url} placeholder="آدرس مربوط به این اعلان را بنویسید" />
                                                    <div className="board-btns" style={{ width: "fit-content", margin: "0 auto", direction: "rtl" }}>
                                                        <div className="btn" onClick={() => changeURL(item.id, "board-url-" + i)}>{item?.image_url ? "تغییر آدرس" : "اضافه کردن آدرس"}</div>
                                                        <label className="btn board-edit-img" htmlFor={"board-photo-" + i}>تغییر عکس</label>
                                                        <div className="btn board-delete" onClick={() => deleteBoard(item.id, i)}>حذف اعلان</div>
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