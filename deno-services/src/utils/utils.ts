import { Config } from "../core/config.ts";

export const getReverseLocation = async (lat: string, long: string) => {
  const url = Config.NOMINATION_URL;

  try {
    if (!url) {
      throw new Error("No Nomination URL is missing");
    }
    const latitude: number = Number(lat);
    const longitude: number = Number(long);

    const response = await fetch(
      `${url}/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`,
    );
    if (!response.ok) {
      throw new Error(`Nomination API Error: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    throw error;
  }
};
