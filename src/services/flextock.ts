/**
 * Flextock Service (Client-Side Wrapper)
 * Calls the secure backend serverless functions to handle all Flextock shipping actions,
 * preventing CORS issues and securing merchant credentials.
 */

export async function authenticateFlextock(): Promise<string> {
  // Authentication is now fully handled on the backend to protect merchant keys.
  // We keep this function signature for backwards compatibility.
  console.warn("authenticateFlextock is deprecated on the client. Auth is handled securely on the server.");
  return "SERVER_HANDLED";
}

export async function triggerCreateFlextockOrder(orderId: string): Promise<any> {
  const response = await fetch(`/api/flextock?action=create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ orderId }),
  });

  const responseText = await response.text();

  if (!response.ok) {
    console.error("Flextock Order Creation Backend Error:", response.status, responseText);
    let errMsg = `Server returned ${response.status}`;
    try {
      const data = JSON.parse(responseText);
      errMsg = data.error || errMsg;
    } catch {}
    throw new Error(errMsg);
  }

  try {
    return JSON.parse(responseText);
  } catch {
    return responseText;
  }
}

export async function triggerSyncFlextockStatus(): Promise<any> {
  const response = await fetch(`/api/flextock?action=sync`, {
    method: "POST",
  });

  const responseText = await response.text();

  if (!response.ok) {
    console.error("Flextock Status Sync Backend Error:", response.status, responseText);
    let errMsg = `Server returned ${response.status}`;
    try {
      const data = JSON.parse(responseText);
      errMsg = data.error || errMsg;
    } catch {}
    throw new Error(errMsg);
  }

  try {
    return JSON.parse(responseText);
  } catch {
    return responseText;
  }
}
