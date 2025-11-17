import { IframeVocalcomBridge } from "./vocalcom_hucc_custom_sdk_v2_client.js";

const iframe = document.getElementById("hucc_iframe");
iframe.addEventListener("load", () => {
	const iframeOrigin = new URL(iframe.src).origin; 
	window.top.vc = new IframeVocalcomBridge(iframe, iframeOrigin);
	
	//vc.on("OnCallOnline", d => console.log("Call online:", d));
	vc.on("OnCallOnline", d => displayEvent('Llamada en linea'));
	vc.on("OnCallFree",  d => console.log("Call ended:", d));
	vc.on("OnAgentPause",  d => console.log("Pause:", d));
});

function displayEvent(mensaje){
	
	document.getElementById('eventos').innerText = mensaje;
	vc.getPhoneCallData().then(data => {
		console.log("Datos de la llamada:", data);
	});
}


//suscribimos a eventos de prueba

//vc.on("OnCallOnline", d => console.log("Call online:", d));
//vc.on("OnCallFree",  d => console.log("Call ended:", d));
//vc.on("OnAgentPause",  d => console.log("Pause:", d));
//vc.on("OnAgentReady",  d => console.log("Ready:", d));
//vc.on("OnSetCallDisposition",  d => console.log("On status:", d));

//hacer llamada manual prueba
//vc.dialManualCall('5491144090942')

//obtener datos de la llamada que el agente tenga abierta --> promise
//vc.getPhoneCallData().then(data => {
//  console.log("Datos de la llamada:", data);
//});

//calificar --> 1 seria el status code
/*vc.setDispositionCode(1).then(data => {
  console.log("calificado?: ", data);
})*/