import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import TaskFormInputs from '@components/TaskFormInputs.js';
import RestAPI from '@service/RestAPI.js';

import { useState } from 'react';

export default function ModalProjectTaskForm({project_id, onTaskSaved, onModalClose}){
	
	const [show, setShow] = useState(true);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
	
	function handleModalClose(){
		
		setShow(false);
		
		//For fade effect's sake.
		setTimeout(() =>{
			onModalClose();
			console.log("Close");
		},300);
		
	}
	
	function handleFormSubmit(e){
		
		e.preventDefault();
		
		setError("");
		setIsLoading(true);
		setIsSubmitSuccess(false);

		try {
			
			const formData = new FormData(e.target);
			
			const formValues = {
				task_id	 		: formData.get("task_id"),
				name 			: formData.get("name"),
				description 	: formData.get("description"),
				status 			: formData.get("status"),
			};
			
			//Validate for empty values
			if(!formValues.name || !formValues.status){
				setError("Name and/or status values are required!");
				setIsLoading(true);
				setIsSubmitSuccess(false);
				return;
			}
			
			
			RestAPI().createTaskForProject(formValues,project_id).then((res) => {	
				res.json().then((json) => {
					
					if(res.status >= 200 && res.status <= 299){
						
						formValues.task_id = json.id;
						
						setIsSubmitSuccess(true);
						onTaskSaved(formValues);
						handleModalClose();
						
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
		
			
			
		} catch (err) {
			setError("Error. Could not submit details");
			setIsLoading(false);
		}
	}
	
	
	
	
	return <>
			<Modal show={show} onHide={handleModalClose}>
				<form method="post" onSubmit={(e) => handleFormSubmit(e)}>
					<Modal.Header closeButton>
						<Modal.Title>
							Task Form
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<TaskFormInputs  />

						{error && <p style={{ color: "red" }}>{error}</p>}
						{isSubmitSuccess && <div className="alert alert-success mt-3" role="alert">Info submitted successfully</div>}
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleModalClose}>
							Close
						</Button>
						<button className="btn btn-primary" type="submit" >
							Save Changes
						</button>
					</Modal.Footer>
				</form>
			</Modal>
	  </>;
}