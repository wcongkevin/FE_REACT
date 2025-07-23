import React, { useState, useEffect } from 'react';
import ReactPaginate from "react-paginate";
import { BallTriangle } from "react-loader-spinner";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import HelpService from '../../services/HelpService';
import { Distributor } from "../../model/Distributor";
import './ContactList.css';

const ContactList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(12);
  const [collectionSize, setCollectionSize] = useState<number>(1);
  const [dataInit, setDataInit] = useState<Distributor[]>([]);
  const [dataBeforeRefresh, setDataBeforeRefresh] = useState<Distributor[]>([]);
  const [distData, setDistData] = useState<Distributor[]>([]);
  const [sortOrder, setSortOrder] = useState('id');
  const [reverseSort, setReverseSort] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [initDataFlag, setInitDataFlag] = useState(false);
  
  const [sortConfig, setSortConfig] = useState<{ key: keyof Distributor, direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    handleSearch();
    if (!initDataFlag) {
      const loadData = async () => {
        try {
          const response = await HelpService.getDistributorList(searchText);
          if (response.data.length !== 0) {
            setDataInit(response.data);
            setCollectionSize(response.data.length);
            refreshData(currentPage, pageSize, response.data);
          } else {
            setError(true);
          }
        } catch (error) {
          console.error('loadData : Error fetching data:', error);
          setError(true);
        } finally {
          setLoading(false);
        }
      };
      loadData();
      setInitDataFlag(true);
    }
  }, [searchText]);

  const refreshData = (startPageNumber, itemsPerPage, filteredData) => {
    const offset = startPageNumber * itemsPerPage;
    setDataBeforeRefresh(filteredData);
    setDistData(
      filteredData.slice(offset, offset + itemsPerPage)
    );
  };


  const handleSearch = () => {
    const filteredData = dataInit.filter((res) => {
      return (
        res.name.toLowerCase().includes(searchText.toLowerCase()) ||
        res.email.toLowerCase().includes(searchText.toLowerCase()) ||
        res.market.toLowerCase().includes(searchText.toLowerCase())
      );
    });
    refreshData(0, pageSize, filteredData);
    setCurrentPage(0);
    setCollectionSize(filteredData.length);
  };

  const handleSort = (key: keyof Distributor) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    if (sortOrder === key) {
      setReverseSort(!reverseSort);
    }
    const sortedData = [...distData].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setSortOrder(key);
    setDistData(sortedData);
    setSortConfig({ key, direction });
  };

  const handlePageChange = (event: { selected: number }) => {
    setCurrentPage(event.selected);
    refreshData(event.selected, pageSize, dataBeforeRefresh);
  };

  const handlePageSizeChange = (event: any) => {
    const totalDataAmount = dataBeforeRefresh.length;
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
    refreshData(curPage, Number(event.target.value), dataBeforeRefresh);
  };

  return (
    <div className="row mw-100 container-fluid d-flex justify-content-center mt-3 ">
      {loading ? (
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
      ) : error ? (
        <div className="text-center text-danger">Error in processing data</div>
      ) : (
        <div className="row mw-100 d-flex justify-content-center">
          <div className="container-fluid mt-3 w-100">
            <div className="row d-flex justify-content-center">
              <div className="col-8 col-sm">
                <h5>Contact List</h5>
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

          <div className="container-fluid w-100">
            <div className="card">
              <div className="row d-flex justify-content-center">
                <div className="table-responsive">
                  <table className="table table-hover table-striped mw-100">
                    <thead className="thead-dark">
                      <tr>
                        <th scope="col" onClick={() => handleSort("id")}>
                          Id
                          {sortOrder === "id" && (
                            <FontAwesomeIcon
                              icon={reverseSort ? faSortUp : faSortDown}
                            />
                          )}
                        </th>
                        <th scope="col" onClick={() => handleSort("name")}>
                          Name
                          {sortOrder === "name" && (
                            <FontAwesomeIcon
                              icon={reverseSort ? faSortUp : faSortDown}
                            />
                          )}
                        </th>
                        <th scope="col" onClick={() => handleSort("email")}>
                          Email
                          {sortOrder === "email" && (
                            <FontAwesomeIcon
                              icon={reverseSort ? faSortUp : faSortDown}
                            />
                          )}
                        </th>
                        <th scope="col" onClick={() => handleSort("market")}>
                          Market
                          {sortOrder === "market" && (
                            <FontAwesomeIcon
                              icon={reverseSort ? faSortUp : faSortDown}
                            />
                          )}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {distData.length > 0 ? (
                        distData.map((distributor, index) => (
                          <tr key={index}>
                            <td scope="row">{distributor.id}</td>
                            <td>{distributor.name}</td>
                            <td>{distributor.email}</td>
                            <td>{distributor.market}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center">
                            No Records Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
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
                    pageRangeDisplayed={3}
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
          </div>
        </div>
      )}
    </div>
  );
};
export default ContactList;