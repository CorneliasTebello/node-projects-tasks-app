'use client';

import RestAPI from '@service/RestAPI.js';
import LoadingAnimation from '@components/LoadingAnimation.js';
import ModalTaskForm from '@components/ModalTaskForm.js';
import StatusSelect from '@components/StatusSelect.js';

import { setPageParams } from '@utils/helpers.js';

import { useState, useEffect } from 'react';

export default function TasksList(){
	
	const urlParams = new URLSearchParams(typeof window != 'undefined' ? window.location.search : null);
	
	const [data,setData] = useState([]);
	const [listLimit,setListLimit] = useState(parseInt(urlParams.get("limit") ?? 10));
	const [page,setPage] = useState(parseInt(urlParams.get("page") ?? 1));
	const [searchQuery,setSearchQuery] = useState(urlParams.get("search") ?? "");
	const [statusFilter,setStatusFilter] = useState(urlParams.get("status") ?? "");
	const [isLoading,setIsLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [taskObjectForModal, setTaskObjectForModal] = useState(null);
	
	
	
	useEffect(() => {
		
		const timeoutId = setTimeout(() => {
			setIsLoading(true);
			fetchData();
			
		},500);
		
		setPageParams({
			"page" : page,
			"limit" : listLimit,
			"search" : searchQuery,
			"status" : statusFilter,
		});
		
		return () => clearTimeout(timeoutId);
		
	},[listLimit,page,searchQuery,statusFilter]);
	
	
	async function fetchData(){
		
		try{
			const res = await RestAPI().fetchTasks([], new URLSearchParams("page="+page+"&search="+searchQuery+"&limit="+listLimit+"&status="+statusFilter).toString());	
				
			const data = await res.json();
				
			if(data.success == false){
				
			}else if(Array.isArray(data)){
				setData(data);
			}
		}catch(e){
			
		}
		
		setIsLoading(false);
	}
	
	
	function handleTaskView(e,task){
		
		e.preventDefault();
		
		setTaskObjectForModal(task);
		setShowModal(true);
		
	}
	
	function handleAddTask(e){
		setTaskObjectForModal({});
		setShowModal(true);
	}
	
	function handleModalClosed(){
		
		setTaskObjectForModal(null);
		setShowModal(false);
	}
	
	function handleTaskSaved(savedTaskObj){
		console.log(savedTaskObj);
		
		//Update/add task in the list
		if(data.find((item) => item.task_id == savedTaskObj.task_id)){
			const updatedData = data.map((item) => {
				
				if(item.task_id == savedTaskObj.task_id){
					return {...savedTaskObj}
				}
				
				return item;
			});
			
			setData(updatedData);
			
		}else{
			setData(prev => [savedTaskObj,...prev]);
		}
		
	}
	
	
	const handleLimitSelect = (e) => setListLimit(e.target.value);
	const prev = (e) => setPage(prev => Math.max(1,prev-1));
	const next = (e) => setPage(prev => prev+1);
	const search = (e) => setSearchQuery(e.target.value);
	const handleStatusFilter = (e) => setStatusFilter(e.target.value);
	
	return <>
	{showModal && <ModalTaskForm {...taskObjectForModal} onTaskSaved={handleTaskSaved} onModalClose={handleModalClosed} /> }
		<h3 className="mb-4">Tasks in the system 
			<div className="d-inline-block float-end"><button className="btn btn-primary" onClick={(e) => handleAddTask(e)} >+ Add Task</button></div> 
		</h3>
		
		
		<div className="input-group mb-3">
			<input type="search" className="form-control" defaultValue={searchQuery} onChange={(e)=>search(e)} placeholder="Search for tasks" />
			
			<div className="d-inline-block">
				<StatusSelect classNames="form-select" name="Status" value={statusFilter} onChange={handleStatusFilter} />
			</div>
		</div>
		
		{isLoading ? 
		<table className="table table-hover placeholder-glow">
			<thead><tr><th>#</th><th>Name</th><th>Status</th></tr></thead>
			<tbody>
			{new Array(6).fill(0).map((item, index) => (
				<tr key={index} className="">
					<td className="fw-bold"><div className="placeholder col-2"></div></td>
					<td><div className="placeholder col-5"></div></td>
					<td className=""><div className="placeholder col-3"></div></td>
					<td className=""></td>
				</tr>
			))}
			</tbody>
		</table>
		:
		
		data.length == 0 ? <p>No data found</p> :
		<div>
			{
				<table className="table table-hover">
					<thead><tr><th>#</th><th>Name</th><th>Status</th></tr></thead>
					<tbody>
					{data.map((entity,index) => (
						<tr key={entity.task_id} className="">
							<td className="fw-bold">{index+1}</td>
							<td>{entity.name}</td>
							<td className="">{entity.status}</td>
							<td className=""><button className="btn btn-primary" onClick={(e) => handleTaskView(e,entity)}>View</button></td>
						</tr>
					))}
					</tbody>
				</table>
			}
		
		
		
		</div>
		}
		<div className="row">
			<div className="col-6">
				<span>Limit: </span>
				<div className="d-inline-block">
					<select className="form-select" defaultValue={listLimit} onChange={(e)=>{handleLimitSelect(e)}} >
					  <option value="5">5</option>
					  <option value="10">10</option>
					  <option value="50">50</option>
					  <option value="100">100</option>
					</select>
				</div>
			</div>
			<div className="col-6">
				<nav className="">
				  <ul className="pagination justify-content-end">
					<div className="align-content-around pe-3">Page {page} </div>
					<li className="page-item">
					  <a className="page-link" href="#" onClick={(e)=>prev(e)}>{"<<"}</a>
					</li>
					<li className="page-item">
					  <a className="page-link" href="#" onClick={(e)=>next(e)}>{">>"}</a>
					</li>
				  </ul>
				</nav>
			</div>
		</div>
	</>;
	
}