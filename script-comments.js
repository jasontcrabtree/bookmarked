// Listen for form submit
//--- This gets the element myForm (by id) and 'listens' for an event, in this case, the submit button being clicked within the form. When that happens, it executes the second parameter of the eventListener, which is to execute the function saveBookmark
document.getElementById("myForm").addEventListener("submit", saveBookmark);

//--- This function is run when the myForm submit button is clicked.
//--- e.preventDefault() stops the form from 'submitting', because we are using the form in a static way, not as a submission form.
//--- This functions goal is to save the bookmark
//--- We are create two variables to save values
function saveBookmark(e) {
	const siteName = document.getElementById("siteName").value;
	var siteURL = document.getElementById("siteURL").value;

	// This is a ReGex (Regular Expression that matches strings) that checks to see if the siteURl includes https:// — if the URL DOES NOT include these, it adds https:// to the start of the string.
	var expression = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
	var regex = new RegExp(expression);

	// If siteURL DOES NOT match regex, add https://. This makes twitter.com work correctly.
	if (!siteURL.match(regex)) {
		siteURL = "https://" + siteURL;
	}

	//--- This creates an *object* array that we use to store the different variables we are working with.
	const bookmark = {
		name: siteName,
		url: siteURL
	};

	// Test if bookmarks is null (does it exist?)
	if (localStorage.getItem("bookmarks") === null) {
		// Initialise array
		const bookmarks = [];
		// Add to array
		bookmarks.push(bookmark);
		// Set to LocalStorage
		//--- JSON.stringify turns our JSON into a string
		localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
		//--- If there IS something in local storage, follow the else pathway
	} else {
		// Get bookmarks from localStorage
		//--- We create this as a variable. TODO::: consider changing the variable name later
		//--- JSON.parse will turn a string back into JSON from a string. We alternate between parse and stringy based on setting or getting from localStorage
		const bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
		// Add bookmark to the array created above (with const bookmark)
		bookmarks.push(bookmark);
		// Re-set the bookmark back to localStorage
		localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
	}

	fetchBookmarks();

	// Reset the form after submission
	function resetForm() {
		//--- Accesses the form ID and resets the form (after the function runs)
		document.getElementById("myForm").reset();
		//--- Opens the confirmation dialog thingy
		document.getElementById("newBookmarkConfirmation").open = true;

		// Experimenting with confirmation message
		//---XX document.getElementById("newBookmarkConfirmation").innerHTML =
		//---XX 	"New Bookmark Added!";

		//--- Closes the Dialog (after 400ms)
		function closeDialog() {
			document.getElementById("newBookmarkConfirmation").open = false;
		}

		/// Sets the timeout period for closing the dialog
		setTimeout(closeDialog, 400);

		// Prevent form from submitting
		e.preventDefault();
	}

	//--- If the dialog is open (true), set the colour of the addBookmark button to disabled
	if ((document.getElementById("newBookmarkConfirmation").open = true)) {
		document
			.getElementById("addBookmark")
			.classList.toggle("disabledAddButton");
	}

	function removeDisabledClass() {
		document
			.getElementById("addBookmark")
			.classList.remove("disabledAddButton");
	}

	setTimeout(removeDisabledClass, 1400);

	//--- Resets the form (deletes the content)
	setTimeout(resetForm, 800);

	//--- Resets the focus (back to the first field)
	function resetFocus() {
		//--- Sets the focus
		document.getElementById("siteName").focus();
	}

	//--- Calls the resetFocus command
	setTimeout(resetFocus, 1400);
}

// We can instantly update by calling the fetchBookmarks() function
fetchBookmarks();

//--- Now that we are storing new form additions in localStorage, we need to create a new function that displays the data in localStorage
// Fetch bookmarks
function fetchBookmarks() {
	// Get bookmarks from localStorage (code duplicated from the else pathway in the saveBookmark function)
	const bookmarks = JSON.parse(localStorage.getItem("bookmarks"));

	// Get output id
	const bookmarkResults = document.getElementById("bookmarkResults");

	// Build the result outputs
	bookmarkResults.innerHTML = "<li></li>";

	//--- Now we're going to loop through all of the bookmarks in localStorage and output them into the unordered li as list items
	///--- The for() loop iterates over each bookmark in the array of bookmarks as stored in local storage
	for (var i = 0; i < bookmarks.length; i++) {
		//--- This creates a variable storing the name and URL for each bookmark
		const name = bookmarks[i].name;
		const url = bookmarks[i].url;

		bookmarkResults.innerHTML +=
			"<li>" +
			name +
			' <a class="savedLink" target="_blank" href="' +
			url +
			'">' +
			url +
			"</a>" +
			' <button class="deleteSavedBookmark" onclick="deleteBookmark(\'' +
			url +
			"')\">Remove</button> ";
		("</li>");
	}
}

// Delete bookmark Function
function deleteBookmark(url) {
	// Get bookmarks
	var bookmarks = JSON.parse(localStorage.getItem("bookmarks"));

	// Loop through the bookmarks to find and select the bookmark we want to delete
	for (var i = 0; i < bookmarks.length; i++) {
		if (bookmarks[i].url == url) {
			// Remove from array
			bookmarks.splice(i, 1);
		}
	}
	// After lopping through the bookmarks we re-set the array back to local storage, excluding the deleted bookmarks object
	localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

	// When we remove the bookmark it updates in localStorage but doesn't delete the active element until we refresh the page.
	//--- We can overcome this by recalling fetchBookmarks

	fetchBookmarks();
}

// Calls the fetchBookmarks function after the window has loaded (the tutorial suggested adding the code to the body tag but nty)
window.onload = fetchBookmarks;
