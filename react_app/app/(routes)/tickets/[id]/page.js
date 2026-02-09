import RestAPI from '@service/RestAPI.js';

import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';

import TicketForm from '@components/TicketForm.js';
import TicketMembers from '@components/TicketMembers.js';

export default async function Page({params}){
	
	
	const {id} = await params;
	let data = {};
	
	if(id == "new"){
		return <TicketForm />
	}
	
	
	const cookieStore = await cookies();           // Read cookies from request
	
	if(parseInt(id) > 0){
		const res = await RestAPI(cookieStore.toString()).fetchTickets([id]);
		
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
						<a href={`/tickets/${data.ticket_id}/edit`} className="btn btn-secondary" >Edit Ticket</a>
					</div>
				</div>
			</div>
			<div className="col-sm-6">
				<div className="shadow card p-3">
					<TicketMembers ticket_id={data.ticket_id} />
				</div>
			</div>
		</div>
	</>;

}