import { useDispatch, useSelector } from "react-redux";
import { toggleSearchBar, setSearchBarText } from "../../features/toggleSearchBar/toggleSearchBarSlice";
export default function Search() {
    const {isSearchBarVisible, searchBarText} = useSelector((state)=>state.SearchBarState);
    const dispatch = useDispatch();
    return <>
            <div className="d-flex">
                <div>
                  <p className="tab-titles">Recents</p> 
                </div>
                <div>
                  <button className="btn mb-3 pr-4 mr-4" onClick={dispatch(toggleSearchBar)} style={{ marginLeft: '-30px', marginBottom: '10px' }}>
                    <FontAwesomeIcon icon={faSearch} />
                  </button>
                </div>
              </div>
              <div className='d-flex justify-content-between'>
                <div></div>
                <div style={{ margin: '0px' }} className={`col-md-9 search-container ${isSearchBarVisible ? 'show' : 'hide'}`}>
                  <input
                    type="text"
                    className="form-control mb-3 navigation-input"
                    placeholder="Search by note"
                    value={searchBarText}
                    onChange={(e) => dispatch(setSearchBarText(e.target.value))}
                  />
                </div>
                <div></div>

              </div>
    </>
}