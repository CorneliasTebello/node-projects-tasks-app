import RestAPI from '@service/RestAPI.js';

import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';

import ProjectForm from '@components/ProjectForm.js';
import ProjectTasks from '@components/ProjectTasks.js';
import ProjectMembers from '@components/ProjectMembers.js';
import StatusBadge from '@components/StatusBadge.js';

export default async function Page({params}){
	
	
	const {slug} = await params;
	let data = {};
	
	if(slug == "new"){
		return <ProjectForm />
	}
	
	
	const cookieStore = await cookies();           // Read cookies from request
	
	if(parseInt(slug) > 0){
		const res = await RestAPI(cookieStore.toString()).fetchProjects([slug]);
		
		const serverData = await res.json();
		data = serverData[0];
	}
	
	if(!data){
		notFound();
	}
	
	
	return <>
		<div className="row">
			<div className="col-sm-6 mb-3">
				<div className="shadow card p-3">
					<div className="fs-3">{data.name}</div>
					<div className="fs-6 fst-italic"><StatusBadge status={data.status} /></div>
					<div className="mt-2">{data.description}</div>
					<div className="py-4"></div>
					<div className="">
						<div className="text-muted row">
							<div className="col-sm-6 mb-3">
								Date Created<br/>
								{data.date_created}
							</div>
							<div className="col-sm-6 mb-3">
								Date Updated<br/>
								{data.date_updated}
							</div>
						</div>
					</div>
					<div className="">
						<a href={`/projects/${data.project_id}/edit`} className="btn btn-secondary" >Edit Project</a>
					</div>
				</div>
			</div>
			<div className="col-sm-6">
				<div className="shadow card p-3 mb-3">
					<ProjectTasks project_id={data.project_id} />
				</div>
				<div className="shadow card p-3">
					<ProjectMembers project_id={data.project_id} />
				</div>
			</div>
		</div>
	</>;

}