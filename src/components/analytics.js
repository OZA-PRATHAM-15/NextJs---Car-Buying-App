import axiosInstance from "@/utils/api";

export const trackHoverEvent = async (carId, carName) => {
  try {
    await axiosInstance.post("/analytics/hover", {
      carId,
      carName,
    });
  } catch (error) {
    console.error("Error tracking hover event:", error);
  }
};

export const sendFilterAnalytics = async (filters) => {
  try {
    const res = await axiosInstance.post("/analytics/filter", {
      filters,
      timestamp: new Date().toISOString(),
    });

    if (res.status !== 200) {
      console.error("Failed to send filter analytics");
    }
  } catch (error) {
    console.error("Error sending filter analytics:", error);
  }
};
