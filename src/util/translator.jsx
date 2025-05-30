export function translateFlag(flag) {
	switch (flag) {
		case "Red Flag" : return "Rødt flagg";
		case "Yellow Flag" : return "Gult flagg";
		case "Safety Car" : return "Sikkerhetsbil";
	}
}

export function translateCategory(category) {
	switch (category) {
		case "FIRST" : return "1.plass";
		case "TENTH" : return "10.plass";
		case "DRIVER" : return "Sjåfør";
		case "CONSTRUCTOR" : return "Konstruktør";
		case "FLAG" : return "Antall";
	}
}
