"use client";

import { useState } from "react";

import StatusSelect from '@components/StatusSelect.js';
import TaskFormInputs from '@components/TaskFormInputs.js';

export default function TaskForm({project_id, task_id, name, description, status, date_created, date_updated}){
	
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
	setIsLoading(true);
	setIsSubmitSuccess(false);

    try {
		
		const formData = new FormData(e.target);
		
		const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `${isRegister ? "register" : "login"}`, {
			method: 'POST',
			credentials: "include",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
			  username:username,
			  password:password,
			  first_name:formData.get("first_name") ?? "",
			  last_name:formData.get("last_name") ?? "",
			  email:formData.get("email") ?? "",
			})
		});
	
		if(res.status >= 200 && res.status <= 299){
			
			setIsSubmitSuccess(true);
			
			if(noRedirect != true){//Indicating its from a login or register screen
				const data = await res.json();
				
				localStorage.setItem("user", JSON.stringify(data.user));
			}else{
				
			}
		}else if(res.status >= 400 && res.status <= 499){
			try{
				const response = await res.json();
				setError(response.message);
			}catch(e){
				setError("Invalid credentials");
			}
		}else if(res.statusText){
			setError(res.statusText);
		}
		
		
		setIsLoading(false);
		
    } catch (err) {
		setError("Error. Could not submit");
		setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
	  
		<TaskFormInputs  />
		
      <button type="submit" className={"btn btn-primary " + (isLoading ? "disabled" : "")} >Save</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
	  {isSubmitSuccess && <div className="alert alert-success mt-3" role="alert">Info submitted successfully</div>}
    </form>
  );
}