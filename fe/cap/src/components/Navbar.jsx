import React from "react";

const Navbar = () => {
	return (
		<>
			<div style={{ height: "35px" }}></div>
			<nav className="navbar fixed-top navbar-expand-lg bg-light">
				<div className="container-fluid">
					<a className="navbar-brand" href="/">
						<i className="fas fa-dice mr-2"></i>
						FunLB
					</a>
					<button
						className="navbar-toggler"
						type="button"
						data-toggle="collapse"
						data-target="#navbarSupportedContent"
						aria-controls="navbarSupportedContent"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<i className="fas fa-bars"></i>
					</button>
					<div className="collapse navbar-collapse" id="navbarSupportedContent">
						<ul className="navbar-nav ml-auto mb-2 mb-lg-0">
							<li className="nav-item">
								<a
									className="nav-link nav-link-1 active"
									aria-current="page"
									href="/"
								>
									Home
								</a>
							</li>

							<li className="nav-item">
								<a className="nav-link nav-link-3" href="/about">
									About
								</a>
							</li>
							<li className="nav-item">
								<a className="nav-link nav-link-4" href="/contact">
									Contact
								</a>
							</li>
							<li className="nav-item">
								<a className="nav-link nav-link-2" href="/my-events">
									My Events
								</a>
							</li>
							<li className="nav-item">
								<a className="nav-link nav-link-4" href="/profile">
									Profile
								</a>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</>
	);
};

export default Navbar;
