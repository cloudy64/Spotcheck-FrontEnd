const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/cafes`;

const getToken = () => localStorage.getItem("token");


export const getCafes = async () => {
  try {

    const token = localStorage.getItem("token");

    const res = await fetch(BASE_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.err || "Failed to fetch cafes");
    }

    return data;
  } catch (err) {
    console.error("Error fetching cafes:", err);
    return [];
  }
};


export const getCafeById = async (cafeId) => {
  try {
    const res = await fetch(`${BASE_URL}/${cafeId}`);

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.err || "Failed to fetch cafe details");
    }

    return data;
  } catch (err) {
    console.error("Error fetching cafe:", err);
    return null;
  }
};

// Filter cafes by status (Public - no auth needed)
export const getCafesByStatus = async (status) => {
  try {
    const res = await fetch(`${BASE_URL}/status/${status}`, {
      method: "GET",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.err || "Failed to fetch cafes by status");
    }

    return data;
  } catch (err) {
    console.error("Error fetching cafes by status:", err);
    return [];
  }
};


export const createCafe = async (cafeData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(cafeData),
    });

    const data = await res.json();
    console.log(res.ok);


    // if (!res.ok) {
    //   throw new Error(data.err || "Failed to create cafe");
    // }

    return data;
  } catch (err) {
    console.error("Error creating cafe:", err);
    return null;
  }
};


export const updateCafe = async (cafeId, cafeData) => {
  try {
    const res = await fetch(`${BASE_URL}/${cafeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(cafeData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.err || "Failed to update cafe");
    }

    return data;
  } catch (err) {
    console.error("Error updating cafe:", err);
    return null;
  }
};


export const updateCafeSeats = async (cafeId, availableSeats, notes = "") => {
  try {
    const res = await fetch(`${BASE_URL}/${cafeId}/seats`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ availableSeats, notes }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.err || "Failed to update seats");
    }

    return data;
  } catch (err) {
    console.error("Error updating seats:", err);
    return null;
  }
};

export const deleteCafe = async (cafeId) => {
  try {
    const res = await fetch(`${BASE_URL}/${cafeId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.err || "Failed to delete cafe");
    }

    return data;
  } catch (err) {
    console.error("Error deleting cafe:", err);
    return null;
  }
};

// Get cafe statistics (Admin only)
export const getCafeStats = async () => {
  try {
    const res = await fetch(`${BASE_URL}/stats/overview`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.err || "Failed to fetch statistics");
    }

    return data;
  } catch (err) {
    console.error("Error fetching statistics:", err);
    return null;
  }
};