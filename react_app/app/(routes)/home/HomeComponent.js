'use client';

import { useEffect, useState } from 'react';

import LoadingAnimation from '@components/LoadingAnimation.js';
import RestAPI from '@service/RestAPI.js';

export default function HomeComponent(){
	
	const [data, setData] = useState([]);
	const [dashboardData, setDashboardData] = useState([]);
	const [totalProjectsCount, setTotalProjectsCount] = useState(0);
	
	useEffect(() =>{
		fetchData();
	},[])
	
	async function fetchData(){
		
		try{
			
			const res = await RestAPI().fetchTickets([],"limit=5");
			
			const json = await res.json();
			
			if(Array.isArray(json)){
				setData(json);
			}
			
			const dashboardRes = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/") + "dashboard",
				{
					method: 'GET',
					credentials: "include",
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
					},
				}
			);
			
			const _dashboardData = await dashboardRes.json();
			
			
			setDashboardData(_dashboardData);
			

			let totalCount = 0;
			_dashboardData?.projects_status?.map((item) => (totalCount += item.count));
			setTotalProjectsCount(totalCount);
			
		}catch(e){
			
		}
		
	}
	
	return <>
	<p>Here is a overview of the projects</p>
	<div className="row d-flex mb-3">
		<div className="col-sm-3">
			<div className="shadow h-100 card p-3">
				<div className="fw-semibold">Total Projects</div>
				<div className="fs-1 fw-bold">{totalProjectsCount}</div>
			</div>
		</div>
		<div className="col-sm-3">
			<div className="shadow h-100 card p-3">
				<div className="fw-semibold">Completed</div>
				<div className="fs-1 fw-bold">{dashboardData?.projects_status?.filter((item) => (item.status == "Completed"))?.at(0)?.count ?? 0}</div>
			</div>
		</div>
		<div className="col-sm-3">
			<div className="shadow h-100 card p-3">
				<div className="fw-semibold">In Progress</div>
				<div className="fs-1 fw-bold">{dashboardData?.projects_status?.filter((item) => (item.status == "In Progress"))?.at(0)?.count ?? 0}</div>
			</div>
		</div>
		<div className="col-sm-3">
			<div className="shadow h-100 card p-3">
				<div className="fw-semibold">Blocked</div>
				<div className="fs-1 fw-bold">{dashboardData?.projects_status?.filter((item) => (item.status == "Blocked"))?.at(0)?.count ?? 0}</div>
			</div>
		</div>
	</div>
	<div className="row d-flex">
		<div className="col-sm-6">
			<div className="shadow h-100 card p-3">
				<div className="fw-semibold">Tasks</div>
				<div className="">
				{
					dashboardData?.tasks_status?.length == 0 ? <p>No data to display</p> :
					<div className="row">
						{dashboardData?.tasks_status?.slice(0,4)?.map((item, index) => (
							<div key={index} className="col-sm-6 mb-2">
								<span className="fs-3 fw-bold d-block">{item.count}</span>
								<span className="text-muted">{item.status}</span>
							</div>
						))}
					</div>
				}
				</div>
				<a href="/tasks">View tasks</a>
			</div>
		</div>
		<div className="col-sm-6">
			<div className="shadow h-100 card p-3">
				<h4 className="mb-3">My Tickets</h4>
				<div className="">
				{
					(dashboardData.user_tickets_count && dashboardData.user_tickets_count.length == 0) ? <p>No data to display</p> :
					<div className="fs-1 fw-bold">
					{dashboardData.user_tickets_count && dashboardData.user_tickets_count[0].assigned_tickets_count}
					</div>
				}
				</div>
				<a href="/tickets">View tickets</a>
			</div>
		</div>
	</div>
	
	
	
	
	<div className="shadow card p-3 mt-5 ">	
		<div className="mb-3 fs-3 fw-semibold">Recent tickets</div>
		{data.length == 0 ? <p>No data</p> :
			<table className="table table-hover">
				<thead><tr><th>#</th><th>Name</th><th>Created</th><th></th></tr></thead>
				<tbody>
				{data.map((entity,index) => (
					<tr key={entity.ticket_id} className="">
						<td className="fw-bold">{index+1}</td>
						<td>{entity.name}</td>
						<td>{entity.date_created}</td>
						<td className=""><a className="btn btn-primary" href={`/tickets/${entity.ticket_id}`}>View</a></td>
					</tr>
				))}
				</tbody>
			</table>
		}
	</div>
	</>
	
	
}