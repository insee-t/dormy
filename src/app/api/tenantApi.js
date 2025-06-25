// client/src/api/tenantApi.js
const API_BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000/api";

export const createTenant = async (tenantData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tenants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tenantData),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to create tenant");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating tenant:", error);
    throw error;
  }
};

export const insertTenant = async (newUser, tenantData, apartmentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tenants/insert`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        clerkTenant: newUser,
        firstName: tenantData.firstName,
        lastName: tenantData.lastName,
        email: tenantData.email,
        apartmentId,
      }),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to insert tenant");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error insert tenants:", error);
    throw error;
  }
};

export const linkRoom = async (tenantData, tenantId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tenants/link`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        tenantId,
        roomNumber: tenantData.room,
      }),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to link tenant");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error link tenants to room:", error);
    throw error;
  }
};

export const fetchTenants = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tenants`, {
      credentials: "include", // Equivalent to withCredentials: true in axios
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    setTenants(data);
  } catch (error) {
    console.error("Error fetching tenants:", error);
  }
};

