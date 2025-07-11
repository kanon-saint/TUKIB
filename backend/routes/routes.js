const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multerConfig');

// Import controller files
const loginController = require('../controllers/loginController');
const googleLoginController = require('../controllers/googleLoginController');
const eventsController = require('../controllers/eventsController');
const usersController = require('../controllers/usersController');
const messagesController = require('../controllers/messagesController');
const serviceRequestsController = require('../controllers/serviceRequestsController');
const equipmentsController = require('../controllers/equipmentsController');
const newsController = require('../controllers/newsController');
const trainingRequestsController = require('../controllers/trainingRequestsController');
const sampleProcessingRequestController = require('../controllers/sampleProcessingRequestController');
const equipmentRentalRequestController = require('../controllers/equipmentRentalRequestController');
const facilityRentalRequestsController = require('../controllers/facilityRentalRequestController');
const facilityController = require('../controllers/facilityController');
const laboratoryController = require('../controllers/laboratoryController');
const statisticsController = require('../controllers/statisticsController');
const feedbackController = require('../controllers/feedbackController');
const servicesController = require('../controllers/ratesAndServicesController');

// Routes for login
router.post('/login', loginController.handleLogin);
router.post('/google-login', googleLoginController.googleLoginController);

// Routes for signup
router.post('/signup', usersController.signupUser);

// Routes for fetching and managing events
router.get('/events', eventsController.getEvents);
router.post('/events', eventsController.createEvent);
router.put('/events/:id', eventsController.updateEvent);
router.delete('/events/:id', eventsController.deleteEvent);

// Routes for users management
router.get('/users', usersController.getUsers);
router.get('/users/:userId', usersController.getUserById);
router.post('/users', usersController.createUser);
router.delete('/users/:userId', usersController.deleteUser);
router.put('/users/:userId', usersController.editUser);

// Add the route to update the status
router.patch('/users/:userId/status', usersController.updateUserStatus);

// Routes for fetching and managing equipment
router.get('/equipments', equipmentsController.getEquipments);
router.post('/equipments', equipmentsController.addEquipment);
router.delete('/equipments/:id', equipmentsController.deleteEquipment);
router.get(
	'/equipments/lab/:laboratory_id',
	equipmentsController.getEquipmentByLab
);

// Routes for messages
router.get('/messages', messagesController.getMessages);
router.post('/messages/submit', messagesController.insertMessage);
router.get('/messages/:messageId/read', messagesController.updateMessageStatus);
router.get('/messages/:messageId', messagesController.getMessageDetails);

// Routes for news management
router.post('/news', newsController.createNews);
router.get('/news', newsController.getAllNews);
router.get('/news/:id', newsController.getNewsById);
router.put('/news/:id', newsController.updateNews);
router.delete('/news/:id', newsController.deleteNews);

// Routes for service requests
router.get('/serviceRequests', serviceRequestsController.getServiceRequests);
router.put(
	'/serviceRequest/:id/reject',
	serviceRequestsController.rejectServiceRequest
);
router.put(
	'/serviceRequest/:id/approve',
	serviceRequestsController.approveServiceRequest
);
router.get(
	'/serviceRequests/:userId',
	serviceRequestsController.getServiceRequestsById
);
router.put(
	'/serviceRequests/:requestId/cancel',
	serviceRequestsController.cancelServiceRequest
);
router.get(
	'/useOfEquipmentRequestDetails/:id',
	serviceRequestsController.getEquipmentRentalRequestById
);
router.get(
	'/useOfFacilityRequestDetails/:id',
	serviceRequestsController.getFacilityRentalRequestById
);
router.get(
	'/trainingRequestDetails/:id',
	serviceRequestsController.getTrainingRequestById
);
router.get(
	'/sampleProcessingRequestDetails/:id',
	serviceRequestsController.getSampleProcessingRequestById
);
router.put(
	'/serviceRequest/:id/reject',
	serviceRequestsController.rejectServiceRequest
);
router.put(
	'/serviceRequest/:id/approve',
	serviceRequestsController.approveServiceRequest
);
router.get(
	'/serviceRequests/:userId',
	serviceRequestsController.getServiceRequestsById
);
router.put(
	'/serviceRequests/:requestId/cancel',
	serviceRequestsController.cancelServiceRequest
);
router.get(
	'/useOfEquipmentRequestDetails/:id',
	serviceRequestsController.getEquipmentRentalRequestById
);
router.get(
	'/useOfFacilityRequestDetails/:id',
	serviceRequestsController.getFacilityRentalRequestById
);
router.get(
	'/trainingRequestDetails/:id',
	serviceRequestsController.getTrainingRequestById
);
router.get(
	'/sampleProcessingRequestDetails/:id',
	serviceRequestsController.getSampleProcessingRequestById
);
router.put(
	'/service-requests/:id/in-progress',
	serviceRequestsController.markAsInProgress
);
router.put(
	'/service-requests/:id/approveChargeSlip',
	serviceRequestsController.approveChargeSlip
);
router.put(
	'/service-requests/:id/uploadReceipt',
	serviceRequestsController.uploadReceipt
);
router.put(
	'/service-requests/:id/uploadResult',
	serviceRequestsController.uploadResult
);
router.put(
	'/service-requests/:id/completed',
	serviceRequestsController.markAsCompleted
);

