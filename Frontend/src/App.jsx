import React,{useState} from "react"
import Signupin from './Signupin'
import Home from './home.jsx'
import Public from "./Public.jsx"
import { BrowserRouter,Routes,Route} from "react-router-dom"
import ManagerPanel from "./ManagerPanel.jsx"
import Rooms from "./Rooms.jsx"
import RoomInfo from "./RoomInfo.jsx"
import List from "./List.jsx"
import MyBookings from "../components/Mybookings/MyBookings.jsx"

function App(){

      return(
         <BrowserRouter>
            <Routes>
            <Route path='/' element={ <Home /> }></Route> 
            <Route path='/signup' element={ <Signupin /> }></Route>
            <Route path='/managerPanel' element={ <ManagerPanel /> }></Route>
            <Route path='/public' element={ <Public /> }></Route> 
            <Route path='/rooms' element={ <Rooms /> }></Route> 
            <Route path='/roominfo' element={ <RoomInfo /> }></Route> 
            <Route path='/list' element={ <List /> }></Route> 
            <Route path="/my-bookings" element={<MyBookings />} />
            </Routes>
         </BrowserRouter> 
      )
 }

 export default App;