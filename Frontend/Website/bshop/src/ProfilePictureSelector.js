import "./ProfilePage.css";
import EditIcon from '@material-ui/icons/Edit';
function ProfilePictureSelector(props) {

    function uploadImage(e) {
        if (e.target.files.length === 0)
            return;
        props.setNewPicInfo(e.target.files[0]);
        props.setEdit(true);

        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                props.setPic(reader.result);
            }
        }
        reader.readAsDataURL(e.target.files[0]);

    }


    return (
        <div className="prof-pic-selector">
            <div className="img-container">
                <img className="prof-img" src={props.pic} alt="profile" />

            </div>
            <input type="file" id="photo-upload" accept="image/*" className="img-uploader" onChange={uploadImage} />
            <label htmlFor="photo-upload" className="custom-file-upload btn"
            >
                تغییر عکس
                    <EditIcon className=" fas" htmlFor="photo-upload" style={{ fontSize: "xx-large" }} />

            </label>
        </div>
    )
}

export default ProfilePictureSelector;