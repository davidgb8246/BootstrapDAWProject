const storageMethod = sessionStorage;
const appStorageName = "BootstrapProject";

let appData = {
    users: [
        {
            id: 1,

            name: "David",
            position: "Estudiante",
            office: "IES Dos Mares",
            age: 19,
            start_date: "01-09-2023",
            salary: 0,

            username: "davidgb8246",
            email: "david@css-es-poesia.net",
            password: "c2b6161a5690716f4136ddba1ae607d6adae10c061b99a4533931990aa4b8b4a",
            admin: true,
        },
        {
            id: 2,

            name: "Irene",
            position: "Profesor",
            office: "IES Dos Mares",
            age: null,
            start_date: "01-09-2024",
            salary: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200,
            
            username: "irene",
            email: "irene@css-es-poesia.net",
            password: "0ea393c6876a3000b5779fdb356ced6a365d369ccddc534ed1ee5989b4efb972",
            admin: true,
        },
        {
            id: 3,

            name: "Carlos",
            position: "Profesor",
            office: "IES Dos Mares",
            age: null,
            start_date: "01-02-2025",
            salary: Math.floor(Math.random() * (3000 - 1200 + 1)) + 1200,

            username: "carlos",
            email: "carlos@css-es-poesia.net",
            password: "e7c5e4e687eba0c36d42eb00e0b4779d98247b1932fbfa85d2eea25332ba2525",
            admin: false,
        },
    ],
};

/*
Name
Position
Office
Age
Start date
Salary
*/

const updateAppDataInStorage = () => {
    storageMethod.setItem(appStorageName, JSON.stringify(appData));
}

if (storageMethod.getItem(appStorageName)) 
    appData = JSON.parse(storageMethod.getItem(appStorageName));

// updateAppDataInStorage();






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

// hashSHA256("carlos1234").then(console.log);