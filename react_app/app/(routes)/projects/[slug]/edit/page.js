import RestAPI from '@service/RestAPI.js';

import ProjectForm from '@components/ProjectForm.js';

import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function Page({params}){
	
	const {slug} = await params;
	let data = {};
	
	const cookieStore = await cookies();           // Read cookies from request
	
	if(parseInt(slug) > 0){
		const res = await RestAPI(cookieStore.toString()).fetchProjects([slug]);
		
		console.log(res);
		
		const serverData = await res.json();
		data = serverData[0];
		console.log(data);
	}
	
	if(!data){
		notFound();
	}
	
	return <>
		<ProjectForm {...data} />
	</>;
}