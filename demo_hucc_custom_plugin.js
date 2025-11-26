import { IframeVocalcomBridge } from "./vocalcom_hucc_custom_sdk_v2_client.js";

// ESTA promesa se resuelve cuando vc está realmente listo
let resolveVc;
export const vcReady = new Promise(res => resolveVc = res);

let vc = null;
export { vc };  // por compatibilidad, pero no se usará directamente

const iframe = document.getElementById("hucc_iframe");


iframe.addEventListener("load", () => {

    const iframeOrigin = new URL(iframe.src).origin;

    vc = new IframeVocalcomBridge(iframe, iframeOrigin);

    window.vc = vc;  // disponible globalmente
    resolveVc(vc);   // <<---- AHORA avisamos al HTML que vc está listo

    console.log("✔ VC inicializado:", vc);

    // EVENTOS DEL SERVIDOR HUCC
    vc.on("OnCallOnline", d => OnCallOnline("Llamada en línea"));
    vc.on("OnCallFree",    d => OnCallFree("Llamada finalizada"));
    vc.on("OnAgentPause",  d => OnAgentPause("Agente en pausa"));
    vc.on("OnAgentReady",  d => OnAgentReady("Agente listo"));
    vc.on("OnSetCallDisposition",  d => OnAgentReady("Agente listo"));
    vc.on("OnAgentLogin",  d => OnAgentLogin("Agente logueado"));
	vc.on("OnAgentLogout",  d => OnAgentLogout("Agente deslogueado"));
    vc.on("OnConnectionWithCTIServerLost",  d => OnConnectionWithCTIServerLost("Conexion de agente perdida"));
});

// **** EVENTO DE PERDIDA DE CONEXION **** //
function OnConnectionWithCTIServerLost(msg) {
    console.log(msg);
}

// **** EVENTO DE AGENTE LOGUEADO **** //
function OnAgentLogin(msg){
    console.log(msg);
	
    const btnManual = document.getElementById("btn_llamadamanual");
	const btnRellamar = document.getElementById("btn_rellamar");
	const btnColgar = document.getElementById("btn_colgar");
	const comboCal = document.getElementById("calificacion");
	const btnCalificar = document.getElementById("btn_calificar");
	const btnPause = document.getElementById("btn_pause");
	const btnReady = document.getElementById("btn_ready");
	const btnLogin = document.getElementById("btn_login");
	const btnLogout = document.getElementById("btn_logout");	
    btnManual.disabled = false;
	btnRellamar.disabled = true;
	btnColgar.disabled = true;
	comboCal.disabled = true;
	btnCalificar.disabled = true;
	btnPause.disabled = true;
	btnReady.disabled = true;
	btnLogin.disabled = true;
	btnLogout.disabled = false;
	
	
	if (vc) {
	    vc.getPauseCodes().then(data => {            
            console.log("DATA DE PAUSAS -> ", data);
			
			const listaPausas = data.Pausas; // array
			const combo = document.getElementById("cmbPausas");

			// Limpiar opciones anteriores
			combo.innerHTML = '<option value="">Seleccione pausa...</option>';

			// Llenar el combobox
			listaPausas.forEach(p => {
				const option = document.createElement("option");
				option.value = p.Code; 
				option.textContent = p.Description; 
				combo.appendChild(option);
			});
            
        });
    }
	
}

// **** EVENTO DE AGENTE DESLOGUEADO **** //
function OnAgentLogout(msg){
    console.log(msg);
	
    const btnManual = document.getElementById("btn_llamadamanual");
	const btnRellamar = document.getElementById("btn_rellamar");
	const btnColgar = document.getElementById("btn_colgar");
	const comboCal = document.getElementById("calificacion");
	const btnCalificar = document.getElementById("btn_calificar");
	const btnPause = document.getElementById("btn_pause");
	const btnReady = document.getElementById("btn_ready");
	const btnLogin = document.getElementById("btn_login");
	const btnLogout = document.getElementById("btn_logout");	
    btnManual.disabled = true;
	btnRellamar.disabled = true;
	btnColgar.disabled = true;
	comboCal.disabled = true;
	btnCalificar.disabled = true;
	btnPause.disabled = true;
	btnReady.disabled = true;
	btnLogin.disabled = true;
	btnLogout.disabled = true;

}

