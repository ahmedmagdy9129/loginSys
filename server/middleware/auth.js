const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');



// Protect routes
exports.protect = async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer', null)
	) {
		// Set token from Bearer token
		token = req.headers.authorization.split(' ')[1];
	} 
		
	
	// Make sure token exists
	if (!token) {
		return next(
			new ErrorResponse('Not authorized to access this route', 401)
		);
	}

	try {
		// verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);


		req.user = await User.findById(decoded.id);

		next();
	} catch (err) {
		return next(
			new ErrorResponse('Not authorized to access this route', 401)
		);
	}
};


// Grant access to specific roles
exports.authorize = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new ErrorResponse(
					`User role ${req.user.role} is not authorized to access this route`,
					403
				)
			);
		}
		next();
	};
};


exports.ipAdrees = async (...ip) =>{
	// http://api.ipify.org/?format=json
	// fetch('http://api.ipify.org/?format=json')
	// 	.then(result => result.json())
	// 	.then(data => console.log(data.ip))
	
	// const res = await data.json({
	// 	ip: res
	// })
	// console.log(res)
}