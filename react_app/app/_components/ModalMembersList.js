
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import LoadingAnimation from '@components/LoadingAnimation.js';
import RestAPI from '@service/RestAPI.js';

import { useState, useEffect } from 'react';

export default function ModalMembersList({project_id, onMemberSelect, onModalClose}){
	
	const [show, setShow] = useState(true);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [listLimit,setListLimit] = useState(10);
	const [page,setPage] = useState(1);
	const [searchQuery,setSearchQuery] = useState("");
	const [data, setData] = useState([]);
	
	
	useEffect(() => {
		
		const searchTimeout = setTimeout(() =>{
			fetchData();
		},500);
		
		return () => {
			clearTimeout(searchTimeout);
		}
		
	},[listLimit,page,searchQuery]);
	
	function handleModalClose(){
		
		setShow(false);
		
		//For fade effect's sake.
		setTimeout(() =>{
			onModalClose();
			console.log("Close");
		},300);
		
	}
	
	function memberSearch(){
		
		
	}
	
	function handleMemberSelected(e,member){
		
		e.preventDefault();
		onMemberSelect(member);
	}
	
	async function fetchData(){
		
		setIsLoading(true);
		
		try{
			const res = await RestAPI().fetchUsers([], new URLSearchParams("page="+page+"&search="+searchQuery+"&limit="+listLimit).toString());
			
			const jsonData = await res.json();
			
			if(Array.isArray(jsonData)){
				setData(jsonData);
			}
			
		}catch(e){
			
		}
		setIsLoading(false);
		
	}
	
	const handleLimitSelect = (e) => setListLimit(e.target.value);
	const prev = (e) => setPage(prev => Math.max(1,prev-1));
	const next = (e) => setPage(prev => prev+1);
	const search = (e) => setSearchQuery(e.target.value);
	
	
	return <>
			<Modal show={show} onHide={handleModalClose}>
				<Modal.Header closeButton>
					<Modal.Title>
						Members List
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
				<div className="input-group mb-3">
					<input type="search" className="form-control" value={searchQuery} onChange={(e)=>search(e)} placeholder="Search for members" />
				</div>
				{isLoading ? <LoadingAnimation /> : 
				(
					data.length == 0 ? <p>No members to show</p> :
					<div>
						<div style={{maxHeight:"300px",overflowX:"scroll"}}>
							<table className="table">
								<thead><tr><th>Name</th><th></th></tr></thead>
								<tbody>
								{data.map((member) => (
									<tr key={member.user_id} className="">
										<td>{member.first_name} {member.last_name}</td>
										<td className="d-flex justify-content-end"><button className="btn btn-primary" onClick={(e) => handleMemberSelected(e,member)}>Select</button></td>
									</tr>
								))}
								</tbody>
							</table>
						</div>
						
					</div>
				)
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
							  <a className="page-link" href="#" onClick={(e)=>prev(e)}>Previous</a>
							</li>
							<li className="page-item">
							  <a className="page-link" href="#" onClick={(e)=>next(e)}>Next</a>
							</li>
						  </ul>
						</nav>
					</div>
				</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleModalClose}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
	  </>;
}