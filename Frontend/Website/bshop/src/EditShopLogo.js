import "./ProfilePage.css";
//import { useEffect, useState } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import { EditSharp } from "@material-ui/icons";
function EditShopLogo(props) {

    function uploadPic(e) {
        if (e.target.files.length === 0)
            return;
        props.setNewPicInfo(e.target.files[0]);
        // props.setEdit(true);

        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                props.setPic(reader.result);
            }
        }
        reader.readAsDataURL(e.target.files[0]);

    }

    function uploadLogo(e) {
        //in upload logo
        if (e.target.files.length === 0)
            return;
        props.setNewLogoInfo(e.target.files[0]);
        // props.setEdit(true);

        const reader2 = new FileReader();
        reader2.onload = () => {
            if (reader2.readyState === 2) {
                props.setLogo(reader2.result);
            }
        }
        reader2.readAsDataURL(e.target.files[0]);

    }


    return (
        <div className="prof-pic-selector" >
            <div className="prof-pic-background" style={{ backgroundImage: "url(" + props.pic + ")" }}>
                <div className="img-container2">
                <div className="img-container" >
                    <img className="prof-img" src={props.logo} alt="profile" />
                </div>
                </div>
            </div>
            <input type="file" id="photo-upload" accept="image/*" className="img-uploader" onChange={uploadPic} />
            <label htmlFor="photo-upload" className=" btn"
            >
                تغییر عکس
                    <EditIcon className=" fas" htmlFor="photo-upload" style={{ fontSize: "xx-large" }} />

            </label>
            <input type="file" id="logo-upload" accept="image/*" className="img-uploader" onChange={uploadLogo} />
            <label htmlFor="logo-upload" className=" btn"
            >
                تغییر لوگو
                    <EditIcon className=" fas" htmlFor="logo-upload" style={{ fontSize: "xx-large" }} />

            </label>
        </div>
    )
}

export default EditShopLogo;