
//Fontawesome added here for global referencing of icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

// Add all icons from the imported styles to the library
library.add(fas);

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import StatusBadge from '@components/StatusBadge.js';

export default function TicketCard({ticket_id, name, description,  date_created, date_updated}){
	
	const fontawesomeContainerStyle = {
		height:"20px", 
		width:"20px",
		position: "absolute",
		right: "15px",
		top: "15px",
		transform: "rotateZ(45deg)",
		color:"#0d6efd"
	};
	
	
	return <>
		<a href={`/tickets/${ticket_id}`} className="shadow card p-3 text-decoration-none">
			<div style={fontawesomeContainerStyle} className="align-bottom d-inline-flex pe-1 me-1">
				<FontAwesomeIcon icon="ticket" />
			</div>
			<div className="fs-4">
				{name}
			</div>
			<div className="py-4"></div>
			<div className="">
				<div className="text-muted">
					Date Created<br/>
					{date_created}
				</div>
			</div>
		</a>
	</>
}