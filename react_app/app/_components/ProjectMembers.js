'use client';

//React imports
import { useEffect, useState } from 'react';

//Local imports
import LoadingAnimation from '@components/LoadingAnimation.js';
import ModalMembersList from '@components/ModalMembersList.js';
//import MemberItem from '@components/MemberItem.js';
import RestAPI from '@service/RestAPI.js';



export default function ProjectMembers({project_id}){
	
		const [isLoading, setIsLoading] = useState(true);
		const [membersData,setMembersData] = useState([]);
		const [showMembersModal, setShowMembersModal] = useState(false);
		
		
		useEffect(() => {
			
			fetchData(project_id);
			
		},[]);
		
		async function fetchData(project_id){
			
			
			setIsLoading(true);
			
			
			try{
				const res = await RestAPI().fetchProjectMembers(project_id);
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
		
			RestAPI().addProjectMember(project_id,member).then((res) =>{
				res.json().then((json) => {
					if(json.success == true){
						setMembersData(prev => [member, ...prev]);
					}
				})
			});
			
			
		}
		
		function handleRemoveMember(e, member){
			
			e.preventDefault();
			
			try{
				if(confirm("Are you sure you want to remove this member?")){
					
					RestAPI().deleteProjectMember(project_id,member).then((res) =>{
						
						
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
		
		{showMembersModal == true && <ModalMembersList project_id={project_id} onMemberSelect={handleMemberSelected} onModalClose={handleModalClose} />}
		
		<h3 className="mb-3">Project Members
		<button className="btn btn-sm btn-primary float-end" onClick={(e) => handleAddMember(e)}>+ Add Member</button></h3>
		{isLoading ? <div className="text-center my-4"><LoadingAnimation /></div>  : 
		(membersData.length == 0 ? <p>No members for project</p> :
			<ul className="list-unstyled">
			{membersData.map((member)=>(
				<li key={member.user_id} className="py-2">
					<div>
						{member.first_name} {member.last_name}
						<button className="btn btn-sm btn-danger float-end" onClick={(e) => handleRemoveMember(e,member)}>Remove Member</button>
					</div>
				</li>
			))}
			</ul>
			)
		}
		</>;
		
}