import RestAPI from '@service/RestAPI.js';
import TicketForm from '@components/TicketForm.js';

import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function Page({params}){
	
	
	const {id} = await params;
	let ticketData = {};
	
	const cookieStore = await cookies();           // Read cookies from request
	
	if(parseInt(id) > 0){
		const res = await RestAPI(cookieStore.toString()).fetchTickets([id]);
		
		ticketData = (await res.json())[0];
	}
	
	if(!ticketData){
		notFound();
	}
	
	
	return <TicketForm {...ticketData} />

}