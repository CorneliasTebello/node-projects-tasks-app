export default function StatusBadge({status}){
	
	
	function badgeColorFromPickStatus(status){
		switch(status){
			case "Not Started" :
				return "text-bg-secondary";
			case "In Progress" :
				return "text-bg-info";
			case "Blocked" :
				return "text-bg-danger";
			case "On Hold" :
				return "text-bg-warning";
			case "Cancelled" :
				return "text-bg-primary";
			case "Completed" :
				return "text-bg-success";
			default :
				return "text-bg-light";
		}
	}
	
	return <>
		<span className={`badge ${badgeColorFromPickStatus(status)}`}>{status}</span>
	</>;
	
}