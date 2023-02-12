import {Filter, MField, Options, SField, Where} from "../Models/QueryModel";
import {InsightError} from "./IInsightFacade";
import {hasComparator, hasRequiredLength} from "./QueryModelHelpers";

export {isSField, isSKey, isMKey, isMField, isSection, isWhere, isFilterList,
	isSComparison, isMComparison, isOptions, isKey, isField, isFilter};

function isSField(arg: string): boolean {
	return Object.values(SField).includes(arg as unknown as SField);
}

function isSKey(input: any): boolean {
	if(!input.includes("_")) {
		throw new InsightError("SKey does not have '_'");
	}
	let inputArr: string[] = input.split("_");
	if (inputArr.length > 2) {
		throw new InsightError("SKey has more than 1 '_'");
	}
	if (!isSField(inputArr[1])) {
		throw new InsightError("SField is invalid");
	}
	if (!isSection(inputArr[0])) {
		throw new InsightError("Invalid section");
	}
	return true;
}

function isSection(arg: string): boolean {
	// TODO implement isSection and keep track of primary section (can only refer to 1 section at a time)
	return true;
}

function isSComparison(arg: any): boolean {
	if (!hasRequiredLength(arg, 1)) {
		throw new InsightError("SComparison has too many keys");
	} else {
		for (const property in arg) {
			isSKey(JSON.parse(JSON.stringify(property)));
			if (!(typeof arg[property] === "string")) {
				throw new InsightError("Comparison must have string");
			}
		}
	}
	return true;
}

function isMField(arg: string): boolean {
	return Object.values(MField).includes(arg as unknown as MField);
}
function isMKey(input: any): boolean {
	if(!input.includes("_")) {
		throw new InsightError("MKey does not have '_'");
	}
	let inputArr: string[] = input.split("_");
	if (inputArr.length > 2) {
		throw new InsightError("MKey has more than 1 '_'");
	}
	if (!isMField(inputArr[1])) {
		throw new InsightError("MField is invalid");
	}
	if (!isSection(inputArr[0])) {
		throw new InsightError("Section is invalid");
	}
	return true;
}

// returns true if MComparison is formatted correctly
function isMComparison(arg: any): boolean {
	if (!hasRequiredLength(arg, 1)) {
		throw new InsightError("MComparison has too many keys");
	} else {
		for (const property in arg) {
			isMKey(JSON.parse(JSON.stringify(property)));
			if (!(typeof arg[property] === "number")) {
				throw new InsightError("Comparison must have number");
			}
		}
	}
	return true;
}

// returns true if arg is a list and every element in list is a filter
function isFilterList(arg: any): arg is Filter[] {
	if (arg.constructor.name !== "Array") {
		throw new InsightError("Logic comparison does not have filter list");
	}
	arg.forEach((filter: any) => {
		isFilter(filter);
	});
	return true;
}

// returns true if WHERE is properly formatted with one comparator throws InsightError if no comparator or only 1 key
function isWhere(arg: any): arg is Where {
	if (!hasComparator(arg)) {
		throw new InsightError("WHERE does not have a comparator");
	} else if (!hasRequiredLength(arg, 1)) {
		throw new InsightError("WHERE should only have 1 key");
	} else {
		return true;
	}
}

function isFilter(arg: any): arg is Filter {
	if (!hasComparator(arg)) {
		throw new InsightError("filter does not have a comparator");
	} else if (!hasRequiredLength(arg, 1)) {
		throw new InsightError("filter should only have 1 key");
	} else {
		return true;
	}
}

// returns true if arg has property COLUMNS defined
// TODO needs more testing
function isOptions(arg: any): arg is Options {
	if (arg.COLUMNS === undefined) {
		throw new InsightError("OPTIONS missing COLUMNS");
	} else if (arg.ORDER === undefined && hasRequiredLength(arg, 2)) {
		// throw error if it does not have order and columns
		throw new InsightError("invalid keys in OPTIONS 1");
	} else if (!(hasRequiredLength(arg, 1) || hasRequiredLength(arg, 2))) {
		throw new InsightError("invalid keys in OPTIONS");
	} else {
		return true;
	}
}

function isField(field: string) {
	return isMField(field) || isSField(field);
}

function isKey(input: string) {
	if(!input.includes("_")) {
		throw new InsightError("Key does not have '_'");
	}
	let inputArr: string[] = input.split("_");
	if (inputArr.length > 2) {
		throw new InsightError("Key has more than 1 '_'");
	}
	if (!isField(inputArr[1])) {
		throw new InsightError("Field is invalid");
	}
	if (!isSection(inputArr[0])) {
		throw new InsightError("Section is invalid");
	}
	return true;
}


