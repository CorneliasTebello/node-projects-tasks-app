import Image from "next/image";

export default function Home() {
  return (
    <div className="align-content-center container h-100">
		<div className="">
			<div className="text-center">
				<p className="fs-1 fw-semibold">Welcome</p>
				<a href="/login" className="btn btn-outline-primary" >Login</a>
				<span className="px-2">OR</span>
				<a href="/register" className="btn btn-outline-primary" >Register</a>
			</div>
		</div>
    </div>
  );
}
