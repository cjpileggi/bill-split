/*
* BillSplit
* Calculate payments, taxes and tips per person based on data entered in various forms
*
* v1.1 (7/11/2016) - Added contribution-per-person elements and calculations
*/
(function () {

	var pCnt = 0 // Total People
	, taxPcent = 0.000 // Sales Tax Percent
	, pPrices = [] // Cost per person
	, pContr = []; // Contribution per person

	document.forms["f1"]["subF1"].onclick = valF1;

	// Validation for Form 1 input fields (Number of people and Sales Tax)
	// Generates and displays error message if they do not match regular expressions
	function valF1(){
		var vPNum = document.forms["f1"]["pNum"].value
		, vTax = document.forms["f1"]["taxIn"].value
		, v1f1 = document.getElementById("v1f1")
		, v2f1 = document.getElementById("v2f1")
		//, regPNum = new RegExp("/^((50)|([1-4]\d)|([1-9]))$/") // Test input 1: Up to 50 people
		//, regTax = new RegExp("/^\d\d?(\.\d\d?\d?)?$/") // Decimal between 0 to 99.999 
		, esc = true; // Toggle
		
		// Test Input 1: Number of people (Up to 50 people)
		if ( !/^((50)|([1-4]\d)|([1-9]))$/.test(vPNum) ) {
			if (typeof(v1f1) === 'undefined' || v1f1 === null) { // Create message if it has not already been created
				var newVal = document.createElement("span");
				newVal.appendChild(document.createTextNode(" Must be a number between 1 and 100"));
				newVal.setAttribute("id", "v1f1");
				newVal.style.color = "red";
				//newVal.style.opacity = 0;
				newVal.style.display = "none";
				document.getElementById("i1").appendChild(newVal);
			}
			$("#v1f1").fadeIn(250);
			esc = false;
		}
		else {
			if (typeof(v1f1) !== 'undefined' || v1f1 !== null) {$("#v1f1").fadeOut(250);} // If message appeared, fade out when corrected
		}
		
		// Test Input 2: Sales tax (Decimal between 0 to 99.999 )
		if (!/^\d\d?(\.\d\d?\d?)?$/.test(vTax)){
			if (typeof(v2f1) === 'undefined' || v2f1 === null) {
				var newVal = document.createElement("span");
				newVal.appendChild(document.createTextNode(" Must be a whole number or decimal."));
				newVal.setAttribute("id", "v2f1");
				newVal.style.color = "red";
				//newVal.style.opacity = 0;
				newVal.style.display = "none";
				document.getElementById("i2").appendChild(newVal);
			}
			$("#v2f1").fadeIn(250);
			esc = false;
		}
		else {
			if (typeof(v2f1) !== 'undefined' || v2f1 !== null) {
				$("#v2f1").fadeOut(250);
				//document.getElementById("i2").removeChild(document.getElementById("i2").childNodes[1]);
			}
		}
		if(esc===false){return false;} //Exit function if input conditions are not met
		
		$("#f1").fadeOut(250); // Remove form 1 from view
		pCnt = vPNum; // Assign global variable s
		taxPcent = decPrec(vTax, 3); // Assign global tax variable to the nearest 3 decimal places
		setTimeout(function() {createF2();}, 50); //Create form 2 with small delay
	}

	// Create input fields for Form 2
	// Contains fields used to enter the costs and payments for individual people
	// Number of fields created is determined by the number of people entered in Form 1
	function createF2() {
		//document.body.removeChild(document.getElementById("f1"));
		var i=1; // Counter
		document.getElementById("f2").style.display = "block";
		createAndDropIn();

		// Recursive function to create and fade in and drop in input fields with delay 
		// Recursively called until the number of input fields reach the number of people entered; the loop then breaks
		function createAndDropIn() {
			// When the counter surpasses the number of people, create the submit button and break out of the function
			if(i > pCnt) {
				var sub2 = document.createElement("input");
				sub2.setAttribute("id", "subF2");
				sub2.setAttribute("type", "button");
				sub2.setAttribute("value","Submit")
				document.getElementById("f2").appendChild(sub2);
				document.getElementById("subF2").onclick = valF2;
				dropIn(document.getElementById("subF2"));
				return true;
			}
			// Create input fields with slight delay between the creation of each field
			setTimeout(function() {
				var para = document.createElement("p")
				, inpCost = document.createElement("input")
				, inpSpend = document.createElement("input")
				, linebreak1 = document.createElement("br")
				, linebreak2 = document.createElement("br")
				, linebreak3 = document.createElement("br");
				para.appendChild(document.createTextNode("Person " + i + ": Order - $"));
				para.setAttribute("id", "f2P" + i);
				para.setAttribute("style" , "position:relative;display:none;");
				inpCost.setAttribute("name", "inp" + i);
				inpSpend.setAttribute("name", "inpC" + i);
				inpCost.setAttribute("type", "text");
				inpSpend.setAttribute("type", "text");
				document.getElementById("f2").appendChild(para);
				document.getElementById("f2P" + i).appendChild(inpCost);
				document.getElementById("f2P" + i).appendChild(linebreak1);
				para.appendChild(document.createTextNode("Contribution: $"));
				document.getElementById("f2P" + i).appendChild(inpSpend);
				document.getElementById("f2P" + i).appendChild(linebreak2);
				document.getElementById("f2P" + i).appendChild(linebreak3);
				dropIn(document.getElementById("f2P" + i)); // Call dropIn to display input field with animation
				i++;
				createAndDropIn(); // Call function again
			}, 100)
		}
	}

	// Validation for Form 2 input fields (Cost per person)
	// Dynamically generates and displays error message if they do not match regular expression
	// Since the number of people vary, so are the number input fields
	function valF2() {
		esc = true; // Toggle
		
		// Loop to validate all input fields
		for (var i=1; i<= pCnt; i++) {
			
			var valMsg = document.forms["f2"]["val" + i];
			
			// Test inputs 1 to pCnt: Costs per person (Decimal between 0.00 to (9)99.999 ) 
			if (!/^[0-9][0-9]?[1-9]?\.[0-9][0-9]$/.test(document.forms["f2"]["inp" + i].value)) {
				if (typeof(valMsg) === 'undefined' || valmsg === null) {
					var para = document.createElement("span");
					para.appendChild(document.createTextNode(" Must be a dollar value in the form (9)99.99"));
					para.setAttribute("id", "val" + i);
					para.style.color = "red";
					//para.style.opacity = 0;
					para.style.display = "none";
					document.getElementById("f2P" + i).appendChild(para);
				}
				$("#val" + i).fadeIn(250);
				esc = false;
			}
			else {
				if (typeof(valMsg) !== 'undefined' || valMsg !== null) {$("#val" + i).fadeOut(250);}
			}
			
			// Test inputs 1 to pCnt: Contribution per person (Decimal between 0.00 to (9)99.999 ) 
			if (!/^[0-9][0-9]?[1-9]?\.[0-9][0-9]$/.test(document.forms["f2"]["inpC" + i].value)) {
				if (typeof(valMsg) === 'undefined' || valmsg === null) {
					var para = document.createElement("span");
					para.appendChild(document.createTextNode(" Must be a dollar value in the form (9)99.99"));
					para.setAttribute("id", "valC" + i);
					para.style.color = "red";
					//para.style.opacity = 0;
					para.style.display = "none";
					document.getElementById("f2P" + i).appendChild(para);
				}
				$("#valC" + i).fadeIn(250);
				esc = false;
			}
			else {
				if (typeof(valMsg) !== 'undefined' || valMsg !== null) {$("#valC" + i).fadeOut(250);}
			}
		}
		if(esc===false) {return false;} // Exit function if at least one clashing value is inputted
		for (var i = 0; i < pCnt; i++){pPrices[i] = document.forms["f2"]["inp" + (i+1)].value; pContr[i]=document.forms["f2"]["inpC" + (i+1)].value} // Assign the individual costs into the array
		$("#f2").fadeOut(250); // Fade out form 2
		$("#tots").fadeIn(250);
		createTotals(); // Call function to display data
		//setTimeout(function() {createFinal(pCnt, vTax);}, 50);
	}

	// Display various cost information based on numbers collected in previous forms
	// Displays cost totals, taxes and tip calculations for individual people, even splits, and total bill
	function createTotals(){
		var tots = document.getElementById("tots") // Reference totals Container
		, newPara = document.createElement("p") // New Paragraph placeholder
		, newH3 = document.createElement("h3") // New H3 header placeholder
		, totPrice = 0.00 // Placeholder for individual cost
		, totContr = 0.00 // Placeholder for individual contribution
		, tax = 0.00 // Placeholder for tax
		, taxDecimal = taxPcent/100 // Tax as a decimal
		, taxMulti = taxDecimal + 1 // Value used as multiplicand to find order value plus tax
		, gTot = 0.00 // Placeholder for grand total (Cost plus tax)
		, pTax = 0.00 // Individual tax
		, pGTot = 0.00 // Individual Grand Total
		, cNum = 1; // Totals Container Child node index
		
		// Calculate totals
		// Total Cost
		for (var i = 0; i < pPrices.length; i++){totPrice += +(pPrices[i]); totContr += +(pContr[i]); } // Loop through array values to calculate total
		totPrice = decPrec(totPrice, 2);
		//dropRight(tots.children[0]);
		tots.children[cNum++].innerHTML = "Order Total: $" + totPrice; // Display total in set paragraph
		
		// Total Tax
		tax = decPrec(taxDecimal*totPrice, 2);
		tots.children[cNum++].innerHTML = "Sales Tax: " + taxPcent + "% of $" + totPrice + " = $" + tax;
		
		// Grand Total
		gTot = decPrec(totPrice*taxMulti,2); //+(totPrice) + +(tax)
		tots.children[cNum++].innerHTML = "Grand Total: $" + gTot;
		
		//Total Contributions
		totContr = decPrec(totContr, 2);
		tots.children[cNum].innerHTML = "Total Contributions: $" + totContr;
		cNum+=2;
		// Total Tips
		tots.children[cNum++].innerHTML = "Double Tax: $" + decPrec(tax * 2, 2); // Double tax
		tots.children[cNum].innerHTML = "15% of Bill: $" + decPrec(gTot *.15, 2); // 15% of bill
		cNum+=2;
		

		
		
		// Individual Totals
		for (var i = 0; i < pPrices.length; i++){
		
			pTax = 0.00;
			pGTot = 0.00;
			pontr = 0.00;
			newPara = document.createElement("p");
			newH3 = document.createElement("h3");
			
			// Head
			newH3.appendChild(document.createTextNode("Person " + (i + 1) +""));
			tots.appendChild(newH3);

			// Individual Cost
			newPara.appendChild(document.createTextNode("Order: $" + pPrices[i] ));
			tots.appendChild(newPara);
			
			// Individual Tax
			newPara = document.createElement("p");
			pTax = decPrec(taxDecimal*pPrices[i], 2 );
			newPara.appendChild(document.createTextNode("Tax: $" + pTax));
			tots.appendChild(newPara);
			
			// Individual Grand Total
			newPara = document.createElement("p");
			pGTot = decPrec(pPrices[i]*taxMulti, 2 ); //+(pPrices[i]) + +(pTax)
			newPara.appendChild(document.createTextNode("Total: $"+pGTot));
			tots.appendChild(newPara);
			
			// Individual Contributions and Amount Owed or Owes
			newPara = document.createElement("p");
			pontr = decPrec(pPrices[i] - pContr[i], 2);
			newPara.appendChild(document.createTextNode("Contribution: $" + pContr[i] + "; "));
			
			if (pontr > 0) {newPara.appendChild(document.createTextNode("Owes $" + pontr + "; "));}
			if (pontr < 0) {newPara.appendChild(document.createTextNode("Owed $" + Math.abs(pontr)));}
			
			tots.appendChild(newPara);
			
			// Individual Tips
			newPara = document.createElement("p");
			newPara.appendChild(document.createTextNode("Tip: Double - $"+decPrec((pTax*2), 2)+"; 15% - $"+decPrec((pGTot*.15), 2)));
			tots.appendChild(newPara);
			
			cNum++; // Increment child node index
  		}

		// Even Split Counts
		newH3 = document.createElement("h3");
		newPara = document.createElement("p");

		// Head
		newH3.appendChild(document.createTextNode("Even Split"));
		tots.appendChild(newH3);
        
		// Order Split
		newPara.appendChild(document.createTextNode("Order: $" + decPrec((totPrice/pPrices.length),2)));
		tots.appendChild(newPara);

		// Tax Split
		newPara = document.createElement("p");
		newPara.appendChild(document.createTextNode("Tax: $" + decPrec(tax/pPrices.length, 2)));
		tots.appendChild(newPara);

		// Grand Total Split
		newPara = document.createElement("p");
		newPara.appendChild(document.createTextNode("Total: $"+decPrec(gTot/pPrices.length, 2)));
		tots.appendChild(newPara);

		// Tip Split
		newPara = document.createElement("p");
		newPara.appendChild(document.createTextNode("Tip: Double - $"+decPrec((tax/pPrices.length)*2, 2)+"; 15% - $"+decPrec((gTot*.15)/pPrices.length, 2)));
		tots.appendChild(newPara);

		/*	var  = document.createElement("input");
			para.appendChild(document.createTextNode("Person " + i + ": $"));
			para.setAttribute("id", "f2P" + i);
			para.setAttribute("style" , "position:relative;display:none;");
			inp.setAttribute("name", "inp" + i);
			para.setAttribute("type", "text");
			document.getElementById("f2").appendChild(para);
			document.getElementById("f2P" + i).appendChild(inp);
			dropIn(document.getElementById("f2P" + i));*/
	}
 
	// Fade in and Ease-Out element
	// Uses quadratic function (X^2 + 0X + 0) to determine element position
	// X value must be negative for Ease-Out
	function dropIn(elmnt) {

		elmnt.style.display = "none";
		$(elmnt).fadeIn(500);
		var currentPos = -100 // Element's position (y value) 
		, incrementer = -2.7; // Value to determine element's position (x value)

		moveThing();

		// Recursively call function to change element position
		// Terminate when X value reaches 0
		function moveThing() {
			incrementer += .0635;

			currentPos += Math.pow(incrementer, 2); // X^2
			
			if (incrementer >= 0) {
				//currentPos = -500;
				//incrementer = .01;
				return true;
			}

			elmnt.style.top = currentPos + "px";
			requestAnimationFrame(moveThing);
		}
	}

	/*
	function dropRight(elmnt) {

		elmnt.style.display = "none";
		$(elmnt).fadeIn(500);
		var currentPos = -100, incrementer = -2.7;

		moveThing();

		function moveThing() {
			incrementer += .0635;

			currentPos += Math.pow(incrementer, 2);
			if (incrementer >= 0) {
				//currentPos = -500;
				//incrementer = .01;
				return true;
			}

			elmnt.style.left = currentPos + "px";
			requestAnimationFrame(moveThing);
		}
	} */

	// Decimal Precision Function
	// Input: Numeric value and number of digits past the decimal point
	// Output: String containing number and decimal (numbers with less decimal places than precision number provided are padded with 0's)
	function decPrec(value, precision) {
		var precision = precision || 0 // Default 0
		
		// Calculate a multiple of 10 with the precision number as the exponent
		, power = Math.pow(10, precision)
		
		// Multiply the value by the multiple of 10 to shift/remove the decimal point; round that value
		, absValue = Math.abs(Math.round(value * power))

		// Return the number to its original multiple and store only the whole number; add the negative indicator if original value was negative
		// Convert to string
		, result = (value < 0 ? '-' : '') + String(Math.floor(absValue / power));

		// Proceed if precision was indicated as greater than 0
		// Zero precision requires no decimal
		if (precision > 0) {
			var fraction = String(absValue % power) // Obtain and store decimal value
			, padding = new Array(Math.max(precision - fraction.length, 0) + 1).join('0'); // Add 0's as padding if precision is greater than precision of original value
			result += '.' + padding + fraction;
		}
		return result;
	}
})();