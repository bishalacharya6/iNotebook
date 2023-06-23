import React, {useContext} from 'react'
import noteContext from '../context/notes/noteContext';


const Noteitem = (props) => {
    const context = useContext (noteContext);
    const {deleteNote} = context
    const {note, updateNote} = props;
  return (
    <div className='col-md-3'>
        <div className="card my-3">
        <div className="card-body">
          <div className="d-flex align-item-center">
            <h5 className="card-title ">{note.title}</h5> 
            <i className="fa-sharp fa-solid fa-trash m-1 px-2" onClick={()=>{ deleteNote(note._id); props.showAlert("Note Deleted Successfully", "success");}}></i>
            <i className="fa-solid fa-file-pen m-1" onClick={()=> {updateNote(note)}} ></i> 
          </div>
            <p className="card-text">{note.description}</p>
            
        </div>
        </div>
      
    </div>
  )
}

export default Noteitem
