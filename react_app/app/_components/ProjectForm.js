'use client';

import RestAPI from '@service/RestAPI.js';

import { useRouter } from "next/navigation";

import { useState } from 'react';

import ProjectsList from '@components/ProjectsList.js';
import StatusSelect from '@components/StatusSelect.js';

export default function ProjectForm({project_id, name, description, status}){
	
	const [projectId, setProjectId] = useState(project_id);
	const [projectName, setProjectName] = useState(name);
	const [projectDescription, setProjectDescription] = useState(description);
	const [projectStatus, setProjectStatus] = useState(status);
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
				project_id	 	: formData.get("project_id"),
				name 			: formData.get("name"),
				description 	: formData.get("description"),
				status 			: formData.get("status"),
			};
			
			//Validate for empty values
			if(!formValues.name || !formValues.status){
				setError("Name and/or status values are required!");
				setIsLoading(false);
				setIsSubmitSuccess(false);
				return;
			}
			
			setProjectId(formValues.project_id);
			setProjectName(formValues.name);
			setProjectDescription(formValues.description);
			setProjectStatus(formValues.status);
			
			if(formValues.project_id > 0){
				RestAPI().updateProject(formValues, formValues.project_id).then((res) => {	
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
				RestAPI().createProject(formValues).then((res) => {	
					res.json().then((json) => {
						
						if(res.status >= 200 && res.status <= 299){
							
							formValues.project_id = json.id;
							setProjectId(json.id);
							
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
		
		if(confirm("Are you sure you want to delete this project?")){
			
			console.log("Delete " + project_id);
			
			try{
				
				RestAPI().deleteProject(project_id).then((res) => {	
					res.json().then((json) => {
						if(json.success == true){
							alert("Deleted successfully");
							router.push("/projects");
						}
					})
					
				});
				
			}catch(e){
				
			}
		}
		
	}
	
	return (
	<>
	<h3 className="mb-4" > Project Form</h3>
    <form onSubmit={handleFormSubmit}>
	  
	  <input type="hidden" name="project_id" defaultValue={projectId}  />

		<div className="mb-3 row">
			<label htmlFor="inputName" className="col-sm-2 col-form-label">Name</label>
			<div className="col-sm-10">
				  <input
					className="form-control"
					id="inputName"
					type="text"
					name="name"
					defaultValue={projectName}
				  />
			</div>
		</div>

		<div className="mb-3 row">
			<label htmlFor="inputDescription" className="col-sm-2 col-form-label">Description</label>
			<div className="col-sm-10">
				  <textarea name="description" defaultValue={projectDescription} className="form-control"></textarea>
			</div>
		</div>

		<div className="mb-3 row">
			<label htmlFor="inputDescription" className="col-sm-2 col-form-label">Status</label>
			<div className="col-sm-10">
				<StatusSelect name="status" value={projectStatus} classNames="form-select" />
			</div>
		</div>
		<div className="d-flex justify-content-end">
			{project_id > 0 && <button className={"btn btn-danger " + (isLoading ? "disabled" : "")} onClick={(e) => {handleDelete(e)}} >Delete Project</button>}
			<div className="mx-1"></div>
			<button type="submit" className={"btn btn-primary " + (isLoading ? "disabled" : "")} >Save</button>
		</div>
      {error && <p style={{ color: "red" }}>{error}</p>}
	  {isSubmitSuccess && <div className="alert alert-success mt-3" role="alert">Info submitted successfully</div>}
    </form>
	</>
  );
	
}