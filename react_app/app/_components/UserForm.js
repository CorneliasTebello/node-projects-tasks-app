'use client';

import RestAPI from '@service/RestAPI.js';
import { notFound } from 'next/navigation';

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

export default function UserForm({user_id}){
	
	const [data,setData] = useState([]);
	const [isLoading,setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
	const router = useRouter();
	
	useState(() => {
		fetchData();
	},[])
	
	async function fetchData(){
		
		setIsLoading(true);
	
		if(parseInt(user_id) > 0){
			const res = await RestAPI().fetchUsers([user_id]);
			
			const serverData = await res.json();
			setData(serverData[0]);
		}
		
		if(!data){
			notFound();
		}
		
		setIsLoading(false);
	}
	
	const handleSubmit = async (e) => {
		
		e.preventDefault();
		setError("");
		setIsLoading(true);
		setIsSubmitSuccess(false);

		try {
			
			const formData = new FormData(e.target);
			
			const formValues = {
			  user_id:formData.get("user_id") ?? null,
			  first_name:formData.get("first_name") ?? "",
			  last_name:formData.get("last_name") ?? "",
			  email:formData.get("email") ?? "",
			};
			
			console.log(formValues);
			
			
			RestAPI().updateUser(formValues,formValues.user_id).then((res) => {
				handleResponse(res);
			});
			
		
			
			function handleResponse(res){
					
				if(res.status >= 200 && res.status <= 299){
					
					setIsSubmitSuccess(true);
					
				}else if(res.status >= 400 && res.status <= 499){
					
					res.json().then((json) => {
						
						try{
							setError(json.message);
						}catch(e){
							setError("Error saving user details");
						}
					});
					
				}else if(res.statusText){
					setError(res.statusText);
				}
			}
			
			
			setIsLoading(false);
			
		} catch (err) {
			setError("Error saving user details");
			setIsLoading(false);
		}
	  };
	
	
	function handleDeleteUser(e){
		
		if(confirm("Are you sure you want to delete this user?")){
			
			setIsLoading(true);
			RestAPI().deleteUser(data.user_id).then((res) => {
				
				res.json().then((json) => {
					
					if(json.success == true){
						router.replace("/users");
					}
				})
				setIsLoading(false);
			});
			
		}
		
	}
	
	return <>
		 <form onSubmit={handleSubmit}>
		  <h1 className="mb-5">User details</h1>

			<input type="hidden" name="user_id" defaultValue={data.user_id} />

			<div className="mb-3 row">
				<label htmlFor="inputUsername" className="col-sm-2 col-form-label">Username</label>
				<div className="col-sm-10">
					  <input
						className="form-control"
						id="inputUsername"
						type="text"
						placeholder="Username"
						defaultValue={data.username}
						disabled
					  />
				</div>
			</div>
		
			<div className="mb-3 row">
				<label htmlFor="inputFirstName" className="col-sm-2 col-form-label">First Name</label>
				<div className="col-sm-10">
					  <input 
						className="form-control"
						id="inputFirstName"
						name="first_name"
						type="text"
						defaultValue={data.first_name}
						placeholder="e.g John"
					  />
				</div>
			</div>
			<div className="mb-3 row">
				<label htmlFor="inputLastName" className="col-sm-2 col-form-label">Last Name</label>
				<div className="col-sm-10">
					  <input 
						className="form-control"
						id="inputLastName"
						name="last_name"
						type="text"
						defaultValue={data.last_name}
						placeholder="e.g Smith"
					  />
				</div>
			</div>
			<div className="mb-3 row">
				<label htmlFor="inputEmail" className="col-sm-2 col-form-label">Email</label>
				<div className="col-sm-10">
					  <input 
						className="form-control"
						id="inputEmail"
						name="email"
						type="email"
						defaultValue={data.email}
						placeholder="e.g johnsmith@example.com"
					  />
				</div>
			</div>
			
			<div className="d-flex justify-content-end">
				<button type="submit" className={"btn btn-primary " + (isLoading ? "disabled" : "")} >Save</button>
			</div>
		  {error && <p style={{ color: "red" }}>{error}</p>}
		  {isSubmitSuccess && <div className="alert alert-success mt-3" role="alert">User details submitted successfully</div>}
		</form>
		
		<div className="mt-5">
			<h4>Account deletion</h4>
			<p>This action can not be reverted</p>
			<button className={"btn btn-danger " + (isLoading ? "disabled" : "")} onClick={(e) => handleDeleteUser(e)} >Delete User</button>
				
		</div>
	</>;

}