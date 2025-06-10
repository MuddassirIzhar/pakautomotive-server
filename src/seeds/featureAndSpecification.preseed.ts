import { Request, Response } from "express";
import { Manager } from "../app-data-source";
import {
	CategoryEnum,
	FeatureAndSpecification,
	FieldEnum,
	TypeEnum,
} from "../entities/feature-and-specification.entity";

export const featureAndSpecificationSeed = async (
	req: Request,
	res: Response
) => {
	const FeatureAndSpecificationRepository = Manager.getRepository(
		FeatureAndSpecification
	);
    await Manager.query("SET FOREIGN_KEY_CHECKS = 0; TRUNCATE table feature_and_specifications; SET FOREIGN_KEY_CHECKS = 1;");
	// await FeatureAndSpecificationRepository.delete({});

	// Seed Specifications
	const specifications = [
		// Dimensions
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.DIMENSIONS,
			name: "Overall Length",
			field: FieldEnum.TEXT,
		},
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.DIMENSIONS,
			name: "Kerb Weight",
			field: FieldEnum.TEXT,
		},
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.DIMENSIONS,
			name: "Overall Width",
			field: FieldEnum.TEXT,
		},
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.DIMENSIONS,
			name: "Boot Space",
			field: FieldEnum.TEXT,
		},
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.DIMENSIONS,
			name: "Overall Height",
			field: FieldEnum.TEXT,
		},
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.DIMENSIONS,
			name: "Seating Capacity",
			field: FieldEnum.TEXT,
		},
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.DIMENSIONS,
			name: "Wheel Base",
			field: FieldEnum.TEXT,
		},
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.DIMENSIONS,
			name: "No. of Doors",
			field: FieldEnum.NUMBER,
		},
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.DIMENSIONS,
			name: "Ground Clearance",
			field: FieldEnum.TEXT,
		},

		// Engine/Motor
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.ENGINE_MOTOR,
			name: "Engine Type",
			field: FieldEnum.TEXT,
		},
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.ENGINE_MOTOR,
			name: "Turbo Charger",
			field: FieldEnum.TEXT,
		},
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.ENGINE_MOTOR,
			name: "Displacement",
			field: FieldEnum.TEXT,
		},
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.ENGINE_MOTOR,
			name: "No. of Cylinders",
			field: FieldEnum.NUMBER,
		},
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.ENGINE_MOTOR,
			name: "Drive Train",
			field: FieldEnum.TEXT,
		},
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.ENGINE_MOTOR,
			name: "Cylinder Configuration",
			field: FieldEnum.TEXT,
		},
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.ENGINE_MOTOR,
			name: "Horse Power",
			field: FieldEnum.TEXT,
		},
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.ENGINE_MOTOR,
			name: "Compression Ratio",
			field: FieldEnum.TEXT,
		},
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.ENGINE_MOTOR,
			name: "Torque",
			field: FieldEnum.TEXT,
		},
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.ENGINE_MOTOR,
			name: "Valves per Cylinder",
			field: FieldEnum.NUMBER,
		},
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.ENGINE_MOTOR,
			name: "Fuel System",
			field: FieldEnum.TEXT,
		},
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.ENGINE_MOTOR,
			name: "Valve Mechanism",
			field: FieldEnum.TEXT,
		},
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.ENGINE_MOTOR,
			name: "Max Speed",
			field: FieldEnum.TEXT,
		},

		// Transmission
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.TRANSMISSION,
			name: "Transmission Type",
			field: FieldEnum.TEXT,
		},
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.TRANSMISSION,
			name: "Gearbox",
			field: FieldEnum.NUMBER,
		},

		// Steering
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.STEERING,
			name: "Steering Type",
			field: FieldEnum.TEXT,
		},
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.STEERING,
			name: "Minimum Turning Radius",
			field: FieldEnum.TEXT,
		},
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.STEERING,
			name: "Power Assisted",
			field: FieldEnum.TEXT,
		},

		// Suspension & Brakes
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.SUSPENSION_BRAKES,
			name: "Front Suspension",
			field: FieldEnum.TEXT,
		},
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.SUSPENSION_BRAKES,
			name: "Front Brakes",
			field: FieldEnum.TEXT,
		},
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.SUSPENSION_BRAKES,
			name: "Rear Suspension",
			field: FieldEnum.TEXT,
		},
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.SUSPENSION_BRAKES,
			name: "Rear Brakes",
			field: FieldEnum.TEXT,
		},

		// Wheels and Tyres
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.WHEELS_TYRES,
			name: "Wheel Type",
			field: FieldEnum.TEXT,
		},
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.WHEELS_TYRES,
			name: "Tyre Size",
			field: FieldEnum.TEXT,
		},
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.WHEELS_TYRES,
			name: "Wheel Size",
			field: FieldEnum.TEXT,
		},
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.WHEELS_TYRES,
			name: "Spare Tyre",
			field: FieldEnum.TEXT,
		},
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.WHEELS_TYRES,
			name: "PCD",
			field: FieldEnum.TEXT,
		},
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.WHEELS_TYRES,
			name: "Spare Tyre Size",
			field: FieldEnum.TEXT,
		},

		// Fuel Economy
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.FUEL_ECONOMY,
			name: "Mileage City",
			field: FieldEnum.TEXT,
		},
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.FUEL_ECONOMY,
			name: "Fuel Tank Capacity",
			field: FieldEnum.TEXT,
		},
		{
			type: TypeEnum.SPECIFICATION,
			category: CategoryEnum.FUEL_ECONOMY,
			name: "Mileage Highway",
			field: FieldEnum.TEXT,
		},
	];

	// Seed Features
	const features = [
		// Safety
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.SAFETY,
			name: "No. of Airbags",
			field: FieldEnum.NUMBER,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.SAFETY,
			name: "Speed Sensing Auto Door Lock",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.SAFETY,
			name: "No. of Seatbelts",
			field: FieldEnum.NUMBER,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.SAFETY,
			name: "Anti-Theft Alarm System",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.SAFETY,
			name: "Driver Seat Belt Warning",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.SAFETY,
			name: "Down Hill Assist Control",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.SAFETY,
			name: "Passenger Seat Belt Warning",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.SAFETY,
			name: "Hill Start Assist Control",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.SAFETY,
			name: "Immobilizer",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.SAFETY,
			name: "Traction Control",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.SAFETY,
			name: "Door Opening Warning",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.SAFETY,
			name: "Vehicle Stability Control",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.SAFETY,
			name: "Child Lock",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.SAFETY,
			name: "Rear Fog Lamp",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.SAFETY,
			name: "ISOFIX Child Seat Anchors",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.SAFETY,
			name: "Autonomous Emergency Braking (AEB)",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.SAFETY,
			name: "High Mount Stop Lamp",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.SAFETY,
			name: "BlindSpot Detection (BSD)",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.SAFETY,
			name: "Anti-Lock Braking System (ABS)",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.SAFETY,
			name: "Lane Departure Warning System (LDWS)",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.SAFETY,
			name: "Electronic Brake-Force Distribution (EBD)",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.SAFETY,
			name: "Lane Keep Assist System (LKAS)",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.SAFETY,
			name: "Brake Assist (BA)",
			field: FieldEnum.BOOLEAN,
		},

		// Exterior
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.EXTERIOR,
			name: "Alloy Wheels",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.EXTERIOR,
			name: "Colored Outside Door Handles",
			field: FieldEnum.TEXT,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.EXTERIOR,
			name: "Rear Spoiler",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.EXTERIOR,
			name: "Side Mirrors with Indicators",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.EXTERIOR,
			name: "Sun Roof",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.EXTERIOR,
			name: "Moon Roof",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.EXTERIOR,
			name: "Fog Lights",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.EXTERIOR,
			name: "DRLs",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.EXTERIOR,
			name: "Roof Rails",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.EXTERIOR,
			name: "Side Steps",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.EXTERIOR,
			name: "Dual Exhaust",
			field: FieldEnum.BOOLEAN,
		},

		// Instrumentation
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.INSTRUMENTATION,
			name: "Tachometer",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.INSTRUMENTATION,
			name: "Multi Info",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.INSTRUMENTATION,
			name: "Information Cluster",
			field: FieldEnum.TEXT,
		},

		// Infotainment
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.INFOTAINMENT,
			name: "CD Player",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.INFOTAINMENT,
			name: "DVD Player",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.INFOTAINMENT,
			name: "Number of Speakers",
			field: FieldEnum.NUMBER,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.INFOTAINMENT,
			name: "USB and Auxillary Cable",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.INFOTAINMENT,
			name: "Front Speakers",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.INFOTAINMENT,
			name: "Bluetooth Connectivity",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.INFOTAINMENT,
			name: "Rear Speakers",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.INFOTAINMENT,
			name: "Display Size",
			field: FieldEnum.TEXT,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.INFOTAINMENT,
			name: "Rear Seat Entertainment",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.INFOTAINMENT,
			name: "Voice Control",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.INFOTAINMENT,
			name: "Android Auto",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.INFOTAINMENT,
			name: "Apple Car Play",
			field: FieldEnum.BOOLEAN,
		},

		// Comfort and Convenience
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Air Conditioner",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Rain Sensing Wipers",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Climate Control",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Heads Up Display (HUD)",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Air Purifier",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Cruise Control",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Rear AC Vents",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Driving Modes",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "3rd Row AC Vents",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Paddle Shifter",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Heater",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Key Type",
			field: FieldEnum.TEXT,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Heated Seats",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Keyless Entry",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Defogger",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Push Start",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "CoolBox",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Remote Engine Start",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Navigation",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Central Locking",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Optional Navigation",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Power Door Locks",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Front Camera",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Rear Camera",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Power Steering",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Power Windows",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "360 Camera",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Power Mirrors",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Front Parking Sensors",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Auto Retractable Side Mirrors",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Rear Parking Sensors",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Power Boot",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Auto-Dimming Rear View Mirror",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Cup Holders",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Rear Central Control",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Arm Rest",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Rear Folding Seat",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Handbrake",
			field: FieldEnum.TEXT,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Rear Headrest",
			field: FieldEnum.NUMBER,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Auto Brake Hold",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Rear Wiper",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Auto Parking System",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Seat Material Type",
			field: FieldEnum.TEXT,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Interior Lighting",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Driver Seat Electric Adjustment",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Glove Box Lamp",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Driver Seat Lumbar Support",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Cargo Light",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Driver Seat Memory Function",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Front Power Outlet",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Passenger Seat Electric Adjustment",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Rear Power Outlet",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Steering Adjustment",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Tyre Pressure Monitoring System (TPMS)",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Steering Switches",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Wireless Charger",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Headlight On Reminder",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Boss Seat Switch",
			field: FieldEnum.BOOLEAN,
		},
		{
			type: TypeEnum.FEATURE,
			category: CategoryEnum.COMFORT_CONVENIENCE,
			name: "Automatic Head Lamps",
			field: FieldEnum.BOOLEAN,
		},
	];

	await FeatureAndSpecificationRepository.save(specifications);
	await FeatureAndSpecificationRepository.save(features);
	res.status(201).send({
		message: "specifications and features seeded successfully",
	});
};
