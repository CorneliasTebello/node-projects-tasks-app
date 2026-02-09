

export default function RestAPI(reqCookies){
	
		
	const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/";
	const headers = { "Content-Type": "application/json" };
	
	
	if (reqCookies) headers.cookie = reqCookies;
	
	async function fetchData(Sub_Url,array_url_parts,params){
		
		try{
			let Full_Url = API_BASE_URL + Sub_Url;
			
			if(array_url_parts?.length > 0){
				 Full_Url = Full_Url + "/" + array_url_parts.join("/");
			}
			
			if(params){
				Full_Url = Full_Url + "?" + new URLSearchParams(params).toString();
			}
			
			
			const res = await fetch(Full_Url, {
				
				credentials: "include",
				headers: headers
			});
			
			/*if(!res.ok){
				throw new Error("Failed to fetch data");
			}*/
			
			return res;
		}catch(e){
			return {success:false,message:e};
		}
		
	};
	
	
	async function postData(Sub_Url,objectData){
		try{
			const res = await fetch(API_BASE_URL + Sub_Url, {
				method: 'POST',
				credentials: "include",
				headers: headers,
				body: JSON.stringify(objectData)
			});
			
			return res;
		}catch(e){
			return {success:false,message:e};
		}
	}
	
	
	
	async function updateData(Sub_Url,objectData,entity_id){
		try{
			const res = await fetch(API_BASE_URL + Sub_Url + "/" + entity_id, {
				method: 'PUT',
				credentials: "include",
				headers: headers,
				body: JSON.stringify(objectData)
			});
			
			return res;
		}catch(e){
			return {success:false,message:e};
		}
	}
	
	
	async function deleteData(Sub_Url,entity_id){
		try{
			const res = await fetch(API_BASE_URL + Sub_Url + "/" + entity_id, {
			  method: 'DELETE',
				credentials: "include",
			  headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				//Authorization: `Bearer ${token}`,
			  }
			});
			
			return res;
		}catch(e){
			return {success:false,message:e};
		}
	}
	
	
	return {
		
		fetchProjects 		: async (array_url_parts,params) => fetchData("projects",array_url_parts,params),
		fetchProjectTasks	: async (project_id,params) => fetchData("projects",[project_id,"tasks"],params),
		fetchProjectMembers	: async (project_id,params) => fetchData("projects",[project_id,"users"],params),
		addProjectMember	: async (project_id,data) => postData(`projects/${project_id}/users/${data.user_id}`,data),
		deleteProjectMember	: async (project_id,data) => deleteData(`projects/${project_id}/users/`,data.user_id),
		createProject 		: async (data) => postData("projects",data),
		updateProject 		: async (data,entity_id) => updateData("projects",data,entity_id),
		deleteProject	 	: async (entity_id) => deleteData("projects",entity_id),
		
		fetchUsers	 		: async (array_url_parts,params) => fetchData("users",array_url_parts,params),
		updateUser	 		: async (data,entity_id) => updateData("users",data,entity_id),
		createUser	 		: async (data) => postData("users",data),
		deleteUser		 	: async (entity_id) => deleteData("users",entity_id),
		
		fetchTasks			: async (array_url_parts,params) => fetchData("tasks",array_url_parts,params),
		createTask 			: async (data) => postData("tasks",data),
		createTaskForProject: async (data,project_id) => postData(`projects/${project_id}/tasks`,data),
		updateTask	 		: async (data,entity_id) => updateData("tasks",data,entity_id),
		deleteTask	 		: async (entity_id) => deleteData("tasks",entity_id),
		
		fetchTickets			: async (array_url_parts,params) => fetchData("tickets",array_url_parts,params),
		fetchTicketMembers		: async (entity_id,params) => fetchData("tickets",[entity_id,"users"],params),
		addTicketMember			: async (data,ticket_id) => postData(`tickets/${ticket_id}/users`,data),
		deleteTicketMember		: async (data,user_id) => deleteData(`tickets/${data.ticket_id}/users`,user_id),
		createTicket 			: async (data) => postData("tickets",data),
		updateTicket	 		: async (data,entity_id) => updateData("tickets",data,entity_id),
		deleteTicket	 		: async (entity_id) => deleteData("tickets",entity_id),
	}
	
	
}