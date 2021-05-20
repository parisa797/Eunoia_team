import { Modal } from "react-bootstrap";

function DeleteItem(props){
    
    const deleteItem=()=>{
        fetch("http://eunoia-bshop.ir:8000/shops/"+props.shopID+"/items/"+props.showDeleteModal.id,{
            method: 'DELETE',
            headers: {
                "Authorization": "Token " + localStorage.getItem('token')
            }
        }).then(
            res => {
                if (res.status === 204) {
                    props.setTriggerReload(!props.triggerReload)
                    if(props.url)
                        window.location.href = props.url;
                    props.setShowDeleteModal({show:false})
                }
                return null;
            }
        )
            .catch(e => console.log(e));
    }

    return <Modal show={props.showDeleteModal.show} onHide={() => props.setShowDeleteModal({show:false})} style={{ display: "flex" }} className="profile-outer-modal">
    <Modal.Header closeButton className="profile-modal">
        <Modal.Title>حذف کالا</Modal.Title>
    </Modal.Header>
    <Modal.Body className="profile-modal">
        <div style={{ direction: "rtl" }}>
            <p>آیا از حذف {props.showDeleteModal.name} اطمینان دارید؟</p>
            <div className="justify-content-center" style={{ width: "100%", display: "flex" }}>
                <div className="btn delete-button" onClick={() => deleteItem()}>تایید و حذف کالا</div>
            </div>
        </div>
    </Modal.Body>

</Modal>
}

export default DeleteItem;