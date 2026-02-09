"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginRegisterForm({isRegister,noRedirect}) {
	
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const router = useRouter();

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
				if(isRegister){
					router.push("/");
				}else{
					router.push("/home");
				}
			}else{
				try{
					res.json().then((json) => {
						router.push("/users/"+json.user.user_id);
					});
				}catch(e){
					router.push("/users");
				}
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
		setIsLoading(false);
		if(err.toString().includes("Failed to fetch")){
			setError("A network issue occurred and we could not log you in. Try again later.");
		}else{
			setError("An issue occurred trying to log you in.");
		}
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{isRegister ? "Register" : "Login"}</h1>


		<div className="mb-3 row">
			<label htmlFor="inputUsername" className="col-sm-2 col-form-label">Username</label>
			<div className="col-sm-10">
				  <input
					className="form-control"
					id="inputUsername"
					type="text"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				  />
			</div>
		</div>

		<div className="mb-3 row">
			<label htmlFor="inputPassword" className="col-sm-2 col-form-label">Password</label>
			<div className="col-sm-10">
				  <input 
					className="form-control"
					id="inputPassword"
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				  />
			</div>
		</div>
		
		{isRegister &&
		<div>
			<hr/>
			<div className="mb-3 row">
				<label htmlFor="inputFirstName" className="col-sm-2 col-form-label">First Name</label>
				<div className="col-sm-10">
					  <input 
						className="form-control"
						id="inputFirstName"
						name="first_name"
						type="text"
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
						placeholder="e.g johnsmith@example.com"
					  />
				</div>
			</div>
		
		</div>}
		
		
      <button type="submit" className={"btn btn-primary " + (isLoading ? "disabled" : "")} >{isRegister ? "Register" : "Login"}</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
	  {isSubmitSuccess && <div className="alert alert-success mt-3" role="alert">User details submitted successfully</div>}
    </form>
  );
}
