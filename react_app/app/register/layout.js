export default function RootLayout({children}) {
  return (
    <div className="align-content-center container h-100">
		<div className="row">
			<div className="col-md-1 col-lg-2"></div>
			<div className="col-sm-12 col-md-10 col-lg-8">{children}</div>
			<div className="col-md-1 col-lg-2"></div>
		</div>
    </div>
  );
}