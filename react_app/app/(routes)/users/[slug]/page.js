

import UserForm from '@components/UserForm.js';

export default async function Page({params}){
	
	
	const {slug} = await params;
	
	if(slug == "new"){
		return 
		<LoginRegisterForm isRegister={true} noRedirect={true} />
	}
	
	return <UserForm user_id={slug} />
	
	
}