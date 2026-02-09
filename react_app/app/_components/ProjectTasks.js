'use client';

import { useState, useEffect } from 'react';

import RestAPI from '@service/RestAPI.js';
import LoadingAnimation from '@components/LoadingAnimation.js';
import ModalProjectTaskForm from '@components/ModalProjectTaskForm.js';

export default function ProjectTasks({project_id}){
	
	const [data, setData] = useState([]);
	const [listLimit,setListLimit] = useState(5);
	const [page,setPage] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const [showTaskFormModal, setShowTaskFormModal] = useState(false);
	
	useEffect(()=>{
		fetchData()
	},[listLimit,page]);
	
	
	async function fetchData(){
		
		setIsLoading(true);
		
		const res = await RestAPI().fetchProjectTasks(project_id, new URLSearchParams("page="+page+"&limit="+listLimit).toString());
		
		const myData = await res.json();
		
		if(Array.isArray(myData)){
			setData(myData);
		}			
		
		setIsLoading(false);
		
	}
	
	
	
	function handleLimitSelect(e){
		setListLimit(e.target.value);
	}
	
	const prevUsers = (e) => setPage(prev => Math.max(0,prev-1));
	const nextUsers = (e) => setPage(prev => prev+1);
	
	
	function handleDelete(e, task_id){
		
		e.preventDefault();
		
		try{
			RestAPI().deleteTask(task_id).then((res) => {
				res.json().then((json) =>{
					if(json.success == true){
						
						//Remove from current data on successful delete from server
						setData(prev => prev.filter((ele) => ele.task_id != task_id));
					}
				})
			});
		}catch(e){
			alert("An error occurred trying to delete task");
		}
		
		
	}
	
	
	function handleAddTask(e){
		
		e.preventDefault();
		
		setShowTaskFormModal(true);
		
		console.log("Add task modal");
		
	}
	
	
	function handleTaskSaved(taskObj){
		
		console.log("ProjectTasks: Task saved", taskObj);
		
		//Add saved task's data to list of tasks data
		setData(prev => [taskObj, ...prev]);
		
	}
	
	
	function handleModalClose(){
		setShowTaskFormModal(false);
	}
	
	return <>
	
		{showTaskFormModal == true && <ModalProjectTaskForm project_id={project_id} onTaskSaved={handleTaskSaved} onModalClose={handleModalClose} />}
	
		<h3 className="mb-4">
			Project's tasks 
		<button className="btn btn-sm btn-primary float-end" onClick={(e) => handleAddTask(e)}>+ Add Task</button>
		</h3>
		
	{isLoading ? <div className="text-center my-4"><LoadingAnimation /></div> :
	 (data.length == 0 ? <p>No tasks</p> :
	 <div>
		<table className="table">
			<thead>
				<tr><th>Name</th><th>Status</th><th>Action</th></tr>
			</thead>
			<tbody>
				{data.map((task) => (
				<tr key={task.task_id}>
					<td>{task.name}</td>
					<td>{task.status}</td>
					<td>
						<a href={`/tasks/${task.task_id}/edit`} className="btn btn-sm btn-secondary me-1">Edit</a>
						<button className="btn btn-sm btn-danger" onClick={(e)=>handleDelete(e, task.task_id)} >Delete</button>
					</td>
				</tr>))
				}
				
			</tbody>
		</table>
		
		
			<div className="row mt-4">
				<div className="col-5">
					<span>Limit: </span>
					<div className="d-inline-block">
						<select className="form-select" defaultValue={listLimit} onChange={(e)=>{handleLimitSelect(e)}} >
						  <option value="1">1</option>
						  <option value="5">5</option>
						  <option value="10">10</option>
						  <option value="50">50</option>
						  <option value="100">100</option>
						</select>
					</div>
				</div>
				<div className="col-7">
					<nav className="">
					  <ul className="pagination justify-content-end">
						<div className="align-content-around pe-3">Page {page} </div>
						<li className="page-item">
						  <a className="page-link" href="#" onClick={(e)=>prevUsers(e)}>{"<<"}</a>
						</li>
						<li className="page-item">
						  <a className="page-link" href="#" onClick={(e)=>nextUsers(e)}>{">>"}</a>
						</li>
					  </ul>
					</nav>
				</div>
			</div>
		
	 </div>)
	}
	</>
	
}