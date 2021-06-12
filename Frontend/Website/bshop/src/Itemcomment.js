import SendIcon from '@material-ui/icons/Send';
import { useEffect, useState } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import { Modal } from "react-bootstrap";

import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { IconButton } from "@material-ui/core";

function Itemcomment(props) {
    const [comments, setComments] = useState([])
    const [writtenComment, setWrittenComment] = useState("")
    const [updateComments, setUpdateComments] = useState(false);
    const [edittingID, setEdittingID] = useState("");
    const [deletingComment, setDeletingComment] = useState(null);
    const [selfComments, setSelfComments] = useState([]);
    const shopID = window.location.pathname.match(/[^\/]+/g)[1]
    const itemID = window.location.pathname.match(/[^\/]+/g)[3];
    const months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"]
    const [loading, setLoading] = useState(true);
    console.log(`"http://eunoia-bshop.ir:8000/shops/${shopID}/items/${itemID}/comments/`);
    const handleUpdateComments = () => {
        fetch(`http://eunoia-bshop.ir:8000/shops/${shopID}/items/${itemID}/commentsreplis`, {
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
                    if(!!res[i].Replies && res[i].Replies.length>0){
                        for (let j in res[i].Replies) {
                            if (!res[i].Replies[j].date_jalali)
                                continue;
                            let str = res[i].Replies[j].date_jalali.split(' ').join('.').split('.').join('-').split('-');
                            console.log(str)
                            str[1] = months[parseInt(str[1]) - 1]
                            str[3] = " ساعت " + str[3]
                            str[2] = str[2][0] === '0' ? str[2][1] : str[2]
                            let new_str = [str[2], str[1], str[0], str[3]]
                            res[i].Replies[j].date_jalali = new_str.join(" ");}
                    }
                }
                setComments(res);
                let username = localStorage.getItem("username")
                setSelfComments(res.filter(c => c.user.user_name === username).map(c => c.id))
                setLoading(false)
            }
        }).catch(e =>{ console.log(e); setLoading(false)})
    }
    useEffect(() => {
        // setLoading(true)
        handleUpdateComments()
    }, [updateComments])

    const [isReplyng, setIsreplying] = useState(-2)
    const [reply, setReply] = useState("")
    const replyComment = () => {
        const fd = new FormData()
        fd.append("text", reply)

            fetch(`http://eunoia-bshop.ir:8000/shops/${shopID}/items/${itemID}/comments/${isReplyng}/replies`,{
            method: 'POST',
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }, 
            body: fd
        }).then(
            res => {
                if (res.ok) {
                    setIsreplying(-2)
                    setUpdateComments(!updateComments);
                    setReply("")
                   
                }
                return null;
            }
        )
            .catch(e => console.log(e));
    }
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
            fetch(`http://eunoia-bshop.ir:8000/shops/${shopID}/items/${itemID}/comments/${edittingID}`, {
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
            fetch(`http://eunoia-bshop.ir:8000/shops/${shopID}/items/${itemID}/comments/`, {
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
        fetch(`http://eunoia-bshop.ir:8000/shops/${shopID}/items/${itemID}/comments/`+deletingComment.id,{
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
    const handleLikeComment = (comment) => {
        fetch(`http://eunoia-bshop.ir:8000/shops/${shopID}/items/${itemID}/comments/${comment.id}/likes`,{
            method: 'POST',
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }
        }).then(() => handleUpdateComments())
    }
    const checkIsLikedByUserOrNot = (comment) => {
        const username = localStorage.getItem("username")
        const temp = comment.AllPeopleLiked[0]?.Liked_By?.findIndex(i => i?.username === username)
        console.log(temp);
        return temp > -1 ? true : false
    }
    const handleReplyLikeComment = (reply, commentid) => {
        fetch(`http://eunoia-bshop.ir:8000/shops/${shopID}/items/${itemID}/comments/${commentid}/replies/${reply.id}/likes`,{
            method: 'POST',
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }
        }).then(() => handleUpdateComments())
    }
    const checkIsReplyLikedByUser = (reply) => {
        console.log(reply);
        const username = localStorage.getItem("username")
        const temp = reply.AllPeopleLiked[0]?.Liked_By?.findIndex(i => i?.username === username)
        console.log(temp);
        return temp > -1 ? true : false
    }
    console.log(props);
    return (
        <div className="shop-page">
    <div className="shop-comments">
        {loading?<p>در حال به روز رسانی نظرات...</p>:
         <><div className="comments-container">
            {!Array.isArray(comments) || comments.length === 0 ? <p data-testid="comment-nocomment">نظری ثبت نشده است.</p> : comments?.map(comment => {
                if (comment) return (<>
                    <div className="shop-comment" key={comment.id} data-testid={"comment"+comment.id}>
                        {/* <h3 className="item-comment-title">{comment.title}</h3> */}
                        <div style={{ display: "inline-flex", borderBottom: "1px solid var(--bg-color3)" }}>
                            <p className="shop-comment-author" data-testid={"comment-username"+comment.id} >{comment.user.user_name}</p>
                            <p className="shop-comment-date" data-testid={"comment-datetime"+comment.id}>{comment.date_jalali}</p>
                            <p className="shop-comment-date" data-testid={"comment-datetime"+comment.id}>
                                <IconButton onClick={() => handleLikeComment(comment)} style={{ color: 'red', padding: '0' }}> 
                                    {checkIsLikedByUserOrNot(comment) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                </IconButton>
                            </p>
                            <p className="shop-comment-date" data-testid={"comment-datetime"+comment.id}>{comment.AllPeopleLiked[0]?.Liked_By?.length}لایک</p>
                            {selfComments.includes(comment.id) && <div className="comment-edit-delete" data-testid={"comment-edit-delete-options"+comment.id}>
                                <p className="comment-edit" data-testid={"comment-edit-options"+comment.id} onClick={() => startEditting(comment.id, comment.text)} > ویرایش</p>
                                <p className="comment-delete" data-testid={"comment-delete-options"+comment.id} onClick={()=>setDeletingComment(comment)}>حذف نظر</p>
                            </div>}
                            {props.userState ==="m" && (<p className="comment-edit mr-2" data-testid={"comment-edit-item-options"+comment.id} onClick={() => setIsreplying(comment.id)} > پاسخ به نظر</p>)}
                        </div>
                        <p className="shop-comment-desc" data-testid={"comment-text"+comment.id}>{comment.text}</p>
                    </div>
                      <div className="reply-comment">{!!comment.Replies && comment.Replies.map(r=>  <div className="shop-comment" key={r.id} data-testid={"comment-reply"+r.id}>
                      {/* <h3 className="shop-comment-title">{comment.title}</h3> */}
                      <div style={{ display: "inline-flex", borderBottom: "1px solid var(--bg-color3)" }}>
                          <p className="shop-comment-author" data-testid={"comment-reply-username"+r.id} >{r.user.user_name}</p>
                          <p className="shop-comment-date" data-testid={"comment-reply-datetime"+r.id}>{r.date_jalali}</p>
                          <div className="shop-comment-author">
                            <IconButton onClick={() => handleReplyLikeComment(r, comment.id)} style={{ color: 'red', padding: '0' }}> 
                                   {checkIsReplyLikedByUser(r) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                            </IconButton>
                            {r.AllPeopleLiked[0]?.Liked_By?.length}
                            لایک 
                            </div>
                      </div>
                      <p className="shop-comment-desc" data-testid={"comment-reply-text"+r.id}>{r.text}</p>
                  </div>)}</div>
                  </> 
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
        </div>} {(props.userState === "m") && isReplyng > -1 && <div className="write-comment-container" data-testid="write-reply-comment">
            <div className="write-comment">
                <div onClick={replyComment} data-testid="send-comment-reply-button"><SendIcon /></div>
                <textarea type="text" placeholder="پاسخ نظر خود را بنویسید..." value={reply} style={{ border: "none", height: "calc(20vh - 20px)" }} onChange={e => setReply(e.target.value)} data-testid="write-comment-reply-input" ></textarea>
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

    </div>
    </div>)
}

export default Itemcomment;