// facility
router.post('/facility', facilityController.createFacility);
router.get('/facilities', facilityController.getAllFacilities);
router.get('/facility/schedules', facilityController.getFacilityWithSchedules);
router.delete('/facility/:id', facilityController.deleteFacility);

// laboratories and equipments
router.get('/laboratory', laboratoryController.getLaboratories);
router.get('/laboratory/:id', laboratoryController.getLaboratoryById);

// feedback
router.post('/feedback', feedbackController.insertFeedback);

// statistics for dashboard overview
router.get('/statistics', statisticsController.getDashboardStats);

// Route for training requests
router.post('/training-requests', upload, async (req, res) => {
	console.log('Files received:', req.files);
	console.log('Body received:', req.body);
	try {
		await trainingRequestsController.createTrainingRequest(req, res);
	} catch (error) {
		res.status(500).json({ message: 'Error processing the request' });
	}
});

// Route for sample processing requests
router.post('/sample-processing-requests', upload, async (req, res) => {
	console.log('Files received:', req.files);
	console.log('Body received:', req.body);

	if (!req.files) {
		return res.status(400).json({ message: 'No files uploaded' });
	}
	if (!req.body.user_id || !req.body.payment_option || !req.body.laboratory) {
		return res
			.status(400)
			.json({ message: 'Missing required fields in the request body' });
	}

	try {
		await sampleProcessingRequestController.createSampleProcessingRequest(
			req,
			res
		);
	} catch (error) {
		console.error('Error in processing request:', error.message || error);
		return res.status(500).json({
			message: 'Error processing the request',
			error: error.message || error,
		});
	}
});

// Route for equipment rental requests
router.post('/equipment-rental-requests', upload, async (req, res) => {
	console.log('Files received:', req.files);
	console.log('Body received:', req.body);
	try {
		await equipmentRentalRequestController.createEquipmentRentalRequest(
			req,
			res
		);
	} catch (error) {
		res.status(500).json({ message: 'Error processing the request' });
	}
});

router.post('/facility-rental-requests', upload, async (req, res) => {
	console.log('Files received:', req.files);
	console.log('Body received:', req.body);
	try {
		await facilityRentalRequestsController.createFacilityRentalRequest(
			req,
			res
		);
	} catch (error) {
		res.status(500).json({ message: 'Error processing the request' });
	}
});

// Route for services and rates
router.get('/services', servicesController.getAllServices); // Get all services
router.get('/services/type/:serviceType', servicesController.getServicesByType); // Get services by type
router.get('/services/lab/:laboratory', servicesController.getServicesByLab); // Get services by laboratory
router.get('/services/:serviceId', servicesController.getServiceById); // Get service by ID
router.get('/laboratories', servicesController.getAllLaboratories); // Get all laboratories
router.post('/services', servicesController.createService); // Create a new service
router.put('/services/:serviceId', servicesController.updateService); // Update a service
router.delete('/services/:serviceId', servicesController.deleteService); // Delete a service

// Export the router
module.exports = router;
