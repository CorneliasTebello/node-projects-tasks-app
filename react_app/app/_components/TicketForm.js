'use client';

import RestAPI from '@service/RestAPI.js';

import { useRouter } from "next/navigation";

import { useState } from 'react';

import ProjectsList from '@components/ProjectsList.js';
import StatusSelect from '@components/StatusSelect.js';

export default function TicketForm({ticket_id, name, description}){
	
	const [ticketId, setTicketId] = useState(ticket_id);
	const [ticketName, setTicketName] = useState(name);
	const [ticketDescription, setTicketDescription] = useState(description);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
	const router = useRouter();
	
	
	function handleFormSubmit(e){
		
		e.preventDefault();
		
		setError("");
		setIsLoading(true);
		setIsSubmitSuccess(false);

		try {
			
			const formData = new FormData(e.target);
			
			const formValues = {
				ticket_id	 	: formData.get("ticket_id"),
				name 			: formData.get("name"),
				description 	: formData.get("description"),
			};
			
			//Validate for empty values
			if(!formValues.name ){
				setError("Name value is required!");
				setIsLoading(false);
				setIsSubmitSuccess(false);
				return;
			}
			
			setTicketId(formValues.ticket_id);
			setTicketName(formValues.name);
			setTicketDescription(formValues.description);
			
			if(formValues.ticket_id > 0){
				RestAPI().updateTicket(formValues, formValues.ticket_id).then((res) => {	
					res.json().then((json) => {
						
						if(res.status >= 200 && res.status <= 299){
														
							setIsSubmitSuccess(true);
							
						}else if(res.status >= 400 && res.status <= 499){
							try{
								setError(res.statusText);
							}catch(e){
								setError("Error. Could not submit details");
							}
						}else if(res.statusText){
							setError(res.statusText);
						}
					
					
						setIsLoading(false);
					})
				});
				
			}else{
				RestAPI().createTicket(formValues).then((res) => {	
					res.json().then((json) => {
						
						if(res.status >= 200 && res.status <= 299){
							
							formValues.ticket_id = json.id;
							setTicketId(json.id);
							
							setIsSubmitSuccess(true);
							
						}else if(res.status >= 400 && res.status <= 499){
							try{
								setError(res.statusText);
							}catch(e){
								setError("Error. Could not submit details");
							}
						}else if(res.statusText){
							setError(res.statusText);
						}
					
					
						setIsLoading(false);
					})
				});
			}
		
			
			
		} catch (err) {
			setError("Error. Could not submit details");
			setIsLoading(false);
		}
	}
	
	
	function handleDelete(e){
		
		e.preventDefault();
		
		if(confirm("Are you sure you want to delete this ticket?")){
			
			console.log("Delete " + ticket_id);
			
			try{
				
				RestAPI().deleteTicket(ticket_id).then((res) => {	
					res.json().then((json) => {
						if(json.success == true){
							alert("Deleted successfully");
							router.push("/tickets");
						}
					})
					
				});
				
			}catch(e){
				
			}
		}
		
	}
	
	return (
	<>
	<h3 className="mb-4" > Ticket Form</h3>
    <form onSubmit={handleFormSubmit}>
	  
	  <input type="hidden" name="ticket_id" defaultValue={ticketId}  />

		<div className="mb-3 row">
			<label htmlFor="inputName" className="col-sm-2 col-form-label">Name</label>
			<div className="col-sm-10">
				  <input
					className="form-control"
					id="inputName"
					type="text"
					name="name"
					defaultValue={ticketName}
				  />
			</div>
		</div>

		<div className="mb-3 row">
			<label htmlFor="inputDescription" className="col-sm-2 col-form-label">Description</label>
			<div className="col-sm-10">
				  <textarea name="description" defaultValue={ticketDescription} className="form-control"></textarea>
			</div>
		</div>

		<div className="d-flex justify-content-end">
			{ticket_id > 0 && <button className={"btn btn-danger " + (isLoading ? "disabled" : "")} onClick={(e) => {handleDelete(e)}} >Delete Ticket</button>}
			<div className="mx-1"></div>
			<button type="submit" className={"btn btn-primary " + (isLoading ? "disabled" : "")} >Save</button>
		</div>
      {error && <p style={{ color: "red" }}>{error}</p>}
	  {isSubmitSuccess && <div className="alert alert-success mt-3" role="alert">Info submitted successfully</div>}
    </form>
	</>
  );
	
}