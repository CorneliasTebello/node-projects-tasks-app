
import 'bootstrap/dist/css/bootstrap.min.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({isCollapsed}){


	const pathname = usePathname();	

	const linkClasses = `d-flex ${isCollapsed ? " justify-content-center" : "justify-content-start"}  nav-link`;

	function SidebarLinkItem({title, path, iconName}){
	
		return <li className="nav-item">
				<Link className={linkClasses  + (new RegExp(path).test(pathname) ? ' active' : ' text-white')} href={path} >
					<div style={{height:"20px", width:"20px"}} className={"align-bottom d-inline-flex"}><FontAwesomeIcon icon={iconName} /></div>
					{!isCollapsed && <div className="ms-2">{title}</div>}
				</Link>
			</li>
	}
	
	return <>
		
		<Link href="/" prefetch={true} className="text-decoration-none">
			<div className="d-flex justify-content-lg-start justify-content-center">
				<img className="" src="/icon.png" style={{maxWidth:"40px"}}  />
				{!isCollapsed &&
				<div className="align-content-center px-2 d-none d-lg-block text-truncate text-white">Projects and Tickets</div>}
			</div>
		</Link>
		
		<div className="py-5"></div>

		<a href="/projects/new" className="btn btn-primary btn-rounded rounded-pill w-100 text-truncate">+{!isCollapsed && " Create a project"}</a>

		<div className="py-3"></div>

		<ul className="nav nav-pills flex-column gap-2">
			<SidebarLinkItem title="Home" path="/home" iconName="house" />
			<SidebarLinkItem title="Projects" path="/projects" iconName="folder-open" />
			<SidebarLinkItem title="Tasks" path="/tasks" iconName="list-check" />
			<SidebarLinkItem title="Tickets" path="/tickets" iconName="ticket" />
			<SidebarLinkItem title="Users" path="/users" iconName="users" />
		</ul>
	</>
	
}