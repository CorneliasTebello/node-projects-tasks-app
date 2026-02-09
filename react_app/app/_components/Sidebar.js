import 'bootstrap/dist/css/bootstrap.min.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import Link from 'next/link';

export default function Sidebar(){
	
	return <>
		<div className="list-group">
			<Link className="list-group-item list-group-item-action py-3" href="/home" >
				<div style={{height:"20px", width:"20px"}} className="align-bottom d-inline-flex pe-1 me-1">
				<FontAwesomeIcon icon="house" /></div>
				Home</Link>
			<a href="/projects" className="list-group-item list-group-item-action py-3">
				<div style={{height:"20px", width:"20px"}} className="align-bottom d-inline-flex pe-1 me-1">
				<FontAwesomeIcon icon="file-lines" /></div>
				Projects</a>
			<a href="/tasks" className="list-group-item list-group-item-action py-3">
				<div style={{height:"20px", width:"20px"}} className="align-bottom d-inline-flex pe-1 me-1">
				<FontAwesomeIcon icon="square-check" /></div>
				Tasks</a>
			<a href="/tickets" className="list-group-item list-group-item-action py-3">
				<div style={{height:"20px", width:"20px"}} className="align-bottom d-inline-flex pe-1 me-1">
				<FontAwesomeIcon icon="ticket" /></div>
				Tickets</a>
			<a href="/users" className="list-group-item list-group-item-action py-3">
				<div style={{height:"20px", width:"20px"}} className="align-bottom d-inline-flex pe-1 me-1">
				<FontAwesomeIcon icon="users" /></div>
				Users</a>
		</div>
	</>
	
}