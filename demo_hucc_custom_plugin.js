import { IframeVocalcomBridge } from "./vocalcom_hucc_custom_sdk_v1_client.js";

const iframe = document.getElementById(""); // ID DE IFRAME CONTENEDOR DE HUCC
const vc = new IframeVocalcomBridge(iframe, ""); // URL DE HUCC

await vc.dialManualCall("__phone__", "__campaignId__");
await vc.setDispositionCode("__status__");

const offOnline = vc.on("OnCallOnline", (data) => {
  console.log("Call online:", data);
});
vc.on("OnCallFree", (data) => {
  console.log("Call ended:", data);
});

const callData = await vc.getPhoneCallData();
console.log(callData);