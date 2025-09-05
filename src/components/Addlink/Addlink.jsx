import { handleSaveLink } from "../../Utils/Link/handleSaveLink";

export default function Addlink(userId){
    const [url, setUrl] = useState('');
    const [note, setNote] = useState('');
    return(
        <div className='col-md-12' style={{ margin: '0px auto 20px auto' }}>
        <div className='button-container'>
          <div></div>
          <div>
            <Popup
              trigger={
                <button className={`btn border-black`}>
                  Add a link
                </button>
              }
              modal
              nested
            >
              {(close) => (
                <div className="link-popup">
                  <h3>Add URL and Notes</h3>
                  <div className="row justify-content-center ">
                    <div className="col-md-8">
                      <input
                        type="text"
                        placeholder="URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="form-control mb-2"
                      />
                      <textarea
                        placeholder="Notes"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="form-control mb-2"
                      ></textarea>
                      <div className="text-center">
                        <button className="btn" onClick={handleSaveLink(userId,url,note)}>Save</button>
                      </div>
                    </div>
                  </div>
                  <div className="row justify-content-center mt-3">
                    <div className="col-md-8 text-center">
                      <button className="btn" onClick={close}><FontAwesomeIcon icon={faTimes} /></button>
                    </div>
                  </div>
                </div>
              )}
            </Popup>
          </div>
          <div></div>
        </div>
      </div>
    );
}