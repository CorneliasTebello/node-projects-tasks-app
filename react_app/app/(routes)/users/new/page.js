import UserForm from '@components/UserForm.js';
import LoginRegisterForm from '@components/LoginRegisterForm.js';

export default function Page({params}){
	
	
	return <>
		<LoginRegisterForm isRegister={true} noRedirect={true} />
	</>;
}