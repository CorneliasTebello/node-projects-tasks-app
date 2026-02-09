'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function LayoutWrapper({children}){
	
	const router = useRouter();
	let hasAlertedLoggingOut = false;
	
	 useEffect(() => {
		 
		 checkLoggedInStatus();
		
		const intervalId  = setInterval(checkLoggedInStatus, 5 * 60 * 1000);
		
		
		return () => {
			clearInterval(intervalId);
		}
		
	}, []);
	
	
	
	async function checkLoggedInStatus(){
		
		try{
			
			if(hasAlertedLoggingOut) return;
			
			const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "check",{
				method:"POST",
				credentials: "include",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
			});
			
			if(response.status == 401){
				if(hasAlertedLoggingOut == false){
					hasAlertedLoggingOut = true;
					localStorage.removeItem("user");
					alert("Session has expired");
					router.push("/login");
				}
			}
			
		}catch(e){
			//Check user object is stored in localstorage. Assume not signed in if that value is missing
			try{
				
				if(!localStorage.getItem("user")){
					alert("Session has expired");
					router.push("/login");
				}
			}catch(e){
				
			}
		}
	}
		
	return <>
	{children}
	</>;
}