import SendIcon from '@material-ui/icons/Send';
import { useEffect, useState } from 'react';

function ShopComments(props){
    const [comments, setComments] = useState([])
    const [writtenComment,setWrittenComment] = useState("")
    const [updateComments,setUpdateComments] = useState(false);
    const months=["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"]
    useEffect(()=>{
        fetch("http://127.0.0.1:8000/api/v1/shops/comment/list/"+props.shopID,{
            method:"GET",
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }

        }).then(res=>{
            if(res.status===200)
                return res.json();
            return null;
        }).then(res=>{
            console.log(res)
            if(res)
                {
                    for(let i in res){
                        let str = res[i].date.split('T').join('.').split('.').join('-').split('-');
                        console.log(str)
                        str[1]= months[parseInt(str[1])]
                        str[3] = " ساعت" + str[3]
                        let new_str = [str[2],str[1],str[0],str[3]]
                        res[i].date = new_str.join(" ");
                    }
                    setComments(res);
                }
        }).catch(e=>console.log(e))
    },[updateComments])
    
    function SendComment(){
        let fd = new FormData()
        fd.append("text",writtenComment);
        fd.append("shop",props.shopID)
        fetch("http://127.0.0.1:8000/api/v1/shops/comment/create/",{
            method:"POST",
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            },
            body: fd
        }).then(res=>{
            if(res.status===201){
                setUpdateComments(!updateComments);
            }
        }).catch(e=>console.log(e))
    }

    return (<div className="shop-comments">
        <div className="comments-container">
    {comments.length===0? <p>نظری ثبت نشده است.</p>:comments.map(comment => {
        if (comment) return (
            <div className="shop-comment">
                {/* <h3 className="shop-comment-title">{comment.title}</h3> */}
                <div style={{ display: "inline-flex", borderBottom: "1px solid var(--bg-color3)" }}>
                    <p className="shop-comment-author">{comment.user.user_name}</p>
                    <p className="shop-comment-date">{comment.date}</p>
                </div>
                <p className="shop-comment-desc">{comment.text}</p>
            </div>
        )
    })}
    </div>
    {(props.userState !== "u") && <div className="shop-comment write-comment">
        <SendIcon onClick={SendComment}/>
        <textarea type="text" placeholder="نظر خود را بنویسید..." value={writtenComment} style={{ border: "none", height: "calc(20vh - 20px)" }} onChange={e=>setWrittenComment(e.target.value)}></textarea>
    </div>}
</div>)
}

export default ShopComments;