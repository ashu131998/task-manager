import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import HomeIcon from '../../assets/images/home.svg'
import CalendarIcon from '../../assets/images/calendar.svg'
import NotificationIcon from '../../assets/images/notification.svg'
import SearchIcon from '../../assets/images/search.svg'
import HomeSelectedIcon from '../../assets/images/home-sel.svg'
import CalendarSelectedIcon from '../../assets/images/calendar-sel.svg'
// import { baseUrl } from '../../service/apiService'
import "toastr/build/toastr.min.css";
import toastr from "toastr";
import apiServiceHandler from '../../services/apiService';

const Footer = (props) => {
    const {selectedTab, setSelectedTab} = props;
    return (

        <div>

            <footer className="bg-light text-center text-white">

                <div className=" footer  pb-0">

                    <section style={{ display: "flex" }}>
                        <div className="col-sm-6">
                            <div
                                className="cursor-pointer btn-floating m-1"
                                onClick={()=>setSelectedTab("home")}
                            ><img height={"46px"} width={"46px"} style={{ height: "38px", width: "38px" }} src={
                                selectedTab =="home"?HomeSelectedIcon:
                                HomeIcon} alt='home' /></div>
                        </div>
                        <div className="col-sm-6">
                            <div
                                className="cursor-pointer btn-floating m-1"
                                onClick={()=>setSelectedTab("calendar")}
                            ><img height={"46px"} width={"46px"} style={{ height: "38px", width: "38px" }} src={
                                selectedTab =="calendar"?CalendarSelectedIcon:
                                CalendarIcon} alt='calendar' /></div>
                        </div>
                    </section>

                </div>
            </footer>

        </div>
    )
}

export default Footer






