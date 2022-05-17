async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
}

window.onload = () => {
let form = document.getElementById("login");
form.addEventListener("submit", async (e) => {
	e.preventDefault();
	let password_hash = await digestMessage(e.target.password.value);
	let data = {
		username: e.target.username.value,
		password_hash
	};

	let rawRes = await fetch("/users/login", {
		method: "POST",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json"
		},
		body: JSON.stringify(data)
	});
	let res = await rawRes.json();
	window.location = "/game"
	console.log(res);
})
}
