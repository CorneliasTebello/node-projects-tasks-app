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
	
	
	
	return <h1 className="mb-3"> Welcome {userFirstName}!</h1>
}