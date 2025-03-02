const storageMethod = sessionStorage;
const appStorageName = "BootstrapProject";

let appData = {
    appName: "BlogMaster",
    users: [
        {
            id: 1,

            username: "davidgb8246",
            firstName: "David",
            lastName: "G.B.",
            email: "david@css-es-poesia.net",
            birthDate: "2005-10-13",
            country: "Desconocido",
            city: "Desconocido",
            password: "c2b6161a5690716f4136ddba1ae607d6adae10c061b99a4533931990aa4b8b4a",

            admin: true,
            blocked: false,
        },
        {
            id: 2,

            username: "ireneCSS",
            firstName: "Irene",
            lastName: "M.G.",
            email: "irene@css-es-poesia.net",
            birthDate: null,
            country: "Desconocido",
            city: "Desconocido",
            password: "0ea393c6876a3000b5779fdb356ced6a365d369ccddc534ed1ee5989b4efb972",

            admin: true,
            blocked: false,
        },
        {
            id: 3,
            
            username: "carlosCSS",
            firstName: "Carlos",
            lastName: "R.G.",
            email: "carlos@css-es-poesia.net",
            birthDate: null,
            country: "Desconocido",
            city: "Desconocido",
            password: "e7c5e4e687eba0c36d42eb00e0b4779d98247b1932fbfa85d2eea25332ba2525",

            admin: false,
            blocked: true,
        },
    ],
    userLoggedIn: {
        id: 1,
    },
    publications: [],
};

const updateAppDataInStorage = () => {
    storageMethod.setItem(appStorageName, JSON.stringify(appData));
}

if (storageMethod.getItem(appStorageName)) 
    appData = JSON.parse(storageMethod.getItem(appStorageName));

updateAppDataInStorage();

//////////////////////////////////////////////////
//                    UTILS                     //
//////////////////////////////////////////////////

async function hashSHA256(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
}

// hashSHA256().then(console.log);