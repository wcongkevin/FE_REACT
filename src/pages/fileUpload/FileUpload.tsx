import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning, faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
import FileService from "../../services/FileService";
import { BallTriangle } from "react-loader-spinner";
import ReactPaginate from "react-paginate";
import filenameConfig from '../../config/filenameConfig'
import { Tooltip } from 'react-tooltip'
import "./FileUpload.css";

const FileUpload: React.FC = () => {
  //1, show loader when opening , hide loader when data retrieved
  const [showLoader, setShowLoader] = useState(true);
  //2, set file version in useEffect
  const [fileVersionInfo, setFileVersionInfo] = useState<object>(null);
  //3, set file configuration in useEffect
  const [fileConfigsValues, setFileConfigsValues] = useState<object>(null);
  //4, retrieve file extensions , set allowed file types in useEffect
  const [allowedFiles, setAllowedFiles] = useState<string[]>([]);
  //5, set drop is in order to set class for (className={`chooseFileDiv ${drop ? "drag" : ""}`})
  const [drop, setDrop] = useState(false);

  const [pageSize, setPageSize] = useState(12);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedFileVersion, setSelectedFileVersion] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedVersions, setSelectedVersions] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fileUploadStatusFlag, setFileUploadStatusFlag] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [allFiles, setAllFiles] = useState<File[]>([]);
  const [collectionSize, setCollectionSize] = useState(1);
  const [fileDataBeforeRefreshed, setFileDataBeforeRefreshed] = useState<File[]>([]);
  const [fileData, setFileData] = useState<File[]>([]);
  const navigate = useNavigate();

  const [initDataFlag, setInitDataFlag] = useState(false);
  const chunkSize = 30 * 1024 * 1024; // 30 MB

  const [fileSizeMsg] = useState(
    "Total size of all files being uploaded in a batch should not exceed 30 MB."
  );
  const [fileExtMsg] = useState(
    "Check the correct file extensions allowed (.xlsx, .xlsb, .xlsm, .xls, .csv, .txt, .json, .dat)."
  );
  const [fileNamingFormatMsgLine1] = useState(
    "Before uploading, ensure your files are named correctly. They should have the following convention:"
  );
  const [fileNamingFormatMsgLine2] = useState(
    "<market>_<division>_<Type>_<retailer>_<yyyymmdd>.<file extension>"
  );
  const [fileNamingFormatMsgLine3] = useState(
    "Example: xxx_xxx_xx_xxxxxx_20230601.xlsx"
  );
  const [afterUploadClickMsg] = useState(
    "After clicking the Upload button, the app will validate the file name(s) and file count and provide a status update."
  );

  useEffect(() => {
    if (!initDataFlag) {
      const loadData = async () => {
        try {
          const res = await FileService.getFileVersions();
          const restData = res.data;
          if (restData) {
            setFileVersionInfo(restData ? restData : null);
          }
          setFileConfigsValues(filenameConfig);
          setAllowedFiles(filenameConfig["extension"]);
          setShowLoader(false);
        } catch (error) {
          console.error("loadData : Error fetching data:", error);
          setShowLoader(false);
        }
      };
      loadData();
      setInitDataFlag(true);
    } else {
      search();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  const goToFileUpload = () => {
    navigate('/file-upload');
    setIsSubmitted(false);
  };

  const goToFileMonitor = () => {
    navigate('/');
    setIsSubmitted(false);
  };

  const onFileUpload = () => {
    uploadChunkFile(allFiles);
    setFileUploadStatusFlag(false);
    return;
  };

  const uploadChunkFile = async (files: File[]) => {
    setShowLoader(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const temp_data: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const temp_resData: any[] = [];
    const newFormData = new FormData();
    let checkFormData: File[] = [];
    let newFormDataSize = 0;
    let chunkFileVersion = '';

    for (let i = 0; i < files.length; i++) {
      const file: File = files[i];
      chunkFileVersion = 'v' + selectedVersions[i];
      //1, file size is bigger than 30 MB
      if (files[i].size > chunkSize) {
        const totalChunks = Math.ceil(file.size / chunkSize);
        for (let j = 0; j < totalChunks; j++) {
          const start = j * chunkSize;
          const chunk = file.slice(start, start + chunkSize);
          const chunkFormData = new FormData();
          chunkFormData.append("file", chunk);
          chunkFormData.append("file_name", getNewFileName(file.name, chunkFileVersion));
          chunkFormData.append("content_type", file.type);
          chunkFormData.append("file_size", chunk.size.toString());
          chunkFormData.append("chunk_no", j.toString());
          chunkFormData.append("total_chunks", totalChunks.toString());
          chunkFormData.append('file_version', chunkFileVersion);
          let tempRES = {};
          try {
            const chunk_response = await FileService.uploadChunk(chunkFormData, j, "Yes");
            tempRES = chunk_response;
            const tempFileName = chunk_response.data.file_name;
            if (!isDuplicateObject(tempFileName, temp_data)) {
              temp_data.push(chunk_response.data);
              temp_resData.push(chunk_response.data);
            }
          } catch (err) {
            const errorResponse = { "file_name": file.name, "reason": "Technical Issue", "status": "FAILURE" };
            temp_data.push(errorResponse);
            temp_resData.push(errorResponse);
            break;
          }
          if (tempRES["status"] === "FAILURE") {
            break;
          }
        }
      } else {
        //2, file size is less than 30 MB
        newFormData.append("file", file, getNewFileName(files[i].name, chunkFileVersion));
        checkFormData.push(files[i]);
        newFormDataSize += files[i].size;
      }
    }

    if (checkFormData.length !== 0) {
      if (newFormDataSize > chunkSize) {
        for (let i = 0; i < checkFormData.length; i++) {
          const allFormData = new FormData();
          allFormData.append("file", checkFormData[i]);
          allFormData.append("file_name", checkFormData[i].name);
          allFormData.append("content_type", checkFormData[i].type);
          allFormData.append("file_size", checkFormData[i].size.toString());
          allFormData.append("chunk_no", "0");
          allFormData.append("total_chunks", "1");
          try {
            const chunk_response = await FileService.uploadChunk(allFormData, 0, "Yes");
            const tempFileName = chunk_response["file_name"];
            if (!isDuplicateObject(tempFileName, temp_data)) {
              temp_data.push(chunk_response.data);
              temp_resData.push(chunk_response.data);
            }
          } catch (err) {
            const errorResponse = { "file_name": checkFormData[i].name, "reason": "Technical Issue", "status": "FAILURE" };
            temp_data.push(errorResponse);
            temp_resData.push(errorResponse);
            break;
          }
        }
      } else {
        try {
          const chunk_response = await FileService.uploadChunk(newFormData, 0, "No");
          temp_data.push(...chunk_response.data);
          temp_resData.push(...chunk_response.data);
        } catch (err) {
          checkFormData.forEach(file => {
            const errorResponse = { "file_name": file.name, "reason": "Technical Issue", "status": "FAILURE" };
            temp_data.push(errorResponse);
            temp_resData.push(errorResponse);
          });
        }
      }
    }

    setIsSubmitted(true);
    setFileUploadStatusFlag(true);
    setData(temp_data);
    setCollectionSize(temp_resData.length);
    setShowLoader(false);
    refreshData(0, pageSize, temp_resData);
    setAllFiles([]);
    setFileData([]);
    setFile(null);
    checkFormData = [];
    newFormData.delete('file');
    newFormData.delete('content_type');
    newFormData.delete('chunk_no');
    newFormData.delete('file_name');
    newFormData.delete('total_chunks');
    newFormData.delete('file_size');
  };

  const getFileVersions = (selectedFile: string) => {
    const fileNameSplit = selectedFile.split(".");
    const fileName = fileNameSplit[0];
    const fileExt = fileNameSplit[1];
    const fileNameBreakup = fileName.split("_");
    fileNameBreakup.pop();
    const versionConfigKey = fileNameBreakup.join("_").toLowerCase();
    const configArr = fileVersionInfo[versionConfigKey];
    let versionArr: number[] = [];
    if (configArr) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      configArr.forEach((item: any) => {
        if (item["file_type"] === fileExt.toLowerCase())
          versionArr = item.version.sort((a: number, b: number) => b - a);
      });
    }
    return versionArr;
  };

  const refreshData = (startPageNumber, itemsPerPage, filteredData) => {
    const offset = startPageNumber * itemsPerPage;
    setFileDataBeforeRefreshed(filteredData);
    setFileData(
      filteredData.slice(offset, offset + itemsPerPage)
    );
  };

  const search = () => {
    let searchedData: File[] = [];
    if (searchText.length != 0) {
      searchedData =
        allFiles.filter((res) => {
          return res.name
            .toLowerCase()
            .match(searchText.toLowerCase());
        })
      setFileData(searchedData);
      setCollectionSize(searchedData.length);
      refreshData(0, pageSize, searchedData);
    } else {
      setFileData(allFiles);
      setCollectionSize(allFiles.length);
      refreshData(0, pageSize, allFiles);
    }
  };

  const onDelete = (i: number) => {
    //1, remove the data of index i 
    //2, if all data removed , we should setFile null to hide data table related
    //3, if still have data , we should still display them with pagination
    const updatedFileData = [...fileDataBeforeRefreshed];
    const index = currentPage * pageSize + i;
    updatedFileData.splice(index, 1);
    setFileData(updatedFileData);
    const updatedAllFiles = allFiles.filter((_file, index) => index !== i);
    setAllFiles(updatedAllFiles);
    const updatedSelectedFileVersion = selectedFileVersion.filter(
      (_version, index) => index !== i
    );
    setSelectedFileVersion(updatedSelectedFileVersion);
    const updatedSelectedVersions = selectedVersions.filter(
      (_version, index) => index !== i
    );
    setSelectedVersions(updatedSelectedVersions);
    if (updatedAllFiles.length === 0) {
      setFile(null);
    }
    setCollectionSize(updatedFileData.length);
    refreshData(currentPage, pageSize, updatedFileData);
  };

  const validateFileExt = (selectedFile: File): boolean => {
    const fileName = selectedFile["name"].split(".")[0];
    const fileExt = selectedFile["name"].split(".")[1].toLowerCase();
    const fileNameBreakup = fileName.split("_");
    if (fileExt != "dat") {
      if (!allowedFiles.includes(selectedFile.type)) return false;
    }
    if (!fileConfigsValues["market"].includes(fileNameBreakup[0].toLowerCase()))
      return false;
    if (
      !fileConfigsValues["division"].includes(fileNameBreakup[1].toLowerCase())
    )
      return false;
    if (!fileConfigsValues["type"].includes(fileNameBreakup[2].toLowerCase()))
      return false;
    if (!validateRetailerName(fileNameBreakup[3])) return false;
    const isValidaDate = validateDateFormat(fileNameBreakup[4]);
    if (!isValidaDate) return false;
    const vailableVersions = getFileVersions(selectedFile["name"]);
    if (vailableVersions.length <= 0) return false;
    return true;
  };

  const getFileValidationErrorMessage = (selectedFile: File): string => {
    let errMsg = '';
    const fileArr = selectedFile.name.split('.');
    const fileName = fileArr[0];
    const fileExt = fileArr[1].toLowerCase();
    const fileNameBreakup = fileName.split('_');

    if (fileExt !== 'dat') {
      if (!allowedFiles.includes(selectedFile.type)) {
        errMsg += 'File extension not supported. Please follow instructions.';
        return errMsg;
      }
    }

    if (fileNameBreakup.length < 5) {
      errMsg += 'File name format not compliant. Please follow instructions.';
      return errMsg;
    }

    if (!fileConfigsValues["market"].includes(fileNameBreakup[0].toLowerCase())) {
      errMsg += `Market not compliant. Allowed values are: (${fileConfigsValues["market"].join(', ').toUpperCase()}). `;
    }
    if (!fileConfigsValues["division"].includes(fileNameBreakup[1].toLowerCase())) {
      errMsg += `Division not compliant. Allowed values are: (${fileConfigsValues["division"].join(', ').toUpperCase()}). `;
    }
    if (!fileConfigsValues["type"].includes(fileNameBreakup[2].toLowerCase())) {
      errMsg += `Type not compliant. Allowed values are: (${fileConfigsValues["type"].join(', ').toUpperCase()}). `;
    }
    if (!validateRetailerName(fileNameBreakup[3])) {
      errMsg += 'Retailer name not compliant. ';
    }

    const isValidDate = validateDateFormat(fileNameBreakup[4]);
    if (!isValidDate) {
      errMsg += 'Date not compliant. Please check date format and Validity. ';
    }

    const availableVersions = getFileVersions(selectedFile.name);
    if (availableVersions.length <= 0) {
      errMsg += 'Selected file metadata not available. ';
    }

    return errMsg;
  };

  const validateRetailerName = (retailerName: string): boolean => {
    const retailerRegex = new RegExp("^[a-zA-Z0-9-]+$");
    return retailerRegex.test(retailerName);
  };

  const validateDateFormat = (date: string): boolean => {
    const dateRegex = new RegExp("^[0-9]{8}$");
    if (!dateRegex.test(date)) return false;

    const year = Number(date.substring(0, 4));
    const month = Number(date.substring(4, 6));
    const day = Number(date.substring(6, 8));

    if (day <= 0 || month <= 0) return false;
    if ([1, 3, 5, 7, 8, 10, 12].includes(month) && day > 31) return false;
    if ([4, 6, 9, 11].includes(month) && day > 30) return false;
    if (month === 2) {
      if (year % 4 === 0 && day > 29) return false;
      if (year % 4 !== 0 && day > 28) return false;
    }
    return true;
  };
  //6, will be triggered when uploading files
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let files = Array.from(event.target.files!);
    const newFormDate = new FormData();
    files.forEach((file) => {
      newFormDate.append("file", file, file.name);
      setFile(file);
      setAllFiles((prevFiles) => [...prevFiles, file]);
      setFileData((prevFiles) => [...prevFiles, file]);
      setSelectedFileVersion((prevVersions) => [
        ...prevVersions,
        getFileVersions(file.name),
      ]);
      setSelectedVersions((prevVersions) => [
        ...prevVersions,
        getFileVersions(file.name)[0],
      ]);
    });
    if (fileData.length > 0) {
      files = files.concat(fileData);
    }
    setCollectionSize(files.length);
    refreshData(0, pageSize, files);
    event.target.value = "";
  };

  const onVersionChange = (event, i: number) => {
    const fileVersion = fileData[i];
    const index = allFiles.indexOf(fileVersion, 0);
    const newVersion = event.target.value.replace("v", "");
    setSelectedVersions((prevVersions) => {
      prevVersions[index] = newVersion;
      return [...prevVersions];
    });
  };

  const getNewFileName = (fileName: string, version: string): string => {
    const fileNameSplit = fileName.split(".");
    return `${fileNameSplit[0].toUpperCase()}_${version.toUpperCase()}.${fileNameSplit[1].toUpperCase()}`;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isDuplicateObject = (tempFileName: string, list: any[]) => {
    return list.some((item) => item.file_name === tempFileName);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePageSizeChange = (event: any) => {
    const totalDataAmount = fileDataBeforeRefreshed.length;
    const currentPageSize = Number(event.target.value);
    const pageTotalNumber = Math.ceil(totalDataAmount / currentPageSize);
    let curPage = currentPage;
    if (totalDataAmount <= 0) {
      throw new Error("There is no data currently");
    }
    if (pageTotalNumber <= curPage) {
      curPage = pageTotalNumber - 1;
    }
    setPageSize(currentPageSize);
    setCurrentPage(curPage);
    refreshData(curPage, Number(event.target.value), fileDataBeforeRefreshed);
  };

  const handlePageChange = (event: { selected: number }) => {
    setCurrentPage(event.selected);
    refreshData(event.selected, pageSize, fileDataBeforeRefreshed);
  };

  const isEnableUploadBtn = (): boolean => {
    let defaultReturn = false;
    allFiles.forEach((fileObj) => {
      if (!validateFileExt(fileObj)) defaultReturn = true;
    });
    return defaultReturn;
  };

  return (
    <div>
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
          <div data-testid="loader" style={{ position: "absolute", color: "white" }}>
            <b>Please Wait....</b>
          </div>
        </div>
      ) : (
        <div className="mt-3">
          <div className="container-fluid" hidden={isSubmitted}>
            <div className="row d-flex justify-content-center">
              <div className="container-fluid mt-3 w-100">
                <div className="row d-flex justify-content-center">
                  <div className="col-8 col-sm">
                    <h5>webapp! File upload</h5>
                  </div>
                </div>
                <p>
                   some description
                </p>
              </div>
              <div className="col-4">
                <div className="card instruction">
                  <h5>Instructions:</h5>
                  <p>
                    1. &nbsp; {fileNamingFormatMsgLine1}{" "}
                    <b>
                      <i>{fileNamingFormatMsgLine2}</i>
                    </b>{" "}
                    {fileNamingFormatMsgLine3}
                  </p>
                  <p>2. &nbsp; {fileSizeMsg} </p>
                  <p>3. &nbsp; {fileExtMsg} </p>
                  <p>4. &nbsp; {afterUploadClickMsg} </p>
                </div>
              </div>
              <div className="col-8">
                <div className="container-flex">
                  <div className="file-box m-3">
                    <div
                      className={`chooseFileDiv ${drop ? "drag" : ""}`}
                      hidden={!file}
                      onDragOver={() => setDrop(true)}
                      onDragLeave={() => setDrop(false)}
                      onDrop={() => setDrop(false)}
                    >
                      <input
                        data-testid="file-input"
                        type="file"
                        className="file"
                        multiple={true}
                        id="chooseFile"
                        onChange={onFileChange}
                      />
                      <label htmlFor="chooseFile" className="align-middle">
                        <FontAwesomeIcon className="mt-5" icon={faUpload} />
                        <h6>Drag and drop or Browse to choose a file.</h6>
                      </label>
                    </div>
                    <div
                      className={`chooseFileDiv ${drop ? "drag" : ""}`}
                      hidden={!!file}
                      onDragOver={() => setDrop(true)}
                      onDragLeave={() => setDrop(false)}
                      onDrop={() => setDrop(false)}
                    >
                      <input
                        type="file"
                        className="file"
                        multiple={true}
                        id="chooseFile"
                        onChange={onFileChange}
                      />
                      <label htmlFor="chooseFile" className="align-middle">
                        <FontAwesomeIcon className="mt-5" icon={faUpload} />
                        <h6>Drag and drop or Browse to choose a file.</h6>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-12 mt-4" hidden={!file}>
                <div className="card">
                  <div className="row m-2">
                    <div className="col-10">
                      <button
                        data-testid="upload-button"
                        onClick={() => onFileUpload()}
                        disabled={isEnableUploadBtn()}
                        className="btn btn-outline-primary"
                      >
                        Upload
                      </button>
                    </div>
                    <div className="col-2">
                      <input
                        id="table-filtering-search"
                        className="form-control search"
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search"
                      />
                    </div>
                  </div>
                  <div className="row table-responsive">
                    <table className="table table-hover table-striped mw-100">
                      <thead className="table-head">
                        <tr>
                          <th scope="col">File Name</th>
                          <th scope="col">File Version</th>
                          <th scope="col">File Size</th>
                          <th scope="col">Last Modified</th>
                          <th scope="col"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {fileData.map((selectedFile, i) => (
                          <tr key={i}>
                            <td>
                              <span
                                className={
                                  !validateFileExt(selectedFile)
                                    ? "errfile"
                                    : ""
                                }
                              >
                                {selectedFile.name}
                                {!validateFileExt(selectedFile) && (
                                  <>
                                    <a data-tooltip-id="faWarning-tooltip" data-tooltip-content={getFileValidationErrorMessage(selectedFile)}>
                                      <FontAwesomeIcon icon={faWarning} />
                                    </a>
                                    <Tooltip id="faWarning-tooltip" />
                                  </>
                                )}
                              </span>
                            </td>
                            <td>
                              <select
                                id={`ver_${selectedFile.name}`}
                                className="form-select form-select-sm"
                                style={{ width: "auto", height: "max-content" }}
                                onChange={(event) =>
                                  onVersionChange(event.target.value, i)
                                }
                              >
                                {getFileVersions(selectedFile.name).map(
                                  (fileVersion) => (
                                    <option
                                      key={fileVersion}
                                      value={fileVersion}
                                    >
                                      {`v${fileVersion}`}
                                    </option>
                                  )
                                )}
                              </select>
                            </td>
                            <td>{`${selectedFile.size} Bytes`}</td>
                            <td>
                              {new Date(
                                selectedFile.lastModified
                              ).toLocaleString()}
                            </td>
                            <td>
                              <FontAwesomeIcon
                                icon={faTrash}
                                type="button"
                                onClick={() => onDelete(i)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {/* <div
                      className="d-flex justify-content-center"
                      hidden={!!file}
                    >
                      <p>No Records Found</p>
                    </div> */}
                  </div>
                  <div className="row pagination m-1">
                    <div className="col-sm-6 col-md-6 col-lg-6">
                      <ReactPaginate
                        previousLabel={<i className="fas fa-chevron-left"></i>}
                        nextLabel={<i className="fas fa-chevron-right"></i>}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={Math.ceil(collectionSize / pageSize)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={4}
                        onPageChange={handlePageChange}
                        containerClassName={"pagination"}
                        activeClassName={"active"}
                        forcePage={currentPage}
                        previousClassName={"page-item"}
                        nextClassName={"page-item"}
                        previousLinkClassName={"page-link"}
                        nextLinkClassName={"page-link"}
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        breakLinkClassName={"page-link"}
                      />
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-6 d-flex justify-content-lg-end justify-content-md-end justify-content-sm-end">
                      <select
                        className="form-select"
                        style={{ width: "auto", height: "max-content" }}
                        value={pageSize}
                        onChange={handlePageSizeChange}
                      >
                        <option value={12}>12 items per page</option>
                        <option value={18}>18 items per page</option>
                        <option value={24}>24 items per page</option>
                      </select>
                    </div>
                  </div>
                </div>
                <br />
              </div>
              <br />
            </div>
          </div>
          <div
            className="container-fluid mt-2 responseDiv"
            hidden={!isSubmitted}
          >
            <div className="row d-flex justify-content-center">
              <div className="container-fluid mt-3 w-100">
                <div className="row d-flex justify-content-center">
                  <div className="col-8 col-sm">
                    <h5>File Validation Check</h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="card p-1">
              <div className="table-responsive response-table">
                <table className="table table-hover table-striped mw-100">
                  <thead className="table-head">
                    <tr>
                      <th scope="col">File Name</th>
                      <th scope="col">Message</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((response, index) => (
                      <tr key={index}>
                        <td>{response.file_name}</td>
                        <td>{response.reason}</td>
                        <td>
                          <span
                            className={`badge ${response.status === "SUCCESS"
                              ? "bg-success"
                              : response.status === "FAILURE"
                                ? "bg-danger"
                                : "bg-warning"
                              }`}
                          // disabled
                          >
                            {response.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="row pagination mb-2">
                <div className="col-sm-6 col-md-6 col-lg-6">
                  <ReactPaginate
                    previousLabel={<i className="fas fa-chevron-left"></i>}
                    nextLabel={<i className="fas fa-chevron-right"></i>}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={Math.ceil(collectionSize / pageSize)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={4}
                    onPageChange={handlePageChange}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                    forcePage={currentPage}
                    previousClassName={"page-item"}
                    nextClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextLinkClassName={"page-link"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    breakLinkClassName={"page-link"}
                  />
                </div>
                <div
                  className=" col-sm-6 col-md-6 col-lg-6 d-flex justify-content-lg-end justify-content-md-end justify-content-sm-end">
                  <select
                    className="form-select"
                    style={{ width: "auto", height: "max-content" }}
                    value={pageSize}
                    onChange={handlePageSizeChange}
                  >
                    <option value={12}>12 items per page</option>
                    <option value={18}>18 items per page</option>
                    <option value={24}>24 items per page</option>
                  </select>
                </div>
                <div className="col-sm-auto">
                  <button
                    className="btn btn-outline-primary goto-button mt-3"
                    onClick={() => goToFileUpload()}
                  >
                    Go to File Upload
                  </button>
                </div>
                <div className="col-sm-auto" hidden={!fileUploadStatusFlag}>
                  <button
                    className="btn btn-outline-primary goto-button mt-3"
                    onClick={() => goToFileMonitor()}
                  >
                    Go to File Monitor
                  </button>
                </div>
              </div>
            </div>
            <br />
          </div>
        </div>
      )}
    </div>
  );
};
export default FileUpload;