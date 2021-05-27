import SendIcon from '@material-ui/icons/Send';
import { useEffect, useState } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import { Modal } from "react-bootstrap";

function ShopComments(props) {
    const [comments, setComments] = useState([])
    const [writtenComment, setWrittenComment] = useState("")
    const [updateComments, setUpdateComments] = useState(false);
    const [edittingID, setEdittingID] = useState("");
    const [deletingComment, setDeletingComment] = useState(null);
    const [selfComments, setSelfComments] = useState([]);
    const months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"]
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // setLoading(true)
        fetch("http://eunoia-bshop.ir:8000/api/v1/shops/comment/list/" + props.shopID, {
            method: "GET",
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }

        }).then(res => {
            if (res.status === 200)
                {
                    console.log(res)
                    return res.json();
                }
            setLoading(false)
            return null;
        }).then(res => {
            console.log(res)
            if (res) {
                for (let i in res) {
                    if (!res[i].date_jalali)
                        continue;
                    let str = res[i].date_jalali.split(' ').join('.').split('.').join('-').split('-');
                    console.log(str)
                    str[1] = months[parseInt(str[1]) - 1]
                    str[3] = " ساعت " + str[3]
                    str[2] = str[2][0] === '0' ? str[2][1] : str[2]
                    let new_str = [str[2], str[1], str[0], str[3]]
                    res[i].date_jalali = new_str.join(" ");
                }
                setComments(res);
                let username = localStorage.getItem("username")
                setSelfComments(res.filter(c => c.user.user_name === username).map(c => c.id))
                setLoading(false)
            }
        }).catch(e =>{ console.log(e); setLoading(false)})
    }, [updateComments])

    function startEditting(id, text) {
        setEdittingID(id);
        setWrittenComment(text);
    }

    function stopEditting() {
        setEdittingID("");
        setWrittenComment("")
    }

    function SendComment() {
        if (writtenComment === "")
            return;
        if (edittingID) {
            let fd = new FormData()
            fd.append("text", writtenComment);
            //fd.append("shop", props.shopID)
            fetch("http://eunoia-bshop.ir:8000/api/v1/shops/comment/"+edittingID, {
                method: "PUT",
                headers: {
                    "Authorization": "Token " + localStorage.getItem('token')
                },
                body: fd
            }).then(res => {
                if (res.status === 200) {
                    setUpdateComments(!updateComments);
                    setWrittenComment("")
                    setEdittingID("");
                }
            }).catch(e => console.log(e))
        }
        else {
            let fd = new FormData()
            fd.append("text", writtenComment);
            fd.append("shop", props.shopID)
            fetch("http://eunoia-bshop.ir:8000/api/v1/shops/comment/create/", {
                method: "POST",
                headers: {
                    "Authorization": "Token " + localStorage.getItem('token')
                },
                body: fd
            }).then(res => {
                if (res.status === 201) {
                    setUpdateComments(!updateComments);
                    setWrittenComment("")
                }
            }).catch(e => console.log(e))
        }

    }

    const deleteComment=()=>{
        fetch("http://eunoia-bshop.ir:8000/api/v1/shops/comment/"+deletingComment.id,{
            method: 'DELETE',
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }
        }).then(
            res => {
                if (res.status === 204) {
                    setUpdateComments(!updateComments);
                    setDeletingComment(null)
                }
                return null;
            }
        )
            .catch(e => console.log(e));
    }

    return (
    <div className="shop-comments">
        {loading?<p>در حال به روز رسانی نظرات...</p>:
         <><div className="comments-container">
            {comments.length === 0 ? <p data-testid="comment-nocomment">نظری ثبت نشده است.</p> : comments.map(comment => {
                if (comment) return (
                    <div className="shop-comment" key={comment.id} data-testid={"comment"+comment.id}>
                        {/* <h3 className="shop-comment-title">{comment.title}</h3> */}
                        <div style={{ display: "inline-flex", borderBottom: "1px solid var(--bg-color3)" }}>
                            <p className="shop-comment-author" data-testid={"comment-username"+comment.id} >{comment.user.user_name}</p>
                            <p className="shop-comment-date" data-testid={"comment-datetime"+comment.id}>{comment.date_jalali}</p>
                            {selfComments.includes(comment.id) && <div className="comment-edit-delete" data-testid={"comment-edit-delete-options"+comment.id}>
                                <p className="comment-edit" data-testid={"comment-edit-options"+comment.id} onClick={() => startEditting(comment.id, comment.text)} > ویرایش</p>
                                <p className="comment-delete" data-testid={"comment-delete-options"+comment.id} onClick={()=>setDeletingComment(comment)}>حذف نظر</p>
                            </div>}
                        </div>
                        <p className="shop-comment-desc" data-testid={"comment-text"+comment.id}>{comment.text}</p>
                    </div>
                )
            })}
        </div>
        {(props.userState === "l") && <div className="write-comment-container" data-testid="write-comment">
            {edittingID && <div className="comment-editting-indicator" >
                <p><div className="btn" onClick={stopEditting} data-testid="stop-editing-btn" style={{padding:0}}> <CloseIcon /></div>در حال ویرایش نظر...</p>
            </div>}
            <div className="write-comment">
                <div onClick={SendComment} data-testid="send-comment-button"><SendIcon /></div>
                <textarea type="text" placeholder="نظر خود را بنویسید..." value={writtenComment} style={{ border: "none", height: "calc(20vh - 20px)" }} onChange={e => setWrittenComment(e.target.value)} data-testid="write-comment-input" ></textarea>
            </div>
        </div>}</>}
        {deletingComment && <Modal show={deletingComment} onHide={() => setDeletingComment(null)} style={{ display: "flex" }} className="profile-outer-modal comment-modal">
    <Modal.Header closeButton className="profile-modal">
        <Modal.Title>حذف نظر</Modal.Title>
    </Modal.Header>
    <Modal.Body className="profile-modal">
        <div style={{ direction: "rtl" }}>
            <p>آیا از حذف این نظر اطمینان دارید؟</p>
            <p className="delete-comment-text">"{deletingComment.text}"</p>
            <div className="justify-content-center" style={{ width: "100%", display: "flex" }}>
                <div className="btn delete-button" onClick={() => deleteComment()}>تایید و حذف نظر</div>
            </div>
        </div>
    </Modal.Body>

</Modal>}

    </div>)
}

export default ShopComments;