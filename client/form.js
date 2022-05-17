//mdn shit
async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
}
//my shit
window.onload = () => {
	let form = document.getElementById("login");
	form.addEventListener("submit", async (e)=>{
		e.preventDefault();
		let password_hash = await digestMessage(e.target.password1.value);		
		let data = {
			username: e.target.username.value,
			password_hash: password_hash
		};
		console.log(JSON.stringify(data));

		$.ajax({
			method: "POST",
			url: "/users/reg",
			headers: {"Content-Type": "application/json"},
			data: JSON.stringify(data),
		}).done((msg) => {
			console.log(msg);
		})

	})

	let pw1 = document.getElementById("pw1");
	let pw2 = document.getElementById("pw2");

	pw1.addEventListener("change", () => {
		if(pw1.value === pw2.value){
			document.getElementById("submit").disabled = false;
		}
	});

	pw2.addEventListener("change", () => {
		if(pw1.value === pw2.value){
			document.getElementById("submit").disabled = false;
		}
	});
}
