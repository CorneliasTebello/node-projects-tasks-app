
import LoginRegisterForm from '@components/LoginRegisterForm.js';

export default async function Page({searchParams}){
	
	return <>
		<LoginRegisterForm isRegister={true} />
		
	</>;
}