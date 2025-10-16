function manualCall(phone){
	if (!phone) {
		alert("Por favor ingrese un número de teléfono");
		return;
	}

	const iframe = document.getElementById("hucc_iframe");
	const mensaje = {
		accion: 'dialManualCall',
		phoneNumber: phone,
		campaignId: null
	};
	
	iframe.contentWindow.postMessage(mensaje, 'https://vcl8-cloud.vocalcom-latam.com');
}
