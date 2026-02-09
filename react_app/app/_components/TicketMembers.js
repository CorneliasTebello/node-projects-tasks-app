'use client';

//React imports
import { useEffect, useState } from 'react';

//Local imports
import LoadingAnimation from '@components/LoadingAnimation.js';
import ModalMembersList from '@components/ModalMembersList.js';
//import MemberItem from '@components/MemberItem.js';
import RestAPI from '@service/RestAPI.js';



export default function TicketMembers({ticket_id}){
	
		const [isLoading, setIsLoading] = useState(true);
		const [membersData,setMembersData] = useState([]);
		const [showMembersModal, setShowMembersModal] = useState(false);
		
		
		useEffect(() => {
			
			fetchData(ticket_id);
			
		},[]);
		
		async function fetchData(ticket_id){
			
			
			setIsLoading(true);
			
			
			try{
				const res = await RestAPI().fetchTicketMembers(ticket_id);
				const data = await res.json();
					
					
				if(data.success == false){
					
				}else if(data.length > 0){
					setMembersData(data);
				}
			}catch(e){
				
			}
		
			setIsLoading(false);
		}
		
	
	
		function handleAddMember(e){
			
			e.preventDefault();
			
			setShowMembersModal(true);
			
			console.log("Show members modal");
			
		}
		
		function handleMemberSelected(member){
			
			try{
				
				const loggedInUser = JSON.parse(localStorage.getItem("user"));
				
				member = {...member, 
					assigned_user_id: member.user_id,
					assigned_first_name: member.first_name,
					assigned_last_name: member.last_name,
					assigned_email: member.email,
					ticket_id: ticket_id,
					assigned_by_user_id: loggedInUser.user_id,
					assigned_by_first_name: loggedInUser.first_name,
					assigned_by_last_name: loggedInUser.last_name,
					assigned_email: loggedInUser.email,
				}
			
				RestAPI().addTicketMember(member, ticket_id).then((res) =>{
					res.json().then((json) => {
						if(json.success == true){
							setMembersData(prev => [member, ...prev]);
						}
					})
				});
			
			}catch(e){
				
			}
			
			
		}
		
		function handleRemoveMember(e, member){
			
			e.preventDefault();
			
			try{
				if(confirm("Are you sure you want to remove this member?")){
					
					RestAPI().deleteTicketMember({ticket_id:ticket_id},member.assigned_user_id).then((res) =>{
						
						console.log(res);
						
						if(!(res.status >= 200 && res.status <= 299)){
							alert("Member removal could not be completed.");
							return;
						}
						
						res.json().then((json) => {
							if(json.success == true){
								setMembersData(prev => membersData.filter((ele) => ele.user_id != member.user_id ));
							}else{
								alert("Member removal could not be completed.");
							}
						})
					});
				}
			}catch(e){
				alert("Member removal could not be completed.");
			}
		}
		
	
		function handleModalClose(){
			setShowMembersModal(false);
		}
		
		
		return <>
		
		{showMembersModal == true && <ModalMembersList ticket_id={ticket_id} onMemberSelect={handleMemberSelected} onModalClose={handleModalClose} />}
		
		<h3 className="mb-3">Ticket Members
		<button className="btn btn-sm btn-primary float-end" onClick={(e) => handleAddMember(e)}>+ Add Member</button></h3>
		{isLoading ? <div className="text-center my-4"><LoadingAnimation /></div>  : 
		(membersData.length == 0 ? <p>No members for ticket</p> :
			<table className="table">
				<thead><tr><th>Name</th><th>Assigned By</th><th></th></tr></thead>
				<tbody>
				{membersData.map((member) => (
					<tr key={member.assigned_user_id} className="">
						<td>{member.assigned_first_name} {member.assigned_last_name}</td>
						<td>{member.assigned_by_first_name} {member.assigned_by_last_name}</td>
						<td className="d-flex justify-content-end"><button className="btn btn-sm btn-danger float-end" onClick={(e) => handleRemoveMember(e,member)}>Remove Member</button></td>
					</tr>
				))}
				</tbody>
			</table>
			)
		}
		</>;
		
}