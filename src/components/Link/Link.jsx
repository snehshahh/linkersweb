import React, {useState, useEffect, useMemo} from "react";
import { handleDeleteFromAll } from "../../Utils/Link/DeleteLink";
import { copyToClipboard } from "../../Utils/Link/CopyToClipBoard";
import { useHandleRemoveFromCollection } from "../../Utils/Link/RemoveFromCollection";
import { useCookies } from "react-cookie";
import { useFetchLinks } from "../../Utils/Link/fetchLinks";
import { useSelector } from "react-redux";
import { useHandleSelectCollection } from "../../Utils/Link/HandleSelectCollection";
import { handleAllSaveUpdate } from "../../Utils/Link/handleAllSaveUpdate";
import { handleImportantDelete } from "../../Utils/Link/handleImportantDelete";

export default function Link(link, editMode, toggleEditMode) {
    // const [editMode, setEditMode] = useState(false);
    const [editedNote, setEditedNote] = useState("");
    const [isHovered, setIsHovered] = useState(false);
    const handleRemoveFromCollection = useHandleRemoveFromCollection();
    const handleSelectCollection = useHandleSelectCollection();
    const [cookie, setCookie, removeCookie] = useCookies(['userId']);
    const [userId, setUserId] = useState('');
    const {fetchData} = useFetchLinks();
    const {links, loading} = useSelector((state)=> state.linksState);
    const {selectedTab} = useSelector((state)=> state.nav);
    


    useEffect(() => {
      fetchData(userId);
    }, [userId, fetchData]);

    useEffect(() => {
      const userIdCookie = cookie.userId;
      setUserId(userIdCookie)
    }, [userId]);
    //This commented func will be inside the parent comp of Link.jsx  
    // const filteredLinks = useMemo(() => {
    //   const today = new Date();
    //   const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    //   const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  
    //   if (selectedTab === "tab1") {
    //     // Recent
    //     return links.filter(
    //       (l) =>
    //         l.data.createDate?.toDate() >= startOfToday &&
    //         l.data.createDate?.toDate() < endOfToday
    //     );
    //   } else if (selectedTab === "tab2") {
    //     // Important
    //     return links.filter((l) => l.data.boolImp === true);
    //   } else if (selectedTab === "tab3") {
    //     // All
    //     return links;
    //   }
    //   return [];
    // }, [selectedTab, links]);

    // if (loading) return <p>Loading...</p>;
    
  return (
    <div
      key={link.id}
      className="mb-3"
      onMouseEnter={() =>
        setIsHovered(true)
      }
      onMouseLeave={() =>
        setIsHovered(false)
      }
    >
      <hr
        style={{
          width: "100px",
          margin: "20px auto 30px auto",
          height: isHovered
            ? "4px"
            : "0px" /* Set desired thickness */,
          backgroundColor: isHovered
            ? "black"
            : "black" /* Set color of the line */,
          transition:
            "height 0.3s ease" /* Add transition for height property */,
        }}
      />
      {editMode ? (
        <div className="mb-2">
          <label className="form-label"></label>
          <input
            type="text"
            className="form-control"
            value={editedNote}
            onChange={(e) => setEditedNote(e.target.value)}
          />
        </div>
      ) : (
        <div className="mb-2">
          <input
            type="text"
            className="form-control mb-3"
            value={link.data.note}
            readOnly
          />
        </div>
      )}
      <div className="input-group d-flex mb-3">
        <input
          type="text"
          className="form-control"
          value={link.data.url}
          readOnly
        />
        <div className="input-group-append pl-5">
          <a
            href={link.data.url}
            className="btn btn-outline-secondary "
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon
              icon={faExternalLinkAlt}
              style={{ color: "black" }}
            />
          </a>
        </div>
      </div>
      <div className="button-container">
        <div></div> {/* Added wrapper div */}
        <div>
          {(selectedTab == "tab1" || selectedTab == "tab3")&&

            <button
            className="btn  me-2"
            title="Delete"
            onClick={() => handleDeleteFromAll(link.id)}
            >
            <FontAwesomeIcon icon={faTrash} />
          </button>
          }
          <button
            className="btn me-2"
            title="Share Link"
            onClick={() =>
              copyToClipboard(
                `https://linkersdb-web.vercel.app/SharedLinkPage/${link.id}`
              )
            }
          >
            <FontAwesomeIcon icon={faShare} />
          </button>

          {((link.data.boolImp != false && selectedTab==="tab3") || (selectedTab ==="tab2")) ? (
                              <button className={`btn me-2`} title="Remove From Importants" onClick={() => handleImportantDelete(link.id)}>
                                <FontAwesomeIcon icon={faTimes} />
                              </button>
                            ) : (
                              <button className={`btn me-2`} title="Add To Importants" onClick={() => addToImportant(link.id)}>
                                <FontAwesomeIcon icon={faExclamation} />
                              </button>
                            )}
          {link.data.collection_id != null ? (
            <button
              className="btn"
              onClick={() =>
                handleRemoveFromCollection(link.id, link.data.collection_id)
              }
              title="Remove From Collection"
            >
              {" "}
              <FontAwesomeIcon
                icon={faBookmark}
                title="Remove From Collection"
                style={{ color: "green" }}
              />
            </button>
          ) : (
            <Popup
              trigger={
                <button className={`btn`} onClick={(e) => e.preventDefault()}>
                  <FontAwesomeIcon
                    icon={faBookmark}
                    title="Save To Collections"
                    style={{ color: "" }}
                  />
                </button>
              }
              modal
            >
              {(close) => (
                <div className="link-popup">
                  <h3>Select a Collection</h3>
                  <ul className="list-unstyled">
                    {collections.map((collection) => (
                      <li key={collection.id} className="m-2">
                        <button
                          className="btn btn-outline"
                          onClick={() => {
                            // handleAddToCollection(link.id);
                            handleSelectCollection(collection.id, link.id);
                            close(); // Close the popup after selecting a collection
                          }}
                          onMouseEnter={(e) =>
                            e.target.classList.add("border-black")
                          }
                          onMouseLeave={(e) =>
                            e.target.classList.remove("border-black")
                          }
                        >
                          <a
                            href="#"
                            style={{ textDecoration: "none", color: "inherit" }}
                          >
                            {collection.data.collection_title}
                          </a>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="row justify-content-center mt-3">
                    <div className="col-md-8 text-center">
                      <button className="btn" onClick={close}>
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </Popup>
          )}
          {(editMode === true) ? (
            <button
              className="btn"
              onClick={() => {
                handleAllSaveUpdate(link.id, editedNote);
                toggleEditMode(link.id);
                setEditedNote("");
              }
              }
            >
              <FontAwesomeIcon icon={faCheck} />
            </button>
          ):(
            <button
            className="btn me-2"
            title="Edit"
            onClick={() => toggleEditMode(link.id)}//yaha pe woh toggle walaaega
          >
            <FontAwesomeIcon icon={faPen} />
          </button>
          )}
        </div>
        <div></div> {/* Added wrapper div */}
      </div>
      <hr
        style={{
          width: "100px",
          margin: "20px auto 30px auto",
          height: isHovered
            ? "4px"
            : "0px" /* Set desired thickness */,
          backgroundColor: isHovered
            ? "black"
            : "black" /* Set color of the line */,
          transition:
            "height 0.3s ease" /* Add transition for height property */,
        }}
      />{" "}
    </div>
  );
}
