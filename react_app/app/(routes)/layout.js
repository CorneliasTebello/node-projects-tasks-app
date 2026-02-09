
//Fontawesome added here for global referencing of icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

// Add all icons from the imported styles to the library
library.add(fas);

import Header from '@components/Header.js';
//import Footer from '@components/Footer.js';
import Sidebar from '@components/Sidebar.js';

import LayoutWrapper from './LayoutWrapper.js';

export default function RootLayout({children}) {
  return (
	<LayoutWrapper>
		<div className="h-100">
			<Header />
			<div className="row">
				<div className="col-md-1 col-lg-2">
					<Sidebar />
				</div>
				<div className="col-sm-12 col-md-10 col-lg-8">
					{children}
				</div>
			</div>
		</div>
    </LayoutWrapper>
  );
}