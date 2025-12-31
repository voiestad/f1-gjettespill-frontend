export function translateFlag(flag) {
	switch (flag) {
		case "Red Flag" : return "Rødt flagg";
		case "Yellow Flag" : return "Gult flagg";
		case "Safety Car" : return "Sikkerhetsbil";
		case "RED_FLAG" : return "Rødt flagg";
		case "YELLOW_FLAG" : return "Gult flagg";
		case "SAFETY_CAR" : return "Sikkerhetsbil";
	}
}

export function translateCategory(category) {
	switch (category) {
		case "FIRST" : return "1. plass";
		case "TENTH" : return "10. plass";
		case "DRIVER" : return "Sjåfør";
		case "CONSTRUCTOR" : return "Konstruktør";
		case "FLAG" : return "Antall";
		case "POLE" : return "Pole";
	}
}

export function translateSession(session) {
	switch (session) {
		case "RACE" : return "Løp";
		case "SPRINT" : return "Sprint";
	}
}
