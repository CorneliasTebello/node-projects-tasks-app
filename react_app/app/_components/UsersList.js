'use client';

import RestAPI from '@service/RestAPI.js';
import LoadingAnimation from '@components/LoadingAnimation.js';

import { useState, useEffect } from 'react';

import Link from 'next/link';

export default function UsersList(){
	
	const [data,setData] = useState([]);
	const [listLimit,setListLimit] = useState(10);
	const [page,setPage] = useState(1);
	const [searchQuery,setSearchQuery] = useState("");
	const [isLoading,setIsLoading] = useState(true);
	
	useEffect(() => {
		
		const timeoutId = setTimeout(() => {
			setIsLoading(true);
			fetchData();
			
		},500);
		
		
		return () => clearTimeout(timeoutId);
		
	},[listLimit,page,searchQuery]);
	
	
	async function fetchData(){	
		
		try{
			const res = await RestAPI().fetchUsers([], new URLSearchParams("page="+page+"&search="+searchQuery+"&limit="+listLimit).toString());
				
			const resData = await res.json();
				
			if(resData.success == false){
				
			}else if(Array.isArray(resData)){
				setData(resData);
			}
		}catch(e){
			
		}
		setIsLoading(false);
	}
	
	
	function handleLimitSelect(e){
		setListLimit(e.target.value);
	}
	
	const prevUsers = (e) => setPage(prev => Math.max(1,prev-1));
	const nextUsers = (e) => setPage(prev => prev+1);
	const handleSearch = (e) => setSearchQuery(e.target.value);
	
	return <>
		
		<h1 className="mb-4">
			Users in the system
			<div className="d-inline-block float-end"><a href="/users/new" className="btn btn-primary" >+ Add User</a></div> 
		</h1>
		
		
		<div className="input-group mb-3">
			<input type="search" className="form-control" defaultValue={searchQuery} onChange={(e)=>handleSearch(e)} placeholder="Search for users" />
		</div>
		
		<div className="row">
			
			<table className="table">
				<thead><tr><th>ID</th><th>Full Name</th><th>Email</th><th></th></tr></thead>
				<tbody>
				{data.map((obj) => (
					
					<tr key={obj.user_id}>
						<td>{obj.user_id}</td>
						<td>{obj.first_name} {obj.last_name}</td>
						<td>{obj.email}</td>
						<td>
							<Link prefetch={false} href={"/users/"+obj.user_id+""} >View/Edit</Link>
						</td>
					</tr>
				))}
				</tbody>
			</table>
		
		</div>
		
		
		{isLoading ? <LoadingAnimation /> :
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
				<nav >
				  <ul className="pagination justify-content-end">
					<li className="page-item">
					  <a className="page-link" href="#" onClick={(e)=>prevUsers(e)}>Previous</a>
					</li>
					<li className="page-item">
					  <a className="page-link" href="#" onClick={(e)=>nextUsers(e)}>Next</a>
					</li>
				  </ul>
				</nav>
			</div>
		</div>
		}
	</>;
	
}