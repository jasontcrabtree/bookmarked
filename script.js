// Listen for form submit
document.getElementById("myForm").addEventListener("submit", saveBookmark);

// Save new Bookmarks
function saveBookmark(e) {
	const siteName = document.getElementById("siteName").value;
	var siteURL = document.getElementById("siteURL").value;

	var expression = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
	var regex = new RegExp(expression);

	if (!siteURL.match(regex)) {
		siteURL = "https://" + siteURL;
	}

	const bookmark = {
		name: siteName,
		url: siteURL
	};

	if (localStorage.getItem("bookmarks") === null) {
		const bookmarks = [];
		bookmarks.push(bookmark);
		localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
	} else {
		const bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
		bookmarks.push(bookmark);
		localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
	}

	fetchBookmarks();

	function resetForm() {
		document.getElementById("myForm").reset();

		document.getElementById("newBookmarkConfirmation").open = true;

		function closeDialog() {
			document.getElementById("newBookmarkConfirmation").open = false;
		}
		setTimeout(closeDialog, 400);
		e.preventDefault();
	}
	setTimeout(resetForm, 800);

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

	function resetFocus() {
		document.getElementById("siteName").focus();
	}
	setTimeout(resetFocus, 1400);
}

// We can instantly update by calling the fetchBookmarks() function
fetchBookmarks();

// Fetch bookmarks from localStorage & Print to HTML Page
function fetchBookmarks() {
	const bookmarks = JSON.parse(localStorage.getItem("bookmarks"));

	const bookmarkResults = document.getElementById("bookmarkResults");

	bookmarkResults.innerHTML = "<li></li>";

	for (var i = 0; i < bookmarks.length; i++) {
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
	var bookmarks = JSON.parse(localStorage.getItem("bookmarks"));

	for (var i = 0; i < bookmarks.length; i++) {
		if (bookmarks[i].url == url) {
			bookmarks.splice(i, 1);
		}
	}
	localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

	fetchBookmarks();
}

// Runs fetchBookmarks on window load
window.onload = fetchBookmarks;