// **** EVENTO DE LLAMADA EN LINEA **** // 
function OnCallOnline(msg){
	
	console.log("AGENT ONLINE");
	const banner = document.getElementById("statusBanner");
	const waiting = document.getElementById("waitingCard");
	const btnManual = document.getElementById("btn_llamadamanual");
	const btnRellamar = document.getElementById("btn_rellamar");
	const btnColgar = document.getElementById("btn_colgar");
	const comboCal = document.getElementById("calificacion");
	const btnCalificar = document.getElementById("btn_calificar");
	const btnPause = document.getElementById("btn_pause");
	const btnReady = document.getElementById("btn_ready");
	const btnLogin = document.getElementById("btn_login");
	const btnLogout = document.getElementById("btn_logout");
	const memodiv = document.getElementById("memo");
	const data1div = document.getElementById("data1");
	
	//banner.innerText = "Agente listo — Esperando llamada";
    //banner.classList.add("status-ready");

    waiting.style.display = "none";
    btnManual.disabled = true;
	btnRellamar.disabled = true;
	btnColgar.disabled = false;
	comboCal.disabled = false;
	btnCalificar.disabled = false;
	btnPause.disabled = true;
	btnReady.disabled = true;
	btnLogin.disabled = true;
	btnLogout.disabled = false;
	
	if (vc) {
	    vc.getPhoneCallData().then(data => {
			const memo = data.memo;						// ACA PONEMOS EL DATO DE MEMO EN CRM "data.memo" DEBE VENIR CON INFO DE DISCADOR
            const data1 = data.callId;					// ACA RESCATAMOS EL ID DE LLAMADA, SIRVE PARA BUSCAR GRABACION ASOCIADA
			memodiv.innerText = "MEMO: " + memo;		
            data1div.innerText = "DATA1: " + data1;		
			console.log("EL MEMO:", memo);    
            //console.log("Datos de la llamada:", data);
        });
    }
}

// **** EVENTO DE AGENTE DISPONIBLE **** //
function OnAgentReady(msg){
	
	console.log(msg);
	const banner = document.getElementById("statusBanner");
	const waiting = document.getElementById("waitingCard");
	const btnManual = document.getElementById("btn_llamadamanual");
	const btnRellamar = document.getElementById("btn_rellamar");
	const btnColgar = document.getElementById("btn_colgar");
	const comboCal = document.getElementById("calificacion");
	const btnCalificar = document.getElementById("btn_calificar");
	const btnPause = document.getElementById("btn_pause");
	const btnReady = document.getElementById("btn_ready");
	const btnLogin = document.getElementById("btn_login");
	const btnLogout = document.getElementById("btn_logout");	
	
	banner.innerText = "Agente listo — Esperando llamada";
    banner.classList.add("status-ready");

    waiting.style.display = "flex";
		
    btnManual.disabled = false;
	btnRellamar.disabled = true;
	btnColgar.disabled = true;
	comboCal.disabled = true;
	btnCalificar.disabled = true;
	btnPause.disabled = false;
	btnReady.disabled = true;
	btnLogin.disabled = true;
	btnLogout.disabled = false;
	
	
}

// **** EVENTO DE LLAMADA FINALIZADA **** //
function OnCallFree (msg){
	
	console.log("AGENT LLAMADA FINALIZADA");
	const banner = document.getElementById("statusBanner");
	const waiting = document.getElementById("waitingCard");
	const btnManual = document.getElementById("btn_llamadamanual");
	const btnRellamar = document.getElementById("btn_rellamar");
	const btnColgar = document.getElementById("btn_colgar");
	const comboCal = document.getElementById("calificacion");
	const btnCalificar = document.getElementById("btn_calificar");	
	const txtTelefono = document.getElementById("txtTelefono");	
	
	banner.innerText = "Agente listo — Esperando llamada";
    banner.classList.add("status-ready");

    waiting.style.display = "none";

    txtTelefono.value = "";
	btnManual.disabled = true;
    btnRellamar.disabled = false;
    btnColgar.disabled = true;

    comboCal.disabled = false;
    btnCalificar.disabled = false;
	
}

function OnAgentPause(msg){
	
	console.log(msg);
	const banner = document.getElementById("statusBanner");
	const waiting = document.getElementById("waitingCard");
	const btnManual = document.getElementById("btn_llamadamanual");
	const btnRellamar = document.getElementById("btn_rellamar");
	const btnColgar = document.getElementById("btn_colgar");
	const comboCal = document.getElementById("calificacion");
	const btnCalificar = document.getElementById("btn_calificar");
	const btnPause = document.getElementById("btn_pause");
	const btnReady = document.getElementById("btn_ready");
	const btnLogin = document.getElementById("btn_login");
	const btnLogout = document.getElementById("btn_logout");	
	
	banner.innerText = "Agente listo — Esperando llamada";
    banner.classList.add("status-ready");

    waiting.style.display = "flex";
		
    btnManual.disabled = true;
	btnRellamar.disabled = true;
	btnColgar.disabled = true;
	comboCal.disabled = true;
	btnCalificar.disabled = true;
	btnPause.disabled = true;
	btnReady.disabled = false;
	btnLogin.disabled = true;
	btnLogout.disabled = false;
	
	
}

function displayEvent(msg) {
    console.log(msg);
    vc.getCampaigns().then(data => {
        console.log("INFO CAMPAIGNS", data);    
            
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