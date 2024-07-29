import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";

import apiServiceHandler from '../../services/apiService';
import "toastr/build/toastr.min.css";
import toastr from "toastr";
import HomeIcon from '../../assets/images/home.svg'

const AddNewTask = ({ isOpen, onClose, currentDate, setRefresh}) => {
    const [currentStatus, setCurrentStatus] = useState("");
    const [currentProject, setCurrentProject] = useState("");
    const [taskData, setTaskData] = useState({});

    const options = [
        { value: "In-progress", label: "In-progress" },
        { value: "Completed", label: "Completed" },
    ];

    const projectOptions = [
        { value: "TEST 1", label: "TEST 1" },
        { value: "TEST 2", label: "TEST 2" }
    ];

    const addNewTask = async () => {
        let loginDetails = localStorage.getItem('responseData')
        loginDetails = JSON.parse(loginDetails);
        let payload =
        {
            "task_name": taskData?.task_name,
            "task_details": taskData?.task_details,
            "due_date": taskData?.due_date,
            "status": currentStatus,
            "created_by": loginDetails?.userData?._id,
            "project": currentProject,
            "created_on": `${currentDate.getFullYear()}, ${currentDate.getMonth()}, ${currentDate.getDay()}`
        }
        try {
            const response = await apiServiceHandler("POST", "api/task", payload);
            setRefresh(true)
            onClose();
        } catch (err) {
            toastr.error(err?.response?.data?.message);
            console.log(err);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        console.log(name, value, "sub")
        setTaskData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // const handleAddTask = () => {
    //     addNewTask()

    // }

    return (
        <div
            className={`modal fade grey-popup add-task-viewmore ${isOpen ? "show backdrop" : " "
                }`}
            id="newtaskModal"
            tabindex="-1"
            aria-labelledby="taskModalLabel"
            aria-hidden="true"
            style={{ display: isOpen ? "block" : "none" }}
        >
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content border-0 new-task-content">
                    <div className="modal-header new-task-header">
                        <div className="mark-done d-flex align-items-center mark-mobile">
                            <button
                                type="button"
                                className="add-task-button create-task-button"
                                onClick={addNewTask}
                            >
                                Create
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                            </button>
                        </div>
                    </div>
                    <div className="modal-body pt-0">
                        <div className="task-head d-flex align-items-center justify-content-between mb-2 mt-2">
                            <div className="task-head-left d-flex align-items-center">
                                {window.screen.width > 760 && <><div className="task-status-label">Status:</div>
                                    <span>&nbsp;</span></>}
                                <div className="new-task-mobile"
                                >
                                    <Select
                                        options={options}
                                        name="status"
                                        value={currentStatus}
                                        onChange={(val) => setCurrentStatus(val)}
                                        placeholder="Status..."
                                    />
                                </div>

                            </div>
                            <div className="task-head-right d-flex align-items-center">
                                {window.screen.width > 760 && <><div className="task-status-label">Project:</div>
                                    <span>&nbsp;</span></>}
                                <div className="new-task-mobile"
                                >
                                    <Select
                                        options={projectOptions}
                                        name="project"
                                        value={currentProject}
                                        onChange={(val) => setCurrentProject(val)}
                                        placeholder="Project..."
                                    />
                                </div>

                            </div>
                        </div>
                        <div className="task-body bg-white mb-0">
                            <div className="mb-2">
                                <div className="col-md-12 mb-2">
                                    <input
                                        type="text"
                                        name="task_name"
                                        placeholder="task name"
                                        className="form-control"
                                        value={taskData?.task_name}
                                        onChange={(e) => handleChange(e)}
                                    />
                                </div>
                                <textarea
                                    className="form-control"
                                    placeholder="Task Details"
                                    rows="5"
                                    name="task_details"
                                    value={taskData?.task_details}
                                    onChange={(e) => handleChange(e)}
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <ul className="list-unstyled task-ul m-0">
                                    <li>
                                        <div className="task-label">Due Date:</div>
                                        <input
                                            type="date"
                                            className="form-control"
                                            placeholder="due date"
                                            name="due_date"
                                            value={taskData?.due_date}
                                            onChange={(e) => handleChange(e)}
                                            required
                                        />
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddNewTask;
