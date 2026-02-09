'use client'
import Link from 'next/link';
import {Suspense} from 'react';

import SearchBar from '@components/SearchBar.js';
import { useRouter } from 'next/navigation';

export default function Header(){
	
  const router = useRouter();
	
	function logout(e){
		
		try{
			e.preventDefault();
			
			fetch(process.env.NEXT_PUBLIC_API_URL + "logout", {
				method: 'POST',
				credentials: "include",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
			});
			
			localStorage.removeItem("user");
			
			router.push("/login");
		}catch(e){
			alert("There was an issue trying to log you out");
		}
	}
	
	return <header>
			<div className="container-fluid py-1">
				<div className="row">
					<div className="col-lg-2"></div>
					<div className="col-lg-8 col-sm-10">
						<div className="row justify-content-between">
							<div className="col-12 col-md-6 flex-row align-content-center">
								<Link href="/" prefetch={true} className="text-decoration-none">
									<div className="d-flex">
										<img className="d-flex align-items-center" src="/icon.png" style={{maxWidth:"50px"}}  />
										<div className="d-flex align-items-center px-2 fs-4 ml-2">Projects and Tickets</div>
									</div>
								</Link>
							</div>
						</div>
					</div>
					<div className="align-content-center col-lg-2 col-sm-2">
						<button className="btn btn-secondary btn-sm float-end" onClick={(e) => logout(e)}>Logout</button>
					</div>
				</div>
			</div>
			<hr className="mb-4"/>
		</header>
}