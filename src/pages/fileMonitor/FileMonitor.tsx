import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactPaginate from "react-paginate";
import { faSortUp, faSortDown, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { BallTriangle } from "react-loader-spinner";
import Multiselect from "multiselect-react-dropdown";
import MonitoringService from '../../services/MonitoringService';
import { MonitoringData } from '../../model/MonitoringData';
import { NameValueObject } from '../../model/NameValueObject';
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'react-datepicker/dist/react-datepicker.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { Monitoring } from '../../class/monitoring';
import moment from 'moment';
import "./FileMonitor.css"

const FileMonitor: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [showLoader, setShowLoader] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const startDatePickerRef = useRef<DatePicker | null>(null);
  const endDatePickerRef = useRef<DatePicker | null>(null);

  const retailerMultiselectRef = useRef<Multiselect>(null);
  const divisionMultiselectRef = useRef<Multiselect>(null);
  const marketMultiselectRef = useRef<Multiselect>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [collectionSize, setCollectionSize] = useState(1);
  const [sortOrder, setSortOrder] = useState('Id');
  const [reverseSort, setReverseSort] = useState(false);

  const [division, setDivision] = useState<NameValueObject[]>([]);
  const [retailer, setRetailer] = useState<NameValueObject[]>([]);
  const [market, setMarket] = useState<NameValueObject[]>([]);

  const [divisionSelectedValues, setDivisionSelectedValues] = useState<NameValueObject[]>([]);
  const [retailerSelectedValues, setRetailerSelectedValues] = useState<NameValueObject[]>([]);
  const [marketSelectedValues, setMarketSelectedValues] = useState<NameValueObject[]>([]);

  const [initDataFlag, setInitDataFlag] = useState(false);
  const [monitorInitData, setMonitorInitData] = useState<MonitoringData[]>([]);
  const [monitorData, setMonitorData] = useState<MonitoringData[]>([]);
  const [monitorBeforeRefreshData, setMonitorBeforeRefreshData] = useState<MonitoringData[]>([]);
  const [monitoring, setMonitoring] = useState(new Monitoring());

  const [sortConfig, setSortConfig] = useState<{ key: keyof MonitoringData, direction: 'asc' | 'desc' } | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const colSpanNum = 11;

  const handleStartDateButtonClick = () => {
    if (startDatePickerRef.current) {
      // startDatePickerRef.current.setOpen(true);
      startDatePickerRef.current.setFocus();
    }
  };

  const handleEndDateButtonClick = () => {
    if (endDatePickerRef.current) {
      endDatePickerRef.current.setFocus();
    }
  };

  const clearSelectedValuesForRetailer = () => {
    if (retailerMultiselectRef.current) {
      retailerMultiselectRef.current.resetSelectedValues();
    }
  };
  const clearSelectedValuesForDivision = () => {
    if (divisionMultiselectRef.current) {
      divisionMultiselectRef.current.resetSelectedValues();
    }
  };
  const clearSelectedValuesForMarket = () => {
    if (marketMultiselectRef.current) {
      marketMultiselectRef.current.resetSelectedValues();
    }
  };

  const dateTimeFormatChange = (dateString: string, format: string) => {
    return moment(dateString).format(format);
  };

  const handleSelectAndRemoveForMarket = (selectedList: Array<{ name: string, value: string }>) => {
    setDivisionSelectedValues(selectedList);
    const formattedList = selectedList.map(item => item.value);
    setMonitoring({ ...monitoring, market: formattedList });
  };

  const handleSelectAndRemoveForDivision = (selectedList: Array<{ name: string, value: string }>) => {
    setMarketSelectedValues(selectedList);
    const formattedList = selectedList.map(item => item.value);
    setMonitoring({ ...monitoring, division: formattedList });
  };

  const handleSelectAndRemoveForRetailer = (selectedList: Array<{ name: string, value: string }>) => {
    setRetailerSelectedValues(selectedList);
    const formattedList = selectedList.map(item => item.value);
    setMonitoring({ ...monitoring, retailer: formattedList });
  };

  const handleSelectStartDate = (date: Date) => {
    setStartDate(date);
    const formattedStartDate = moment(date).format('D-M-YYYY');
    setMonitoring({ ...monitoring, start_date: formattedStartDate });
  };

  const handleSelectEndDate = (date: Date) => {
    setEndDate(date);
    const formattedStartDate = moment(date).format('D-M-YYYY');
    setMonitoring({ ...monitoring, end_date: formattedStartDate });
  };

  const handleSort = (key: keyof MonitoringData) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    if (sortOrder === key) {
      setReverseSort(!reverseSort);
    }
    const sortedData = [...monitorData].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    
    setSortOrder(key);
    setMonitorData(sortedData);
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    search();
    if (!initDataFlag) {
      const loadData = async () => {
        try {
          const res1 = await MonitoringService.getMonitoringDataById();
          const res2 = await MonitoringService.getDataById();
          if (res1.data.length > 0) {
            const filteredData = res1.data.filter((s: MonitoringData) => s.Market != null && s.Retailer && s.Division);
            setMonitorInitData(filteredData);
            refreshData(currentPage, pageSize, filteredData);
            setCollectionSize(filteredData.length);
          }
          if (res2.data) {
            sessionStorage.setItem('dropdown', JSON.stringify(res2));
            let convertedArray = res2.data.division.map(item => ({ name: item, value: item }));
            setDivision(convertedArray);
            convertedArray = res2.data.retailer.map(item => ({ name: item, value: item }));
            setRetailer(convertedArray);
            convertedArray = res2.data.market.map(item => ({ name: item, value: item }));
            setMarket(convertedArray);
          }
          setShowLoader(false);
        } catch (error) {
          console.error('loadData : Error fetching data:', error);
          setShowLoader(false);
        }
      };
      loadData();
      setInitDataFlag(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  const refreshData = (startPageNumber, itemsPerPage, filteredData) => {
    const offset = startPageNumber * itemsPerPage;
    setMonitorBeforeRefreshData(filteredData);
    setMonitorData(
      filteredData.slice(offset, offset + itemsPerPage)
    );
  };

  const onSubmit = async () => {
    setShowLoader(true);
    try {
      const res = await MonitoringService.postMonitoringDataById(monitoring);
      const filteredData = res.data.filter((s: MonitoringData) => s.Market != null && s.Retailer && s.Division);
      setMonitorData(filteredData);
      refreshData(0, pageSize, filteredData);
      setCurrentPage(0);
      setCollectionSize(filteredData.length);
      setShowLoader(false);
    } catch (error) {
      console.error('fetchData : Error fetching data:', error);
      setShowLoader(false);
    }
  };

  const onReset = async () => {
    setStartDate(null);
    setEndDate(null);
    clearSelectedValuesForRetailer();
    clearSelectedValuesForDivision();
    clearSelectedValuesForMarket();
    refreshData(0, pageSize, monitorInitData);
    setCollectionSize(monitorInitData.length);
    setSearchText('');
  };

  const search = () => {
    const filteredData = monitorInitData.filter((res) => {
      return (
        res.Market.toLowerCase().includes(searchText.toLowerCase()) ||
        res.Retailer.toLowerCase().includes(searchText.toLowerCase()) ||
        res.Division.toLowerCase().includes(searchText.toLowerCase()) ||
        res.UploadDate.toString().includes(searchText) ||
        res.IncidentNo.toLowerCase().includes(searchText.toLowerCase()) ||
        res.Status.toLowerCase().includes(searchText.toLowerCase())
      );
    });
    refreshData(0, pageSize, filteredData);
    setCurrentPage(0);
    setCollectionSize(filteredData.length);
  };

  const trimString = (text: string, length: number) => {
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  const onDisable = (): boolean => {
    if (!startDate && !endDate) {
      return false;
    } else if (startDate && endDate) {
      return false;
    } else if (startDate && !endDate) {
      return true;
    } else if (endDate && !startDate) {
      return true;
    } else {
      return false;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePageSizeChange = (event: any) => {
    const totalDataAmount = monitorBeforeRefreshData.length;
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
    refreshData(curPage, Number(event.target.value), monitorBeforeRefreshData);
  };

  const handlePageChange = (event: { selected: number }) => {
    setCurrentPage(event.selected);
    refreshData(event.selected, pageSize, monitorBeforeRefreshData);
  };

  const toggleShowMore = (id: number) => {
    setMonitorData(monitorData.map(item => 
      item.Id === id ? { ...item, showMore: !item.showMore } : item
    ));
  };

  return (
    <div>
      {showLoader ?
        (
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
          <div className="row mw-100 container-fluid d-flex justify-content-center mt-3">
            <div className="container-fluid mt-3 w-100">
              <div className="row d-flex justify-content-center">
                <div data-testid="fileMonitor" className="col-8 col-sm">
                  <h5>File Monitor</h5>
                </div>
                <div className="col-4 col-sm-auto">
                  <input
                    id="table-filtering-search"
                    name="search"
                    className="form-control"
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search"
                  />
                </div>
              </div>
            </div>
            <div className="container-fluid mt-3 w-100">
              <div className="card">
                <form ref={formRef}>
                  <div className="row form-group d-flex justify-content-center">
                    <div className="col-4 col-md">
                      <label htmlFor="market" className="form-label">
                        Market
                      </label>
                      <Multiselect
                        ref={marketMultiselectRef}
                        options={market} // Options to display in the dropdown
                        selectedValues={divisionSelectedValues} // Preselected value to persist in dropdown
                        onSelect={handleSelectAndRemoveForMarket} // Function will trigger on select event
                        onRemove={handleSelectAndRemoveForMarket} // Function will trigger on remove event
                        displayValue="name" // Property name to display in the dropdown options
                      />
                    </div>

                    <div className="col-4 col-md">
                      <label htmlFor="division" className="form-label">
                        Division
                      </label>
                      <Multiselect
                        ref={divisionMultiselectRef}
                        options={division} // Add your options here
                        selectedValues={marketSelectedValues}
                        onSelect={handleSelectAndRemoveForDivision}
                        onRemove={handleSelectAndRemoveForDivision}
                        displayValue="name" // Property name of your options to display
                      />
                    </div>

                    <div className="col-4 col-md">
                      <label htmlFor="retailer" className="form-label">
                        Retailer
                      </label>
                      <Multiselect
                        ref={retailerMultiselectRef}
                        options={retailer} // Add your options here
                        selectedValues={retailerSelectedValues}
                        onSelect={handleSelectAndRemoveForRetailer}
                        onRemove={handleSelectAndRemoveForRetailer}
                        displayValue="name" // Property name of your options to display
                      />
                    </div>

                    <div className="col-4 col-md">
                      <div className="row">
                        <div data-testid="startDate" className="col">
                          <label htmlFor="start_date" className="form-label">
                            Start Date
                            <span className="text-danger">
                            </span>
                          </label>
                        </div>
                        <div data-testid="startDateInput" className="input-group">
                          <DatePicker
                            ref={startDatePickerRef}
                            selected={startDate}
                            onChange={handleSelectStartDate}
                            dateFormat="dd-MM-yyyy"
                            className="form-control"
                            placeholderText="DD-MM-YYYY"
                            maxDate={new Date()}
                          // readOnly
                          />
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={handleStartDateButtonClick}
                          >
                            <FontAwesomeIcon icon={faCalendar} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="col-4 col-md">
                      <div className="row">
                        <div data-testid="endDate" className="col">
                          <label className="form-label">
                            End Date
                            <span className="text-danger">
                            </span>
                          </label>
                        </div>
                        <div className="input-group">
                          <DatePicker
                            ref={endDatePickerRef}
                            selected={endDate}
                            onChange={handleSelectEndDate}
                            dateFormat="dd-MM-yyyy"
                            className="form-control"
                            placeholderText="DD-MM-YYYY"
                            maxDate={new Date()}
                            minDate={startDate}
                            // readOnly={true}
                            disabled={!startDate}
                          />
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={handleEndDateButtonClick}
                          >
                            <FontAwesomeIcon icon={faCalendar} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-auto col-lg-auto btn-toolbar buttn d-flex justify-content-lg-start align-self-center">
                      <div>
                        <div role="group" className="btn-group-sm">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={onSubmit}
                            disabled={onDisable()}
                          >
                            Search
                          </button>
                        </div>
                      </div>
                      <div>
                        <div data-testid="reset" role="group" className="btn-group-sm ms-2">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onReset}
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="file-monitor-table-responsive mt-3">
              <table className="table table-bordered table-hover">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col" onClick={() => handleSort("Id")}>
                      Id
                      {sortOrder === "Id" && (
                        <FontAwesomeIcon
                          icon={reverseSort ? faSortUp : faSortDown}
                        />
                      )}
                    </th>
                    <th data-testid="market" scope="col" onClick={() => handleSort("Market")}>
                      Market
                      {sortOrder === "Market" && (
                        <FontAwesomeIcon
                          icon={reverseSort ? faSortUp : faSortDown}
                        />
                      )}
                    </th>
                    <th data-testid="retailer" scope="col" onClick={() => handleSort("Retailer")}>
                      Retailer
                      {sortOrder === "Retailer" && (
                        <FontAwesomeIcon
                          icon={reverseSort ? faSortUp : faSortDown}
                        />
                      )}
                    </th>
                    <th data-testid="division" scope="col" onClick={() => handleSort("Division")}>
                      Division
                      {sortOrder === "Division" && (
                        <FontAwesomeIcon
                          icon={reverseSort ? faSortUp : faSortDown}
                        />
                      )}
                    </th>
                    <th scope="col" onClick={() => handleSort("UploadDate")}>
                      Upload Date
                      {sortOrder === "UploadDate" && (
                        <FontAwesomeIcon
                          icon={reverseSort ? faSortUp : faSortDown}
                        />
                      )}
                    </th>
                    <th scope="col" onClick={() => handleSort("ProcessDate")}>
                      Process Date
                      {sortOrder === "ProcessDate" && (
                        <FontAwesomeIcon
                          icon={reverseSort ? faSortUp : faSortDown}
                        />
                      )}
                    </th>
                    <th scope="col" onClick={() => handleSort("UploadChannel")}>
                      Upload Channel
                      {sortOrder === "UploadChannel" && (
                        <FontAwesomeIcon
                          icon={reverseSort ? faSortUp : faSortDown}
                        />
                      )}
                    </th>
                    <th scope="col" onClick={() => handleSort("username")}>
                      User Name
                      {sortOrder === "username" && (
                        <FontAwesomeIcon
                          icon={reverseSort ? faSortUp : faSortDown}
                        />
                      )}
                    </th>
                    <th scope="col" onClick={() => handleSort("FilesName")}>
                      File Name
                      {sortOrder === "FilesName" && (
                        <FontAwesomeIcon
                          icon={reverseSort ? faSortUp : faSortDown}
                        />
                      )}
                    </th>
                    <th scope="col" onClick={() => handleSort("FailureReason")}>
                      Comments
                      {sortOrder === "FailureReason" && (
                        <FontAwesomeIcon
                          icon={reverseSort ? faSortUp : faSortDown}
                        />
                      )}
                    </th>
                    <th scope="col" onClick={() => handleSort("Status")}>
                      Status
                      {sortOrder === "Status" && (
                        <FontAwesomeIcon
                          icon={reverseSort ? faSortUp : faSortDown}
                        />
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {monitorData.map((data, index) => (
                    <tr key={index}>
                      <td>{data.Id}</td>
                      <td>{data.Market}</td>
                      <td>{data.Retailer}</td>
                      <td>{data.Division}</td>
                      <td>
                        {dateTimeFormatChange(data.TimeStamp.toString(), 'yyyy-MM-DD hh:ss')}
                      </td>
                      <td>
                        {dateTimeFormatChange(data.ProcessDate.toString(), "MM/DD/YYYY")}
                      </td>
                      <td>{data.UploadChannel}</td>
                      <td>{data.username}</td>
                      <td>{data.FilesName}</td>
                      <td>
                        {trimString(data.FailureReason, 30)}
                        {data.FailureReason.length > 30 && (
                          <div onClick={() => toggleShowMore(data.Id)}>
                            <span className="seeMore">
                              {data.showMore ? 'Less' : 'More'}
                            </span>
                          </div>
                        )}
                        {data.showMore && (
                          <div className="overlay">
                            <div className="popupBox">
                              <div className="popupContent">
                                <h2>Failure Reason</h2>
                                <p>{data.FailureReason}</p>
                                <button onClick={() => toggleShowMore(data.Id)}>Close</button>
                              </div>
                            </div>
                          </div>
                        )}
                      </td>
                      <td>{data.Status === 'FILE RECEIVED' && (
                        <span className="badge bg-warning" aria-disabled>
                          IN PROGRESS</span>)}
                        {data.Status === 'FILE UPLOADED' && (
                          <span className="badge bg-warning" aria-disabled>
                            IN PROGRESS</span>)}
                        {data.Status === 'SUCCESS' && (
                          <span className="badge bg-success" aria-disabled>
                            {data.Status}</span>)}
                        {(data.Status === 'FAILURE' || data.Status === 'FAILED' || data.Status === 'DELETED') && (
                          <span className="badge bg-danger" aria-disabled>
                            {data.Status}</span>)}
                        {data.Status === 'IN PROGRESS' && (
                          <span className="badge bg-warning" aria-disabled>
                            {data.Status}</span>)}</td>
                    </tr>
                  ))}
                  {monitorData.length === 0 && (
                    <tr>
                      <td colSpan={colSpanNum} className="text-center">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="row">
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
        )}
    </div>
  );
};
export default FileMonitor;