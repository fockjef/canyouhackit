// tcpdump -e -l type mgt -r de-auth.cap
// 17:28:39.076910 BSSID:7c:8b:ca:cb:d7:82 (oui Unknown) DA:Broadcast SA:7c:8b:ca:cb:d7:82 (oui Unknown) Beacon (hackme4fun1) [1.0* 2.0* 5.5* 11.0* 9.0 18.0 36.0 54.0 Mbit] ESS CH: 9, PRIVACY

// password list: https://github.com/danielmiessler/SecLists/raw/master/Passwords/xato-net-10-million-passwords.txt
// aircrack-ng de-auth.cap -w xato-net-10-million-passwords.txt
// KEY FOUND! [ P@$$w0rd ]

(function( challenge_id = "wpa2_deauth" ){

	runSolution( { challenge_id, solution } );

	function solution( tag ){
		let ssid = "hackme4fun1",
		    mac = "7c:8b:ca:cb:d7:82",
		    pass = "P@$$w0rd";
		console.info( ssid );
		console.info( mac );
		console.info( pass );
		tag.refs.ssid.value = ssid;
		tag.refs.mac.value = mac;
		tag.refs.password.value = pass;
		tag.submitAnswer();
	}
})();
