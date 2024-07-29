import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.css'
// import { baseUrl } from '../../service/apiService'
import "toastr/build/toastr.min.css";
import AddNewTask from './addNewTask';
import Select from "react-select";
import apiServiceHandler from '../../services/apiService';
import toastr from 'toastr';

const Calendar = (props) => {
    const [isOpen, setIsOpen] = useState(false)
    const { selectedTab, toggleDropdown, dropdownStates } = props;
    const [tasks, setTasks] = useState()
    const [refresh, setRefresh] = useState(false)
    const [currentStatus, setCurrentStatus] = useState("alltask");
    const [currentDate, setCurrentDate] = useState(new Date()); // Start with October 2020
    const [selectedDay, setSelectedDay] = useState(4);
    const [days, setDays] = useState([]);
    const [monthChange, setMonthChange] = useState(true);

    useEffect(() => { getTasks(); }, [currentDate])
    useEffect(() => {
        if (refresh == true) getTasks();
    }, [refresh])
    useEffect(() => { if (selectedTab == "calendar") getTasks() }, [selectedTab])

    const onClose = () => {
        setIsOpen(false)
        getTasks()
    }
    const options = [
        { value: "In-progress", label: "In-progress" },
        { value: "Completed", label: "Completed" },
    ];

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    let loginDetails = localStorage.getItem('responseData')
    loginDetails = JSON.parse(loginDetails)

    const getTasks = async () => {
        let payload = {
            created_on: `${currentDate.getFullYear()}, ${currentDate.getMonth()}, ${currentDate.getDate()}`
        }
        setRefresh(false)
        try {
            const response = await apiServiceHandler("POST", "api/task/by_date", payload);
            console.log(response)
            setTasks(response?.data);
        } catch (err) {
            toastr.error(err?.response?.data?.message);
            console.log(err);
        }
    };

    const handleDelete = async (task) => {
        let payload = {
            task_id: task._id
        }
        try {
            const response = await apiServiceHandler("POST", "api/task/delete", payload);
            getTasks()
        } catch (err) {
            toastr.error(err?.response?.data?.message);
            console.log(err);
        }
    };
    useEffect(() => {
        if (monthChange == true)
            generateCalendar();
    }, [monthChange]);

    const generateCalendar = () => {
        setMonthChange(false)
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const lastDay = new Date(year, month + 1, 0).getDate();

        const newDays = [];
        for (let i = 0; i < firstDay; i++) {
            console.log(firstDay)
            newDays.push(null); // Add empty slots for days before the 1st
        }
        for (let i = 1; i <= lastDay; i++) {
            newDays.push(i);
        }

        setDays(newDays);
    };

    const handleDayClick = (day) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
        console.log(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))
        if (day) setSelectedDay(day);
        console.log(currentDate.getFullYear(), currentDate.getMonth(), day)
    };

    const changeMonth = (increment) => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() + increment);
            return newDate;
        });
        setMonthChange(true)
    };

    return (<>
        {selectedTab == "calendar" ? <div className="bg-for-dashboard">
            <div className="bg-box">
                <div className="bg-box-white">
                    <div className="calender-bg" style={{ paddingTop: "40px" }}>
                        <header style={{ display: "block" }}>
                            <div style={{ display: "flex" }}> <button className="btn btn-light btn month-nav" onClick={() => changeMonth(-1)}>←</button>
                                <h1 style={{ width: "900px" }}>{`${months[currentDate.getMonth()]}, ${currentDate.getFullYear()}`}</h1>
                                <button className="btn btn-light month-nav" onClick={() => changeMonth(1)}>→</button>
                            </div>
                            <div className="date-picker">
                                <div className="weekdays">
                                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, index) => (
                                        <div key={index}>{day}</div>
                                    ))}
                                </div>
                                <div className="days">
                                    {days.map((day, index) => (
                                        <div
                                            key={index}
                                            className={day === selectedDay ? 'cursor-pointer active' : 'cursor-pointer'}
                                            onClick={() => handleDayClick(day)}
                                        >
                                            {day}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button className="add-task-button" onClick={() => setIsOpen(true)}>+ Add Task</button>
                        </header>
                    </div>

                    <div className="tasks-section">
                        <h2>Tasks</h2>
                        <Select
                            options={options}
                            name="status"
                            value={currentStatus}
                            onChange={(val) => setCurrentStatus(val)}
                            placeholder="Status..."
                        />

                        {tasks?.map((task) => {
                            return currentStatus == "alltask" || task?.status?.value == currentStatus["value"] ? (<div className="progress-items mt-3">
                                <div className="progress-item">
                                    <div className="progress-icon">
                                        <svg width="18" height="23" viewBox="0 0 25 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.10794 0.0729386C4.76052 0.194431 4.45722 0.403483 4.27654 0.645941C3.99787 1.01991 3.93812 1.33041 3.93812 2.40451V3.39151L2.61007 3.3921C1.34725 3.39263 1.26651 3.39942 0.966024 3.53065C0.792283 3.60648 0.547733 3.78078 0.422615 3.91786C0.0419467 4.33485 0.000823774 4.53529 0.000823774 5.97275C0.000823774 7.16986 0.008386 7.25273 0.13038 7.39819C0.309496 7.61176 0.629604 7.61176 0.80872 7.39819C0.930401 7.25314 0.938276 7.16933 0.938276 6.01799C0.938276 4.2228 0.889591 4.27062 2.71631 4.27062H3.93812V4.69951C3.93812 5.51585 4.26667 6.08059 4.90332 6.35856C5.50429 6.621 6.30963 6.509 6.77192 6.09864C7.10559 5.80249 7.26583 5.41199 7.29951 4.81274L7.33001 4.27062H9.07136H10.8128V4.69951C10.8128 5.2578 10.9423 5.65117 11.2297 5.96613C12.0178 6.82953 13.5583 6.61356 14.0382 5.57246C14.0935 5.45237 14.1533 5.11187 14.1715 4.81274L14.2047 4.27062H15.9375H17.6704L17.7035 4.81274C17.7217 5.11187 17.7815 5.45237 17.8368 5.57246C18.3167 6.61356 19.8572 6.82953 20.6453 5.96613C20.9328 5.65117 21.0622 5.2578 21.0622 4.69951V4.27062H22.2841C23.2539 4.27062 23.5436 4.28896 23.6892 4.35953C24.0881 4.55299 24.0621 3.87555 24.0621 14.0742V23.3561L24.2067 23.4836C24.3989 23.6528 24.6895 23.6492 24.8637 23.4754L24.9995 23.3397V14.0207C24.9995 3.66796 25.0307 4.41403 24.5778 3.91786C24.4526 3.78078 24.2081 3.60648 24.0343 3.53065C23.734 3.39948 23.6529 3.39263 22.3952 3.3921L21.072 3.39151L21.0515 2.29263C21.0286 1.06744 20.9716 0.854055 20.5651 0.472874C20.21 0.139809 19.9035 0.0242946 19.3748 0.0242946C18.8462 0.0242946 18.5397 0.139809 18.1845 0.472874C17.778 0.854055 17.721 1.06744 17.6982 2.29263L17.6777 3.39151H15.9375H14.1973L14.1768 2.29263C14.154 1.06744 14.097 0.854055 13.6905 0.472874C13.3353 0.139809 13.0288 0.0242946 12.5002 0.0242946C11.9715 0.0242946 11.665 0.139809 11.3099 0.472874C10.9034 0.854055 10.8464 1.06744 10.8235 2.29263L10.803 3.39151H9.06286H7.3227L7.3022 2.29263C7.27933 1.06744 7.22233 0.854055 6.81585 0.472874C6.37969 0.0638545 5.63347 -0.110912 5.10794 0.0729386ZM5.93615 0.946362C6.02102 0.986683 6.15463 1.10888 6.23301 1.21789C6.37369 1.4137 6.3755 1.43913 6.3755 3.22624C6.3755 5.18507 6.35494 5.32672 6.04251 5.51872C5.81384 5.6592 5.37092 5.64883 5.16675 5.49821C4.89101 5.29484 4.86639 5.08485 4.88732 3.11776L4.90682 1.29091L5.06307 1.13338C5.32155 0.872692 5.63804 0.804884 5.93615 0.946362ZM12.8108 0.946362C12.8957 0.986683 13.0293 1.10888 13.1077 1.21789C13.2483 1.4137 13.2501 1.43913 13.2501 3.22624C13.2501 5.18507 13.2296 5.32672 12.9172 5.51872C12.711 5.64537 12.2598 5.64765 12.07 5.523C11.7725 5.3276 11.7502 5.16784 11.7502 3.22624C11.7502 1.43913 11.752 1.4137 11.8927 1.21789C12.1265 0.892619 12.4782 0.788591 12.8108 0.946362ZM19.6854 0.946362C19.7703 0.986683 19.9039 1.10888 19.9823 1.21789C20.123 1.4137 20.1248 1.43913 20.1248 3.22624C20.1248 5.16784 20.1025 5.3276 19.805 5.523C19.6152 5.64765 19.164 5.64537 18.9579 5.51872C18.6454 5.32672 18.6249 5.18507 18.6249 3.22624C18.6249 1.43913 18.6267 1.4137 18.7674 1.21789C19.0012 0.892619 19.3529 0.788591 19.6854 0.946362ZM0.270497 8.78249C0.195439 8.81156 0.104006 8.88787 0.0673828 8.95205C0.0210727 9.03327 0.000823774 12.0495 0.000823774 18.8788C0.000823774 29.9536 -0.042424 29.0265 0.497798 29.5331C1.03908 30.0407 -0.0303615 29.9992 12.5002 29.9992C25.0307 29.9992 23.9613 30.0407 24.5026 29.5331C24.9781 29.0871 24.9995 28.974 24.9995 26.908C24.9995 25.8584 24.9744 25.083 24.9384 25.0199C24.7938 24.7666 24.2095 24.7843 24.1027 25.0452C24.0803 25.0997 24.0621 25.9215 24.0621 26.8714C24.0621 28.3004 24.0457 28.6281 23.9673 28.7704C23.7604 29.1455 24.5948 29.1201 12.5002 29.1201C2.78506 29.1201 1.47306 29.1096 1.31119 29.0312C0.911715 28.8374 0.938276 29.5656 0.938276 18.8146C0.938276 9.58196 0.932089 9.02396 0.828906 8.90955C0.697976 8.76444 0.458175 8.70988 0.270497 8.78249ZM7.84255 8.83952C7.77293 8.86566 7.14308 9.53683 6.44287 10.331C5.74272 11.125 5.15487 11.7607 5.13662 11.7436C5.11837 11.7265 4.96076 11.5084 4.78639 11.2589C4.49516 10.8422 4.45053 10.8039 4.23854 10.7873C3.95868 10.7655 3.75063 10.9299 3.75063 11.1727C3.75063 11.2728 3.9455 11.6341 4.25867 12.1148C4.8107 12.9621 4.95107 13.077 5.25937 12.9338C5.40042 12.8682 6.34925 11.8333 8.04354 9.89691C8.50958 9.36429 8.5652 9.20904 8.36433 9.00151C8.19528 8.82674 8.0206 8.77253 7.84255 8.83952ZM9.99994 10.4791C8.68782 10.8534 8.49945 12.4661 9.70214 13.0281L10.0249 13.1789H15.2394C19.1662 13.1789 20.5176 13.1612 20.7113 13.1073C21.0495 13.0131 21.5103 12.5809 21.6108 12.2637C21.789 11.7012 21.595 11.0567 21.1524 10.7402C20.7051 10.4202 20.7758 10.424 15.2557 10.4294C12.4512 10.4322 10.0861 10.4546 9.99994 10.4791ZM20.457 11.3716C20.7871 11.5366 20.8543 11.9141 20.5963 12.1559L20.443 12.2998H15.2897H10.1364L9.96906 12.1133C9.83926 11.9686 9.81007 11.8878 9.83888 11.7526C9.88288 11.5465 9.97988 11.4256 10.1544 11.3593C10.3654 11.279 20.2956 11.2911 20.457 11.3716ZM7.84255 14.6416C7.77293 14.6678 7.14308 15.3389 6.44287 16.1331C5.74272 16.9271 5.15487 17.5628 5.13662 17.5457C5.11837 17.5286 4.96076 17.3105 4.78639 17.0611C4.49516 16.6444 4.45053 16.606 4.23854 16.5894C3.95868 16.5676 3.75063 16.732 3.75063 16.9748C3.75063 17.0749 3.9455 17.4362 4.25867 17.9169C4.81108 18.7648 4.95051 18.8788 5.26093 18.7359C5.39692 18.6733 6.54768 17.4142 8.19847 15.5218C8.50939 15.1654 8.54889 14.9943 8.36433 14.8036C8.19528 14.6289 8.0206 14.5746 7.84255 14.6416ZM10.1566 16.2656C9.61608 16.383 9.26648 16.6131 9.06667 16.9828C8.69244 17.6755 8.99111 18.5368 9.71658 18.8565C9.99756 18.9804 10.0248 18.981 15.2962 18.9797C20.3233 18.9785 20.6063 18.9729 20.8435 18.8697C21.3656 18.6425 21.6883 18.1639 21.6858 17.6203C21.6835 17.0897 21.3946 16.6565 20.867 16.3926L20.5935 16.2558L15.4375 16.2471C12.6017 16.2424 10.2253 16.2506 10.1566 16.2656ZM20.599 17.2994C20.796 17.5142 20.795 17.7718 20.5963 17.958L20.443 18.1019H15.2841C10.2308 18.1019 10.1228 18.0996 10.0019 17.9862C9.83813 17.8326 9.7912 17.6353 9.87138 17.4377C10.008 17.1007 9.88244 17.1079 15.3961 17.122L20.4482 17.1349L20.599 17.2994ZM7.8248 20.4862C7.7798 20.5031 7.17796 21.1537 6.48737 21.9321C5.79678 22.7104 5.21218 23.3683 5.18818 23.394C5.16425 23.4197 5.00794 23.2302 4.84089 22.9729C4.4536 22.3766 4.23554 22.2655 3.91531 22.5017C3.64395 22.7019 3.69289 22.896 4.21648 23.6964C4.76727 24.5383 4.85283 24.6221 5.13531 24.5968C5.32493 24.5798 5.48498 24.4207 6.8636 22.8784C7.69918 21.9436 8.41002 21.116 8.4432 21.0392C8.59013 20.6994 8.1959 20.3469 7.8248 20.4862ZM9.71908 22.2062C9.1806 22.4524 8.82094 23.0839 8.90818 23.6297C8.99843 24.1941 9.47565 24.6628 10.0799 24.7804C10.3106 24.8253 11.9686 24.8401 15.5028 24.8287L20.5935 24.8124L20.867 24.6756C21.3946 24.4117 21.6835 23.9785 21.6858 23.4479C21.6883 22.9043 21.3656 22.4257 20.8435 22.1986C20.6061 22.0952 20.3259 22.0898 15.2813 22.0908C10.1422 22.0918 9.96094 22.0956 9.71908 22.2062ZM20.5963 23.1102C20.795 23.2964 20.796 23.554 20.599 23.7689L20.4482 23.9333L15.4123 23.949C11.0979 23.9625 10.345 23.9523 10.1567 23.8786C9.79607 23.7373 9.72008 23.3463 10.0019 23.0821C10.1228 22.9687 10.2308 22.9663 15.2841 22.9663H20.443L20.5963 23.1102Z" fill="white" />
                                        </svg>


                                    </div>
                                    <div className="progress-text">
                                        <h3 style={{ fontSize: "22.42px" }}>{task?.task_name}</h3>
                                        <p>{
                                            (
                                                () => {
                                                    const specificDate = new Date(task?.due_date);
                                                    const currentDate = new Date();

                                                    const difference = specificDate - currentDate;

                                                    const daysUntil = Math.ceil(difference / (1000 * 60 * 60 * 24));

                                                    return task?.status?.value == "Completed" ?
                                                        "Completed" :
                                                        (daysUntil < 0 ? `${-1 * daysUntil} Days ago` : `${daysUntil} Days Remaining`)
                                                }
                                            )()
                                        }</p>
                                    </div>
                                    <div className="menu-dots cursor-pointer" onClick={() => toggleDropdown(task._id)}>⋮
                                        {dropdownStates === task._id && (
                                            <div
                                                className='profile-dropdown task-dropdown cursor-pointer'
                                                onClick={() => handleDelete(task)}
                                            >
                                                <p>Delete</p>
                                            </div>
                                        )} </div>
                                </div>
                            </div>) : <></>
                        })}
                    </div>
                </div>
                <AddNewTask setRefresh={setRefresh} isOpen={isOpen} onClose={onClose} currentDate={currentDate}></AddNewTask >
            </div>
        </div > : <></>
        }</>
    )
}

export default Calendar
