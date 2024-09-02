import "./List.css";
// import Navbar from "../../components/navbar/Navbar";
// import Header from "../../components/header/Header";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from "./components/Search/SearchItem";

const List = () => {
  const location = useLocation();
  // Provide default values to avoid errors
  const { destination = 'mumbai', date = [{ startDate: new Date(), endDate: new Date() }], options = {} } = location.state || {};
  
  const [searchDestination, setSearchDestination] = useState(destination);
  const [searchDate, setSearchDate] = useState(date);
  const [openDate, setOpenDate] = useState(false);
  const [searchOptions, setSearchOptions] = useState(options);

  return (
    <div>
      {/* <Navbar />
      <Header type="list" /> */}
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>
            <div className="lsItem">
              <label htmlFor="destination">Destination</label>
              <input
                id="destination"
                placeholder={searchDestination}
                type="text"
                onChange={(e) => setSearchDestination(e.target.value)}
              />
            </div>
            <div className="lsItem">
              <label htmlFor="date">Check-in Date</label>
              <span onClick={() => setOpenDate(!openDate)}>
                {`${format(searchDate[0].startDate, "MM/dd/yyyy")} to ${format(searchDate[0].endDate, "MM/dd/yyyy")}`}
              </span>
              {openDate && (
                <DateRange
                  onChange={(item) => setSearchDate([item.selection])}
                  minDate={new Date()}
                  ranges={searchDate}
                />
              )}
            </div>
            <div className="lsItem">
              <label htmlFor="options">Options</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Min price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    className="lsOptionInput"
                    placeholder="Min price"
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Max price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    className="lsOptionInput"
                    placeholder="Max price"
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Adult</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={searchOptions.adult || '1'}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Children</span>
                  <input
                    type="number"
                    min={0}
                    className="lsOptionInput"
                    placeholder={searchOptions.children || '0'}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Room</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={searchOptions.room || '1'}
                  />
                </div>
              </div>
            </div>
            <button>Search</button>
          </div>
          <div className="listResult">
            {[...Array(9).keys()].map((i) => (
              <SearchItem key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
