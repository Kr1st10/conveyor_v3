let applications = [];
let lastId = 1;

export async function login(email, password) {
    return { ok: true, token: "fake-jwt-token" };
}

export async function register(data) {
    return { ok: true };
}

export async function createApplication(data) {
    const app = { id: lastId++, status: "На проверке", ...data };
    applications.push(app);
    return app;
}

export async function getApplication(id) {
    return applications.find(a => a.id === Number(id));
}

export async function getAllApplications() {
    return applications;
}

// let applications = [
//     {
//         id: 1,
//         user: "Иванов И.И.",
//         inn: "123456789012",
//         passport: "4510123456",
//         amount: 100000,
//         term: 12,
//         status: "На рассмотрении",
//         date: "2025-11-01"
//     },
// ];

// export const getApplications = () => {
//     return applications;
// };

// export const addApplication = (app) => {
//     app.id = applications.length + 1;
//     app.status = "На рассмотрении";
//     app.date = new Date().toISOString().split('T')[0];
//     applications.push(app);
// };

// export const updateApplicationStatus = (id, status) => {
//     const index = applications.findIndex(a => a.id === id);
//     if (index !== -1) {
//         applications[index].status = status;
//     }
// };

