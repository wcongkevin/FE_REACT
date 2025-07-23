import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BallTriangle } from "react-loader-spinner";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import ReactQuill from 'react-quill';
import HelpService from '../../services/HelpService'; 
import 'react-quill/dist/quill.snow.css';
const webappWiki: React.FC = () => {
  //1, show loader when opening , hide loader when data retrieved
  const [showLoader, setShowLoader] = useState(true);
  const [isContentToggled, setIsContentToggled] = useState<boolean>(false);
  const [webappHtml, setwebappHtml] = useState<string>("");
  const [savedContent, setSavedContent] = useState<string>(webappHtml);
  const [isShown, setIsShown] = useState<boolean>(true);
  const toggleContent = () => {
    setIsContentToggled(!isContentToggled);
    setIsShown(!isShown);
  };
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsContentToggled(false);
    setIsShown(true);
    const webappJsonData = { content: webappHtml };
    setSavedContent(webappHtml);
    HelpService.onboardRetailerSet(webappJsonData).then(response => {
      if (response.data.content) {
        setwebappHtml(response.data.content);
      }
    }).catch(error => {
      console.error('HelpService.onboardRetailerSet : Error saving data:', error);
    });
  };
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await HelpService.onboardRetailerGet();
        const restData = res.data;
        if (restData.content) {
          setwebappHtml(restData.content ? restData.content : null);
          setSavedContent(restData.content ? restData.content : null);
        }
        setShowLoader(false);
      } catch (error) {
        console.error("loadData : Error fetching data:", error);
        setShowLoader(false);
      }
    };
    loadData();
  }, []);
  return (
    <div className="container-fluid row h-100 mt-3">
      {showLoader ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            zIndex: 1020,
            top: 0,
            height: "100%",
            position: "absolute",
            width: "100%",
            backgroundColor: "rgba(51, 51, 51, 0.8)",
          }}
        >
          <BallTriangle
            height={100}
            width={100}
            color="white"
            ariaLabel="loading"
          />
          <div style={{ position: "absolute", color: "white" }}>
            <b>Please Wait....</b>
          </div>
        </div>
      ) : (
        <div>
          <div className="container-fluid mt-3 w-100">
            <div className="row d-flex justify-content-center">
              <div className="col-8 col-sm">
                <h5 className="mb-3">webapp! wiki</h5>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <div className="ms-2 float-end">
                {isShown && (
                  <FontAwesomeIcon
                    icon={faEdit}
                    onClick={toggleContent}
                    data-toggle="tooltip"
                    title="Edit"
                  />
                )}
              </div>
              {!isContentToggled ? (
                <div
                  className="card-text"
                  dangerouslySetInnerHTML={{ __html: savedContent }}
                />
              ) : (
                <div>
                  <form onSubmit={onSubmit}>
                    <div>
                      <ReactQuill
                        value={webappHtml}
                        onChange={setwebappHtml}
                        theme="snow"
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-outline-primary buttn"
                    >
                      Save
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default webappWiki;