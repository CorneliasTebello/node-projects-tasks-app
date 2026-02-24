'use client';

import { useEffect, useState } from 'react';

export default function WelcomeMessage(){
	
	const [userFirstName, setUserFirstName] = useState("");
	
	useEffect(() => {
		try{
			
			const currentUserObj = JSON.parse(localStorage.getItem("user"));
			setUserFirstName(currentUserObj.first_name);
			
		}catch(e){}
	},[])
	
	
	
	return <>
	<h4 className="fw-bold mb-0"> Welcome back, {userFirstName}.</h4>
	<p className="text-muted">Here's a quick overview of your workspace.</p>
	</>;
}