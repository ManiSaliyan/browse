const fetch = require("node-fetch"); // Only needed in Node.js environments

const endpoint = "https://production-sfo.browserless.io/chrome/bql";
const token = "2Sm62k10bK4WTFV1b297d95580bc0c729b1f1b8d4260c2659";
const proxyString = "&proxy=residential";
const optionsString = "&blockConsentModals=true";
const addresses = ["0x4813ae583A1E1479FC2eEe4eb76ff231d47be2B5","0x828518D2f5135b3B06a22888cA6e738291E75c7a","0xF52FdFE4e543DDAC0a526F08DA15b2B32D4AF66a","0xE370b41Dd51F5cA8c0870dd45aDAf1137091EF19","0x9137c957b4EFbf785fC988130BC801d0f8D18e42","0xef244483032Fa4A2D875eC6C60Fcd8aa73487D39","0x1fb4a6f8Db796201255c9C0EFbAff8128D485B4f","0x4fEA8ad10e954BEBCd3645D20d5a5aEf1DFa05F2","0x3024Af7bED4ED6f7F341Cb4A6cc7Fc851E505Bf3","0xF206d35b9C3560A51b7b00124B676Aab230F6918","0xD2333428797863C680d9a3C637fc1D1893a10649","0x14594827d71375b5897C239bb8b8F4Bd49928828","0x6A09dd0e52C073a76e02A240E4Ee5C86ea8243Ae","0xb9B4EFd01709D5E36069E6e6Cb0AA98170233E97","0x5000B1724EB9dbD16CfEfC8B391Ad5B23fd178E8","0x3E3D4fA7E9B3c8fE47f8b79A9F0A78ee507F9847","0x85d10dF1AAf4FdE0815593E0dd770fe141fEbfab","0x1e942f7da3420e3B802bE129C1c9740a192e259D","0xf76F51F15478e3f711F16550eea72960216547f8","0x0d054c5d81600D314db8fcA546b0D646BA588B7a","0x0EFB9566302566dC0741C13713E9bdda037D1746","0x80C7BfdEcd554fcDeDA1D2973cd8717E1B8F48Cf","0x58A402E933b72aAeb1CfF6713d6FF75547541F1A","0x046D3Fccf2758d555424e25131FdD265Ef5DA16C","0xbB2ce7BAB2adC9ccbB94CA1B68676415E8ED4868","0x5a20D0B4Af4D8DFca3D35eA6DEEDb6db451372FD","0x2234a5AeE3e2A4366C7E80aB9F4cb094b13ad101","0xb22fc580Bd80753adD1a6da7165f35c2CbF3EeE6","0xd15D9ad784833c9E236Db887D0580F9B9aa2bbD0","0x7A5a8fB0e879C43F745d20B1621f06a514d7634f","0xFB07f39C52f2371381f102EA76901eF601fA3771","0x4a42F26fCf10f2eb51036767DB6F1E909917ccF7","0xfa2625cF1E1c5E7Af38Ff93ae71aB298d4a5510A","0x8FBdAE645a0AcBe6d2f09FDadd935dcFE731f8d7","0xfd88DECf96E9057C4A23A519692230572B4B3270","0xd0fEB3509De3ddEC73F4758893e940Ec266c23E8"];


// Main function to process each address
async function claimFaucet(address) {
  const url = `${endpoint}?token=${token}${proxyString}${optionsString}`;

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        mutation ClaimFaucet {
          goto(url: "https://faucet.gnosischain.com/") {
            status
          }
          type(text: "${address}", selector: "#address") {
            time
          }
          verify(type: cloudflare) {
            solved
          }
          waitForTimeout(time: 2000) {
            time
          }
          click(selector: "button[type='submit']") {
            time
          }
          waitForTimeout(time: 2000) {
            time
          }
        }
      `,
      operationName: "ClaimFaucet"
    })
  };

  try {
    const response = await fetch(url, options);
    const text = await response.text(); // in case response isn't JSON

    try {
      const data = JSON.parse(text);
      console.log(`✅ Success for ${address}:`, data);
    } catch (err) {
      console.error(`❌ Invalid JSON for ${address}:`, text);
    }

  } catch (error) {
    console.error(`❌ Request failed for ${address}:`, error);
  }
}

// Run all addresses one after another
async function runAll() {
  for (const address of addresses) {
    console.log(`\n--- Processing address: ${address} ---`);
    await claimFaucet(address);
    await new Promise(res => setTimeout(res, 4000)); // Optional delay
  }
}

runAll();