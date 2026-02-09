'use client';

import RestAPI from '@service/RestAPI.js';
import ProjectCard from '@components/ProjectCard.js';
import LoadingAnimation from '@components/LoadingAnimation.js';
import StatusSelect from '@components/StatusSelect.js';
import ProjectCardPlaceholder from '@components/placeholders/ProjectCardPlaceholder.js';

import { setPageParams } from '@utils/helpers.js';

import { useState, useEffect } from 'react';

export default function ProjectsList(){
	
	const urlParams = new URLSearchParams(typeof window != 'undefined' ? window.location.search : null);
	
	const [projectsData,setProjectsData] = useState([]);
	const [listLimit,setListLimit] = useState(parseInt(urlParams.get("limit") ?? 10));
	const [page,setPage] = useState(parseInt(urlParams.get("page") ?? 1));
	const [searchQuery,setSearchQuery] = useState(urlParams.get("search") ?? "");
	const [statusFilter,setStatusFilter] = useState(urlParams.get("status") ?? "");
	const [isLoading,setIsLoading] = useState(true);
	
	
	
	useEffect(() => {
		
		const timeoutId = setTimeout(() => {
			setIsLoading(true);
			fetchProjects();
			
		},500);
		
		setPageParams({
			"page" : page,
			"limit" : listLimit,
			"search" : searchQuery,
			"status" : statusFilter,
		});
		
		return () => clearTimeout(timeoutId);
		
	},[listLimit,page,searchQuery,statusFilter]);
	
	
	async function fetchProjects(){
		
		try{
			const res = await RestAPI().fetchProjects([], new URLSearchParams("page="+page+"&search="+searchQuery+"&limit="+listLimit+"&status="+statusFilter).toString());	
				
			const data = await res.json();
				
			if(data.success == false){
				
			}else if(Array.isArray(data)){
				setProjectsData(data);
			}
		}catch(e){
			
		}
		
		setIsLoading(false);
	}
	
	
	const handleLimitSelect = (e) => setListLimit(e.target.value);
	const prev = (e) => setPage(prev => Math.max(1,prev-1));
	const next = (e) => setPage(prev => prev+1);
	const projectSearch = (e) => setSearchQuery(e.target.value);
	const handleStatusFilter = (e) => setStatusFilter(e.target.value);
	
	return <>
		
		<h3 className="mb-4">Projects in the system 
			<div className="d-inline-block float-end"><a href="/projects/new" className="btn btn-primary" >+ Add Project</a></div> 
		</h3>
		
		
		<div className="input-group mb-3">
			<input type="search" className="form-control" defaultValue={searchQuery} onChange={(e)=>projectSearch(e)} placeholder="Search for project" />
			
			<div className="d-inline-block">
				<StatusSelect classNames="form-select" name="Status" value={statusFilter} onChange={handleStatusFilter} />
			</div>
		</div>
		
		{isLoading ? 
		<div className="row">
			{new Array(6).fill(0).map((item, index) => (<div key={index} className="col-sm-4 mb-4"><ProjectCardPlaceholder  /></div>))}
		</div>
		:
		
		projectsData.length == 0 ? <p>No data found</p> :
		<div>
			<div className="row">
			{
				projectsData.map((project) => (
					<div key={project.project_id} className="col-4 mb-4"><ProjectCard {...project} /></div>
				))
			}
			</div>
		
		
		
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
		</div>
		}
	</>;
	
}