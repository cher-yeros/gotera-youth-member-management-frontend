import { store } from "@/redux/store";
import { getApiOrigin } from "@/lib/apiOrigin";

export async function uploadPhoto(file: File): Promise<string> {
  const token = store.getState().auth?.token;
  if (!token) {
    throw new Error("You must be signed in to upload a photo");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${getApiOrigin()}/upload`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Failed to upload photo");
  }
  if (!data.url) {
    throw new Error("Upload succeeded but no URL was returned");
  }
  return data.url as string;
}
